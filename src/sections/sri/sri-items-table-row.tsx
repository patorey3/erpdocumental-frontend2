
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, Typography } from '@mui/material';
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
  const { productCode, description, cC_RUC_DNI, name, itemId, itemBarCode, itemName } = row;
  const popover = usePopover();
  
  return (
    <>
      <TableRow hover>
        <TableCell>{rowNumber}</TableCell>
        <TableCell>
          <Box sx={{ width: 200 }}>
            <Typography variant="subtitle2">BarCode: {itemBarCode}</Typography>
            <Typography style={{ display: 'none' }} variant="subtitle2">
              BarCode: {itemId}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {itemName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{cC_RUC_DNI}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Box sx={{ width: 200 }}>
            <Typography variant="subtitle2">BarCode: {productCode}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {description}
            </Typography>
          </Box>
        </TableCell>
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
