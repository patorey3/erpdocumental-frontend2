import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { IItemConsulta } from '../types';

// ----------------------------------------------------------------------

type Props = {
  row: IItemConsulta;
  onEditRow?: VoidFunction;
  onViewRow?: VoidFunction;
  onSelectRow: (id: number ) => void;
  onDeleteRow?: VoidFunction;
};

export default function SriTableConsultaRow({
  row,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const { id, selected, accessKey, razonSocial, comprobante, total } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={ () => onSelectRow (id)} />
      </TableCell>

      <TableCell>{id}</TableCell>

      <TableCell>{accessKey}</TableCell>

      <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>{razonSocial}</TableCell>
      <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>{comprobante}</TableCell>

      <TableCell sx={{ textAlign: 'right' }}>{ total ? Number(total).toFixed(2) : ''}</TableCell>
    </TableRow>
  );
}
