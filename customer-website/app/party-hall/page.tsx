"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, Clock, CheckCircle, Star, Sparkles, Music, Cake } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { useBookPartyHall, useMyPartyHallBookings, useCancelPartyHallBooking } from "../lib/api/hooks";
import { useAuthStore } from "../hooks/useAuthStore";
import type { PartyHallPackage } from "../lib/api/types";

// ── Data ──────────────────────────────────────────────────────────────────────

const OCCASIONS = [
  { label: "Birthday",       emoji: "🎂" },
  { label: "Ring Ceremony",  emoji: "💍" },
  { label: "Baby Shower",    emoji: "🍼" },
  { label: "Anniversary",    emoji: "🌹" },
  { label: "Corporate",      emoji: "💼" },
  { label: "Engagement",     emoji: "💎" },
  { label: "Farewell",       emoji: "✈️" },
  { label: "Other",          emoji: "✨" },
];

const TIME_SLOTS = [
  "10:00 AM – 1:00 PM",
  "1:00 PM – 4:00 PM",
  "4:00 PM – 7:00 PM",
  "7:00 PM – 10:00 PM",
];

const PACKAGES: {
  key: PartyHallPackage;
  name: string;
  subtitle: string;
  price: string;
  capacity: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    key: "BASIC",
    name: "Darbar Basic",
    subtitle: "An elegant start",
    price: "₹15,000",
    capacity: "Up to 50 guests",
    features: [
      "4-hour hall rental",
      "Basic floral décor",
      "Welcome drinks for all guests",
      "Dedicated event coordinator",
      "Standard sound system",
    ],
  },
  {
    key: "ROYAL",
    name: "Royal Celebration",
    subtitle: "Most popular",
    price: "₹28,000",
    capacity: "Up to 80 guests",
    features: [
      "6-hour hall rental",
      "Premium floral & drape décor",
      "Welcome drinks + snacks",
      "Customised menu (veg / non-veg)",
      "Professional sound & lighting",
      "Photography setup area",
      "Dedicated event team",
    ],
    highlight: true,
  },
  {
    key: "GRAND",
    name: "Grand Mughal",
    subtitle: "The complete experience",
    price: "₹48,000",
    capacity: "Up to 100 guests",
    features: [
      "Full-day hall rental (8 hrs)",
      "Luxury Mughal-theme décor",
      "Multi-course banquet menu",
      "Live ghazal / instrumental music",
      "Professional DJ setup",
      "Stage & backdrop",
      "In-house photographer",
      "Exclusive bridal/VIP lounge",
    ],
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0407 0%, #0d0208 50%, #1a0505 100%)" }} />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #7C1D1D 0%, transparent 60%), radial-gradient(circle at 70% 50%, #4a0b0b 0%, transparent 60%)" }} />

      {/* Ornamental corners */}
      {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
        <div key={pos} className={`absolute ${pos} w-12 h-12 opacity-30`}
          style={{ border: "1px solid #D4AF37", borderRadius: "2px" }} />
      ))}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="section-eyebrow mb-4"
        >
          Private Events
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="section-title mb-6"
        >
          Your Royal{" "}
          <span className="text-gold-shimmer">Party Hall</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="font-cormo text-ivory/50 text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Celebrate life's most precious moments in a setting worthy of royalty.
          Birthdays, ring ceremonies, anniversaries — for intimate gatherings of up to 100 guests.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-wrap gap-6 justify-center"
        >
          {[
            { icon: <Users className="w-4 h-4" />,   label: "Up to 100 guests" },
            { icon: <Clock className="w-4 h-4" />,   label: "Flexible timing" },
            { icon: <Sparkles className="w-4 h-4" />, label: "Custom décor" },
            { icon: <Music className="w-4 h-4" />,   label: "Live music available" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 font-royal text-[11px] tracking-widest uppercase text-ivory/50">
              <span className="text-gold-400">{icon}</span>
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function OccasionsStrip() {
  return (
    <section className="py-12 border-y border-gold-400/10">
      <div className="container mx-auto px-6">
        <p className="text-center font-royal text-[10px] tracking-[0.4em] uppercase text-gold-400/60 mb-8">Perfect For</p>
        <div className="flex flex-wrap justify-center gap-4">
          {OCCASIONS.map(({ label, emoji }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border border-gold-400/10 hover:border-gold-400/30 transition-colors" style={{ background: "rgba(212,175,55,0.03)" }}>
              <span className="text-2xl">{emoji}</span>
              <span className="font-royal text-[10px] tracking-widest uppercase text-ivory/50">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Packages</p>
          <h2 className="section-title">Choose Your <span className="text-gold-shimmer">Experience</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.key}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
              className={`relative rounded-2xl p-8 flex flex-col ${pkg.highlight ? "border-gold-400/40" : "border-gold-400/10"}`}
              style={{
                background: pkg.highlight
                  ? "linear-gradient(135deg, rgba(124,29,29,0.2), rgba(74,11,11,0.15))"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${pkg.highlight ? "rgba(212,175,55,0.35)" : "rgba(212,175,55,0.08)"}`,
              }}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-400 text-obsidian font-royal text-[9px] tracking-widest uppercase px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <p className="font-royal text-[10px] tracking-[0.3em] uppercase text-gold-400/60 mb-2">{pkg.subtitle}</p>
              <h3 className="font-royal text-xl text-ivory mb-1">{pkg.name}</h3>
              <p className="font-cormo text-ivory/40 text-sm mb-4">{pkg.capacity}</p>
              <p className="font-royal text-3xl text-gold-400 mb-6">{pkg.price}</p>

              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 font-cormo text-sm text-ivory/60">
                    <Star className="w-3.5 h-3.5 text-gold-400/60 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                className={`w-full text-center py-3 rounded-xl font-royal text-xs tracking-widest uppercase transition-all ${
                  pkg.highlight
                    ? "btn-gold"
                    : "border border-gold-400/25 text-ivory/60 hover:border-gold-400/50 hover:text-ivory"
                }`}
              >
                <span>Select Package</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingForm({ defaultPackage }: { defaultPackage: PartyHallPackage }) {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"book" | "my">("book");
  const [done, setDone] = useState(false);

  const [name,         setName]         = useState(user?.name ?? "");
  const [phone,        setPhone]        = useState(user?.phone ?? "");
  const [email,        setEmail]        = useState(user?.email ?? "");
  const [eventType,    setEventType]    = useState("");
  const [guestCount,   setGuestCount]   = useState(50);
  const [date,         setDate]         = useState("");
  const [timeSlot,     setTimeSlot]     = useState("");
  const [packageType,  setPackageType]  = useState<PartyHallPackage>(defaultPackage);
  const [requests,     setRequests]     = useState("");

  const book   = useBookPartyHall();
  const { data: myBookings, isLoading } = useMyPartyHallBookings();
  const cancel = useCancelPartyHallBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType || !date || !timeSlot) return;
    book.mutate(
      { customerName: name, customerPhone: phone, customerEmail: email || undefined,
        eventType, guestCount, preferredDate: date, preferredTime: timeSlot,
        packageType, specialRequests: requests || undefined },
      { onSuccess: () => setDone(true) }
    );
  };

  const tomorrow = () => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const inputCls = "w-full bg-transparent border-b border-gold-400/20 focus:border-gold-400/60 text-ivory font-cormo py-2 outline-none transition-colors placeholder:text-ivory/20";

  return (
    <section id="book" className="py-20 border-t border-gold-400/10">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Book Now</p>
          <h2 className="section-title">Reserve the <span className="text-gold-shimmer">Hall</span></h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
          {(["book", "my"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg font-royal text-xs tracking-widest uppercase transition-all ${
                tab === t ? "bg-gold-400/15 text-gold-400 border border-gold-400/30" : "text-ivory/40 hover:text-ivory"
              }`}
            >
              {t === "book" ? "Book Hall" : "My Bookings"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "book" && (
            <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {done ? (
                <div className="text-center py-20">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h2 className="font-royal text-2xl text-ivory mb-3">Booking Enquiry Sent!</h2>
                  <p className="font-cormo text-ivory/50 mb-2 text-lg">Our events team will call you within 2 hours to confirm.</p>
                  <p className="font-cormo text-ivory/30 mb-8 text-sm">You'll receive an SMS confirmation on {phone}</p>
                  <button onClick={() => { setDone(false); setTab("my"); }} className="btn-gold magnetic">
                    <span>View My Bookings</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-luxury rounded-2xl p-8 space-y-7">

                  {/* Contact */}
                  <div>
                    <p className="font-royal text-[10px] tracking-[0.3em] uppercase text-gold-400/50 mb-4">Contact Details</p>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Name *</label>
                        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
                      </div>
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Phone *</label>
                        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Email (optional)</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="For booking confirmation" />
                    </div>
                  </div>

                  {/* Event */}
                  <div>
                    <p className="font-royal text-[10px] tracking-[0.3em] uppercase text-gold-400/50 mb-4">Event Details</p>
                    <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-3">Occasion *</label>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {OCCASIONS.map(({ label, emoji }) => (
                        <button key={label} type="button" onClick={() => setEventType(label)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-royal text-[10px] tracking-widest uppercase transition-all ${
                            eventType === label
                              ? "bg-gold-400/15 border-gold-400/40 text-gold-400"
                              : "border-gold-400/10 text-ivory/40 hover:text-ivory"
                          }`}
                        >
                          {emoji} {label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Preferred Date *
                        </label>
                        <input type="date" required value={date} min={tomorrow()} onChange={(e) => setDate(e.target.value)}
                          className={inputCls} style={{ colorScheme: "dark" }} />
                      </div>
                      <div>
                        <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Guest Count
                        </label>
                        <div className="flex items-center gap-3 py-2">
                          <input type="range" min={10} max={100} step={5} value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="flex-1 accent-yellow-600" />
                          <span className="font-royal text-gold-400 text-sm w-8 text-right">{guestCount}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Preferred Time Slot *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button key={slot} type="button" onClick={() => setTimeSlot(slot)}
                            className={`px-3 py-2.5 rounded-xl border font-royal text-[10px] tracking-wider uppercase transition-all ${
                              timeSlot === slot ? "bg-gold-400/15 border-gold-400/50 text-gold-400" : "border-gold-400/10 text-ivory/40 hover:text-ivory"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Package */}
                  <div>
                    <p className="font-royal text-[10px] tracking-[0.3em] uppercase text-gold-400/50 mb-4">Package</p>
                    <div className="grid grid-cols-3 gap-3">
                      {PACKAGES.map((pkg) => (
                        <button key={pkg.key} type="button" onClick={() => setPackageType(pkg.key)}
                          className={`py-3 px-2 rounded-xl border text-center transition-all ${
                            packageType === pkg.key ? "bg-gold-400/15 border-gold-400/40" : "border-gold-400/10 hover:border-gold-400/25"
                          }`}
                        >
                          <p className={`font-royal text-[10px] tracking-widest uppercase mb-1 ${packageType === pkg.key ? "text-gold-400" : "text-ivory/50"}`}>
                            {pkg.name.split(" ").slice(-1)[0]}
                          </p>
                          <p className={`font-royal text-sm ${packageType === pkg.key ? "text-gold-400" : "text-ivory/30"}`}>
                            {pkg.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Requests */}
                  <div>
                    <label className="font-royal text-[10px] tracking-widest text-ivory/40 uppercase block mb-2">Special Requests</label>
                    <textarea value={requests} onChange={(e) => setRequests(e.target.value)} rows={3}
                      className="w-full bg-transparent border border-gold-400/20 focus:border-gold-400/40 text-ivory font-cormo py-2 px-3 rounded-xl outline-none transition-colors placeholder:text-ivory/20 resize-none"
                      placeholder="Theme colour, dietary requirements, decoration preferences…" />
                  </div>

                  <button type="submit" disabled={!eventType || !date || !timeSlot || book.isPending}
                    className="btn-gold w-full justify-center py-4 disabled:opacity-50">
                    {book.isPending
                      ? <span className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                      : <span>Send Booking Enquiry</span>
                    }
                  </button>
                  <p className="text-center font-cormo text-ivory/30 text-xs">
                    Our events coordinator will call you within 2 hours to finalise details.
                  </p>
                </form>
              )}
            </motion.div>
          )}

          {tab === "my" && (
            <motion.div key="my" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => <div key={i} className="card-luxury rounded-2xl p-6 h-32 animate-pulse" />)}
                </div>
              ) : !myBookings?.length ? (
                <div className="text-center py-24">
                  <Cake className="w-12 h-12 text-ivory/20 mx-auto mb-4" />
                  <p className="font-royal text-ivory/40 text-sm tracking-widest uppercase mb-6">No bookings yet</p>
                  <button onClick={() => setTab("book")} className="btn-gold magnetic"><span>Book Now</span></button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }} className="card-luxury rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-royal text-ivory text-base">{b.eventType}</p>
                          <p className="font-cormo text-sm text-ivory/40">{b.preferredDate} · {b.preferredTime}</p>
                        </div>
                        <span className={`font-royal text-xs tracking-widest uppercase ${
                          b.status === "CONFIRMED" ? "text-green-400" :
                          b.status === "CANCELLED" ? "text-red-400" : "text-yellow-400"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 font-cormo text-sm text-ivory/40">
                        <span>{b.guestCount} guests</span>
                        <span>· {PACKAGES.find((p) => p.key === b.packageType)?.name ?? b.packageType}</span>
                        {b.totalAmount && <span>· ₹{b.totalAmount.toLocaleString("en-IN")}</span>}
                      </div>
                      {b.status === "PENDING" && (
                        <button onClick={() => cancel.mutate(b.id)}
                          className="mt-4 font-royal text-[10px] tracking-widest text-red-400/50 hover:text-red-400 transition-colors uppercase">
                          Cancel Booking
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
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartyHallPage() {
  return (
    <main className="bg-obsidian">
      <Navbar />
      <div className="pt-24">
        <HeroSection />
        <OccasionsStrip />
        <PackagesSection />
        <BookingForm defaultPackage="ROYAL" />
      </div>
      <Footer />
    </main>
  );
}
