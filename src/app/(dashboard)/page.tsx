'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  DollarSign,
  ShoppingBag,
  Box,
  TrendingUp,
  Users as UsersIcon,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Star,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  BarChart3,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCounts, getOverviewCards } from '@/api/analytics';
import useCurrentYearOrder from "@/hooks/analytics/useCurrentYearOrder";
import useCustomerReviews from "@/hooks/analytics/useCustomerReviews";
import useLiveSalesBreakdown from '@/hooks/analytics/useLiveSalesBreakdown';
import { useDashboardStore } from '@/store/useDashboardStore';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ───────── Greeting by time of day ─────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// ───────── Modern area chart config ─────────
function buildAreaOptions(categories: string[], color: string) {
  return {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'inherit',
    },
    colors: [color],
    stroke: { curve: 'smooth' as const, width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#999', fontSize: '11px', fontWeight: 500 } },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { style: { colors: '#999', fontSize: '11px' }, formatter: (v: number) => `${v}` },
    },
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { sizeOffset: 4 } },
    tooltip: {
      theme: 'light',
      y: { formatter: (v: number) => `${v}` },
    },
  };
}

// ───────── Donut chart config ─────────
function buildDonutOptions(labels: string[], colors: string[]) {
  return {
    chart: { background: 'transparent', fontFamily: 'inherit' },
    labels,
    colors,
    legend: {
      show: true,
      position: 'bottom' as const,
      fontSize: '12px',
      fontWeight: 500,
      labels: { colors: '#666' },
      markers: { size: 8, shape: 'circle' as const },
      itemMargin: { horizontal: 8, vertical: 4 },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontWeight: 600 },
      dropShadow: { enabled: false },
    },
    stroke: { width: 3, colors: ['#fff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            name: { show: true, fontSize: '13px', color: '#666' },
            value: { show: true, fontSize: '22px', fontWeight: 700, color: '#111' },
            total: { show: true, label: 'Total', fontSize: '12px', color: '#999' },
          },
        },
      },
    },
    responsive: [{ breakpoint: 768, options: { chart: { height: 280 } } }],
  };
}

// ───────── Bar chart config ─────────
function buildBarOptions(categories: string[]) {
  return {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: ['#6366f1'],
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 6,
        borderRadiusApplication: 'end' as const,
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#999', fontSize: '11px', fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { colors: '#999', fontSize: '11px' } },
    },
    tooltip: { theme: 'light' },
  };
}

// ───────── Sparkline mini config ─────────
function buildSparkline(data: number[], color: string) {
  return {
    chart: { sparkline: { enabled: true }, background: 'transparent' },
    colors: [color],
    stroke: { curve: 'smooth' as const, width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] },
    },
    tooltip: { enabled: false },
  };
}

export default function DashboardPage() {
  const [totalCounts, setTotalCounts] = useState<any>({});
  const [overviewCards, setOverviewCards] = useState<any>({});
  const currentYearOrders = useCurrentYearOrder();
  const reviews = useCustomerReviews();
  const salesData: any = useLiveSalesBreakdown({ intervalMs: 30000 });
  const customers = useDashboardStore(s => s.customers);
  const products = useDashboardStore(s => s.products);
  const orders = useDashboardStore(s => s.orders);

  useEffect(() => {
    getOverviewCards().then(r => setOverviewCards(r.data || {})).catch(() => {});
    getCounts().then(r => { if (r) setTotalCounts({ orders: r.orders, sales: r.sales }); }).catch(() => {});
  }, []);

  // Derive recent orders from store
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a: any, b: any) => new Date(b.placedAt || b.createdAt).getTime() - new Date(a.placedAt || a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  // Sales chart data
  const salesChart = useMemo(() => {
    const cy = salesData?.currentYear || {};
    return {
      categories: cy.month || ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      values: cy.sales || [],
      total: cy.total || totalCounts?.sales || 0,
    };
  }, [salesData, totalCounts]);

  const totalCustomers = customers.filter((c: any) => String(c.role || '').toUpperCase() === 'CUSTOMER').length;

  // Stat cards data
  const stats = [
    {
      title: 'Total Revenue',
      value: `QAR ${Number(salesChart.total).toLocaleString()}`,
      description: 'Lifetime sales',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      sparkData: salesChart.values.length ? salesChart.values : [0, 2, 5, 3, 8, 6, 9],
      sparkColor: '#10b981',
    },
    {
      title: 'Total Orders',
      value: totalCounts?.orders || orders.length || 0,
      description: 'All time orders',
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      sparkData: currentYearOrders.length ? currentYearOrders : [0, 1, 3, 2, 5, 4, 6],
      sparkColor: '#3b82f6',
    },
    {
      title: 'Delivered',
      value: overviewCards?.ordersDelivered || 0,
      description: 'Successful deliveries',
      icon: Truck,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      sparkData: [3, 5, 4, 7, 6, 8, 9],
      sparkColor: '#8b5cf6',
    },
    {
      title: 'Customers',
      value: totalCustomers,
      description: 'Registered customers',
      icon: UsersIcon,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
      sparkData: [1, 2, 2, 3, 4, 3, 5],
      sparkColor: '#f59e0b',
    },
  ];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">{getGreeting()}</p>
          <h1 className="text-3xl font-bold mt-1 tracking-tight">Flower Bloom Dashboard</h1>
          <p className="text-white/70 text-sm mt-2 max-w-lg">
            Here's what's happening across your store today. Track revenue, orders, and customer activity at a glance.
          </p>
        </div>
        <div className="absolute top-6 right-8 z-10 hidden md:flex gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Products</p>
            <p className="text-xl font-bold">{overviewCards?.totalProducts || products.length || 0}</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Active Today</p>
            <p className="text-xl font-bold">{totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div className="h-10 w-20 opacity-60">
                  <Chart
                    type="area"
                    height={40}
                    width="100%"
                    options={buildSparkline(stat.sparkData, stat.sparkColor)}
                    series={[{ data: stat.sparkData }]}
                  />
                </div>
              </div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1 tracking-tight">{stat.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Revenue Chart — 4/7 */}
        <Card className="lg:col-span-4 border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-500" />
                  Revenue Overview
                </CardTitle>
                <CardDescription className="text-xs mt-1">Monthly sales for the current year</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" /> Live
                </Badge>
              </div>
            </div>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-bold text-neutral-900">QAR {Number(salesChart.total).toLocaleString()}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <Chart
                type="area"
                height={300}
                options={buildAreaOptions(salesChart.categories, '#6366f1')}
                series={[{ name: 'Revenue', data: salesChart.values }]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction — 3/7 */}
        <Card className="lg:col-span-3 border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Customer Satisfaction
            </CardTitle>
            <CardDescription className="text-xs mt-1">Reviews breakdown by rating</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[320px] flex items-center justify-center">
              {reviews && Array.isArray(reviews) && reviews.length > 0 ? (
                <Chart
                  type="donut"
                  height={320}
                  options={buildDonutOptions(
                    ['Extremely Satisfied', 'Satisfied', 'Poor', 'Very Poor'],
                    ['#10b981', '#6366f1', '#f59e0b', '#ef4444']
                  )}
                  series={reviews}
                />
              ) : (
                <div className="text-center text-neutral-400">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No review data yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Bottom Row ─── */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
        {/* Order History — 3/5 */}
        <Card className="lg:col-span-3 border-none shadow-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-500" />
                  Monthly Orders
                </CardTitle>
                <CardDescription className="text-xs mt-1">Order volume for the current year</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <Chart
                type="bar"
                height={300}
                options={buildBarOptions(months)}
                series={[{ name: 'Orders', data: currentYearOrders }]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders — 2/5 */}
        <Card className="lg:col-span-2 border-none shadow-md bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-400" />
              Recent Orders
            </CardTitle>
            <CardDescription className="text-xs mt-1">Last 5 orders placed</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {recentOrders.map((order: any, i: number) => {
                  const statusColor =
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                    order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700';
                  return (
                    <div key={order._id || order.id || i} className="px-6 py-3.5 flex items-center justify-between hover:bg-neutral-50/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900">{order.code || `#${String(order._id || '').slice(-6)}`}</span>
                        <span className="text-[11px] text-neutral-400 mt-0.5">
                          {new Date(order.placedAt || order.createdAt).toLocaleDateString()} · {order.totalItems || 0} items
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-neutral-900">QAR {Number(order.amount || 0).toFixed(0)}</span>
                        <Badge className={`${statusColor} border-none text-[10px] font-semibold capitalize`}>
                          {order.status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-neutral-400">
                <ShoppingBag className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm">No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
