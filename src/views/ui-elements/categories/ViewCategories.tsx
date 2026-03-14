'use client';

import * as React from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  MoreHorizontal,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '../../../store/useDashboardStore';

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useCategories } from '../../../hooks/categories/useCategories';
import { useDeleteCategory } from '../../../hooks/categories/useCategoryMutation';

interface Category {
  id: string | number;
  name: string;
  ar_name: string;
  slug: string;
  isActive: boolean;
  image: string;
}

export default function CategoriesTable() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);

  const categories = useDashboardStore(s => s.categories);
  const delMutation = useDeleteCategory();

  const handleDelete = async () => {
    if (categoryToDelete) {
      await delMutation.mutateAsync(String(categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) return <Badge className="bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-100 flex gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Active</Badge>;
    return <Badge className="bg-rose-100 text-rose-700 border-none hover:bg-rose-100 flex gap-1 w-fit"><XCircle className="h-3 w-3" /> Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="p-6 border-b bg-neutral-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search categories..."
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
                        <DropdownMenuItem onClick={() => setStatus('active')}>Active</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus('inactive')}>Inactive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                <Button onClick={() => router.push('/categories/add')} className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all rounded-xl">
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="hover:bg-transparent border-neutral-100">
                <TableHead className="w-[100px] pl-6 py-4 font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Image</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Name</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Arabic Name</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Slug</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                        <Package className="h-12 w-12 opacity-20" />
                        <p>No categories found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category: Category) => (
                  <TableRow key={category.id} className="hover:bg-neutral-50/50 transition-colors border-neutral-100 group">
                    <TableCell className="pl-6 py-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100 flex items-center justify-center">
                        {category.image ? (
                          <img src={category.image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="h-6 w-6 text-neutral-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-800">{category.name}</TableCell>
                    <TableCell className="text-neutral-600">{category.ar_name}</TableCell>
                    <TableCell className="text-neutral-600 text-sm font-mono">{category.slug}</TableCell>
                    <TableCell>{getStatusBadge(category.isActive)}</TableCell>
                    <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                                asChild
                            >
                                <a href={`https://crunchy-cookies.skynetsilicon.com/category/${category.slug}`} target="_blank" rel="noreferrer">
                                    <Eye className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg"
                                onClick={() => router.push(`/categories/edit/${category.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg"
                                onClick={() => {
                                    setCategoryToDelete(category);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Category</DialogTitle>
            <DialogDescription className="text-neutral-500 pt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-neutral-900">{categoryToDelete?.name}</span>?
              This action is permanent and cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button variant="outline" className="rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-xl shadow-lg shadow-rose-500/20" onClick={handleDelete} disabled={delMutation.isPending}>
                {delMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}