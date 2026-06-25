"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Users, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { AdminShell } from "../components/AdminShell";
import api from "../lib/api";

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  partySize: number;
  reservedDate: string;
  reservedTime: string;
  occasion: string | null;
  specialRequest: string | null;
  status: string;
  tableNumber: string | null;
  branchName: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-700"  },
  COMPLETED: { label: "Completed", className: "bg-blue-100 text-blue-700"    },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700"      },
  NO_SHOW:   { label: "No Show",   className: "bg-gray-100 text-gray-600"    },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.className}`}>{c.label}</span>;
}

function ReservationsInner() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: reservations = [], isLoading } = useQuery<Reservation[]>({
    queryKey: ["admin-reservations"],
    queryFn:  () => api.get("admin/reservations").then((r) => r.data.data ?? []),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => api.put(`admin/reservations/${id}/confirm`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reservations"] }),
  });
  const cancel = useMutation({
    mutationFn: (id: string) => api.delete(`admin/reservations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reservations"] }),
  });

  const filtered = reservations.filter((r) => {
    const matchSearch = !search ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerPhone.includes(search);
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = reservations.filter((r) => r.reservedDate === todayStr && r.status !== "CANCELLED").length;
  const pendingCount = reservations.filter((r) => r.status === "PENDING").length;
  const totalGuests = reservations
    .filter((r) => r.reservedDate === todayStr && r.status === "CONFIRMED")
    .reduce((s, r) => s + r.partySize, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage table bookings and guest requests</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: CalendarDays, label: "Today's Bookings", value: todayCount, color: "text-blue-600",  bg: "bg-blue-50"   },
          { icon: Clock,        label: "Pending Approval", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50" },
          { icon: Users,        label: "Guests Tonight",   value: totalGuests,  color: "text-green-600", bg: "bg-green-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-50 animate-pulse">
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
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No reservations found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Guest", "Date & Time", "Party", "Occasion", "Table", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.customerName}</p>
                    <p className="text-xs text-gray-400">{r.customerPhone}</p>
                    {r.specialRequest && (
                      <p className="text-xs text-amber-600 mt-0.5 italic">"{r.specialRequest}"</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {new Date(r.reservedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-gray-400">{r.reservedTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {r.partySize}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{r.occasion ?? <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{r.tableNumber ?? <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {r.status === "PENDING" && (
                        <button
                          onClick={() => confirm.mutate(r.id)}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                        <button
                          onClick={() => { if (confirm(`Cancel ${r.customerName}'s reservation?`)) cancel.mutate(r.id); }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ReservationsPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><ReservationsInner /></AdminShell>
    </QueryClientProvider>
  );
}
