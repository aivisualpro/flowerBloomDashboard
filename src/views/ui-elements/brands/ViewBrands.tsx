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
  MoreHorizontal,
  Package,
  Store,
  Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ParticleTextEffect } from "@/components/ParticleTextEffect";

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
  CardHeader,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useBrands } from '../../../hooks/brands/useBrands';
import { useDeleteBrand } from '../../../hooks/brands/useBrandsMutation';

interface Brand {
  id: string;
  name: string;
  ar_name: string;
  slug: string;
  isActive: boolean;
  logo: string;
  countryCode: string;
}

export default function BrandsTable() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [brandToDelete, setBrandToDelete] = React.useState<Brand | null>(null);

  const { data: brands, isLoading } = useBrands();
  const delMutation = useDeleteBrand();

  const filteredData = React.useMemo(() => {
    if (!brands?.rows) return [];
    return brands.rows.filter((row: Brand) => {
        const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase()) || 
                            row.ar_name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || 
                             (status === 'active' && row.isActive) || 
                             (status === 'inactive' && !row.isActive);
        return matchesSearch && matchesStatus;
    });
  }, [brands, search, status]);

  const handleDelete = async () => {
    if (brandToDelete) {
      await delMutation.mutateAsync(brandToDelete.id);
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) return <Badge className="bg-emerald-100 text-emerald-700 border-none hover:bg-emerald-100 flex gap-1 w-fit"><CheckCircle className="h-3 w-3" /> Active</Badge>;
    return <Badge className="bg-rose-100 text-rose-700 border-none hover:bg-rose-100 flex gap-1 w-fit"><XCircle className="h-3 w-3" /> Inactive</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="w-full flex justify-center mb-[-20px]">
          <ParticleTextEffect words={["Brands", "Collection"]} />
      </div>

      <Card className="border-none shadow-md bg-white overflow-hidden">
        <CardHeader className="p-6 border-b bg-neutral-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search brands..."
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
                    <Button onClick={() => router.push('/brands/add')} className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all rounded-xl">
                      <Plus className="mr-2 h-4 w-4" /> Add Brand
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50/50">
              <TableRow className="hover:bg-transparent border-neutral-100">
                <TableHead className="w-[100px] pl-6 py-4 font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Logo</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Name</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Country</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-neutral-600 uppercase text-[10px] tracking-wider text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} className="py-8"><div className="h-4 bg-neutral-100 animate-pulse rounded" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                        <Store className="h-12 w-12 opacity-20" />
                        <p>No brands found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((brand: Brand) => (
                  <TableRow key={brand.id} className="hover:bg-neutral-50/50 transition-colors border-neutral-100 group">
                    <TableCell className="pl-6 py-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-100 flex items-center justify-center">
                        {brand.logo || (brand as any).image ? (
                          <img src={brand.logo || (brand as any).image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Store className="h-6 w-6 text-neutral-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-neutral-800">
                      <div>
                        {brand.name}
                        <div className="text-xs text-neutral-400 font-normal">{brand.ar_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                         <Globe className="h-3.5 w-3.5 text-neutral-400" />
                         {brand.countryCode || 'Global'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(brand.isActive)}</TableCell>
                    <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg"
                                onClick={() => router.push(`/brands/edit/${brand.id}`)}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg"
                                onClick={() => {
                                    setBrandToDelete(brand);
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
            <DialogTitle className="text-xl font-bold">Delete Brand</DialogTitle>
            <DialogDescription className="text-neutral-500 pt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-neutral-900">{brandToDelete?.name}</span>?
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
