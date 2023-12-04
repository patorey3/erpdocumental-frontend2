// import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import {
  Table,
  Container,
  TableBody,
  TableContainer,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IItemToCreate } from 'src/types/purchases';

import SriRelatedItems from './sri-related-items';
import SriItemsTableRow from './sri-items-table-row';

const TABLE_HEAD = [
  { id: '', label: '#', width: 88 },
  { id: '', label: 'Producto (Interno)' },
  { id: '', label: 'RUC/Cédula', width: 160 },
  { id: '', label: 'Razón Social', width: 160 },
  { id: '', label: 'Producto Consultado', width: 250 },
  { id: '', width: 100 },
];

type Props = {
  items: IItemToCreate[];
  itemHasChanged: (item: IItemToCreate) => void;

};

export default function SriItemList({ items, itemHasChanged }: Props) {
  const [itemState, setItemState] = useState<IItemToCreate[]>([]);
  const settings = useSettingsContext();
  const [tableData, setTableData] = useState<IItemToCreate[]>(items);
  const [itemToRelated, setItemToRelated] = useState<IItemToCreate|undefined>(undefined);

  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const confirm = useBoolean();

  const handleLinkItems = (row: IItemToCreate) => {
    setItemToRelated(row);
    confirm.onTrue();
  }

  const setItemTable = () =>{
    const newItems = itemState.filter((it) => it.itemId === 0);
    const changedItem = itemState.filter((it) => it.itemId !== 0);
    setTableData(newItems);
    itemHasChanged(changedItem[0])
  } 

  useEffect(() => {
    setItemState(items);
    console.log('itemsitemsitems',items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    console.log('tableData')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);
  

  useEffect(() => {
    setTableData(itemState);
    console.log('itemState',itemState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemState]);

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
                onLinkRow={() => handleLinkItems(row)}
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
            <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Relacionar Items"
        maxWidth='lg'
        content={
          <SriRelatedItems item={itemToRelated} onClose={confirm.onFalse} setItemTable= {setItemTable}/>
        }
        action={null}
      />
    </Container>
  );
}
