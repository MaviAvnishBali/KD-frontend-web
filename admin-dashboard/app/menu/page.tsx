"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, X, ChevronDown, ImagePlus, ImageOff } from "lucide-react";
import { useRef } from "react";
import { AdminShell } from "../components/AdminShell";
import api from "../lib/api";

/* ── Types ── */
interface MenuItem {
  id: string; name: string; description: string; price: number;
  discountPrice: number | null; foodType: string; categoryId: number;
  preparationTime: number; isAvailable: boolean; isBestSeller: boolean;
  rating: number | null;
  images: { url: string; isPrimary: boolean }[] | null;
}
interface Category { id: number; name: string; }

const FOOD_TYPES = ["VEG", "NON_VEG", "VEGAN", "JAIN"];

const EMPTY_FORM = { name: "", description: "", price: "", discountPrice: "",
  foodType: "VEG", categoryId: "", preparationTime: "20", gstRate: "5" };

/* ── Item form modal ── */
function ItemModal({ item, categories, onClose }: {
  item: MenuItem | null; categories: Category[]; onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!item;
  const [form, setForm] = useState(item ? {
    name: item.name, description: item.description ?? "",
    price: String(item.price), discountPrice: item.discountPrice ? String(item.discountPrice) : "",
    foodType: item.foodType, categoryId: String(item.categoryId),
    preparationTime: String(item.preparationTime), gstRate: "5",
  } : EMPTY_FORM);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name, description: form.description,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        foodType: form.foodType,
        categoryId: parseInt(form.categoryId),
        preparationTime: parseInt(form.preparationTime),
        gstRate: parseFloat(form.gstRate),
        branchId: "00000000-0000-0000-0000-000000000001",
      };
      if (isEdit) return api.put(`admin/menu/items/${item!.id}`, payload);
      return api.post("admin/menu/items", payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-menu"] }); onClose(); },
    onError: (e: any) => setError(typeof e === "string" ? e : "Failed to save"),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{isEdit ? "Edit Dish" : "Add New Dish"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Dish Name *</label>
            <input className="input" placeholder="e.g. Veg Dum Biryani" value={form.name} onChange={set("name")} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Describe the dish…" value={form.description} onChange={set("description")} />
          </div>

          {/* Category + Food type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Category *</label>
              <select className="input" value={form.categoryId} onChange={set("categoryId")}>
                <option value="">Select…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Food Type *</label>
              <select className="input" value={form.foodType} onChange={set("foodType")}>
                {FOOD_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Price (₹) *</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="420" value={form.price} onChange={set("price")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Discount Price (₹)</label>
              <input className="input" type="number" min="0" step="0.01" placeholder="Optional" value={form.discountPrice} onChange={set("discountPrice")} />
            </div>
          </div>

          {/* Prep time + GST */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Prep Time (min)</label>
              <input className="input" type="number" min="0" value={form.preparationTime} onChange={set("preparationTime")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">GST Rate (%)</label>
              <select className="input" value={form.gstRate} onChange={set("gstRate")}>
                {["0","5","12","18"].map((r) => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={!form.name || !form.price || !form.categoryId || save.isPending}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {save.isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Dish"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Image upload cell ── */
function ImageCell({ item }: { item: MenuItem }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const primaryUrl = item.images?.find((i) => i.isPrimary)?.url ?? item.images?.[0]?.url ?? null;

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return api.post(`admin/menu/items/${item.id}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-menu"] }),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {primaryUrl ? (
          <img src={primaryUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImageOff className="w-4 h-4 text-gray-300" />
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors disabled:opacity-50"
        title={primaryUrl ? "Replace image" : "Upload image"}
      >
        {upload.isPending
          ? <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin block" />
          : <ImagePlus className="w-4 h-4" />
        }
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

/* ── Main page ── */
function MenuInner() {
  const qc = useQueryClient();
  const [search,  setSearch]  = useState("");
  const [catFilter, setCat]   = useState("");
  const [modal,   setModal]   = useState<MenuItem | null | "new">(null);

  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["admin-menu"],
    queryFn:  () => api.get("v1/products?size=100").then((r) => r.data.data?.content ?? []),
  });
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn:  () => api.get("v1/categories").then((r) => r.data.data ?? []),
  });

  const toggleAvail = useMutation({
    mutationFn: (id: string) => api.patch(`admin/menu/items/${id}/toggle-availability`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-menu"] }),
  });
  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`admin/menu/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-menu"] }),
  });

  const filtered = items.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !catFilter || String(i.categoryId) === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu & Dishes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} dishes · manage prices, availability and details</p>
        </div>
        <button onClick={() => setModal("new")} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Dish
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search dishes…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={catFilter} onChange={(e) => setCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="card">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-medium">No dishes found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Image", "Dish", "Category", "Price", "Discount", "Type", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const catName = categories.find((c) => c.id === item.categoryId)?.name ?? "—";
                const typeColor = { VEG: "text-green-700 bg-green-50", NON_VEG: "text-red-700 bg-red-50",
                  VEGAN: "text-emerald-700 bg-emerald-50", JAIN: "text-orange-700 bg-orange-50" }[item.foodType] ?? "";
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <ImageCell item={item} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 leading-tight">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{catName}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{item.price}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">
                      {item.discountPrice ? `₹${item.discountPrice}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor}`}>
                        {item.foodType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvail.mutate(item.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium ${item.isAvailable ? "text-green-600" : "text-gray-400"}`}
                      >
                        {item.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {item.isAvailable ? "Available" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal(item)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${item.name}"?`)) deleteItem.mutate(item.id); }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ItemModal
          item={modal === "new" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  const [qc] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><MenuInner /></AdminShell>
    </QueryClientProvider>
  );
}
