"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import { useCreateReservation, useAvailableSlots, useReservations, useCancelReservation } from "../lib/api/hooks";
import { Navbar } from "../components/layout/Navbar";
import { useAuthStore } from "../hooks/useAuthStore";

const BRANCH_ID = "1";
const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];
const OCCASIONS = ["Birthday", "Anniversary", "Business Dinner", "Date Night", "Family Gathering", "Other"];

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function ReservationsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"book" | "my">("book");

  const [name,    setName]    = useState(user?.name ?? "");
  const [phone,   setPhone]   = useState(user?.phone ?? "");
  const [date,    setDate]    = useState(tomorrow());
  const [time,    setTime]    = useState("");
  const [party,   setParty]   = useState(2);
  const [occasion, setOccasion] = useState("");
  const [request, setRequest] = useState("");
  const [done,    setDone]    = useState(false);

  const { data: slots, isLoading: slotsLoading } = useAvailableSlots(BRANCH_ID, date, party);
  const { data: myReservations, isLoading: resLoading } = useReservations();
  const createReservation = useCreateReservation();
  const cancelReservation = useCancelReservation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) return;
    createReservation.mutate(
      {
        branchId:      BRANCH_ID,
        customerName:  name,
        customerPhone: phone,
        partySize:     party,
        reservedDate:  date,
        reservedTime:  time,
        occasion:      occasion || undefined,
        specialRequest: request || undefined,
      },
      { onSuccess: () => setDone(true) }
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-eyebrow mb-2">Royal Table</p>
            <h1 className="section-title mb-3">
              Reserve a <span className="text-gold-shimmer">Table</span>
            </h1>
            <p className="font-cormo text-ivory/40 mb-10 text-lg">
              Book your seat at the royal court. We'll prepare for your arrival.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
            {(["book", "my"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg font-royal text-xs tracking-widest uppercase transition-all ${
                  tab === t ? "bg-gold-400/15 text-gold-400 border border-gold-400/30" : "text-ivory/40 hover:text-ivory"
                }`}
              >
                {t === "book" ? "Book Table" : "My Reservations"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "book" && (
              <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {done ? (
                  <div className="text-center py-20">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    <h2 className="font-royal text-2xl text-ivory mb-3">Reservation Confirmed!</h2>
                    <p className="font-cormo text-ivory/50 mb-8">We look forward to welcoming you to Kila Darbar.</p>
                    <button onClick={() => { setDone(false); setTab("my"); }} className="btn-gold magnetic">
                      <span>View My Reservations</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="card-luxury rounded-2xl p-8 space-y-6">
                    {/* Guest info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Full Name</label>
                        <input
                          required value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border-b border-gold-400/20 focus:border-gold-400/60 text-ivory font-cormo py-2 outline-none transition-colors placeholder:text-ivory/20"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Phone</label>
                        <input
                          required value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-transparent border-b border-gold-400/20 focus:border-gold-400/60 text-ivory font-cormo py-2 outline-none transition-colors placeholder:text-ivory/20"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    {/* Date + Party */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Date
                        </label>
                        <input
                          type="date" required value={date}
                          min={tomorrow()}
                          onChange={(e) => { setDate(e.target.value); setTime(""); }}
                          className="w-full bg-transparent border-b border-gold-400/20 focus:border-gold-400/60 text-ivory font-cormo py-2 outline-none transition-colors"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Party Size
                        </label>
                        <div className="flex gap-2 flex-wrap pt-1">
                          {PARTY_SIZES.map((n) => (
                            <button
                              key={n} type="button"
                              onClick={() => { setParty(n); setTime(""); }}
                              className={`w-8 h-8 rounded-lg border font-royal text-xs transition-all ${
                                party === n ? "bg-gold-400/15 border-gold-400/50 text-gold-400" : "border-gold-400/15 text-ivory/40 hover:text-ivory"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Time slots */}
                    <div>
                      <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Available Slots
                      </label>
                      {slotsLoading ? (
                        <div className="flex gap-2 flex-wrap">
                          {[...Array(6)].map((_, i) => <div key={i} className="h-8 w-20 rounded-lg bg-white/5 animate-pulse" />)}
                        </div>
                      ) : !slots?.length ? (
                        <p className="font-cormo text-ivory/30 text-sm">No slots available for this date/party size.</p>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {slots.map((slot) => (
                            <button
                              key={slot} type="button"
                              onClick={() => setTime(slot)}
                              className={`px-3 py-1.5 rounded-lg border font-royal text-xs tracking-wider transition-all ${
                                time === slot ? "bg-gold-400/15 border-gold-400/50 text-gold-400" : "border-gold-400/15 text-ivory/50 hover:text-ivory"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Occasion */}
                    <div>
                      <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Occasion (optional)</label>
                      <div className="flex gap-2 flex-wrap">
                        {OCCASIONS.map((occ) => (
                          <button
                            key={occ} type="button"
                            onClick={() => setOccasion(occasion === occ ? "" : occ)}
                            className={`px-3 py-1.5 rounded-full border font-royal text-[10px] tracking-widest uppercase transition-all ${
                              occasion === occ ? "bg-gold-400/15 border-gold-400/40 text-gold-400" : "border-gold-400/10 text-ivory/40 hover:text-ivory"
                            }`}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special request */}
                    <div>
                      <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Special Requests</label>
                      <textarea
                        value={request} onChange={(e) => setRequest(e.target.value)} rows={3}
                        className="w-full bg-transparent border border-gold-400/20 focus:border-gold-400/40 text-ivory font-cormo py-2 px-3 rounded-xl outline-none transition-colors placeholder:text-ivory/20 resize-none"
                        placeholder="Dietary needs, seating preference, decoration…"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!time || createReservation.isPending}
                      className="btn-gold w-full justify-center py-4 disabled:opacity-50"
                    >
                      {createReservation.isPending ? (
                        <span className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      ) : (
                        <span>Confirm Reservation</span>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {tab === "my" && (
              <motion.div key="my" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {resLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => <div key={i} className="card-luxury rounded-2xl p-6 animate-pulse h-32" />)}
                  </div>
                ) : !myReservations?.length ? (
                  <div className="text-center py-24">
                    <p className="text-4xl mb-4">🪑</p>
                    <p className="font-royal text-ivory/40 text-sm tracking-widest uppercase mb-6">No reservations</p>
                    <button onClick={() => setTab("book")} className="btn-gold magnetic"><span>Book a Table</span></button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myReservations.map((res, i) => (
                      <motion.div key={res.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-luxury rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-royal text-ivory text-base">{res.customerName}</p>
                            <p className="font-cormo text-sm text-ivory/40">{res.reservedDate} at {res.reservedTime}</p>
                          </div>
                          <span className={`font-royal text-xs tracking-widest uppercase ${
                            res.status === "CONFIRMED" ? "text-green-400" :
                            res.status === "CANCELLED" ? "text-red-400" : "text-yellow-400"
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-ivory/40 font-cormo text-sm">
                          <span>{res.partySize} guests</span>
                          {res.occasion && <span>· {res.occasion}</span>}
                          {res.tableNumber && <span>· Table {res.tableNumber}</span>}
                        </div>
                        {res.status !== "CANCELLED" && (
                          <button
                            onClick={() => cancelReservation.mutate(res.id)}
                            className="mt-4 font-royal text-[10px] tracking-widest text-red-400/50 hover:text-red-400 transition-colors uppercase"
                          >
                            Cancel
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
