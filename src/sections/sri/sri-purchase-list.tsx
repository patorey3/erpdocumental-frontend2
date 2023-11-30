// import Iconify from 'src/components/iconify';
import { useState, useEffect, useCallback } from 'react';

import {
  Table,
  Container,
  TableBody,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { useSettingsContext } from 'src/components/settings';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IPurchase } from 'src/types/purchases';

import SriPurchaseTableRow from './sri-purchase-table-row';

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

/* const handleEditRow = ( row: IPurchase) => {
  console.log('row',row);
} */

const STORAGE_KEY = 'sri_purchase';
const initialDocState = { sri_purchase: {} };

export default function SriPurchaseList({ purchases }: Props) {
  const router = useRouter();
  const { update: updatedocSri } = useLocalStorage(STORAGE_KEY, initialDocState);


  const settings = useSettingsContext();
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const [tableData, setTableData] = useState<IPurchase[]>(purchases);
  useEffect(() => {
    setTableData(purchases);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchases]);

  const handleSriPurchaseEdit = (purchase: IPurchase) => {
    console.log(purchase);
    updatedocSri('sri_purchase',purchase);
    handleEditRow();
  }

  const handleEditRow = useCallback(
    () => {
      router.push(paths.dashboard.utils.edit);
    },
    [router]
  );


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
                <SriPurchaseTableRow
                key={`${row.sriSerieNumber}-${row.referenceNumber}`}
                row={row}
                rowNumber={table.page*10 + index + 1}
                onEditRow={() => handleSriPurchaseEdit(row)}
                onViewRow={() => handleSriPurchaseEdit(row)}
              />
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
