'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Save, ArrowLeft, Loader2, Palette, Droplets } from 'lucide-react';

// API
import { getColorsById } from '../../../api/colors';
import { useAddColor, useUpdateColor } from '../../../hooks/colors/useColorMutation';

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
  value: string;
  mode: string;
  isActive: boolean;
}

export default function AddOrEditColors() {
  const router = useRouter();
  const { id } = useParams();
  const colorId = Array.isArray(id) ? id[0] : id;
  const isEdit = Boolean(colorId);

  const [form, setForm] = useState<FormState>({
    name: '',
    value: '#000000',
    mode: 'solid',
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch color detail if edit
  const { data: detail, isFetching: isLoadingDetail } = useQuery({
    queryKey: ['color', colorId],
    queryFn: () => getColorsById(colorId as string),
    enabled: isEdit && !!colorId,
    refetchOnWindowFocus: false
  });

  const { mutateAsync: addColor, isPending: isAdding } = useAddColor();
  const { mutateAsync: updateColor, isPending: isUpdating } = useUpdateColor();

  /* hydrate edit */
  useEffect(() => {
    if (!isEdit || !detail) return;
    setForm({
      name: detail.name || '',
      value: detail.value || '#000000',
      mode: detail.mode || 'solid',
      isActive: detail.isActive !== undefined ? detail.isActive : true,
    });
  }, [isEdit, detail]);

  /* setters */
  const setField = (k: keyof FormState, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.value.trim()) errs.value = 'Color value is required';
    return errs;
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
      const payload = {
        name: form.name.trim(),
        value: form.value.trim(),
        mode: form.mode,
        isActive: form.isActive,
      };

      if (isEdit) {
        await updateColor({ id: colorId as string, payload: payload });
      } else {
        await addColor(payload);
      }
      router.push('/colors');
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
                {isEdit ? 'Edit Color' : 'Create Color'}
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
               {isEdit ? 'Save Changes' : 'Create Color'}
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
                <CardTitle>Color Definition</CardTitle>
                <CardDescription>Specify color name and its visual value</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Color Name *</Label>
                  <Input
                      id="name"
                      placeholder="e.g. Royal Blue"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      className={fieldErrors.name ? "border-red-500" : ""}
                  />
                   {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="value">Color Value (Hex/RGB) *</Label>
                        <div className="flex gap-2">
                            <div 
                                className="h-10 w-12 rounded-lg border border-neutral-200 shadow-sm" 
                                style={{ backgroundColor: form.value }}
                            />
                            <Input
                                id="value"
                                placeholder="#000000"
                                value={form.value}
                                onChange={(e) => setField('value', e.target.value)}
                                className={`font-mono ${fieldErrors.value ? "border-red-500" : ""}`}
                            />
                        </div>
                        {fieldErrors.value && <p className="text-xs text-red-500">{fieldErrors.value}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mode">Mode</Label>
                        <Select value={form.mode} onValueChange={(v) => setField('mode', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="gradient">Gradient</SelectItem>
                                <SelectItem value="metallic">Metallic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200">
                <div 
                    className="h-32 w-32 rounded-3xl shadow-2xl transition-all duration-500"
                    style={{ 
                        backgroundColor: form.value,
                        boxShadow: `0 20px 50px ${form.value}44`
                    }}
                />
            </div>
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
                            <p className="text-xs text-muted-foreground">Available for products</p>
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
