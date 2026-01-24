'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Save from '@mui/icons-material/Save';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Btn from '../../../components/Button';
import { useSubCategories } from '../../../hooks/subCategories/useSubCategories';
import { useAddCategoryType, useUpdateCategoryType } from '../../../hooks/categoryTypes/useCategoryTypesMutation';
import { getCategoryTypeById } from '../../../api/categoryTypes';

const AddOrEditCategoryType = () => {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const isEdit = pathname.includes('/edit');

  const [form, setForm] = React.useState({
    name: '',
    ar_name: '',
    totalStocks: 0,
    totalPieceUsed: 0,
    parent: '', // stores PARENT CATEGORY id (from categories.rows)
  });

  const setField = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  // ----- detail (edit) -----
  const { data: detail, isLoading: loadingDetail } = useQuery({
    queryKey: ['categoryType', id],
    queryFn: () => getCategoryTypeById(id as string), // should return the doc object
    enabled: isEdit && !!id,
    select: (doc: any) => doc || {}
  });

  React.useEffect(() => {
    if (!isEdit || !detail) return;
    setForm((p) => ({
      ...p,
      name: detail?.name || '',
      ar_name: detail?.ar_name || '',
      totalStocks: detail?.totalStock || 0,
      totalPieceUsed: detail?.totalPieceUsed || 0,
      parent: detail?.parent?._id || detail?.parent?.id || detail?.parent || '',
    }));
  }, [isEdit, detail]);

  // ----- parent options from categories -----
  const { data: cats, isLoading: catsLoading } = useSubCategories(); // { rows:[{id,name,image}], ... }
  const options = cats?.rows ?? [];

  // map selected id -> option object
  const selectedParent = React.useMemo(() => options.find((o: any) => o.id === form.parent) || null, [options, form.parent]);

  // ----- mutations -----
  const addMutation = useAddCategoryType();
  const updateMutation = useUpdateCategoryType(id as string);
  const saving = addMutation.isPending || updateMutation.isPending;
  const disabled = saving || loadingDetail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      ar_name: form.ar_name.trim(),
      parent: form.parent || '',
      totalStock: Number(form.totalStocks) || 0,
      totalPieceUsed: Number(form.totalPieceUsed) || 0,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id as string, payload });
      } else {
        await addMutation.mutateAsync(payload);
        // reset for add
        setForm({
          name: '',
          ar_name: '',
          totalStocks: 0,
          totalPieceUsed: 0,
          parent: ''
        });
      }
      // go back to list; adjust route if needed
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ py: '2rem' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {isEdit ? 'Edit Sub Category' : 'Add Sub Category'}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={12} sx={{ width: '100%' }}>
            <Card variant="outlined" sx={{ mb: 2, borderRadius: 3, opacity: disabled ? 0.7 : 1, backgroundColor: '#111' }}>
              <CardHeader title="Basics" sx={{ pb: 0 }} />
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ width: '100%' }}>
                    <TextField
                      label="Name *"
                      fullWidth
                      required
                      value={form.name}
                      disabled={disabled}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                  </div>
                  
                  <div style={{ width: '100%' }}>
                    <TextField
                      label="Name (Arabic) *"
                      fullWidth
                      required
                      value={form.ar_name}
                      disabled={disabled}
                      onChange={(e) => setField('ar_name', e.target.value)}
                    />
                  </div>

                  <div style={{ width: '100%' }}>
                    <TextField
                      label="Total Stocks *"
                      fullWidth
                      required
                      value={form.totalStocks}
                      disabled={disabled}
                      onChange={(e) => setField('totalStocks', e.target.value)}
                    />
                  </div>

                  <div style={{ width: '100%' }}>
                    <TextField
                      label="Total Piece Used *"
                      fullWidth
                      required
                      value={form.totalPieceUsed}
                      disabled={disabled}
                      onChange={(e) => setField('totalPieceUsed', e.target.value)}
                    />
                  </div>

                  <div style={{ width: '100%', gridColumn: 'span 2' }}>
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => option.name}
                      value={selectedParent}
                      onChange={(_, newValue) => setField('parent', newValue?.id || '')}
                      loading={catsLoading}
                      disabled={disabled}
                      renderInput={(params) => (
                        <TextField {...params} label="Parent Sub Category *" required fullWidth />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Stack direction="row" spacing={1.5}>
              <Btn type="submit" isStartIcon startIcon={<Save />} variant="primary" disabled={disabled}>
                {isEdit ? 'Save Changes' : 'Add Sub Category'}
              </Btn>
              <MuiButton variant="outlined" onClick={() => router.back()} disabled={disabled}>
                Cancel
              </MuiButton>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddOrEditCategoryType;
