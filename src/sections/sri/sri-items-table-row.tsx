import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IItemToCreate } from 'src/types/purchases';

// ----------------------------------------------------------------------

type Props = {
  row: IItemToCreate;
  onLinkRow: VoidFunction;
  onContactRow: VoidFunction;
  rowNumber: number;
};

export default function SriItemsTableRow({ row, onLinkRow, onContactRow, rowNumber }: Props) {
  const { productCode, description, cC_RUC_DNI, name, itemBarCode, itemName } = row;

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>{rowNumber}</TableCell>

        <TableCell>{productCode}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>{cC_RUC_DNI}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{itemBarCode}</TableCell>
        <TableCell>{itemName}</TableCell>
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
            onLinkRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:link-variant" />
          Relacionar
        </MenuItem>

        <MenuItem
          disabled={cC_RUC_DNI !== '0'}
          onClick={() => {
            onContactRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:account" />
          Crear Contacto
        </MenuItem>
      </CustomPopover>
    </>
  );
}
