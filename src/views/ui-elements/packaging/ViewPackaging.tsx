// src/pages/.../ViewPackaging.jsx
import * as React from 'react';
import { Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Tooltip, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '../../../components/Button';
import { IoBag } from 'react-icons/io5';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { usePackaging } from '../../../hooks/packaging/usePackaging';
import { useDeletePackaging } from '../../../hooks/packaging/usePackagingMutation';
import TablePagination from '../../../components/TablePagination';

interface PackagingRow {
  id?: string;
  _id?: string;
  name: string;
  ar_name?: string;
  slug?: string;
  materials?: string[];
  ar_materials?: string[];
  isActive: boolean;
}

/* ---------- pretty pill helper + chip ---------- */
const pill = (bg: string, fg: string, border: string) => ({
  bgcolor: bg,
  color: fg,
  border: `1px solid ${border}`,
  fontWeight: 700,
  height: 26,
  borderRadius: 999,
  '& .MuiChip-icon': { fontSize: 16, mr: 0.5, color: fg },
  '& .MuiChip-label': { px: 0.75, fontSize: 12, letterSpacing: 0.2 }
});

const ActiveChip: React.FC<{ value: boolean }> = ({ value }) =>
  value ? (
    <Chip size="small" icon={<CheckCircleIcon />} label="Active" sx={pill('rgba(16,185,129,0.18)', '#86efac', 'rgba(16,185,129,0.45)')} />
  ) : (
    <Chip size="small" icon={<CancelIcon />} label="Inactive" sx={pill('rgba(239,68,68,0.18)', '#fca5a5', 'rgba(239,68,68,0.45)')} />
  );

export default function ViewPackaging() {
  const navigate = useNavigate();

  const [confirm, setConfirm] = React.useState<{ open: boolean, id: string | null, name: string }>({ open: false, id: null, name: '' });

  const { data, isLoading } = usePackaging();
  const { mutateAsync: deletePackaging, isPending: deletePackagingPending } = useDeletePackaging();

  const openConfirm = (row: PackagingRow) => setConfirm({ open: true, id: (row.id ?? row._id) || null, name: row.name });
  const closeConfirm = () => setConfirm({ open: false, id: null, name: '' });

  const handleConfirmDelete = async () => {
    if (confirm.id == null) return;
    try {
      await deletePackaging(confirm.id);
    } finally {
      closeConfirm();
    }
  };

  const columns: GridColDef<PackagingRow>[] = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'ar_name', headerName: 'Name (Arabic)', width: 250 },
    { field: 'slug', headerName: 'Slug', width: 250 },
    {
      field: 'materials',
      headerName: 'Materials',
      width: 250,
      renderCell: (params: GridRenderCellParams<PackagingRow>) => (params?.row?.materials || []).join(', ')
    },
    {
      field: 'ar_materials',
      headerName: 'Materials (Arabic)',
      width: 250,
      renderCell: (params: GridRenderCellParams<PackagingRow>) => (params?.row?.ar_materials || []).join(', ')
    },

    // ---- Active/Inactive badge ----
    {
      field: 'isActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 220,
      sortable: true,
      renderCell: (params: GridRenderCellParams<PackagingRow>) => <ActiveChip value={params.value} />
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<PackagingRow>) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 0.5
          }}
        >
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => navigate(`/packaging/edit/${params.row.id ?? params.row._id}`)}>
              <EditIcon fontSize="small" sx={{ color: '#fff' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openConfirm(params.row)} disabled={deletePackagingPending}>
              <DeleteIcon fontSize="small" sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <h4
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '1rem'
          }}
        >
          Packaging
        </h4>
        <Button isLink href="/packaging/add" isStartIcon startIcon={<IoBag />} variant="primary" color="primary">
          Add Packaging
        </Button>
      </div>

      <DataGrid
        rows={data?.rows ?? []}
        columns={columns}
        getRowId={(r) => r.id ?? r._id ?? ''}
        pagination
        initialState={{ pagination: { paginationModel: { pageSize: 12 } } }}
        pageSizeOptions={[12]}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        loading={isLoading}
        // 👇 hamara dark glass pagination
        slots={{ pagination: TablePagination }}
        sx={{
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#e5e7eb",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            color: "#cbd5e1",
          },
          "& .MuiDataGrid-cell": { borderColor: "rgba(255,255,255,0.06)" },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "rgba(255,255,255,0.02)",
          },
          "& .MuiDataGrid-row--borderBottom": {
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          },
          "& .MuiDataGrid-row.blocked": {
            background:
              "linear-gradient(90deg, rgba(239,68,68,0.06), rgba(239,68,68,0.0))",
          },
          "& .MuiDataGrid-virtualScroller": { overflowX: "hidden" },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            bgcolor: 'transparent',
            minHeight: 64
          }
        }}
      />

      {/* Confirm Delete Dialog */}
      <Dialog open={confirm.open} onClose={deletePackagingPending ? undefined : closeConfirm}>
        <DialogTitle>Delete Packaging?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{confirm.name}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={closeConfirm} disabled={deletePackagingPending}>
            Cancel
          </MuiButton>
          <MuiButton onClick={handleConfirmDelete} color="error" variant="contained" disabled={deletePackagingPending}>
            {deletePackagingPending ? 'Deleting...' : 'Delete'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
