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
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUsers } from "../../../hooks/users/useUsers";
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
  const { data, isLoading } = useUsers(0);

  const columns = [
    {
        accessorKey: "firstName",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <User className="h-5 w-5" />
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
      cell: ({ row }) => (
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-1 text-xs text-neutral-600">
                <Phone className="h-3 w-3 text-neutral-400" />
                {row.getValue("phone") || "N/A"}
             </div>
          </div>
      )
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
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
      id: "actions",
      header: () => <div className="text-right pr-6">Actions</div>,
      cell: ({ row }) => {
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
                            onClick={() => router.push(`/customers/edit/${user.id ?? user._id}`)}
                            className="flex gap-2"
                        >
                            <Edit className="h-4 w-4" /> Edit User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
      },
    }
  ];

  const rows = React.useMemo(() => data?.rows ?? [], [data]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Users</h1>
        <p className="text-neutral-500">View and manage system users and their roles.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={rows} 
        searchKey="firstName" 
        loading={isLoading} 
      />
    </div>
  );
}
