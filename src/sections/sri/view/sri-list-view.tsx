import Container from '@mui/material/Container';
// import { useTheme } from '@mui/material/styles';

// import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { Card, Table, Button, TableBody, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IJobsItem } from 'src/types/transaction';

import SriTableRow from '../sri-table-row';
import { useListDocCatalog } from '../hook/useCatalog';
import { useListJobTransactions } from '../hook/useJobTransaction';

// type IJobsItem = {
//   totalKeys: number;
//   processedKeys: number;
//   processedPurchases: number;
//   savedPurchases: number;
//   processedTaxWithHoldings: number;
//   savedTaxWithHoldings: number;
//   processedCreditMemos: number;
//   savedCreditMemos: number;
//   notDownloadedYet: number;
//   jobTransaction: string;
//   description: string;
//   created: string;
//   status: string;
// };

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const initialCatalogState = { type_docs: [] };
const STORAGE_KEY = 'doc-catalog';
export default function SriListView() {
  // const theme = useTheme();
  //  const { state, update, reset } = useLocalStorage(STORAGE_KEY, defaultSettings);

  const { state : docCatalog , update: updateCatalog } = useLocalStorage(STORAGE_KEY, initialCatalogState);
// , update: updateCatalog
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  // const router = useRouter();
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });

  const [tableData, setTableData] = useState<IJobsItem[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [dateJob, setDateJob] = useState('');

  // const [docs, setDocs] = useState<any>();

  const TABLE_HEAD = [
    { id: '', width: 88 },
    { id: 'description', label: 'Consulta' },
    { id: 'created', label: 'Fecha', width: 160 },
    { id: 'totalKeys', label: 'Total Comprobantes', width: 160 },
    { id: 'progress', label: 'Progreso', width: 140 },
    { id: 'status', label: 'Estado', width: 110 },
    { id: '', width: 88 },
  ];
  // const denseHeight = table.dense ? 60 : 80;

  const queryListTransactions = useListJobTransactions(pageIndex, pageSize, dateJob);
  const queryCatalog = useListDocCatalog('Purchase')


  useEffect(() => {
    if (queryListTransactions.isFetched) {
      setDateJob('');
      setTableData(queryListTransactions.data.data);
      setTotalPages(queryListTransactions.data.totalPages);
      setPageSize(queryListTransactions.data.pageSize);
      setPageIndex(queryListTransactions.data.pageIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryListTransactions.data]);

  useEffect(() => {
    if (queryCatalog.isFetched) {
      const cat = queryCatalog.data.map( (item : any) => ({id: item.id, name: item.name, accountId: item.accountId }));
      if(docCatalog === initialCatalogState){
        updateCatalog('type_docs', cat);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);
  useEffect(() => {
    if (queryListTransactions.isError) {
      enqueueSnackbar(queryListTransactions.error.message, {
        variant: 'error',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryListTransactions.isError]);

  /* useEffect(() => {
    if(docCatalog === initialCatalogState){
      setCatalog();
    }
  }, []); */

  const onPageChange = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
    table.onChangePage(event, newPage);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Consultas SRI"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Utilidades',
            href: paths.dashboard.utils.root,
          },
          { name: 'Listado de Procesos' },
        ]}
        action={
          <Button
            component={RouterLink}
            style={{ backgroundColor: '#42C6FF' }}
            href={paths.dashboard.utils.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nueva Consulta
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {queryListTransactions.isLoading ? (
        <LoadingScreen />
      ) : (
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  key={Math.random.toString()}
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />
                <TableBody>
                  {tableData.map((row, index) => (
                    <SriTableRow
                      key={row.jobTransaction}
                      row={row}
                      selected={table.selected.includes(row.jobTransaction)}
                      onSelectRow={() => table.onSelectRow(row.jobTransaction)}
                      onDeleteRow={() => undefined}
                      onEditRow={() => undefined}
                      onViewRow={() => undefined}
                    />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
            <TablePaginationCustom
              count={pageSize * totalPages}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={onPageChange}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </TableContainer>
        </Card>
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------
