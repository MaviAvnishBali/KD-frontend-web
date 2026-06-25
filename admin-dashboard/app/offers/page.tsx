"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Image as ImageIcon, Tag } from "lucide-react";
import { AdminShell } from "../components/AdminShell";
import api from "../lib/api";

/* ── Offer form ── */
interface Offer {
  id: string; emoji: string; title: string; description: string;
  promoCode: string; savingText: string; badgeText: string;
  bgColorStart: string; bgColorEnd: string; discountType: string;
  discountValue: number | null; minOrderAmount: number | null;
  maxDiscount: number | null; validUntil: string | null;
  displayOrder: number; is_active: boolean;
}

const EMPTY_OFFER = {
  emoji: "🎁", title: "", description: "", promoCode: "", savingText: "",
  badgeText: "", bgColorStart: "#6B0F1A", bgColorEnd: "#3d0409",
  discountType: "PERCENTAGE", discountValue: "", minOrderAmount: "",
  maxDiscount: "", validUntil: "", displayOrder: "99",
};

function OfferModal({ offer, onClose }: { offer: Offer | null; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!offer;
  const [form, setForm] = useState(offer ? {
    emoji: offer.emoji, title: offer.title, description: offer.description ?? "",
    promoCode: offer.promoCode ?? "", savingText: offer.savingText ?? "",
    badgeText: offer.badgeText ?? "", bgColorStart: offer.bgColorStart,
    bgColorEnd: offer.bgColorEnd, discountType: offer.discountType ?? "PERCENTAGE",
    discountValue: offer.discountValue != null ? String(offer.discountValue) : "",
    minOrderAmount: offer.minOrderAmount != null ? String(offer.minOrderAmount) : "",
    maxDiscount: offer.maxDiscount != null ? String(offer.maxDiscount) : "",
    validUntil: offer.validUntil ? offer.validUntil.slice(0, 16) : "",
    displayOrder: String(offer.displayOrder),
  } : EMPTY_OFFER);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        discountValue:   form.discountValue  ? parseFloat(form.discountValue)  : null,
        minOrderAmount:  form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        maxDiscount:     form.maxDiscount    ? parseFloat(form.maxDiscount)    : null,
        validUntil:      form.validUntil || null,
        displayOrder:    parseInt(form.displayOrder),
      };
      if (isEdit) return api.put(`admin/banners/offers/${offer!.id}`, payload);
      return api.post("admin/banners/offers", payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-offers"] }); onClose(); },
    onError: (e: any) => setError(typeof e === "string" ? e : "Failed to save"),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{isEdit ? "Edit Offer" : "Create Offer"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Preview strip */}
          <div className="rounded-xl p-4 text-white text-sm flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${form.bgColorStart}, ${form.bgColorEnd})` }}>
            <span className="text-3xl">{form.emoji || "🎁"}</span>
            <div className="min-w-0">
              <p className="font-bold truncate">{form.title || "Offer title"}</p>
              <p className="text-white/70 text-xs truncate">{form.promoCode ? `Code: ${form.promoCode}` : "No promo code"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Emoji</label>
              <input className="input" placeholder="🎁" value={form.emoji} onChange={set("emoji")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Badge Text</label>
              <input className="input" placeholder="Weekend Special" value={form.badgeText} onChange={set("badgeText")} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Title *</label>
            <input className="input" placeholder="Weekend Royal Feast" value={form.title} onChange={set("title")} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Offer details…" value={form.description} onChange={set("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Promo Code</label>
              <input className="input font-mono uppercase" placeholder="ROYAL50" value={form.promoCode}
                onChange={(e) => setForm((f) => ({ ...f, promoCode: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Saving Text</label>
              <input className="input" placeholder="Save ₹50" value={form.savingText} onChange={set("savingText")} />
            </div>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Discount Type</label>
              <select className="input" value={form.discountType} onChange={set("discountType")}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Value {form.discountType === "PERCENTAGE" ? "(%)" : "(₹)"}
              </label>
              <input className="input" type="number" min="0" placeholder="20" value={form.discountValue} onChange={set("discountValue")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Max Discount (₹)</label>
              <input className="input" type="number" min="0" placeholder="100" value={form.maxDiscount} onChange={set("maxDiscount")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Min Order (₹)</label>
              <input className="input" type="number" min="0" placeholder="500" value={form.minOrderAmount} onChange={set("minOrderAmount")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Valid Until</label>
              <input className="input" type="datetime-local" value={form.validUntil} onChange={set("validUntil")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bg Color Start</label>
              <div className="flex gap-2">
                <input type="color" className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer" value={form.bgColorStart}
                  onChange={set("bgColorStart")} />
                <input className="input flex-1" value={form.bgColorStart} onChange={set("bgColorStart")} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bg Color End</label>
              <div className="flex gap-2">
                <input type="color" className="h-9 w-12 rounded-lg border border-gray-200 cursor-pointer" value={form.bgColorEnd}
                  onChange={set("bgColorEnd")} />
                <input className="input flex-1" value={form.bgColorEnd} onChange={set("bgColorEnd")} />
              </div>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => save.mutate()} disabled={!form.title || save.isPending} className="btn-primary flex-1 disabled:opacity-50">
            {save.isPending ? "Saving…" : isEdit ? "Save Changes" : "Create Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
function OffersInner() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<Offer | null | "new">(null);
  const [tab, setTab] = useState<"offers" | "banners">("offers");

  const { data: offers = [], isLoading: offersLoading } = useQuery<Offer[]>({
    queryKey: ["admin-offers"],
    queryFn:  () => api.get("admin/banners/offers").then((r) => r.data.data ?? []),
  });

  const toggleOffer = useMutation({
    mutationFn: (id: string) => api.patch(`admin/banners/offers/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-offers"] }),
  });
  const deleteOffer = useMutation({
    mutationFn: (id: string) => api.delete(`admin/banners/offers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-offers"] }),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offers & Banners</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create promo codes and manage what customers see on the home screen</p>
        </div>
        <button onClick={() => setModal("new")} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {[{ key: "offers", label: "Promotional Offers", icon: Tag },
          { key: "banners", label: "Hero Banners", icon: ImageIcon }].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? "border-red-800 text-red-800" : "border-transparent text-gray-500 hover:text-gray-900"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "offers" && (
        offersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : offers.length === 0 ? (
          <div className="card p-16 text-center text-gray-400">
            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p className="font-medium mb-1">No offers yet</p>
            <p className="text-sm">Create your first promotional offer to attract customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className={`relative rounded-2xl overflow-hidden border transition-all ${!offer.is_active ? "opacity-50 grayscale" : ""}`}
                style={{ background: `linear-gradient(135deg, ${offer.bgColorStart}, ${offer.bgColorEnd})` }}>
                <div className="p-5 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{offer.emoji}</span>
                    <div className="flex gap-1">
                      <button onClick={() => toggleOffer.mutate(offer.id)}
                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        {offer.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setModal(offer)}
                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this offer?")) deleteOffer.mutate(offer.id); }}
                        className="p-1.5 bg-white/20 hover:bg-red-400/60 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-base leading-tight mb-1">{offer.title}</h3>
                  {offer.description && <p className="text-white/70 text-xs mb-3 line-clamp-2">{offer.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    {offer.promoCode && (
                      <span className="font-mono text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg tracking-wider">
                        {offer.promoCode}
                      </span>
                    )}
                    {offer.discountValue && (
                      <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">
                        {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                      </span>
                    )}
                    {offer.validUntil && (
                      <span className="text-xs text-white/50 ml-auto">
                        Expires {new Date(offer.validUntil).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "banners" && (
        <div className="card p-8 text-center text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
          <p className="font-medium mb-1">Hero Banner Management</p>
          <p className="text-sm text-gray-400">Banner CRUD coming soon. For now manage via database.</p>
        </div>
      )}

      {modal && (
        <OfferModal offer={modal === "new" ? null : modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

export default function OffersPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><OffersInner /></AdminShell>
    </QueryClientProvider>
  );
}
