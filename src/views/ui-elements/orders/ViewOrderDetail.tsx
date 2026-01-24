'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOrderDetail } from '../../../hooks/orders/useOrders';

export default function ViewOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading } = useOrderDetail(orderId);

  if (isLoading) {
    return <div className="p-6">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found.</div>;
  }

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') return <Badge className="bg-emerald-100 text-emerald-700">Delivered</Badge>;
    if (s === 'pending') return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
    if (s === 'cancelled') return <Badge className="bg-rose-100 text-rose-700">Cancelled</Badge>;
    return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.code || order._id}</h1>
        {getStatusBadge(order.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {order.user?.firstName} {order.user?.lastName}</p>
            <p><strong>Email:</strong> {order.user?.email}</p>
            <p><strong>Phone:</strong> {order.user?.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p>{order.shippingAddress?.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {order.payment}</p>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Placed:</strong> {new Date(order.placedAt).toLocaleString()}</p>
            {order.deliveredAt && <p><strong>Delivered:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                {item.product?.featuredImage && <img src={item.product.featuredImage} alt={item.product.title || item.title} className="w-16 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.title || item.title || 'Product'}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">Price: QAR {item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">QAR {item.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>QAR {order._derived?.subtotal?.toFixed(2)}</span>
            </div>
            {order._derived?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-QAR {order._derived.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>QAR {order._derived?.shipping?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>QAR {order._derived?.tax?.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>QAR {order._derived?.total?.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
