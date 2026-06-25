"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PartyPopper, Users, Calendar, Search, CheckCircle, XCircle, Eye, X } from "lucide-react";
import { AdminShell } from "../components/AdminShell";
import { formatCurrency } from "../lib/utils";
import api from "../lib/api";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type PackageType   = "BASIC" | "ROYAL" | "GRAND";

interface PartyHallBooking {
  id:              string;
  customerName:    string;
  customerPhone:   string;
  customerEmail:   string | null;
  eventType:       string;
  guestCount:      number;
  preferredDate:   string;
  preferredTime:   string;
  packageType:     PackageType;
  specialRequests: string | null;
  status:          BookingStatus;
  totalAmount:     number | null;
  createdAt:       string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: "Pending",   className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-700"   },
  COMPLETED: { label: "Completed", className: "bg-blue-100 text-blue-700"     },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700"       },
};

const PACKAGE_CONFIG: Record<PackageType, { label: string; className: string }> = {
  BASIC: { label: "Basic",  className: "bg-orange-50 text-orange-700"  },
  ROYAL: { label: "Royal",  className: "bg-yellow-50 text-yellow-700"  },
  GRAND: { label: "Grand",  className: "bg-purple-50 text-purple-700"  },
};

const EVENT_EMOJIS: Record<string, string> = {
  "Birthday":      "🎂",
  "Ring Ceremony": "💍",
  "Baby Shower":   "🍼",
  "Anniversary":   "🌹",
  "Corporate":     "💼",
  "Engagement":    "💎",
  "Farewell":      "✈️",
  "Other":         "✨",
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 86400)  return `${Math.round(diff / 3600)}h ago`;
  const d = Math.round(diff / 86400);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

function DetailModal({ booking, onClose }: { booking: PartyHallBooking; onClose: () => void }) {
  const qc = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: (status: BookingStatus) =>
      api.put(`admin/party-hall/bookings/${booking.id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-party-hall"] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span>{EVENT_EMOJIS[booking.eventType] ?? "✨"}</span>
              {booking.eventType} — {booking.customerName}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{booking.customerPhone}{booking.customerEmail ? ` · ${booking.customerEmail}` : ""}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Date",     new Date(booking.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
              ["Time",     booking.preferredTime],
              ["Guests",   `${booking.guestCount} people`],
              ["Package",  booking.packageType],
              ["Amount",   booking.totalAmount ? formatCurrency(booking.totalAmount) : "TBD"],
              ["Booked",   timeAgo(booking.createdAt)],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {booking.specialRequests && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Special Requests</p>
              <p className="text-sm text-amber-800 font-cormo">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
          <div className="flex gap-2 p-5 border-t border-gray-100">
            {booking.status === "PENDING" && (
              <button
                onClick={() => updateStatus.mutate("CONFIRMED")}
                disabled={updateStatus.isPending}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50"
              >
                Confirm Booking
              </button>
            )}
            {booking.status === "CONFIRMED" && (
              <button
                onClick={() => updateStatus.mutate("COMPLETED")}
                disabled={updateStatus.isPending}
                className="flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #7C1D1D, #4a0b0b)" }}
              >
                Mark Completed
              </button>
            )}
            <button
              onClick={() => { if (confirm("Cancel this booking?")) updateStatus.mutate("CANCELLED"); }}
              disabled={updateStatus.isPending}
              className="flex-1 py-2.5 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const ALL_STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function PartyHallInner() {
  const qc = useQueryClient();
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<PartyHallBooking | null>(null);

  const { data: bookings = [], isLoading } = useQuery<PartyHallBooking[]>({
    queryKey: ["admin-party-hall", statusFilter],
    queryFn: () =>
      api.get("admin/party-hall/bookings", { params: { status: statusFilter || undefined } })
        .then((r) => r.data.data ?? []),
  });

  const confirm = useMutation({
    mutationFn: (id: string) => api.put(`admin/party-hall/bookings/${id}/status`, { status: "CONFIRMED" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-party-hall"] }),
  });
  const cancel = useMutation({
    mutationFn: (id: string) => api.put(`admin/party-hall/bookings/${id}/status`, { status: "CANCELLED" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-party-hall"] }),
  });

  const filtered = bookings.filter((b) =>
    !search ||
    b.customerName.toLowerCase().includes(search.toLowerCase()) ||
    b.customerPhone.includes(search) ||
    b.eventType.toLowerCase().includes(search.toLowerCase())
  );

  // Summary counts
  const pending   = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const revenue   = bookings.filter((b) => b.status !== "CANCELLED" && b.totalAmount).reduce((s, b) => s + (b.totalAmount ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PartyPopper className="w-6 h-6 text-purple-500" /> Party Hall
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage private event bookings</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Approval", value: pending,             color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Confirmed Events", value: confirmed,           color: "text-green-600",  bg: "bg-green-50"  },
          { label: "Revenue (Active)", value: formatCurrency(revenue), color: "text-purple-600", bg: "bg-purple-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search by name, phone or event type…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-50 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <PartyPopper className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No party hall bookings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Event", "Customer", "Date & Time", "Guests", "Package", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 flex items-center gap-1.5">
                      {EVENT_EMOJIS[b.eventType] ?? "✨"} {b.eventType}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(b.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {new Date(b.preferredDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-gray-400">{b.preferredTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> {b.guestCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PACKAGE_CONFIG[b.packageType]?.className ?? ""}`}>
                      {PACKAGE_CONFIG[b.packageType]?.label ?? b.packageType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {b.totalAmount ? formatCurrency(b.totalAmount) : <span className="text-gray-300">TBD</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[b.status]?.className ?? ""}`}>
                      {STATUS_CONFIG[b.status]?.label ?? b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(b)}
                        className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {b.status === "PENDING" && (
                        <button onClick={() => confirm.mutate(b.id)}
                          className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Confirm">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                        <button onClick={() => { if (window.confirm("Cancel this booking?")) cancel.mutate(b.id); }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Cancel">
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

      {selected && <DetailModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function PartyHallPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><PartyHallInner /></AdminShell>
    </QueryClientProvider>
  );
}
