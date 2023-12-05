import { format } from 'date-fns';
import { useState, useEffect } from 'react';

import { Container } from '@mui/system';
import { TabPanel, TabContext } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';
import {
  Tab,
  Box,
  Card,
  Tabs,
  Grid,
  Stack,
  Table,
  Button,
  Divider,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

// import { useResponsive } from 'src/hooks/use-responsive';

import { fCurrency } from 'src/utils/format-number';
import { localStorageGetItem } from 'src/utils/storage-available';

import { mockPurchaseData } from 'src/_mock/_mock_purchase';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useTable, TableHeadCustom } from 'src/components/table';

import { IPurchase, ITaxDetail } from 'src/types/purchases';

const TABS_OPTIONS = [
  { value: 'general', label: 'Datos Generales', icon: 'ic:baseline-home' },
  { value: 'detalle', label: 'Detalle', icon: 'fluent:box-multiple-20-filled' },
  { value: 'historial', label: 'Historial Financiero', icon: 'tabler:report-money' },
  { value: 'pagos', label: 'Pagos', icon: 'fa6-solid:money-check-dollar' },
  { value: 'vinculados', label: 'Documentos Vinculados', icon: 'bi:file-earmark-zip' },
];

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 88 },
  { id: 'itemBarCode', label: 'Barcode de Item' },
  { id: 'itemName', label: 'Nombre de Item' },
  { id: 'productCode', label: 'Código de Producto' },
  { id: 'description', label: 'Descripción' },
  { id: 'quantity', label: 'Cantidad' },
  { id: 'priceAmount', label: 'Precio Unitario' },
  { id: 'subtotal', label: 'SubTotal' },
  { id: 'tax', label: 'Impuesto' },
  { id: 'total', label: 'Total' },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

type Props = {
  purchase: IPurchase;
};

export default function PurchaseDetailRow({ purchase }: Props) {
  const [option, setOption] = useState(TABS_OPTIONS[0]);
  const settings = useSettingsContext();
  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const [tableData, setTableData] = useState(purchase.details);
  console.log('mockPurchaseData', mockPurchaseData);
  // const mdUp = useResponsive('up', 'md');
  const catalog = localStorageGetItem('doc-catalog');
  const objCatalog = JSON.parse(catalog ?? '');

  const renderTipoDoc = (id: number | null) => {
    if (id) {
      const indexTypeDoc = objCatalog.type_docs.findIndex((cat: any) => cat.id === id);
      return objCatalog.type_docs[indexTypeDoc].name;
    }
    return 'Sin Asignar';
  };
  const handleOption = (event: React.SyntheticEvent, newValue: string) => {
    const selectedOption = TABS_OPTIONS.find((op) => op.value === newValue);
    setOption(selectedOption ?? TABS_OPTIONS[0]);
    // setPurchases(docs);
  };

  useEffect(() => {
    setTableData(purchase.details);
  }, [purchase.details]);

  const renderTaxesByItem = (taxDetail: ITaxDetail[], subtotal: number) => {
    // eslint-disable-next-line no-return-assign
    const totalImpuesto = taxDetail.reduce((acum, curr) => (acum += curr.taxAmount), 0) ?? 0;
    return Number(totalImpuesto + subtotal).toFixed(2);
  };

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={8} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(purchase.subTotal)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={8} />
        <TableCell sx={{ color: 'text.secondary' }}>Impuestos</TableCell>
        <TableCell width={120}>{fCurrency(Number(purchase.taxAmount))}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={8} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(purchase.subTotal + purchase.taxAmount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderEstado = (texto: string) => {
    const color = texto === 'No Procesado' ? 'warning' : 'success';
    return <Label color={color}>{texto}</Label>;
  };

  return (
    <Container maxWidth={!settings.themeStretch ? false : 'lg'}>
      <Card>
        <TabContext value={option.value}>
          <Tabs
            value={option.value}
            onChange={handleOption}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                style={{ color: '#1EAAE7' }}
                icon={<Iconify icon={tab.icon} />}
                value={tab.value}
                label={tab.label}
              />
            ))}
          </Tabs>
          <TabPanel value={TABS_OPTIONS[0].value}>
            <Typography variant="h5">Información Documental</Typography>
            <Divider flexItem orientation="horizontal" sx={{ border: '0.5px solid #dddddd ' }} />
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="horizontal" sx={{ borderStyle: 'solid' }} />}
              sx={{ p: 3 }}
            >
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Categoría Documental</Typography>
                  <Typography variant="body2">COMPRA</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Documento de Requisición</Typography>
                  <Typography variant="body2">00120304</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">¿Está Procesado?</Typography>
                  <Typography variant="body2">
                    {purchase.accountableStatus === 'NotEmmited' ? 'NO' : 'SI'}
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Relación Documental</Typography>
                  <Typography variant="body2">{renderTipoDoc(purchase.documentModelId)}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Usuario de Sistema</Typography>
                  <Typography variant="body2">Nombre de Usuario</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">¿Está Procesado?</Typography>
                  <Typography variant="body2">NO</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">ID Documental</Typography>
                  <Typography variant="body2">{purchase.documentId}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Fecha de Registro</Typography>
                  <Typography variant="body2">
                    {format(new Date(purchase.created ?? ''), 'dd/MM/yyyy')}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Fecha de Conciliación</Typography>
                  <Typography variant="body2">01/01/2023</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack spacing={2} style={{ marginBottom: '15px' }}>
                  <Button
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                      width: '208px',
                      height: '45px',
                      backgroundColor: '#0F8BE3',
                    }}
                    variant="contained"
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={3}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '30px',
                            borderRadius: '5px',
                            width: '30px',
                            backgroundColor: 'white',
                          }}
                        >
                          <Iconify
                            style={{ width: '50px', color: '#0F8BE3' }}
                            icon="fa6-solid:laptop-file"
                          />
                        </div>
                      </Grid>
                      <Grid
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        item
                        xs={9}
                      >
                        Ver Documento Adjunto
                      </Grid>
                    </Grid>
                  </Button>
                  <Button
                    style={{ width: '208px', height: '45px', backgroundColor: '#FFA239' }}
                    variant="contained"
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={3}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '30px',
                            borderRadius: '5px',
                            width: '30px',
                            backgroundColor: 'white',
                          }}
                        >
                          <Iconify
                            style={{ width: '50px', color: '#FFA239' }}
                            icon="fluent:document-copy-16-filled"
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={9}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        Clonar Compra
                      </Grid>
                    </Grid>
                  </Button>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Fecha de Procesado</Typography>
                  <Typography variant="body2">
                    {format(new Date(purchase.transactionDate ?? ''), 'dd/MM/yyyy')}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Typography variant="h5">Información de Contacto</Typography>
            <Divider flexItem orientation="horizontal" sx={{ border: '0.5px solid #dddddd ' }} />
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="horizontal" sx={{ borderStyle: 'solid' }} />}
              sx={{ p: 3 }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Razón Social</Typography>
                  <Typography variant="body2">{purchase.partner.name}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">RUC/Cédula</Typography>
                  <Typography variant="body2">{purchase.partner.cC_RUC_DNI}</Typography>
                </Stack>
              </Stack>
            </Stack>
            <Typography variant="h5">Información de Comprobante</Typography>
            <Divider flexItem orientation="horizontal" sx={{ border: '0.5px solid #dddddd ' }} />
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="horizontal" sx={{ borderStyle: 'solid' }} />}
              sx={{ p: 3 }}
            >
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Serie</Typography>
                  <Typography variant="body2">{purchase.sriSerieNumber}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Nro de Autorización</Typography>
                  <Typography variant="body2">{purchase.sriAuthorization}</Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Número Comprobante</Typography>
                  <Typography variant="body2">{purchase.referenceNumber}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Fecha de Comprobante</Typography>
                  <Typography variant="body2">
                    {format(new Date(purchase.transactionDate ?? ''), 'dd/MM/yyyy')}
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">SubTotal</Typography>
                  <Typography variant="body2">{purchase.subTotal}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Impuesto</Typography>
                  <Typography variant="body2">{purchase.taxAmount}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Total</Typography>
                  <Typography variant="body2">{purchase.total}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </TabPanel>
          <TabPanel value={TABS_OPTIONS[1].value}>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
                  <TableHeadCustom
                    key="thc-purchase-dt"
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                  />
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.itemBarCode}</TableCell>
                        <TableCell>{row.itemName}</TableCell>
                        <TableCell>{row.productCode}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="center">{row.quantity}</TableCell>
                        <TableCell align="right">{row.priceAmount}</TableCell>
                        <TableCell align="right">{row.subtotal}</TableCell>
                        <TableCell align="right">{renderTaxesByItem(row.taxDetails, 0)}</TableCell>
                        <TableCell align="right">
                          {renderTaxesByItem(row.taxDetails, row.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {renderTotal}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </TabPanel>
          <TabPanel value={TABS_OPTIONS[2].value}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              divider={<Divider flexItem orientation="horizontal" sx={{ borderStyle: 'solid' }} />}
              sx={{ p: 3 }}
            >
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Código de Cuenta Contable</Typography>
                  <Typography variant="body2">
                    {mockPurchaseData.tabHistory.codigo_contable}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Valor Inicial de la Compra</Typography>
                  <Typography variant="body2">
                    ${mockPurchaseData.tabHistory.valor_inicial.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Nombre de Cuenta Contable</Typography>
                  <Typography variant="body2">
                    {mockPurchaseData.tabHistory.nombre_codigo_contable}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="subtitle2">Saldo de la Compra</Typography>
                  <Typography variant="body2">
                    ${mockPurchaseData.tabHistory.saldo_compra.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack>
                  <Typography variant="subtitle2">Documento Modelo Relacionado</Typography>
                  <Typography variant="body2">
                    {mockPurchaseData.tabHistory.doc_relacionado}
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 1 }}>
                <Stack spacing={2} style={{ marginBottom: '15px' }}>
                  <Button
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                      width: '208px',
                      height: '45px',
                      backgroundColor: '#0F8BE3',
                    }}
                    variant="contained"
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={3}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '30px',
                            borderRadius: '5px',
                            width: '30px',
                            backgroundColor: 'white',
                          }}
                        >
                          <Iconify
                            style={{ width: '50px', color: '#0F8BE3' }}
                            icon="fa6-solid:laptop-file"
                          />
                        </div>
                      </Grid>
                      <Grid
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        item
                        xs={9}
                      >
                        Ver Documento Adjunto
                      </Grid>
                    </Grid>
                  </Button>
                  <Button
                    style={{ width: '208px', height: '45px', backgroundColor: '#9F41CD' }}
                    variant="contained"
                  >
                    <Grid container>
                      <Grid
                        item
                        xs={3}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '30px',
                            borderRadius: '5px',
                            width: '30px',
                            backgroundColor: 'white',
                          }}
                        >
                          <Iconify
                            style={{ width: '50px', color: '#9F41CD' }}
                            icon="fa6-solid:money-bill-transfer"
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={9}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        Ver Libro Mayor
                      </Grid>
                    </Grid>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Código Cuenta</TableCell>
                  <TableCell>Nombre Cuenta</TableCell>
                  <TableCell>Documento Modelo Relacionado</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>ID Documental </TableCell>
                  <TableCell>Entradas y Salidas de Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPurchaseData.tabHistory.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{format(item.fecha, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{item.codigo_contable}</TableCell>
                    <TableCell>{item.nombre_codigo_contable}</TableCell>
                    <TableCell>{item.doc_relacionado}</TableCell>
                    <TableCell>{item.descripción}</TableCell>
                    <TableCell>{item.id_documental}</TableCell>
                    <TableCell align="right">{item.valor}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={7}>
                    <b>SALDO</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>0.00</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel value={TABS_OPTIONS[3].value}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Documento Modelo Relacionado</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>ID Documental </TableCell>
                  <TableCell>Entradas y Salidas de Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPurchaseData.tabPayment.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{format(item.fecha, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{item.doc_relacionado}</TableCell>
                    <TableCell>{item.descripción}</TableCell>
                    <TableCell>{item.id_documental}</TableCell>
                    <TableCell align="right">{item.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>
                    <b>SALDO</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>{mockPurchaseData.tabPayment.total.toFixed(2)}</b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel value={TABS_OPTIONS[4].value}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>ID Documental </TableCell>
                  <TableCell>Estado Contable</TableCell>
                  <TableCell>Estado Contable</TableCell>
                  <TableCell>Estado Registro</TableCell>
                  <TableCell>Valores</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPurchaseData.tabDocRelated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{format(item.fecha, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{item.doc_relacionado}</TableCell>
                    <TableCell>{item.contacto}</TableCell>
                    <TableCell>{item.id_documental}</TableCell>
                    <TableCell>{renderEstado(item.estado_contable)}</TableCell>
                    <TableCell>{item.estado_registro}</TableCell>
                    <TableCell align="right">{item.valor}</TableCell>
                    <TableCell>
                      <Tooltip title="Ver Documento Adjunto">
                        <Iconify
                          style={{ width: '50px', color: '#0F8BE3', cursor: 'pointer' }}
                          icon="fa6-solid:laptop-file"
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>{' '}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
}
