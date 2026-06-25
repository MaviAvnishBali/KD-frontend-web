"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react";
import { AdminShell } from "../components/AdminShell";
import { formatCurrency } from "../lib/utils";
import api from "../lib/api";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  totalOrders: number;
  totalSpend: number;
  loyaltyPoints: number;
  tier: string;
  createdAt: string;
  lastOrderAt: string;
}

const TIER_CONFIG: Record<string, { className: string }> = {
  BRONZE: { className: "bg-orange-100 text-orange-700"  },
  SILVER: { className: "bg-gray-100 text-gray-700"      },
  GOLD:   { className: "bg-yellow-100 text-yellow-700"  },
  ROYAL:  { className: "bg-purple-100 text-purple-700"  },
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 86400)  return `${Math.round(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.round(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function CustomersInner() {
  const [page, setPage]     = useState(0);
  const [search, setSearch] = useState("");
  const [tier, setTier]     = useState("");

  const { data, isLoading } = useQuery<{ content: Customer[]; totalPages: number; totalElements: number }>({
    queryKey: ["admin-customers", page, tier],
    queryFn:  () =>
      api.get("admin/customers", { params: { page, size: 10, tier: tier || undefined } })
        .then((r) => r.data.data),
  });

  const customers = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filtered = search
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data?.totalElements?.toLocaleString() ?? 0} registered customers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          />
        </div>
        <select className="input w-36" value={tier} onChange={(e) => { setTier(e.target.value); setPage(0); }}>
          <option value="">All Tiers</option>
          {Object.keys(TIER_CONFIG).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-50 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <p className="text-4xl mb-3">👤</p>
          <p className="font-medium">No customers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Customer", "Contact", "Orders", "Total Spend", "Points", "Tier", "Last Order"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="w-3 h-3 text-gray-400" />{c.phone}
                    </p>
                    {c.email && (
                      <p className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                        <Mail className="w-3 h-3" />{c.email}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.totalOrders}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(c.totalSpend)}</td>
                  <td className="px-4 py-3 text-gray-600">{c.loyaltyPoints.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_CONFIG[c.tier]?.className ?? "bg-gray-100 text-gray-600"}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(c.lastOrderAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
    </div>
  );
}

export default function CustomersPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><CustomersInner /></AdminShell>
    </QueryClientProvider>
  );
}
