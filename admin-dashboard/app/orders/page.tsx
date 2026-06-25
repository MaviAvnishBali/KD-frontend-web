"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { AdminShell } from "../components/AdminShell";
import { formatCurrency } from "../lib/utils";
import api from "../lib/api";

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  orderType: "DELIVERY" | "DINE_IN" | "TAKEAWAY";
  totalAmount: number;
  itemCount: number;
  createdAt: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:          { label: "Pending",          className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED:        { label: "Confirmed",        className: "bg-blue-100 text-blue-700" },
  PREPARING:        { label: "Preparing",        className: "bg-orange-100 text-orange-700" },
  READY:            { label: "Ready",            className: "bg-purple-100 text-purple-700" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-indigo-100 text-indigo-700" },
  DELIVERED:        { label: "Delivered",        className: "bg-green-100 text-green-700" },
  CANCELLED:        { label: "Cancelled",        className: "bg-red-100 text-red-700" },
};

const TYPE_LABEL: Record<string, string> = {
  DINE_IN: "Dine In",
  TAKEAWAY: "Takeaway",
  DELIVERY: "Delivery",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING:   "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY:     "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED",
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)  return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  return `${Math.round(diff / 3600)}h ago`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.className}`}>{c.label}</span>;
}

function OrderDetailModal({ order, onClose }: { order: AdminOrder; onClose: () => void }) {
  const qc = useQueryClient();
  const next = NEXT_STATUS[order.status];

  const advance = useMutation({
    mutationFn: () => api.put(`admin/orders/${order.id}/status`, { status: next }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); onClose(); },
  });
  const cancel = useMutation({
    mutationFn: () => api.post(`admin/orders/${order.id}/cancel`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{order.orderNumber}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.customerName} · {order.customerPhone}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Status", <StatusBadge key="s" status={order.status} />],
              ["Type", TYPE_LABEL[order.orderType] ?? order.orderType],
              ["Items", `${order.itemCount} item${order.itemCount !== 1 ? "s" : ""}`],
              ["Total", formatCurrency(order.totalAmount)],
              ["Placed", timeAgo(order.createdAt)],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <div className="text-sm font-medium text-gray-900">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-5 border-t border-gray-100">
          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <button
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
              className="flex-1 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}
          {next && (
            <button
              onClick={() => advance.mutate()}
              disabled={advance.isPending}
              className="flex-1 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7C1D1D, #4a0b0b)" }}
            >
              {advance.isPending ? "Updating…" : `Mark as ${STATUS_CONFIG[next].label}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const ALL_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function OrdersInner() {
  const [page, setPage]       = useState(0);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const { data, isLoading } = useQuery<{ content: AdminOrder[]; totalPages: number; totalElements: number }>({
    queryKey: ["admin-orders", page, statusFilter],
    queryFn: () =>
      api.get("admin/orders", { params: { page, size: 10, status: statusFilter || undefined } })
        .then((r) => r.data.data),
  });

  const orders = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filtered = search
    ? orders.filter((o) =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerPhone.includes(search)
      )
    : orders;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.totalElements ?? 0} total orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by order #, customer…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
        <select
          className="input w-44"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Order", "Customer", "Type", "Items", "Amount", "Status", "Placed", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 leading-tight">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.orderType === "DINE_IN"  ? "bg-teal-50 text-teal-700" :
                      order.orderType === "TAKEAWAY" ? "bg-amber-50 text-amber-700" :
                                                       "bg-blue-50 text-blue-700"
                    }`}>
                      {TYPE_LABEL[order.orderType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.itemCount}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(order)}
                      className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {selected && (
        <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><OrdersInner /></AdminShell>
    </QueryClientProvider>
  );
}
