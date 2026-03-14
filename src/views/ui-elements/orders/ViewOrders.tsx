'use client';

import * as React from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  ChevronDown,
  MoreHorizontal,
  ShoppingCart
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useDashboardStore } from '../../../store/useDashboardStore';

interface Order {
  id: string;
  code: string;
  user: string;
  totalItems: number;
  amount: number;
  tax: number;
  avgDiscount: number;
  couponType: string;
  status: string;
  cancelReason: string;
  payment: string;
  placedAt: string;
  deliveredAt: string;
  appliedCoupon: any;
}

export default function OrdersTable() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const allOrders = useDashboardStore(s => s.orders);
  const ordersRows = React.useMemo(() => {
    return allOrders.filter(o => {
      const matchSearch = String(o.code || '').toLowerCase().includes(search.toLowerCase()) || String(o.user || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' ? true : o.status === status;
      return matchSearch && matchStatus;
    });
  }, [allOrders, search, status]);

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') return <Badge className="bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-100 flex gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Delivered</Badge>;
    if (s === 'pending') return <Badge className="bg-amber-100 text-amber-700 border-none hover:bg-amber-100 flex gap-1 w-fit"><Clock className="h-3 w-3" /> Pending</Badge>;
    if (s === 'cancelled') return <Badge className="bg-rose-100 text-rose-700 border-none hover:bg-rose-100 flex gap-1 w-fit"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
    return <Badge className="bg-blue-100 text-blue-700 border-none hover:bg-blue-100 flex gap-1 w-fit"><AlertCircle className="h-3 w-3" /> Processing</Badge>;
  };

  const getPaymentBadge = (payment: string) => {
    const p = String(payment || '').toLowerCase();
    if (p === 'paid') return <Badge className="bg-green-100 text-green-700 border-none">Paid</Badge>;
    return <Badge className="bg-gray-100 text-gray-700 border-none">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="p-6 border-b bg-neutral-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10 bg-white border-neutral-200 focus-visible:ring-primary/20 transition-all rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-xl border-neutral-200 flex gap-2">
                            <Filter className="h-4 w-4 text-neutral-400" />
                            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setStatus('all')}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus('pending')}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus('processing')}>Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus('delivered')}>Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus('cancelled')}>Cancelled</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="hover:bg-transparent border-neutral-100">
                <TableHead className="w-[100px] pl-6 py-4 font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Order Code</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Customer</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Items</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Amount</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Payment</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Placed At</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                        <ShoppingCart className="h-12 w-12 opacity-20" />
                        <p>No orders found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ordersRows.map((order: Order) => (
                  <TableRow key={order.id || (order as any)._id} className="hover:bg-neutral-50/50 transition-colors border-neutral-100 group">
                    <TableCell className="pl-6 py-4 font-mono text-neutral-600">{order.code}</TableCell>
                    <TableCell className="font-semibold text-neutral-800">{order.user}</TableCell>
                    <TableCell className="text-neutral-600">{order.totalItems}</TableCell>
                    <TableCell className="font-semibold text-neutral-900">QAR {Number(order.amount).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentBadge(order.payment)}</TableCell>
                    <TableCell className="text-neutral-600 text-sm">{new Date(order.placedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                                onClick={() => router.push(`/orders/${order.id}`)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="block group-hover:hidden">
                            <MoreHorizontal className="h-4 w-4 mx-auto text-neutral-300" />
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
