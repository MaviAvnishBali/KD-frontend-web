"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, MapPin, Star, LogOut, Plus, Trash2, Edit3, Check, X } from "lucide-react";
import {
  useProfile, useUpdateProfile,
  useAddresses, useAddAddress, useDeleteAddress,
  useLoyalty,
} from "../lib/api/hooks";
import { Navbar } from "../components/layout/Navbar";
import { useAuthStore } from "../hooks/useAuthStore";
import { useRequireAuth } from "../hooks/useRequireAuth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useRequireAuth();
  const { logout } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addresses, isLoading: addrLoading }  = useAddresses();
  const { data: loyalty }                            = useLoyalty();
  const updateProfile = useUpdateProfile();
  const addAddress    = useAddAddress();
  const deleteAddress = useDeleteAddress();

  const [editing, setEditing] = useState(false);
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  const [showAddAddr, setShowAddAddr] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: "", addressLine1: "", city: "", state: "", pincode: "" });

  const startEdit = () => {
    setName(profile?.name ?? "");
    setEmail(profile?.email ?? "");
    setEditing(true);
  };

  const saveProfile = () => {
    updateProfile.mutate({ name, email }, { onSuccess: () => setEditing(false) });
  };

  const handleAddAddress = () => {
    if (!addrForm.addressLine1 || !addrForm.city || !addrForm.pincode) {
      toast.error("Please fill required fields");
      return;
    }
    addAddress.mutate(
      { ...addrForm, addressLine2: null, landmark: null, latitude: null, longitude: null, isDefault: (addresses?.length ?? 0) === 0 },
      { onSuccess: () => { setShowAddAddr(false); setAddrForm({ label: "", addressLine1: "", city: "", state: "", pincode: "" }); } }
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isAuthenticated) return null;

  if (profileLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-obsidian pt-28">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="card-luxury rounded-2xl p-8 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-white/5 mb-4" />
              <div className="h-5 bg-white/5 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/4" />
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-2xl space-y-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-eyebrow mb-2">Your Account</p>
            <h1 className="section-title mb-8">
              My <span className="text-gold-shimmer">Profile</span>
            </h1>
          </motion.div>

          {/* Profile card */}
          <div className="card-luxury rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-obsidian"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}>
                  {profile?.name?.charAt(0)?.toUpperCase() ?? "G"}
                </div>
                <div>
                  {editing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-b border-gold-400/40 text-ivory font-royal text-lg outline-none focus:border-gold-400/80 transition-colors w-48"
                    />
                  ) : (
                    <h2 className="font-royal text-lg text-ivory">{profile?.name ?? "Guest"}</h2>
                  )}
                  <p className="font-cormo text-ivory/40 text-sm">{profile?.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={saveProfile} disabled={updateProfile.isPending} className="p-2 text-green-400 hover:text-green-300 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditing(false)} className="p-2 text-ivory/40 hover:text-ivory transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button onClick={startEdit} className="p-2 text-ivory/40 hover:text-gold-400 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gold-400/40" />
                {editing ? (
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                    className="bg-transparent border-b border-gold-400/20 text-ivory/70 font-cormo text-sm outline-none focus:border-gold-400/50 transition-colors flex-1"
                  />
                ) : (
                  <span className="font-cormo text-sm text-ivory/60">{profile?.email ?? "—"}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-gold-400/40" />
                <span className="font-royal text-xs text-ivory/60 uppercase tracking-wide">
                  {profile?.role?.replace("_", " ") ?? "Customer"}
                </span>
              </div>
            </div>
          </div>

          {/* Loyalty */}
          {loyalty && (
            <div className="card-luxury rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(107,15,26,0.15))" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-royal text-[10px] tracking-widest text-gold-400/60 uppercase mb-1">Royal Rewards</p>
                  <p className="font-royal text-3xl text-gold-400">{loyalty.points.toLocaleString()}</p>
                  <p className="font-cormo text-sm text-ivory/40">points · {loyalty.tier} Member</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl">👑</p>
                  {loyalty.nextTierPoints && (
                    <p className="font-cormo text-xs text-ivory/30 mt-1">
                      {loyalty.nextTierPoints.toLocaleString()} pts to {loyalty.nextTier}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="card-luxury rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400/60" />
                <span className="font-royal text-xs tracking-widest text-ivory/60 uppercase">Saved Addresses</span>
              </div>
              <button onClick={() => setShowAddAddr(!showAddAddr)} className="text-gold-400/60 hover:text-gold-400 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {showAddAddr && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-4 rounded-xl border border-gold-400/15 space-y-3">
                {[
                  { label: "Label (Home/Work)", key: "label", placeholder: "Home" },
                  { label: "Address Line 1 *", key: "addressLine1", placeholder: "Street, Area" },
                  { label: "City *", key: "city", placeholder: "Bangalore" },
                  { label: "State", key: "state", placeholder: "Karnataka" },
                  { label: "Pincode *", key: "pincode", placeholder: "560001" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="font-royal text-[9px] tracking-widest text-ivory/30 uppercase block mb-1">{label}</label>
                    <input
                      value={addrForm[key as keyof typeof addrForm]}
                      onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-transparent border-b border-gold-400/15 focus:border-gold-400/40 text-ivory font-cormo text-sm py-1.5 outline-none transition-colors placeholder:text-ivory/20"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleAddAddress} disabled={addAddress.isPending} className="btn-gold text-xs py-2 px-4 disabled:opacity-50">Save</button>
                  <button onClick={() => setShowAddAddr(false)} className="font-royal text-xs text-ivory/40 hover:text-ivory transition-colors px-3">Cancel</button>
                </div>
              </motion.div>
            )}

            {addrLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : !addresses?.length ? (
              <p className="font-cormo text-ivory/30 text-sm text-center py-4">No saved addresses</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div>
                      {addr.label && <p className="font-royal text-[10px] tracking-widest text-gold-400/60 uppercase mb-0.5">{addr.label}</p>}
                      <p className="font-cormo text-sm text-ivory/70">{addr.addressLine1}, {addr.city}</p>
                      <p className="font-cormo text-xs text-ivory/30">{addr.state} – {addr.pincode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {addr.isDefault && <span className="font-royal text-[9px] tracking-widest text-green-400 uppercase">Default</span>}
                      <button onClick={() => deleteAddress.mutate(addr.id)} className="text-ivory/20 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-royal text-xs tracking-widest text-red-400/50 hover:text-red-400 transition-colors uppercase"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </main>
    </>
  );
}
