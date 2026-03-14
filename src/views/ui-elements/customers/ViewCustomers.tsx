'use client';

import * as React from "react";
import {
  User,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  MoreVertical,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardStore } from '../../../store/useDashboardStore';
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ViewCustomers() {
  const router = useRouter();
  const rows = useDashboardStore(s => s.customers);

  const filteredCustomers = React.useMemo(() => {
    return rows.filter(row => String(row.role || "").toUpperCase() === "CUSTOMER");
  }, [rows]);

  const columns = React.useMemo(() => [
    {
        accessorKey: "firstName",
        header: "User",
        cell: ({ row }: any) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 overflow-hidden shrink-0">
                        {user.image ? (
                            <img src={user.image} alt="User" className="h-full w-full object-cover" />
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
      header: "Contact",
      cell: ({ row }: any) => (
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-1 text-xs text-neutral-600">
                <Phone className="h-3 w-3 text-neutral-400" />
                {row.getValue("phone") || "N/A"}
             </div>
          </div>
      )
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: any) => {
          const user = row.original;
          const fullAddress = [
            user.address, 
            user.city, 
            user.state, 
            user.zipCode, 
            user.country
          ].filter(Boolean).join(", ");
          
          return (
              <div className="flex flex-col gap-1 max-w-[150px]">
                 <div className="flex gap-2 text-xs text-neutral-600">
                    <MapPin className="h-3 w-3 text-neutral-400 mt-0.5 shrink-0" />
                    <span className="truncate" title={fullAddress || "N/A"}>
                        {fullAddress || "N/A"}
                    </span>
                 </div>
              </div>
          )
      }
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: ({ row }: any) => {
        const date = row.original.dob ? new Date(row.original.dob).toLocaleDateString() : "N/A";
        return (
          <div className="flex flex-col gap-1 max-w-[100px]">
             <div className="flex items-center gap-1 text-xs text-neutral-600">
                <Calendar className="h-3 w-3 text-neutral-400" />
                <span className="truncate">{date}</span>
             </div>
          </div>
        )
      }
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => {
          const role = String(row.getValue("role") || "").toLowerCase();
          const isAdmin = role === "admin";
          return (
            <Badge className={`border-none ${isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-700'} hover:bg-opacity-80 flex gap-1 w-fit`}>
                {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {isAdmin ? "Admin" : "Customer"}
            </Badge>
          );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const user = row.original;
        const isActive = user.status === "active" || user.isActive === true;
        return (
            <Badge className={`border-none ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} hover:bg-opacity-80 flex gap-1 w-fit`}>
                {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }: any) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "N/A";
        return (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
             <Calendar className="h-3 w-3 text-neutral-400" />
             {date}
          </div>
        );
      }
    },
    {
      accessorKey: "provider",
      header: "Provider",
      cell: ({ row }: any) => {
        const provider = row.original.provider || "email";
        return (
          <div className="flex items-center gap-1 text-xs text-neutral-600 capitalize">
             <Globe className="h-3 w-3 text-neutral-400" />
             {provider}
          </div>
        );
      }
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }: any) => {
        const dateStr = row.original.lastLoginAt;
        if (!dateStr) return <span className="text-xs text-neutral-500">N/A</span>;
        const d = new Date(dateStr);
        return (
          <div className="flex items-center gap-1 text-xs text-neutral-600">
             <Clock className="h-3 w-3 text-neutral-400" />
             {d.toLocaleDateString()} {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-6">Actions</div>,
      cell: ({ row }: any) => {
        const user = row.original;
        return (
            <div className="text-right pr-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4 text-neutral-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                            onClick={() => router.push(`/customer-detail/${user.id ?? user._id}`)}
                            className="flex gap-2 cursor-pointer text-indigo-600 focus:text-indigo-600"
                        >
                            <User className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => router.push(`/customers/edit/${user.id ?? user._id}`)}
                            className="flex gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4" /> Edit User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
      },
    }
  ], [router]);

  return (
    <div className="space-y-6">
      <DataTable 
        columns={columns} 
        data={filteredCustomers} 
        searchKey="firstName" 
        loading={false} 
      />
    </div>
  );
}
