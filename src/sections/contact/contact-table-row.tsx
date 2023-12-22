
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Stack, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IContact } from 'src/types/contact';

// ----------------------------------------------------------------------

type Props = {
  row: IContact;
  rowNumber: number;
  // selected: boolean;
  // onSelectRow: VoidFunction;
  // onViewRow: VoidFunction;
  // onEditRow: (id: string) => void;
  // onDeleteRow: VoidFunction;
};

export default function ContactTableRow({
  row,
  rowNumber,
} // selected,
// onSelectRow,
// onViewRow,
// onEditRow,
// onDeleteRow,
: Props) {
  const {
    // id,
    ruc,
    name,
    empleados,
    // address,
    email,
    phone,
    sector,
    isPerson,
    ubication
  } = row;
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
        <TableCell>{rowNumber}</TableCell>
        <TableCell align="left">
          <Stack>
            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{name}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{ruc}</Typography>
          </Stack>
          
          </TableCell>
        <TableCell align="center">
          <Label variant="soft" color={isPerson ? 'default' : 'info'}>
            {isPerson ? 'Persona' : 'Empresa'}
          </Label>
        </TableCell>
        <TableCell>
        <Typography sx={{ fontSize: '12px', color:'#212B36', lineHeight:'18px', fontWeight: '400' }}>{empleados}</Typography>
        </TableCell>
        <TableCell>
        <Typography sx={{ fontSize: '12px', color:'#212B36', lineHeight:'18px', fontWeight: '400' }}>{ubication}</Typography>
        </TableCell>
        <TableCell>{sector}</TableCell>
        <TableCell align="left">
        <Stack>
            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{email}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{phone}</Typography>
          </Stack>

          
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
            // onEditRow(row.id.toString());
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}
        >
          <Iconify icon="ci:note-edit" />
          Editar Contacto
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="material-symbols:person-add-disabled-rounded" />
          Desactivar Contacto
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={undefined}>
            Delete
          </Button>
        }
      />
    </>
  );
}
