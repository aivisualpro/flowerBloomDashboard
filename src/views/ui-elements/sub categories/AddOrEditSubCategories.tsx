'use client';
// force recompile

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Save, ArrowLeft, Upload, Loader2, Trash2 } from 'lucide-react';

// API
import { useCategories } from '../../../hooks/categories/useCategories';
import { getSubCategoryById } from '../../../api/subCategories';
import { useAddSubCategory, useUpdateSubCategory } from '../../../hooks/subCategories/useSubCategoryMutation';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormState {
  name: string;
  ar_name: string;
  slug: string;
  parent: string;
  image: string;
  imageFile: File | null;
  isActive: boolean;
}

export default function AddOrEditSubCategories() {
  const router = useRouter();
  const { id } = useParams();
  const subCategoryId = Array.isArray(id) ? id[0] : id;
  const isEdit = Boolean(subCategoryId);

  const [form, setForm] = useState<FormState>({
    name: '',
    ar_name: '',
    slug: '',
    parent: '',
    image: '',
    imageFile: null,
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch subcategory detail if edit
  const { data: detail, isFetching: isLoadingDetail } = useQuery({
    queryKey: ['subCategory', subCategoryId],
    queryFn: () => getSubCategoryById(subCategoryId as string),
    enabled: isEdit && !!subCategoryId,
    select: (res: any) => (Array.isArray(res?.data) ? res.data[0] : (res?.data || res)),
    refetchOnWindowFocus: false
  });

  // Fetch parent categories for selection
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({});
  const categoryOptions = useMemo(() => categoriesData?.rows || [], [categoriesData]);

  const { mutateAsync: addSubCategory, isPending: isAdding } = useAddSubCategory();
  const { mutateAsync: updateSubCategory, isPending: isUpdating } = useUpdateSubCategory();

  /* hydrate edit */
  useEffect(() => {
    if (!isEdit || !detail) return;
    const data = detail;
    setForm({
      name: data.name || '',
      ar_name: data.ar_name || '',
      slug: data.slug || '',
      parent: data.parent?._id || data.parent?.id || data.parent || data.category?._id || data.category?.id || data.category || '',
      image: data.image || '',
      imageFile: null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
  }, [isEdit, detail]);

  /* setters */
  const setField = (k: keyof FormState, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField('image', URL.createObjectURL(file));
    setField('imageFile', file);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.ar_name.trim()) errs.ar_name = 'Arabic name is required';
    if (!form.parent) errs.parent = 'Parent category is required';
    return errs;
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('ar_name', form.ar_name.trim());
    if (form.slug) fd.append('slug', form.slug.trim());
    fd.append('parent', form.parent);
    fd.append('category', form.parent); // Include both to ensure compatibility
    fd.append('isActive', String(!!form.isActive));
    if (form.imageFile) {
      fd.append('image', form.imageFile);
    }
    return fd;
  };

  const loading = isLoadingDetail || isAdding || isUpdating;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError('Please fill all required fields.');
      return;
    }

    try {
      const formData = buildFormData();
      if (isEdit) {
        await updateSubCategory({ id: subCategoryId as string, formData });
      } else {
        await addSubCategory(formData);
      }
      router.push('/subCategories');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-8 md:max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-neutral-200 text-neutral-800 bg-white shadow-sm hover:bg-neutral-100"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {isEdit ? 'Edit Sub Category' : 'Create Sub Category'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button
                variant="default"
                onClick={handleSubmit}
                className="min-w-[140px]"
                disabled={loading}
              >
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isEdit ? 'Save Changes' : 'Create Sub Category'}
             </Button>
          </div>
        </div>

        {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* BASICS */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Sub category name and parent organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English) *</Label>
                    <Input
                        id="name"
                        placeholder="e.g. Chocolate Cookies"
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        className={fieldErrors.name ? "border-red-500" : ""}
                    />
                     {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ar_name" className="text-right block w-full">الاسم (عربي) *</Label>
                    <Input
                        id="ar_name"
                        dir="rtl"
                        placeholder="مثال: كوكيز الشوكولاتة"
                        value={form.ar_name}
                        onChange={(e) => setField('ar_name', e.target.value)}
                         className={fieldErrors.ar_name ? "border-red-500 text-right" : "text-right"}
                    />
                    {fieldErrors.ar_name && <p className="text-xs text-red-500 text-right">{fieldErrors.ar_name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category *</Label>
                  <Select 
                    value={form.parent} 
                    onValueChange={(v) => setField('parent', v)}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger className={fieldErrors.parent ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat: any) => (
                        <SelectItem key={String(cat.id)} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.parent && <p className="text-xs text-red-500">{fieldErrors.parent}</p>}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Optional)</Label>
                    <Input
                        id="slug"
                        placeholder="chocolate-cookies"
                        value={form.slug}
                        onChange={(e) => setField('slug', e.target.value)}
                        className="font-mono"
                    />
                </div>
              </CardContent>
            </Card>

            {/* MEDIA */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Image</CardTitle>
                <CardDescription>Sub category image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Sub Category Image</Label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {form.image ? (
                            <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                <img src={form.image} alt="Sub Category" className="h-full w-full object-cover" />
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => setForm(f => ({...f, image: '', imageFile: null}))}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                                <span className="text-xs">No image</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={onImageSelect}
                            />
                            <Label htmlFor="image-upload">
                                <div className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                                </div>
                            </Label>
                            <p className="text-xs text-muted-foreground">Recommended size: 400x400px</p>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-xs text-muted-foreground">Visible on store</p>
                        </div>
                        <Switch
                            checked={form.isActive}
                            onCheckedChange={(c) => setField('isActive', c)}
                        />
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
