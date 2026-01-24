'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Save, Trash2, Calculator, ArrowLeft, Upload, Loader2, Wand2 } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

// Hooks
import { getProductById } from '../../../api/products';
import { useAddProduct, useUpdateProduct } from '../../../hooks/products/useProductMutation';
import { useBrands } from '../../../hooks/brands/useBrands';
import { useProductNames } from '../../../hooks/products/useProducts';
import { useCategoryTypes } from '../../../hooks/categoryTypes/useCategoryTypes';
import { useSubCategories } from '../../../hooks/subCategories/useSubCategories';
import { useOccasions } from '../../../hooks/occasions/useOccasions';
import { useRecipients } from '../../../hooks/recipients/useRecipients';
import { useColors } from '../../../hooks/colors/useColors';
import { usePackaging } from '../../../hooks/packaging/usePackaging';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Combobox } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Constants
const CONDITIONS = ['new', 'used', 'refurbished'];
const CURRENCIES = ['QAR', 'USD', 'SAR'];
const AVAILABILITY = ['in_stock', 'out_of_stock', 'low_stock'];

interface FormState {
  title: string;
  ar_title: string;
  sku: string;
  description: string;
  ar_description: string;
  qualities: string[];
  ar_qualities: string[];
  price: string | number;
  discount: string | number;
  currency: string;
  totalStocks: string | number;
  remainingStocks: string | number;
  totalPieceSold: string | number;
  stockStatus: string;
  brand: string;
  categories: string[];
  type: string[];
  typePieces: { type: string; pieces: number | string }[];
  totalPieceCarry: string | number;
  occasions: string[];
  recipients: string[];
  colors: string[];
  packagingOption: string;
  condition: string;
  featuredImage: string;
  featuredImageFile: File | null;
  images: { url: string; file?: File }[];
  suggestedProducts: string[];
  isActive: boolean;
  isFeatured: boolean;
  dimensions: {
    width: string | number;
    height: string | number;
  };
}

const toOptions = (arr: any): any[] => (Array.isArray(arr) ? arr : []);
const idOf = (obj: any) => (obj?._id || obj?.id || obj || null);
const getLabel = (o: any) => (o?.name || o?.title || o?.label || String(o || ''));
const optionById = (list: any[], id: any) => list.find((x) => idOf(x) === id) || null;
const optionsByIds = (list: any[], ids: any[]) => {
  if (!Array.isArray(ids)) return [];
  return list.filter((x) => ids.includes(idOf(x)));
};
// Helper to transform API data to {label, value} for our generic components
const transformOptions = (list: any[] | undefined): Option[] => {
  return (list || []).map(item => ({
    label: getLabel(item),
    value: idOf(item)
  }));
};

const stripHtml = (html: string) => (html || '').replace(/<[^>]*>?/gm, '').trim();

export default function AddOrEditProduct() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  
  const pathname = usePathname();
  const isEdit = Boolean(productId) || pathname.includes('/edit');
  const isCreate = !isEdit;

  const [form, setForm] = useState<FormState>({
    title: '',
    ar_title: '',
    sku: '',
    description: '',
    ar_description: '',
    qualities: [],
    ar_qualities: [],
    price: '',
    discount: 0,
    currency: 'QAR',
    totalStocks: '',
    remainingStocks: '',
    totalPieceSold: 0,
    stockStatus: 'in_stock',
    brand: '',
    categories: [],
    type: [],
    typePieces: [],
    totalPieceCarry: '',
    occasions: [],
    recipients: [],
    colors: [],
    packagingOption: '',
    condition: 'new',
    featuredImage: '',
    featuredImageFile: null,
    images: [],
    suggestedProducts: [],
    isActive: true,
    isFeatured: false,
    dimensions: {
      width: '',
      height: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: detail, isFetching: isLoadingDetail } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId as string),
    enabled: isEdit && !!productId,
    select: (doc: any) => doc || {},
    refetchOnWindowFocus: false
  });

  const { mutateAsync: addProduct, isPending: isAdding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // Data Hooks
  const { data: brandsQ } = useBrands();
  const { data: typesQ } = useCategoryTypes();
  const { data: subsQ } = useSubCategories();
  const { data: occsQ } = useOccasions();
  const { data: recsQ } = useRecipients();
  const { data: colsQ } = useColors();
  const { data: packsQ } = usePackaging();
  const { data: namesQ } = useProductNames();

  // Transformed Options
  const namesOpts = toOptions(namesQ?.rows);
  const brandOpts = toOptions(brandsQ?.rows);
  const typeOpts = toOptions(typesQ?.rows);
  const subcategoryOpts = toOptions(subsQ?.rows);
  const occasionOpts = toOptions(occsQ?.rows);
  const recipientOpts = toOptions(recsQ?.rows);
  const colorOpts = toOptions(colsQ?.rows);
  const packagingOpts = toOptions(packsQ?.rows);

  const brandSelectOpts = transformOptions(brandOpts);
  const typeSelectOpts = transformOptions(typeOpts);
  const subcategorySelectOpts = transformOptions(subcategoryOpts);
  const occasionSelectOpts = transformOptions(occasionOpts);
  const recipientSelectOpts = transformOptions(recipientOpts);
  const colorSelectOpts = transformOptions(colorOpts);
  const packagingSelectOpts = transformOptions(packagingOpts);
  const namesSelectOpts = transformOptions(namesOpts);

  /* hydrate edit */
  useEffect(() => {
    if (!isEdit || !detail) return;
    const p = detail;

    // Fix optional chaining issues by explicit checks
    const hydratedTypePieces = Array.isArray(p.typePieces)
      ? p.typePieces.map((row: any) => ({
          type: idOf(row.type),
          pieces: row.pieces ?? 0
        }))
      : [];

    const totalFromTypePieces = hydratedTypePieces.reduce(
      (sum: number, row: any) => sum + (Number(row.pieces) || 0),
      0
    );

    const next = {
      title: p.title ?? '',
      ar_title: p.ar_title ?? '',
      sku: p.sku ?? '',
      description: p.description ?? '',
      ar_description: p.ar_description ?? '',
      qualities: Array.isArray(p.qualities) ? p.qualities : [],
      ar_qualities: Array.isArray(p.ar_qualities) ? p.ar_qualities : [],
      price: p.price ?? '',
      discount: p.discount ?? 0,
      currency: p.currency || 'QAR',
      totalStocks: p.totalStocks ?? '',
      remainingStocks: p.remainingStocks ?? '',
      totalPieceSold: p.totalPieceSold ?? 0,
      stockStatus: p.stockStatus || 'in_stock',

      brand: idOf(p.brand),
      categories: (p.categories || []).map(idOf),
      type: (p.type || []).map(idOf),

      typePieces: hydratedTypePieces,
      totalPieceCarry:
        p.totalPieceCarry != null ? p.totalPieceCarry : totalFromTypePieces,

      occasions: (p.occasions || []).map(idOf),
      recipients: (p.recipients || []).map(idOf),
      colors: (p.colors || []).map(idOf),
      packagingOption: idOf(p.packagingOption),
      condition: p.condition || 'new',

      featuredImage: p.featuredImage || '',
      featuredImageFile: null,
      images: (p.images || [])
          .map((i: any) => {
            const url = i?.url ?? i;
            return url ? { url } : null;
          })
          .filter(Boolean) || [],

      suggestedProducts: (p.suggestedProducts || []).map(idOf),

      isActive: !!p.isActive,
      isFeatured: !!p.isFeatured,
      dimensions: {
        width: p.dimensions && p.dimensions.width != null ? p.dimensions.width : '',
        height: p.dimensions && p.dimensions.height != null ? p.dimensions.height : ''
      }
    };

    setForm(next);
  }, [isEdit, detail]);

  /* setters */
  const setField = (k: keyof FormState, v: any) => setForm((f) => ({ ...f, [k]: v }));
  
  const removeImageRow = (idx: number) =>
    setField(
      'images',
      (form.images || []).filter((_, i) => i !== idx)
    );

  const onFeaturedSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField('featuredImage', URL.createObjectURL(file));
    setField('featuredImageFile', file);
  };

  const onAdditionalSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const rows = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setField('images', [...(form.images || []), ...rows]);
  };

  /* computed */
  const discountedPrice = useMemo(() => {
    const base = Number(form.price || 0);
    const disc = Number(form.discount || 0);
    const v = base - (base * disc) / 100;
    return Number.isFinite(v) ? Math.max(v, 0) : 0;
  }, [form.price, form.discount]);

  const stockRatio = useMemo(() => {
    const tot = Number(form.totalStocks || 0);
    const sold = Number(form.totalPieceSold || 0);
    if (tot <= 0) return 0;
    const rem = Math.max(tot - sold, 0);
    return Math.max(0, Math.min(rem / tot, 1)) * 100;
  }, [form.totalStocks, form.totalPieceSold]);

  const autoCalcStockStatus = () => {
    const tot = Number(form.totalStocks || 0);
    const sold = Number(form.totalPieceSold || 0);
    if (tot <= 0) return setField('stockStatus', 'out_of_stock');
    const rem = Math.max(tot - sold, 0);
    const ratio = rem / tot;
    if (rem <= 0) return setField('stockStatus', 'out_of_stock');
    if (ratio <= 0.15) return setField('stockStatus', 'low_stock');
    return setField('stockStatus', 'in_stock');
  };

  const typePiecesTotal = useMemo(
    () =>
      (form.typePieces || []).reduce(
        (sum, row) => sum + (Number(row.pieces) || 0),
        0
      ),
    [form.typePieces]
  );

  const appendIdArray = (fd: FormData, key: string, arr: string[]) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((id) => {
      if (id) fd.append(key, id);
    });
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (isCreate) {
      if (!form.title.trim()) errs.title = 'Title is required';
      if (!form.ar_title.trim()) errs.ar_title = 'Arabic title is required';
      if (!form.sku.trim()) errs.sku = 'SKU is required';

      if (!stripHtml(form.description)) {
        errs.description = 'Description (English) is required';
      }
      if (!stripHtml(form.ar_description)) {
        errs.ar_description = 'Description (Arabic) is required';
      }

      if (!form.price || Number(form.price) <= 0) {
        errs.price = 'Price is required';
      }
      if (!form.totalStocks || Number(form.totalStocks) <= 0) {
        errs.totalStocks = 'Total stocks is required';
      }

      const hasFeatured = !!form.featuredImageFile || !!form.featuredImage;
      if (!hasFeatured) {
        errs.featuredImage = 'Featured image is required';
      }
      const galleryCount = (form.images || []).filter(
        (i) => i?.file || i?.url
      ).length;
      if (galleryCount === 0) {
        errs.images = 'At least one gallery image is required';
      }

      if (!form.brand) errs.brand = 'Brand is required';
      if (!Array.isArray(form.categories) || form.categories.length === 0) {
        errs.categories = 'Select at least one category';
      }
      if (!Array.isArray(form.type) || form.type.length === 0) {
        errs.type = 'Select at least one type';
      }
      if (!Array.isArray(form.occasions) || form.occasions.length === 0) {
        errs.occasions = 'Select at least one occasion';
      }
      if (!Array.isArray(form.recipients) || form.recipients.length === 0) {
        errs.recipients = 'Select at least one recipient';
      }
      if (!Array.isArray(form.colors) || form.colors.length === 0) {
        errs.colors = 'Select at least one color';
      }

      if ((form.typePieces || []).length) {
        if (!typePiecesTotal || typePiecesTotal <= 0) {
          errs.totalPieceCarry = 'Enter pieces for each selected type';
        }
      } else if (form.totalPieceCarry === '' || form.totalPieceCarry == null) {
        errs.totalPieceCarry = 'Total piece carry is required';
      }
    }

    return errs;
  };

  const buildFormData = () => {
    const fd = new FormData();

    fd.append('title', (form.title || '').trim());
    fd.append('ar_title', (form.ar_title || '').trim());
    fd.append('sku', (form.sku || '').trim());
    fd.append('description', form.description || '');
    fd.append('ar_description', form.ar_description || '');
    fd.append('price', form.price === '' || form.price == null ? '' : String(form.price));
    fd.append('discount', form.discount === '' || form.discount == null ? '0' : String(form.discount));
    fd.append('currency', form.currency || 'QAR');
    fd.append('totalStocks', form.totalStocks === '' || form.totalStocks == null ? '' : String(form.totalStocks));
    fd.append('remainingStocks', form.remainingStocks === '' || form.remainingStocks == null ? '' : String(form.remainingStocks));
    fd.append('totalPieceSold', form.totalPieceSold === '' || form.totalPieceSold == null ? '0' : String(form.totalPieceSold));

    const typePiecesClean = (form.typePieces || [])
      .filter((row) => row && row.type && row.pieces !== '' && row.pieces != null)
      .map((row) => ({
        type: row.type,
        pieces: Number(row.pieces) || 0
      }));

    const totalFromTypes = typePiecesClean.reduce(
      (sum, row) => sum + (row.pieces || 0),
      0
    );
    const totalPieceCarryValue =
      typePiecesClean.length ? totalFromTypes : form.totalPieceCarry || 0;

    fd.append(
      'totalPieceCarry',
      totalPieceCarryValue === '' || totalPieceCarryValue == null
        ? '0'
        : String(totalPieceCarryValue)
    );

    if (typePiecesClean.length) {
      fd.append('typePieces', JSON.stringify(typePiecesClean));
    }

    fd.append('stockStatus', form.stockStatus || 'in_stock');
    fd.append('condition', form.condition || 'new');
    fd.append('isActive', String(!!form.isActive));
    fd.append('isFeatured', String(!!form.isFeatured));

    fd.append('qualities', JSON.stringify(form.qualities || []));
    fd.append('ar_qualities', JSON.stringify(form.ar_qualities || []));

    appendIdArray(fd, 'categories', form.categories);
    appendIdArray(fd, 'occasions', form.occasions);
    appendIdArray(fd, 'recipients', form.recipients);
    appendIdArray(fd, 'colors', form.colors);
    appendIdArray(fd, 'suggestedProducts', form.suggestedProducts);
    appendIdArray(fd, 'type', form.type);

    fd.append(
      'dimensions',
      JSON.stringify({
        width: form.dimensions?.width === '' ? undefined : Number(form.dimensions?.width),
        height: form.dimensions?.height === '' ? undefined : Number(form.dimensions?.height)
      })
    );

    if (form.brand) fd.append('brand', form.brand);
    if (form.packagingOption) fd.append('packagingOption', form.packagingOption);

    if (form.featuredImageFile) {
      fd.append('featuredImage', form.featuredImageFile);
    } else if (form.featuredImage) {
      fd.append('featuredImage', form.featuredImage);
    }

    const existingUrls: string[] = [];
    (form.images || []).forEach((row) => {
      if (row.file) fd.append('images', row.file);
      else if (row.url) existingUrls.push(row.url);
    });
    fd.append('existingImageUrls', JSON.stringify(existingUrls));

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
      // Scroll to top or show toast usually (omitted for now)
      return;
    }

    try {
      setSaving(true);
      const formData = buildFormData();
      if (isEdit) await updateProduct({ id: productId as string, formData });
      else await addProduct(formData);
      navigate('/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-8 md:max-w-7xl">
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
                {isEdit ? 'Edit Product' : 'Create Product'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button 
                variant="default" 
                onClick={handleSubmit} 
                className="min-w-[140px]"
                disabled={loading || saving}
              >
               {(loading || saving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isEdit ? 'Save Changes' : 'Publish Product'}
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
                <CardDescription>Product title, code and basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input 
                        id="title" 
                        placeholder="e.g. Red Velvet Cookies" 
                        value={form.title} 
                        onChange={(e) => setField('title', e.target.value)}
                        className={fieldErrors.title ? "border-red-500" : ""}
                    />
                     {fieldErrors.title && <p className="text-xs text-red-500">{fieldErrors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ar_title" className="text-right block w-full">العنوان (عربي) *</Label>
                    <Input 
                        id="ar_title" 
                        dir="rtl"
                        placeholder="مثال: كوكيز ريد فيلفيت" 
                        value={form.ar_title}
                        onChange={(e) => setField('ar_title', e.target.value)}
                         className={fieldErrors.ar_title ? "border-red-500 text-right" : "text-right"}
                    />
                    {fieldErrors.ar_title && <p className="text-xs text-red-500 text-right">{fieldErrors.ar_title}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU Code *</Label>
                    <Input 
                        id="sku" 
                        placeholder="ITEM-001" 
                        value={form.sku} 
                        onChange={(e) => setField('sku', e.target.value)}
                        className={`font-mono ${fieldErrors.sku ? "border-red-500" : ""}`}
                    />
                    {fieldErrors.sku && <p className="text-xs text-red-500">{fieldErrors.sku}</p>}
                </div>
              </CardContent>
            </Card>

            {/* DESCRIPTION */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Detailed product description in both languages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                    <Label>Description (English)</Label>
                    <div className="prose-sm pb-12 sm:pb-8 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <ReactQuill 
                            theme="snow"
                            value={form.description}
                            onChange={(val) => setField('description', val)}
                            placeholder="Describe your product..."
                            className="h-40"
                        />
                    </div>
                    {fieldErrors.description && <p className="text-xs text-red-500">{fieldErrors.description}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="w-full text-right block">الوصف (عربي)</Label>
                    <div className="prose-sm pb-12 sm:pb-8 border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2" dir="rtl">
                       <ReactQuill 
                           theme="snow"
                           value={form.ar_description}
                           onChange={(val) => setField('ar_description', val)}
                           placeholder="...وصف المنتج"
                           className="h-40"
                        />
                    </div>
                    {fieldErrors.ar_description && <p className="text-xs text-red-500 text-right">{fieldErrors.ar_description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* MEDIA */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Product images and gallery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Featured Image *</Label>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {form.featuredImage ? (
                            <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                <img src={form.featuredImage} alt="Featured" className="h-full w-full object-cover" />
                                <Button 
                                    size="icon" 
                                    variant="destructive" 
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => setForm(f => ({...f, featuredImage: '', featuredImageFile: null}))}
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
                                id="featured-upload" 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={onFeaturedSelect}
                            />
                            <Label htmlFor="featured-upload">
                                <div className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" /> Upload Featured
                                </div>
                            </Label>
                            <p className="text-xs text-muted-foreground">Recommended size: 800x800px</p>
                            {fieldErrors.featuredImage && <p className="text-xs text-red-500">{fieldErrors.featuredImage}</p>}
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Gallery Images</Label>
                        <div>
                             <Input 
                                id="gallery-upload" 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                multiple
                                onChange={onAdditionalSelect}
                            />
                            <Label htmlFor="gallery-upload">
                                <div className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                                    <Upload className="mr-2 h-3 w-3" /> Add Images
                                </div>
                            </Label>
                        </div>
                    </div>
                    
                    {form.images.length === 0 ? (
                        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                            No gallery images added
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                            {form.images.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square overflow-hidden rounded-md border border-slate-200">
                                    <img src={img.url} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                         <Button 
                                            size="icon" 
                                            variant="destructive" 
                                            className="h-8 w-8"
                                            onClick={() => removeImageRow(idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {fieldErrors.images && <p className="text-xs text-red-500">{fieldErrors.images}</p>}
                </div>
              </CardContent>
            </Card>
            
            {/* CLASSIFICATION */}
             <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Classification</CardTitle>
                <CardDescription>Organize your products with categories and attributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Brand *</Label>
                        <Combobox 
                            options={brandSelectOpts}
                            value={form.brand}
                            onChange={(val) => setField('brand', val)}
                            placeholder="Select Brand"
                        />
                         {fieldErrors.brand && <p className="text-xs text-red-500">{fieldErrors.brand}</p>}
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Type *</Label>
                        <MultiSelect 
                            options={typeSelectOpts}
                            selected={form.type}
                            onChange={(val) => {
                                 setForm((prev) => {
                                   const newTypeIds = val;
                                   const prevMap = new Map(
                                     (prev.typePieces || []).map((tp) => [tp.type, tp.pieces])
                                   );
                                   const newTypePieces = newTypeIds.map((id) => ({
                                     type: id,
                                     pieces: prevMap.get(id) ?? 0
                                   }));
                                   return {
                                     ...prev,
                                     type: newTypeIds,
                                     typePieces: newTypePieces
                                   };
                                 })
                            }}
                            placeholder="Select Types"
                        />
                         {fieldErrors.type && <p className="text-xs text-red-500">{fieldErrors.type}</p>}
                    </div>

                    {/* RECIPE SECTION */}
                    {form.type.length > 0 && (
                        <div className="col-span-1 md:col-span-2 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h4 className="text-sm font-medium">Type Recipe (Pieces per Type)</h4>
                                <Badge variant="outline" className="bg-white">{typePiecesTotal} pcs total</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {form.type.map((typeId) => {
                                    const opt = typeSelectOpts.find(o => o.value === typeId);
                                    const row = (form.typePieces || []).find((tp) => tp.type === typeId) || { pieces: 0 };
                                    return (
                                        <div key={typeId} className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">{opt?.label}</Label>
                                            <Input 
                                                type="number"
                                                className="h-8"
                                                value={row.pieces}
                                                onChange={(e) => {
                                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                                    setForm((prev) => {
                                                        const copy = [...(prev.typePieces || [])];
                                                        const idx = copy.findIndex((tp) => tp.type === typeId);
                                                        if (idx >= 0) copy[idx] = { ...copy[idx], pieces: val };
                                                        else copy.push({ type: typeId, pieces: val || 0 });
                                                        return { ...prev, typePieces: copy };
                                                    });
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            {fieldErrors.totalPieceCarry && <p className="mt-2 text-xs text-red-500">{fieldErrors.totalPieceCarry}</p>}
                        </div>
                    )}

                     <div className="space-y-2">
                        <Label>Categories *</Label>
                        <MultiSelect 
                            options={subcategorySelectOpts}
                            selected={form.categories}
                            onChange={(val) => setField('categories', val)}
                            placeholder="Select Categories"
                        />
                         {fieldErrors.categories && <p className="text-xs text-red-500">{fieldErrors.categories}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label>Occasions *</Label>
                        <MultiSelect 
                            options={occasionSelectOpts}
                            selected={form.occasions}
                            onChange={(val) => setField('occasions', val)}
                            placeholder="Select Occasions"
                        />
                         {fieldErrors.occasions && <p className="text-xs text-red-500">{fieldErrors.occasions}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label>Recipients *</Label>
                        <MultiSelect 
                            options={recipientSelectOpts}
                            selected={form.recipients}
                            onChange={(val) => setField('recipients', val)}
                            placeholder="Select Recipients"
                        />
                         {fieldErrors.recipients && <p className="text-xs text-red-500">{fieldErrors.recipients}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label>Colors *</Label>
                        <MultiSelect 
                            options={colorSelectOpts}
                            selected={form.colors}
                            onChange={(val) => setField('colors', val)}
                            placeholder="Select Colors"
                        />
                         {fieldErrors.colors && <p className="text-xs text-red-500">{fieldErrors.colors}</p>}
                    </div>
                    
                     <div className="space-y-2">
                        <Label>Packaging</Label>
                        <Combobox 
                            options={packagingSelectOpts}
                            value={form.packagingOption}
                            onChange={(val) => setField('packagingOption', val)}
                            placeholder="Select Packaging"
                        />
                    </div>
                </div>
              </CardContent>
             </Card>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-8">
            
            {/* PRICING & INVENTORY */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label>Price *</Label>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                value={form.price}
                                onChange={(e) => setField('price', e.target.value === '' ? '' : Number(e.target.value))}
                                className={fieldErrors.price ? "border-red-500" : ""}
                            />
                        </div>
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                            <Label>Currency</Label>
                            <Select value={form.currency} onValueChange={(v) => setField('currency', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Discount (%)</Label>
                        <Input 
                            type="number" 
                            placeholder="0" 
                            value={form.discount}
                            onChange={(e) => setField('discount', e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-md border bg-slate-50 p-3">
                        <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium">Final Price</span>
                        </div>
                        <Badge variant="secondary" className="text-base">
                            {form.currency} {discountedPrice.toFixed(2)}
                        </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <Label className="text-base">Stock</Label>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs" 
                                onClick={autoCalcStockStatus}
                                type="button"
                            >
                                <Wand2 className="mr-1 h-3 w-3" /> Auto-calc
                            </Button>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Total</Label>
                                <Input 
                                    type="number" 
                                    value={form.totalStocks}
                                    onChange={(e) => setField('totalStocks', e.target.value === '' ? '' : Number(e.target.value))}
                                    className={fieldErrors.totalStocks ? "border-red-500" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Sold</Label>
                                <Input 
                                    type="number" 
                                    value={form.totalPieceSold}
                                    onChange={(e) => setField('totalPieceSold', e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={form.stockStatus} onValueChange={(v) => setField('stockStatus', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {AVAILABILITY.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                         </div>
                         
                         {/* Simple Progress Bar */}
                         <div className="space-y-1">
                             <div className="flex justify-between text-xs text-muted-foreground">
                                 <span>Fill rate</span>
                                 <span>{Math.round(stockRatio)}%</span>
                             </div>
                             <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                 <div 
                                    className={`h-full transition-all duration-300 ${stockRatio < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${stockRatio}%` }} 
                                />
                             </div>
                         </div>
                    </div>
                </CardContent>
            </Card>

            {/* SETTINGS */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Settings & Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-xs text-muted-foreground">Product visibility in store</p>
                        </div>
                        <Switch 
                            checked={form.isActive}
                            onCheckedChange={(c) => setField('isActive', c)}
                        />
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Featured</Label>
                            <p className="text-xs text-muted-foreground">Promote on homepage</p>
                        </div>
                        <Switch 
                            checked={form.isFeatured}
                            onCheckedChange={(c) => setField('isFeatured', c)}
                        />
                    </div>
                    
                    <Separator />

                    <div className="space-y-3">
                         <Label>Dimensions (cm)</Label>
                         <div className="grid grid-cols-2 gap-4">
                            <Input 
                                placeholder="Width" 
                                type="number" 
                                value={form.dimensions.width}
                                onChange={(e) => setField('dimensions', { ...form.dimensions, width: e.target.value })}
                            />
                            <Input 
                                placeholder="Height" 
                                type="number" 
                                value={form.dimensions.height}
                                onChange={(e) => setField('dimensions', { ...form.dimensions, height: e.target.value })}
                            />
                         </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select value={form.condition} onValueChange={(v) => setField('condition', v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Suggested Products</Label>
                        <MultiSelect 
                            options={namesSelectOpts}
                            selected={form.suggestedProducts}
                            onChange={(val) => setField('suggestedProducts', val)}
                            placeholder="Select Products"
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