"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, User, Shield, CheckCircle, XCircle, Phone, Calendar, Globe, Clock, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export type User = {
  _id: string
  id?: string
  firstName: string
  lastName: string
  email: string
  image?: string
  phone?: string
  role: string
  provider?: string
  dob?: string
  createdAt?: string
  lastLoginAt?: string
  status?: string
  isActive?: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-bold text-sm uppercase text-neutral-800 hover:text-neutral-900 px-0 hover:bg-transparent"
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 overflow-hidden shrink-0">
            {user.image ? (
              <img src={user.image} alt="User" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-neutral-900 text-sm whitespace-nowrap">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-neutral-500">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-neutral-600">
        <Phone className="h-3 w-3 text-neutral-400" />
        {row.original.phone || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => {
      const dob = row.original.dob;
      return (
        <div className="flex items-center gap-1 text-xs text-neutral-600">
          <Calendar className="h-3 w-3 text-neutral-400" />
          {dob ? new Date(dob).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = String(row.original.role || "").toUpperCase();
      const isAdmin = role === "ADMIN";
      return (
        <Badge className={`border-none ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-700'} hover:bg-opacity-80 flex gap-1 w-fit`}>
          {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
          {isAdmin ? "Admin" : "Customer"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.status === "active" || user.isActive === true;
      return (
        <Badge className={`border-none ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} hover:bg-opacity-80 flex gap-1 w-fit`}>
          {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-neutral-600 capitalize">
        <Globe className="h-3 w-3 text-neutral-400" />
        {row.original.provider || "email"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const d = row.original.createdAt;
      return (
        <div className="flex items-center gap-1 text-xs text-neutral-600">
          <Calendar className="h-3 w-3 text-neutral-400" />
          {d ? new Date(d).toLocaleDateString() : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    cell: ({ row }) => {
      const d = row.original.lastLoginAt;
      if (!d) return <span className="text-xs text-neutral-400">N/A</span>;
      const date = new Date(d);
      return (
        <div className="flex items-center gap-1 text-xs text-neutral-600">
          <Clock className="h-3 w-3 text-neutral-400" />
          {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const userId = user.id ?? user._id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/customer-detail/${userId}`} className="flex gap-2 cursor-pointer text-indigo-600">
                <Eye className="h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/customers/edit/${userId}`} className="flex gap-2 cursor-pointer">
                <Edit className="h-4 w-4" /> Edit Customer
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
