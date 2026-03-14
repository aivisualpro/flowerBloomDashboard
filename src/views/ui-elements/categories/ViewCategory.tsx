'use client';

import * as React from 'react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  MoreVertical,
  Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCategories } from '../../../hooks/categories/useCategories';
import { useDeleteCategory } from '../../../hooks/categories/useCategoryMutation';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function CategoriesTable() {
  const router = useRouter();
  const { data, isLoading } = useCategories();
  const { mutateAsync: deleteCategory, isPending } = useDeleteCategory();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);

  const handleDelete = async () => {
    if (categoryToDelete) {
        await deleteCategory(categoryToDelete.id);
        setConfirmDeleteOpen(false);
        setCategoryToDelete(null);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
          <div className="h-10 w-10 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 flex items-center justify-center">
              {row.getValue("image") ? (
                  <img src={row.getValue("image")} alt="" className="h-full w-full object-cover" />
              ) : (
                  <ImageIcon className="h-4 w-4 text-neutral-300" />
              )}
          </div>
      )
    },
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
          <div className="flex flex-col">
              <span className="font-bold text-neutral-900">{row.getValue("name")}</span>
              <span className="text-xs text-neutral-500 italic uppercase tracking-tighter">{row.original.slug}</span>
          </div>
      )
    },
    {
      accessorKey: "ar_name",
      header: "Arabic Name",
      cell: ({ row }) => <span className="text-neutral-600 font-medium text-right">{row.getValue("ar_name")}</span>
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
          const active = Boolean(row.getValue("isActive"));
          return (
              <Badge className={`border-none ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} hover:bg-opacity-80 flex gap-1 w-fit`}>
                  {active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  {active ? "Active" : "Hidden"}
              </Badge>
          );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-6">Actions</div>,
      cell: ({ row }) => {
        const category = row.original;
        return (
            <div className="text-right pr-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-neutral-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl w-48 transition-all duration-200">
                        <DropdownMenuLabel>Category Options</DropdownMenuLabel>
                        <DropdownMenuItem 
                            onClick={() => router.push(`/categories/edit/${category.id}`)}
                            className="flex gap-2 cursor-pointer"
                        >
                            <Edit className="h-4 w-4 text-neutral-400" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => {
                                setCategoryToDelete(category);
                                setConfirmDeleteOpen(true);
                            }}
                            className="flex gap-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                        >
                            <Trash2 className="h-4 w-4" /> Delete Category
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
      },
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <Button onClick={() => router.push('/categories/add')} className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={data?.rows || []} 
        searchKey="name" 
        loading={isLoading} 
      />

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Category</DialogTitle>
            <DialogDescription className="text-neutral-500 pt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-neutral-900">{categoryToDelete?.name}</span>? 
              This will un-categorize products linked to it. This action is permanent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button variant="ghost" className="rounded-xl" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-xl shadow-lg shadow-rose-500/20" onClick={handleDelete} disabled={isPending}>
                {isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
