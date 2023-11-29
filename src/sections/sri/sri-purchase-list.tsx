// import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import {
  Table,
  TableRow,
  MenuItem,
  Container,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { useSettingsContext } from 'src/components/settings';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IPurchase } from 'src/types/purchases';

const TABLE_HEAD = [
  { id: '', label: '#', width: 88 },
  { id: '', label: 'Estado' },
  { id: '', label: 'Familia', width: 160 },
  { id: '', label: 'Nro de Comprobante', width: 250 },
  { id: '', label: 'RUC/Cédula', width: 160 },
  { id: '', label: 'Razón Social', width: 160 },
  { id: '', label: 'Total', width: 140 },
  { id: '', label: 'Tipo Comprobante', width: 110 },
  { id: '', width: 100 },
];

type Props = {
  purchases: IPurchase[];
};



export default function SriPurchaseList({ purchases }: Props) {
  console.log('docs purchases', purchases);

  const settings = useSettingsContext();
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const popover = usePopover();
  const [tableData, setTableData] = useState<IPurchase[]>(purchases);

 
  useEffect(() => {
    setTableData(purchases);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchases]);

  return (
    <Container maxWidth={!settings.themeStretch ? false : 'lg'}>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={tableData.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />
          <TableBody>
            {tableData
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row, index) => (
                <>
                <TableRow hover key={`${row.invoiceId}-${index}`}>
                  <TableCell>{table.page * 10 + index + 1}</TableCell>
                  <TableCell>
                    <Label
                      variant="soft"
                      color={
                        (row.documentId === 0 && 'warning') ||
                        (row.documentId !== 0 && 'success') ||
                        'default'
                      }
                    >
                      {row.documentId !== 0 ? 'Guardado' : 'No Guardado'}
                    </Label>
                  </TableCell>
                  <TableCell>{row.documentId}</TableCell>
                  <TableCell>{`${row.sriSerieNumber}-${row.referenceNumber}`}</TableCell>
                  <TableCell>{row.partner.cC_RUC_DNI}</TableCell>
                  <TableCell>{row.partner.name}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    {Number(row.total).toFixed(2)}
                  </TableCell>
                  <TableCell>Factura</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color={popover.open ? 'primary' : 'default'}
                      onClick={popover.onOpen}
                    >
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
                                      // onViewRow();
                                      popover.onClose();
                                    }}
                                  >
                                    <Iconify icon="solar:eye-bold" />
                                    View
                                  </MenuItem>
            
                                  <MenuItem
                                    onClick={() => {
                                      // onEditRow();
                                      popover.onClose();
                                    }}
                                  >
                                    <Iconify icon="solar:pen-bold" />
                                    Edit 
                                  </MenuItem>
                                </CustomPopover>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationCustom
        count={tableData.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Container>
  );
}
