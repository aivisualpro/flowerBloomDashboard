"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  ArrowLeft,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Clock,
  ShoppingBag,
  Heart,
  Loader2,
  Package,
  Eye,
  Mail,
} from "lucide-react"

import { getUserById } from "@/api/users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CustomerDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const customerId = Array.isArray(id) ? id[0] : id

  const [customer, setCustomer] = useState<any>(null)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">("orders")

  useEffect(() => {
    if (!customerId) return

    async function fetchCustomer() {
      try {
        const data = await getUserById(customerId as string)
        setCustomer(data)
      } catch (e) {
        console.error("Failed to fetch customer:", e)
      } finally {
        setLoading(false)
      }
    }

    async function fetchWishlist() {
      try {
        const res = await axios.get(`/api/wishlist/lists/user/${customerId}`)
        setWishlist(Array.isArray(res.data?.data) ? res.data.data : [])
      } catch (e) {
        console.error("Failed to fetch wishlist:", e)
      } finally {
        setLoadingWishlist(false)
      }
    }

    fetchCustomer()
    fetchWishlist()
  }, [customerId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <User className="h-12 w-12 text-neutral-300" />
        <h2 className="text-xl font-bold text-neutral-700">Customer not found</h2>
        <Button onClick={() => router.push("/customers")} variant="outline">
          Back to Customers
        </Button>
      </div>
    )
  }

  const role = String(customer.role || "").toLowerCase()
  const isAdmin = role === "admin"
  const isActive = customer.status === "active" || customer.isActive === true
  const fullAddress = [customer.address, customer.city, customer.state, customer.zipCode, customer.country]
    .filter(Boolean)
    .join(", ")

  const infoItems = [
    { icon: Mail, label: "Email", value: customer.email },
    { icon: Phone, label: "Phone", value: customer.phone || "N/A" },
    { icon: Calendar, label: "Date of Birth", value: customer.dob ? new Date(customer.dob).toLocaleDateString() : "N/A" },
    { icon: Globe, label: "Provider", value: customer.provider || "Email", capitalize: true },
    { icon: MapPin, label: "Address", value: fullAddress || "N/A" },
    { icon: Clock, label: "Last Login", value: customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : "Never" },
    { icon: CheckCircle, label: "Joined On", value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "Unknown" },
  ]

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-neutral-200 text-neutral-800 bg-white shadow-sm hover:bg-neutral-100 rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 border-b pb-8 pt-8 px-6 text-center relative">
              {/* Status + Role badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className={`border-none text-xs ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {isActive ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge className={`border-none text-xs ${isAdmin ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-700"}`}>
                  {isAdmin ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
                  {isAdmin ? "Admin" : "Customer"}
                </Badge>
              </div>

              {/* Avatar */}
              <div className="mx-auto h-24 w-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
                {customer.image ? (
                  <img src={customer.image} alt={customer.firstName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
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
              {infoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
                    <span className={`text-neutral-900 font-medium text-sm break-words ${item.capitalize ? "capitalize" : ""}`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column — Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab bar */}
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "orders" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "wishlist" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Heart className="h-4 w-4" />
              Wishlist ({wishlist.length})
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="border-b bg-neutral-50/50 pb-4">
                <CardTitle className="text-lg">Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col items-center justify-center p-12 text-neutral-400">
                  <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm">No orders found for this customer.</p>
                  <p className="text-xs mt-1 text-neutral-300">Orders will appear here once placed.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="border-b bg-neutral-50/50 pb-4">
                <CardTitle className="text-lg">Wishlisted Products</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingWishlist ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
                  </div>
                ) : wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {wishlist.map((product: any, i: number) => (
                      <div key={product._id || i} className="flex gap-4 p-3 border border-neutral-100 rounded-xl hover:shadow-md transition-shadow">
                        <div className="h-16 w-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {product.featuredImage ? (
                            <img src={product.featuredImage} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-6 w-6 text-neutral-300" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <span className="font-bold text-sm text-neutral-900 truncate">{product.name || product.title || "Unknown Product"}</span>
                          {product.brand?.name && (
                            <span className="text-xs text-neutral-500 mt-0.5">{product.brand.name}</span>
                          )}
                          <span className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" /> Wishlisted
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-neutral-400">
                    <Heart className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-sm">No wishlisted items found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
