// import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import {
  Table,
  Container,
  TableBody,
  TableContainer,
} from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IItemToCreate } from 'src/types/purchases';

import SriItemsTableRow from './sri-items-table-row';

const TABLE_HEAD = [
  { id: '', label: '#', width: 88 },
  { id: '', label: 'Barcode (Interno)' },
  { id: '', label: 'Descripción (Interno)', width: 160 },
  { id: '', label: 'RUC/Cédula', width: 160 },
  { id: '', label: 'Razón Social', width: 160 },
  { id: '', label: 'Código Consultado', width: 250 },
  { id: '', label: 'Descripción Consultado', width: 140 },
  { id: '', width: 100 },
];

type Props = {
  items: IItemToCreate[];
};

export default function SriItemList({ items }: Props) {
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IItemToCreate[]>(items);
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });

  useEffect(() => {
    setTableData(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

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
                <SriItemsTableRow 
                key={`${table.page}*10+${index}+1`}
                row={row}
                rowNumber={table.page*10 + index + 1}
                onLinkRow={() => undefined}
                onContactRow={() => undefined}
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
