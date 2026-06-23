"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminShell } from "../components/AdminShell";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  ChefHat,
  IndianRupee,
  Clock,
  Star,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import api from "../lib/api";
import { formatCurrency } from "../lib/utils";

const COLORS = ["#7C1D1D", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  activeOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  avgRating: number;
  lowStockAlerts: number;
  pendingReservations: number;
  salesTrend: Array<{ hour: string; sales: number; orders: number }>;
  ordersByType: Array<{ name: string; value: number }>;
  topItems: Array<{ name: string; quantity: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    number: string;
    customer: string;
    total: number;
    status: string;
    type: string;
    time: string;
  }>;
}

export default function DashboardPage() {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      <AdminShell><DashboardInner /></AdminShell>
    </QueryClientProvider>
  );
}

function DashboardInner() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/reports/dashboard").then((r) => r.data.data),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const kpiCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(stats?.todaySales ?? 0),
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "+12% vs yesterday",
      trendUp: true,
    },
    {
      title: "Orders Today",
      value: stats?.todayOrders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: `${stats?.activeOrders ?? 0} active`,
      trendUp: true,
    },
    {
      title: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+47 new today",
      trendUp: true,
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats?.avgOrderValue ?? 0),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+₹23 vs last week",
      trendUp: true,
    },
    {
      title: "Avg Rating",
      value: `${stats?.avgRating ?? 0} ★`,
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      trend: "Based on 1,234 reviews",
      trendUp: true,
    },
    {
      title: "Low Stock Alerts",
      value: stats?.lowStockAlerts ?? 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      trend: "Items need restocking",
      trendUp: false,
    },
    {
      title: "Avg Prep Time",
      value: "18 min",
      icon: ChefHat,
      color: "text-teal-600",
      bg: "bg-teal-50",
      trend: "2 min faster than target",
      trendUp: true,
    },
    {
      title: "Reservations",
      value: stats?.pendingReservations ?? 0,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "Pending confirmations",
      trendUp: false,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-royal-maroon font-serif">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <button className="btn-outline-royal py-2 px-4 text-sm">
            Export Report
          </button>
          <button className="btn-royal py-2 px-4 text-sm">
            + New Order
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-royal transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground mb-1">{card.title}</p>
            <p className={`text-xs font-medium ${card.trendUp ? "text-green-600" : "text-red-600"}`}>
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales trend */}
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-semibold mb-4">Sales Today (Hourly)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats?.salesTrend ?? []}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C1D1D" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C1D1D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#7C1D1D"
                fill="url(#salesGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by type */}
        <div className="bg-white dark:bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-semibold mb-4">Orders by Type</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats?.ordersByType ?? []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {(stats?.ordersByType ?? []).map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling items */}
        <div className="bg-white dark:bg-card rounded-2xl p-6 border border-border">
          <h2 className="font-semibold mb-4">Top Selling Items Today</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={(stats?.topItems ?? []).slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v) => [`${v} orders`]} />
              <Bar dataKey="quantity" fill="#7C1D1D" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="bg-white dark:bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-royal-maroon hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {(stats?.recentOrders ?? []).slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{order.number}</p>
                  <p className="text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING:          { label: "Pending",          className: "bg-yellow-100 text-yellow-700" },
    CONFIRMED:        { label: "Confirmed",        className: "bg-blue-100 text-blue-700" },
    PREPARING:        { label: "Preparing",        className: "bg-orange-100 text-orange-700" },
    READY:            { label: "Ready",            className: "bg-purple-100 text-purple-700" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-indigo-100 text-indigo-700" },
    DELIVERED:        { label: "Delivered",        className: "bg-green-100 text-green-700" },
    CANCELLED:        { label: "Cancelled",        className: "bg-red-100 text-red-700" },
  };
  const c = config[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-80 bg-muted rounded-2xl" />
        <div className="h-80 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
