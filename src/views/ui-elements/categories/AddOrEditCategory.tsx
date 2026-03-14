'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Save, Trash2, ArrowLeft, Upload, Loader2 } from 'lucide-react';

// API
import { getCategoryById } from '../../../api/categories';
import { useAddCategory, useUpdateCategory } from '../../../hooks/categories/useCategoryMutation';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FormState {
  name: string;
  ar_name: string;
  slug: string;
  image: string;
  imageFile: File | null;
  isActive: boolean;
}

export default function AddOrEditCategory() {
  const router = useRouter();
  const { id } = useParams();
  const categoryId = Array.isArray(id) ? id[0] : id;
  const isEdit = Boolean(categoryId);

  const [form, setForm] = useState<FormState>({
    name: '',
    ar_name: '',
    slug: '',
    image: '',
    imageFile: null,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: detail, isFetching: isLoadingDetail } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategoryById(categoryId as string),
    enabled: isEdit && !!categoryId,
    select: (doc: any) => doc?.data?.[0] || {},
    refetchOnWindowFocus: false
  });

  const { mutateAsync: addCategory, isPending: isAdding } = useAddCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();

  /* hydrate edit */
  useEffect(() => {
    if (!isEdit || !detail) return;
    const c = detail;
    setForm({
      name: c.name || '',
      ar_name: c.ar_name || '',
      slug: c.slug || '',
      image: c.image || '',
      imageFile: null,
      isActive: !!c.isActive,
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
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    return errs;
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('ar_name', form.ar_name.trim());
    fd.append('slug', form.slug.trim());
    fd.append('isActive', String(!!form.isActive));
    if (form.imageFile) {
      fd.append('image', form.imageFile);
    } else if (form.image) {
      fd.append('image', form.image);
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
      setSaving(true);
      const formData = buildFormData();
      if (isEdit) await updateCategory({ id: categoryId as string, formData });
      else await addCategory(formData);
      router.push('/categories');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
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
          </div>
          <div className="flex items-center gap-3">
             <Button
                variant="default"
                onClick={handleSubmit}
                className="min-w-[140px]"
                disabled={loading || saving}
              >
               {(loading || saving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isEdit ? 'Save Changes' : 'Create Category'}
             </Button>
          </div>
        </div>

        {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="space-y-8 lg:col-span-2">

            {/* BASICS */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Category name and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name (English) *</Label>
                    <Input
                        id="name"
                        placeholder="e.g. Cookies"
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
                        placeholder="مثال: كوكيز"
                        value={form.ar_name}
                        onChange={(e) => setField('ar_name', e.target.value)}
                         className={fieldErrors.ar_name ? "border-red-500 text-right" : "text-right"}
                    />
                    {fieldErrors.ar_name && <p className="text-xs text-red-500 text-right">{fieldErrors.ar_name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                        id="slug"
                        placeholder="cookies"
                        value={form.slug}
                        onChange={(e) => setField('slug', e.target.value)}
                        className={`font-mono ${fieldErrors.slug ? "border-red-500" : ""}`}
                    />
                    {fieldErrors.slug && <p className="text-xs text-red-500">{fieldErrors.slug}</p>}
                </div>
              </CardContent>
            </Card>

            {/* MEDIA */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Image</CardTitle>
                <CardDescription>Category image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Category Image</Label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {form.image ? (
                            <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                <img src={form.image} alt="Category" className="h-full w-full object-cover" />
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
                            <Input
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

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-8">

            {/* SETTINGS */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-xs text-muted-foreground">Category visibility</p>
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
