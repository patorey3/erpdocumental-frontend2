import { useState } from 'react';
import { format } from 'date-fns';

import { Collapse } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { localStorageGetItem } from 'src/utils/storage-available';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IPurchase } from 'src/types/purchases';

import PurchaseDetailRow from './purchase-detail-row';

// ----------------------------------------------------------------------

type Props = {
  row: IPurchase;
  rowNumber: number;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: (id: string) => void;
  onDeleteRow: VoidFunction;
};

export default function PurchaseTableRow({
  row,
  rowNumber,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    transactionDate,
    documentModelId,
    partner,
    sriSerieNumber,
    referenceNumber,
    total,
    hasCredit,
    accountableStatus,
  } = row;
  const confirm = useBoolean();

  const popover = usePopover();

  const [open, setOpen] = useState(false);

  const catalog = localStorageGetItem('doc-catalog');

  const objCatalog = JSON.parse(catalog ?? '');

  const renderTipoDoc = (id: number | null) => {
    if (id) {
      const indexTypeDoc = objCatalog.type_docs.findIndex((cat: any) => cat.id === id);
      return objCatalog.type_docs[indexTypeDoc].name;
    }
    return 'Sin Asignar';
  };

  const handleOpenCollapse = () => {
    setOpen(!open);
  };

  
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <IconButton aria-label="expand row" size="small" onClick={() => handleOpenCollapse()}>
            {open ? <Iconify icon="mdi:chevron-up" /> : <Iconify icon="mdi:chevron-down" />}
          </IconButton>
        </TableCell>
        <TableCell>{rowNumber}</TableCell>
        <TableCell align="center">
          {format(new Date(transactionDate ?? ''), 'dd-MM-yyyy')}
        </TableCell>
        <TableCell>{renderTipoDoc(documentModelId)}</TableCell>
        <TableCell>{partner.name}</TableCell>
        <TableCell align="center">
          {sriSerieNumber}-{referenceNumber}
        </TableCell>
        <TableCell align="right">{Number(total).toFixed(2)}</TableCell>
        <TableCell align="center">{hasCredit ? 'CRÉDITO' : 'CONTADO'}</TableCell>
        <TableCell align="center">
          {accountableStatus === 'NotEmmited' ? 'NO EMITIDA' : 'EMITIDA'}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <PurchaseDetailRow purchase={row} />
        </Collapse>
      </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}

        >
          <Iconify icon="fa6-solid:laptop-file"/>
          Ver Adjuto
        </MenuItem>

        <MenuItem                 
          onClick={() => {
            onEditRow(row.invoiceId.toString());
            popover.onClose();
          }}
          disabled={row.accountableStatus==='Emmited'}
          sx={{ color: '#1EAAE7' }}

        >
          <Iconify icon="ci:note-edit" />
          Editar 
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
