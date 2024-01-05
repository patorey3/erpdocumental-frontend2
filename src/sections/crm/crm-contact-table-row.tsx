
import { useState } from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Stack, Table, Collapse, TableBody, TableHead, Typography } from '@mui/material';

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
  onEditRow: (id: string, isPerson: boolean) => void;
  // onDeleteRow: VoidFunction;
};

export default function CrmContactTableRow({
  row,
  rowNumber,
  onEditRow,

} // selected,
// onSelectRow,
// onViewRow,
// onDeleteRow,
: Props) {
  const {
    // id,
    ruc,
    name,
    empleados,
    isActive,
    email,
    phone,
    sector,
    isPerson,
    ubication
  } = row;
  const confirm = useBoolean();
  const popover = usePopover();
  const [open, setOpen] = useState(false);

  const handleOpenCollapse = (employees:any[]) =>{
    console.log('query_job',employees)
    setOpen(!open);
  }

  return (
    <>
      <TableRow key={row.id} hover>
      <TableCell padding="checkbox">
        <IconButton
            aria-label="expand row"
            size="small"
            disabled={empleados.length === 0}
            onClick={() =>handleOpenCollapse(row.empleados)}
          >
            {open ? <Iconify icon="mdi:chevron-up" /> : <Iconify icon="mdi:chevron-down" />}
          </IconButton>
        </TableCell>
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
        <Typography sx={{ fontSize: '12px', color:'#212B36', lineHeight:'18px', fontWeight: '400' }}>{`${empleados.length} Contactos Asociados` }</Typography>
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
        <TableCell align="center">
        <Label variant="soft" color={isActive ? 'info' : 'warning'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Label>
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
          <div style={{display:'flex', margin:'50px', justifyContent:'center', justifyItems:'center', backgroundColor:'#EBF6FD'}}>
            <Table size='small' sx={{ maxWidth: '80%', backgroundColor:'white', margin:'15px' }}>
            <TableHead >
            <TableRow key="tk-1235" >
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Contacto</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {
                empleados.map((empleado) =>(
                <TableRow key={empleado.id} hover>
                  <TableCell>
                  <Stack>
            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{empleado.name}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{empleado.cC_RUC_DNI}</Typography>
          </Stack>

                  </TableCell>
                  <TableCell>EMPLEADO</TableCell>
                  <TableCell>{empleado.c_cargo}</TableCell>
                  <TableCell>
                  <Stack>
            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{empleado.emailCompany}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{empleado.phone}</Typography>
          </Stack>
                    </TableCell>
                    
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
                </TableRow>
                  ))
              }
            </TableBody>
            </Table>
          </div>
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
           // onEditRow(row.id.toString(), row.isPerson);
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}
        >
          <Iconify icon="ic:round-person" />
          Agregar Empleado
        </MenuItem>
        <MenuItem
          onClick={() => {
            // onEditRow(row.id.toString(), row.isPerson);
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}
        >
          <Iconify icon="carbon:enterprise" />
          Agregar Agencia
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}
        >
          <Iconify icon="octicon:unlink-16" />
          Quitar Agencia/Empleado
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
