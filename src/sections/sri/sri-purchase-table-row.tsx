import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { localStorageGetItem } from 'src/utils/storage-available';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IPurchase } from 'src/types/purchases';

// ----------------------------------------------------------------------

type Props = {
  row: IPurchase;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  rowNumber: number;
};

export default function SriPurchaseTableRow({ row, onEditRow, onViewRow, rowNumber }: Props) {
  const { documentId, documentModelId, partner, referenceNumber, sriSerieNumber, total } = row;

  const catalog = localStorageGetItem('doc-catalog');
  const objCatalog = JSON.parse(catalog ?? '');
  const renderTipoDoc = (id: number | null) => {
    if (id) {
      const indexTypeDoc = objCatalog.type_docs.findIndex((cat: any) => cat.id === id);
      return objCatalog.type_docs[indexTypeDoc].name;
    }
    return 'Sin Asignar';
  };
  const renderEstado = (id: number) => {
    const texto = id === 0 ? 'No Guardado' : 'Guardado';
    const color = id === 0 ? 'warning' : 'success';
    return <Label color={color}>{texto}</Label>;
  };

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>{rowNumber}</TableCell>

        <TableCell>{renderEstado(documentId)}</TableCell>
        <TableCell>{renderTipoDoc(documentModelId)}</TableCell>
        <TableCell>{`${sriSerieNumber}-${referenceNumber}`}</TableCell>
        <TableCell>{partner.cC_RUC_DNI}</TableCell>
        <TableCell>{partner.name}</TableCell>
        <TableCell style={{ textAlign: 'right' }}>{Number(total).toFixed(2)}</TableCell>
        <TableCell>Factura</TableCell>
        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:eye" />
          Ver
        </MenuItem>

        <MenuItem
          disabled={documentId !== 0}
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:pencil" />
          Editar
        </MenuItem>
      </CustomPopover>
    </>
  );
}
