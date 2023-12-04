import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableContainer from '@mui/material/TableContainer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, Select, MenuItem, TableBody, InputLabel, FormControl, SelectChangeEvent, } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { usePurchases } from 'src/hooks/use-purchase';
import { useListDocCatalog } from 'src/hooks/use-catalog';
import { useLocalStorage } from 'src/hooks/use-local-storage';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IPurchase } from 'src/types/purchases';

import PurchaseTableRow from '../purchase-table-row';

// import PurchaseTableRow from '../purchase-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '', width: 88 },
  { id: '', label: '#', width: 88 },
  { id: 'invoiceNumber', label: 'Fecha Comprobante', width: 120, align: 'center' },
  { id: 'createDate', label: 'Naturaleza Documental', align: 'center' },
  { id: 'dueDate', label: 'Proveedor', align: 'center' },
  { id: 'price', label: 'Nro de Comprobante', width: 155, align: 'center' },
  { id: 'sent', label: 'Total', align: 'center', width: 120 },
  { id: 'sent2', label: 'Método de Pago', align: 'center', width: 120 },
  { id: 'status', label: 'Estado Contable', align: 'center', width: 120 },
  { id: '' },
];

export type IPurchaseTableFilters = {
  purchaseDate: Date | null;
};

// ----------------------------------------------------------------------

export default function PurchaseListView() {
 // const theme = useTheme();

  const [emittedDocument, setEmittedDocument] = useState<boolean | string>("all");

  const [hasCredit, setHasCredit] = useState<boolean | string>("all");
  const [filtersPurchase, setFiltersPurchase] = useState<IPurchaseTableFilters>({
    purchaseDate: null,
  });

  const [pageSize, setPageSize] = useState<number>(10);

  const [totalPages, setTotalPages] = useState<number>(0);

  const [pageIndex, setPageIndex] = useState<number>(1);

  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  
  const [documentModelId, setDocumentModelId] = useState<number>(0);

  const [catalogDoc, setCatalogDoc] = useState([]);

  const router = useRouter();


  // const settings = useSettingsContext();

  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });

  const confirm = useBoolean();

  const queryCatalog = useListDocCatalog('Purchase');

  const queryPurchases = usePurchases(emittedDocument, hasCredit, pageIndex);

  const initialCatalogState = { type_docs: [] };

  const STORAGE_KEY = 'doc-catalog';

  const { state: docCatalog, update: updateCatalog } = useLocalStorage(
    STORAGE_KEY,
    initialCatalogState
  );

  const [tableData, setTableData] = useState(purchases);

  useEffect(() => {
    if (queryCatalog.isFetched) {
      const cat = queryCatalog.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        accountId: item.accountId,
      }));
      setCatalogDoc(cat);
      if (docCatalog === initialCatalogState) {
        updateCatalog('type_docs', cat);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);

  useEffect(() => {
    if (queryPurchases.isFetched) {
      setPurchases(queryPurchases.data.data);
      setTableData(queryPurchases.data.data);
      setPageSize(queryPurchases.data.pageSize);
      setTotalPages(queryPurchases.data.totalPages);
      // setTotalPages(queryPurchases.data.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryPurchases.data]);

  const onPageChange = (event: unknown, newPage: number) => {
    setPageIndex(newPage + 1);
    table.onChangePage(event, newPage);
  };

  const handleFilterPurchaseDate = useCallback((newValue: Date | null) => {
    setFiltersPurchase({ purchaseDate: newValue });
  }, []);

  const onChangeEstadoContable= (event: SelectChangeEvent<unknown>) => {
    if(event.target.value===true || event.target.value===false || event.target.value==="all" ){
      setEmittedDocument(event.target.value);
    }
  };
  const onChangeMetodoPago= (event: SelectChangeEvent<unknown>) => {
    if(event.target.value===true || event.target.value===false || event.target.value==="all" ){
      setHasCredit(event.target.value);
    }
  };
  const onChangeNaturaleza= (event: SelectChangeEvent<unknown>) => {
      setDocumentModelId(Number(event.target.value));
  };

  const handleEditPurchase = useCallback(
    (id: string) => {
      router.push(paths.dashboard.purchase.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container style={{ maxWidth: '1400px' }}>
        <CustomBreadcrumbs
          heading="Lista de Compras"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Compras',
              href: paths.dashboard.purchase.root,
            },
            {
              name: 'Lista de Compras',
            },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.purchase.new}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Registrar Nueva Compra
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card style={{ maxWidth: '1400px' }}>
          <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{
              p: 2.5,
              pr: { xs: 2.5, md: 1 },
            }}
          >
            <DatePicker
              label="Fecha de Factura"
              format="dd/MM/yyyy"
              value={filtersPurchase.purchaseDate}
              onChange={handleFilterPurchaseDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
              sx={{
                maxWidth: { md: 200 },
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="id-naturaleza-label">Naturaleza Contable</InputLabel>
              <Select
                labelId="id-naturaleza-label"
                id="id-naturaleza"
                name='id-naturaleza'
                value={documentModelId}
                label="Naturaleza Contable"
                onChange={onChangeNaturaleza}
              >
                <MenuItem key={0} value={0}>Todos</MenuItem>
                {
                  catalogDoc.map((doc: any) => <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>)
                }
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="id-estado-contable-label">Estado Contable</InputLabel>
              <Select
                labelId="id-estado-contable-label"
                id="id-estado-contable"
                name ="id-estado-contable"
                value={emittedDocument}
                label="Estado Contable"
                onChange={onChangeEstadoContable}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value={true as any}>Emitida</MenuItem>
                <MenuItem value={false as any}>No Emitida</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="id-metodo-pago-label">Método de Pago</InputLabel>
              <Select
                labelId="id-metodo-pago-label"
                id="id-metodo-pago"
                name ="id-metodo-pago"
                value={hasCredit}
                label="Método de Pago"
                onChange={onChangeMetodoPago}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value={true as any}>Crédito</MenuItem>
                <MenuItem value={false as any}>Contado</MenuItem>
              </Select>
            </FormControl>            
          </Stack>
          {queryPurchases.isLoading ? (
        <LoadingScreen />
      ) : (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ maxWidth: '100%' }}>
                <TableHeadCustom
                  key="thc-purchase"
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                />
                <TableBody>
                  {tableData.map((row, index) => (
                    <PurchaseTableRow
                      key={row.invoiceId}
                      row={row}
                      rowNumber={(pageIndex - 1) * 10 + index + 1}
                      selected={table.selected.includes(row.documentId.toString())}
                      onSelectRow={() => table.onSelectRow(row.documentId.toString())}
                      onDeleteRow={() => undefined}
                      // eslint-disable-next-line @typescript-eslint/no-shadow
                      onEditRow={(invoiceId) => handleEditPurchase(invoiceId)}
                      onViewRow={() => undefined}
                    />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
      )
                  }
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
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
