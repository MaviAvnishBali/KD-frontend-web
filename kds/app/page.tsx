"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { CheckCircle, Clock, AlertTriangle, ChefHat, Volume2, VolumeX } from "lucide-react";

interface KdsOrder {
  id: string;
  orderNumber: string;
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  tableNumber?: string;
  items: KdsItem[];
  status: "PENDING" | "PREPARING" | "READY";
  placedAt: string;
  elapsedMinutes: number;
  priority: boolean;
  station?: string;
}

interface KdsItem {
  id: string;
  name: string;
  quantity: number;
  status: "PENDING" | "PREPARING" | "READY";
  customizations: string[];
  addons: string[];
  specialInstruction?: string;
}

type TimerColor = "text-green-600" | "text-yellow-500" | "text-red-600";

const getTimerColor = (minutes: number): TimerColor => {
  if (minutes < 10) return "text-green-600";
  if (minutes < 20) return "text-yellow-500";
  return "text-red-600";
};

const getTimerBg = (minutes: number): string => {
  if (minutes < 10) return "border-green-500 bg-green-50";
  if (minutes < 20) return "border-yellow-500 bg-yellow-50";
  return "border-red-500 bg-red-50 animate-pulse";
};

export default function KdsPage() {
  const [orders, setOrders] = useState<KdsOrder[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedStation, setSelectedStation] = useState<string>("ALL");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sock = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080", {
      path: "/ws/socket.io",
      transports: ["websocket"],
    });

    sock.on("connect", () => {
      console.log("KDS connected");
      sock.emit("kds:join", { branchId: "main" });
    });

    sock.on("kds:new-order", (order: KdsOrder) => {
      setOrders((prev) => [order, ...prev]);
      if (soundEnabled) playNewOrderSound();
    });

    sock.on("kds:order-updated", (updated: KdsOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)).filter((o) => o.status !== "READY")
      );
    });

    sock.on("kds:order-cancelled", ({ orderId }: { orderId: string }) => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (soundEnabled) playCancelSound();
    });

    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, [soundEnabled]);

  // Tick elapsed times every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => ({
          ...o,
          elapsedMinutes: Math.floor(
            (Date.now() - new Date(o.placedAt).getTime()) / 60000
          ),
        }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const startPreparing = useCallback((orderId: string) => {
    socket?.emit("kds:start-preparing", { orderId });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "PREPARING" } : o))
    );
  }, [socket]);

  const markReady = useCallback((orderId: string) => {
    socket?.emit("kds:mark-ready", { orderId });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (soundEnabled) playReadySound();
  }, [socket, soundEnabled]);

  const markItemReady = useCallback((orderId: string, itemId: string) => {
    socket?.emit("kds:item-ready", { orderId, itemId });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((i) =>
                i.id === itemId ? { ...i, status: "READY" } : i
              ),
            }
          : o
      )
    );
  }, [socket]);

  const filteredOrders = orders.filter(
    (o) => selectedStation === "ALL" || o.station === selectedStation || !o.station
  );

  const pendingOrders   = filteredOrders.filter((o) => o.status === "PENDING");
  const preparingOrders = filteredOrders.filter((o) => o.status === "PREPARING");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* KDS Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Kila Darbar KDS</span>
          </div>
          <div className="text-sm text-gray-400">
            {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Station filter */}
          <div className="flex gap-2">
            {["ALL", "GRILL", "FRY", "TANDOOR", "COLD", "BEVERAGES"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStation(s)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedStation === s
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-400 font-bold">{pendingOrders.length} Pending</span>
            <span className="text-blue-400 font-bold">{preparingOrders.length} Preparing</span>
            <span className="text-gray-400">{orders.length} Total</span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
        </div>
      </header>

      {/* KDS Board */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[calc(100vh-80px)]">
        {/* Pending column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <h2 className="font-bold text-yellow-400">INCOMING ({pendingOrders.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <KdsOrderCard
                key={order.id}
                order={order}
                onStartPreparing={() => startPreparing(order.id)}
                onMarkReady={() => markReady(order.id)}
                onItemReady={(itemId) => markItemReady(order.id, itemId)}
              />
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <ChefHat className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No pending orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Preparing column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <h2 className="font-bold text-blue-400">PREPARING ({preparingOrders.length})</h2>
          </div>
          <div className="space-y-3">
            {preparingOrders.map((order) => (
              <KdsOrderCard
                key={order.id}
                order={order}
                onMarkReady={() => markReady(order.id)}
                onItemReady={(itemId) => markItemReady(order.id, itemId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface KdsOrderCardProps {
  order: KdsOrder;
  onStartPreparing?: () => void;
  onMarkReady: () => void;
  onItemReady: (itemId: string) => void;
}

function KdsOrderCard({ order, onStartPreparing, onMarkReady, onItemReady }: KdsOrderCardProps) {
  const timerColor = getTimerColor(order.elapsedMinutes);
  const timerBg = getTimerBg(order.elapsedMinutes);

  const allItemsReady = order.items.every((i) => i.status === "READY");

  return (
    <div
      className={`rounded-xl border-2 p-4 space-y-3 ${timerBg} ${
        order.priority ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {order.priority && (
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                PRIORITY
              </span>
            )}
            <span className="font-bold text-gray-800 text-lg">#{order.orderNumber}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                order.orderType === "DINE_IN"
                  ? "bg-purple-100 text-purple-700"
                  : order.orderType === "PICKUP"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.orderType === "DINE_IN" && order.tableNumber
                ? `Table ${order.tableNumber}`
                : order.orderType}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className={`text-right font-mono font-bold text-lg ${timerColor}`}>
          <Clock className="w-4 h-4 inline mr-1" />
          {order.elapsedMinutes}m
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between p-2 rounded-lg ${
              item.status === "READY"
                ? "bg-green-100 opacity-60"
                : "bg-white/70"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">
                  {item.quantity}x {item.name}
                </span>
              </div>
              {item.customizations.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.customizations.join(", ")}
                </p>
              )}
              {item.addons.length > 0 && (
                <p className="text-xs text-blue-500 mt-0.5">
                  + {item.addons.join(", ")}
                </p>
              )}
              {item.specialInstruction && (
                <p className="text-xs text-orange-500 mt-0.5 font-medium">
                  ⚠ {item.specialInstruction}
                </p>
              )}
            </div>

            {item.status !== "READY" ? (
              <button
                onClick={() => onItemReady(item.id)}
                className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors flex-shrink-0"
              >
                Done
              </button>
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {order.status === "PENDING" && onStartPreparing && (
          <button
            onClick={onStartPreparing}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            START
          </button>
        )}

        <button
          onClick={onMarkReady}
          disabled={!allItemsReady && order.items.length > 0}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors ${
            allItemsReady || order.items.length === 0
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          READY ✓
        </button>
      </div>
    </div>
  );
}

function playNewOrderSound() {
  if (typeof window !== "undefined" && "AudioContext" in window) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  }
}

function playReadySound() {
  if (typeof window !== "undefined" && "AudioContext" in window) {
    const ctx = new AudioContext();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.2);
    });
  }
}

function playCancelSound() {
  if (typeof window !== "undefined" && "AudioContext" in window) {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }
}
