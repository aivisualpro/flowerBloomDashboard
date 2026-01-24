'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DollarSign, ShoppingBag, Box, Tag, TrendingUp, Users as UsersIcon } from "lucide-react"

// project imports
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SalesCustomerSatisfactionChartData } from '@/views/dashboard/DashSales/chart/sales-customer-satisfication-chart';
import { SalesSupportChartData1 } from '@/views/dashboard/DashSales/chart/sales-support-chart1';
import SalesAmountPanel from '@/views/dashboard/DashSales/chart/SalesAmountChart';
import { getCounts, getOverviewCards } from '@/api/analytics';
import useCurrentYearOrder from "@/hooks/analytics/useCurrentYearOrder";
import useCustomerReviews from "@/hooks/analytics/useCustomerReviews";

import { ParticleTextEffect } from '@/components/ParticleTextEffect';

// Dynamically import ApexCharts 
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashSales() {
  const [totalCounts, setTotalCounts] = useState<any>({});
  const [overviewCards, setOverviewCards] = useState<any>({});
  const currentYearOrders = useCurrentYearOrder();
  const reviews = useCustomerReviews();

  useEffect(() => {
    const fetchOverviewCards = async () => {
      try {
        const cards = await getOverviewCards();
        setOverviewCards(cards.data || {});
      } catch (err) {
        console.error("Failed to fetch card stats", err);
      }
    };
    fetchOverviewCards();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCounts();
        if (res) {
            const data = { orders: res.orders, sales: res.sales }
            setTotalCounts(data);
        }
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    })()
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="w-full flex justify-center mb-[-20px]">
         <ParticleTextEffect words={["Dashboard"]} />
      </div>


      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Products"
          value={overviewCards?.totalProducts || 0}
          description="Active in inventory"
          icon={Box}
          color="bg-rose-500"
        />
        <StatsCard
          title="Total Orders"
          value={totalCounts?.orders || 0}
          description="All time orders"
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatsCard
          title="Delivered Orders"
          value={overviewCards?.ordersDelivered || 0}
          description="Successful deliveries"
          icon={Tag}
          color="bg-emerald-500"
        />
      </div>

      {/* Secondary Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-neutral-400" />
                Total Sales Breakdown
            </CardTitle>
            <CardDescription>Visualizing revenue distribution across regions.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl font-bold text-neutral-900 tracking-tight">
                    ${totalCounts?.sales || 0}
                </span>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Live Data
                </span>
            </div>
            <div className="h-[350px] -ml-4">
                <SalesAmountPanel />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-neutral-400" />
                Customer Satisfaction
            </CardTitle>
            <CardDescription>Monthly review and feedback metrics.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] flex items-center justify-center pt-8">
             {reviews && (
                <div className="w-full h-full">
                    <Chart type="pie" height="100%" {...(SalesCustomerSatisfactionChartData(reviews) as any)} />
                </div>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Lower Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
         <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Order History Metrics</CardTitle>
            <CardDescription>Performance trends over the current fiscal year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
                {currentYearOrders && (
                    <Chart {...(SalesSupportChartData1(currentYearOrders) as any)} height="100%" />
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
