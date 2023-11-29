import { useState, useEffect } from 'react';

import { Table, Container, TableBody, TableContainer } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IConsulta, IItemConsulta } from '../types';
import SriTableConsultaRow from './sri-table-consulta-row';

type Props = {
  consulta: IConsulta;
  setConsulta: (consulta: IConsulta) => void;
};

const TABLE_HEAD = [
  { id: 'id', label: '#', width: 50 },
  { id: 'accessKey', label: 'Clave de acceso', width: 160 },
  { id: 'razonSocial', label: 'Razón Social', width: 160 },
  { id: 'comprobante', label: 'Comprobante', width: 140 },
  { id: 'total', label: 'Total', width: 110 },
];

function Step3Form({ consulta, setConsulta }: Props) {
  const settings = useSettingsContext();
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const [tableData, setTableData] = useState<IItemConsulta[]>([]);

  useEffect(() => {
    setTableData(consulta.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetSelectedConsulta = (id: number) => {
    const newConsulta = { ...consulta };
    const indexItem = newConsulta.items.findIndex((it) => it.id === id);
    newConsulta.items[indexItem].selected = !newConsulta.items[indexItem].selected;
    setConsulta(newConsulta);
  };
  const handleSetSelectedAll = () => {
    const newConsulta = { ...consulta };
    newConsulta.items.forEach((item) => {
      item.selected = !item.selected;
    });
    setConsulta(newConsulta);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: '15px',
      }}
    >
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={handleSetSelectedAll}
              />
              <TableBody>
                {tableData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <SriTableConsultaRow
                      key={row.id}
                      row={row}
                      onSelectRow={handleSetSelectedConsulta}
                    />
                  ))}
              </TableBody>
            </Table>
          </Scrollbar>
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
    </div>
  );
}

export default Step3Form;
