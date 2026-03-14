'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  ArrowLeft,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Clock,
  ShoppingBag,
  Heart,
  Loader2,
  Package
} from 'lucide-react';

import { getUserById } from '../../../api/users';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { API_BASE_URL as BASE } from '@/config';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function CustomerDetail() {
  const router = useRouter();
  const { id } = useParams();
  const customerId = Array.isArray(id) ? id[0] : id;

  const [activeTab, setActiveTab] = React.useState<'orders' | 'wishlist'>('orders');

  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getUserById(customerId as string),
    enabled: !!customerId,
  });

  const { data: wishlist, isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['wishlist', customerId],
    queryFn: async () => {
      // Direct call to relative app path, handle absolute or internal
      const res = await axios.get(`/api/wishlist/lists/user/${customerId}`);
      return Array.isArray(res.data?.data) ? res.data.data : res.data?.items || [];
    },
    enabled: !!customerId,
    retry: 1
  });

  const allOrders = useDashboardStore(s => s.orders);
  
  const customerOrders = React.useMemo(() => {
    return allOrders.filter((o: any) => 
      o.userId === customerId || 
      o.user?._id === customerId || 
      o.user?.id === customerId ||
      o.user === customerId // if it's just ID string
    );
  }, [allOrders, customerId]);

  if (isLoadingCustomer) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <User className="h-12 w-12 text-neutral-300" />
        <h2 className="text-xl font-bold text-neutral-700">Customer not found</h2>
        <Button onClick={() => router.push('/customers')} variant="outline">Back to Customers</Button>
      </div>
    );
  }

  const role = String(customer.role || "").toLowerCase();
  const isAdmin = role === "admin";
  const isActive = customer.status === "active" || customer.isActive === true;
  
  const fullAddress = [
      customer.address, 
      customer.city, 
      customer.state, 
      customer.zipCode, 
      customer.country
  ].filter(Boolean).join(", ");

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-neutral-200 text-neutral-800 bg-white shadow-sm hover:bg-neutral-100 rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-neutral-50/50 border-b pb-8 pt-8 px-6 text-center relative">
              <div className="absolute top-4 right-4 flex gap-2">
                 <Badge className={`border-none ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {isActive ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                    {isActive ? "Active" : "Inactive"}
                 </Badge>
                 <Badge className={`border-none ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-700'}`}>
                    {isAdmin ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                    {isAdmin ? "Admin" : "Customer"}
                 </Badge>
              </div>

              <div className="mx-auto h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
                {customer.image ? (
                  <img src={customer.image} alt={customer.firstName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-neutral-300" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-neutral-900">
                {customer.firstName} {customer.lastName}
              </CardTitle>
              <p className="text-neutral-500 font-medium mt-1">{customer.email}</p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Phone</span>
                  <span className="text-neutral-900 font-medium">{customer.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Date of Birth</span>
                  <span className="text-neutral-900 font-medium">{customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Provider</span>
                  <span className="text-neutral-900 font-medium capitalize">{customer.provider || 'Email'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Address</span>
                  <span className="text-neutral-900 font-medium">{fullAddress || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Last Login</span>
                  <span className="text-neutral-900 font-medium">
                    {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Joined On</span>
                  <span className="text-neutral-900 font-medium">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs for Orders and Wishlists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'orders' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders ({customerOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'wishlist' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Heart className="h-4 w-4" />
              Wishlist ({wishlist?.length || 0})
            </button>
          </div>

          {activeTab === 'orders' && (
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="border-b bg-neutral-50/50 pb-4">
                <CardTitle className="text-lg">Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {customerOrders.length > 0 ? (
                  <div className="divide-y divide-neutral-100">
                    {customerOrders.map((order: any) => (
                      <div key={order.id || order._id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-semibold text-primary">{order.code}</span>
                          <span className="text-xs text-neutral-500">{new Date(order.placedAt || order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-bold">QAR {Number(order.amount).toFixed(2)}</span>
                              <span className="text-xs text-neutral-500">{order.totalItems} items</span>
                            </div>
                            <Badge className="bg-neutral-100 text-neutral-700 border-none">{order.status}</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={() => router.push(`/orders/${order.id || order._id}`)}>
                                <ShoppingBag className="h-4 w-4 text-neutral-400" />
                            </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-neutral-400">
                    <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                    <p>No orders found for this customer.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'wishlist' && (
            <Card className="border-none shadow-md bg-white">
               <CardHeader className="border-b bg-neutral-50/50 pb-4">
                <CardTitle className="text-lg">Wishlisted Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingWishlist ? (
                  <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-neutral-400" /></div>
                ) : wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {wishlist.map((item: any, i: number) => {
                      const product = item.product || item; // Depends on API structure
                      return (
                        <div key={i} className="flex gap-4 p-3 border border-neutral-100 rounded-xl hover:shadow-md transition-shadow pr-4">
                          <div className="h-16 w-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                            {product.featuredImage ? (
                              <img src={product.featuredImage} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-full w-full p-4 text-neutral-300" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center overflow-hidden">
                            <span className="font-bold text-sm text-neutral-900 truncate">{product.name || product.title || "Unknown Product"}</span>
                            <span className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                                <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> Wishlisted
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-neutral-400">
                    <Heart className="h-12 w-12 mb-4 opacity-20" />
                    <p>No wishlisted items found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
