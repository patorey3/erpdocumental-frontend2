import * as Yup from 'yup';
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Box, Stack, Container } from '@mui/system';
import { Grid, Table, MenuItem, TableRow, TableBody, TableCell, TableHead, Typography, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { fCurrency } from 'src/utils/format-number';
import { localStorageGetItem } from 'src/utils/storage-available';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IPurchase, ITaxDetail } from 'src/types/purchases';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function UtilEditPage() {
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');
  const { enqueueSnackbar } = useSnackbar();


  const document = localStorageGetItem('sri_purchase');
  const objDocument = JSON.parse(document ?? '');
  const sriDocument: IPurchase = objDocument.sri_purchase;
  const hasItemToCreate = sriDocument.details.findIndex((it) => it.id ===0) >= 0;

  const objcatalog = JSON.parse(localStorageGetItem('doc-catalog') ?? '');
  const docCatalog = objcatalog.type_docs;
  const titleHeading =
    sriDocument.invoiceId === 0 ? 'Editar Factura de Compra' : 'Consulta de Factura de Compra';
  const nroDocumento = `${sriDocument.sriSerieNumber}-${sriDocument.referenceNumber}`;

  const DocumentSchema = Yup.object().shape({
    sriSerieNumber: Yup.string().required('Numero de serie es requerido'),
    referenceNumber: Yup.string().required('Número es requerido'),
    documentModelId: Yup.number().required('Fámilia de Documento es requerido'),
    cC_RUC_DNI: Yup.string().required('RUC Cédula es Requerido'),
    name: Yup.string().required('Nombre de Contacto es Requerido'),
    sriAuthorization: Yup.string().required('Número de Autorización es Requerido'),
    description: Yup.string().required('Descripción Documental  es Requerido'),
    transactionDate: Yup.string().required('Fecha  es Requerido'),
    subTotal: Yup.number().required('SubTotal  es Requerido'),
    taxAmount: Yup.number().required('Impuesto  es Requerido'),
    total: Yup.number().required('Total  es Requerido'),
  });

  const defaultValues = useMemo(
    () => ({
      sriSerieNumber: sriDocument?.sriSerieNumber ?? '',
      referenceNumber: sriDocument?.referenceNumber ?? '',
      documentModelId: sriDocument?.documentModelId,
      cC_RUC_DNI: sriDocument?.partner.cC_RUC_DNI ?? '',
      name: sriDocument?.partner.name ?? '',
      sriAuthorization: sriDocument?.sriAuthorization ?? '',
      description: sriDocument?.description ?? 'Sin Descripción',
      transactionDate: sriDocument?.transactionDate ?? '',
      subTotal: sriDocument?.subTotal ?? 0,
      taxAmount: sriDocument?.taxAmount ?? 0,
      total: sriDocument?.total ?? 0,
    }),
    [sriDocument]
  );


  const methods = useForm({
    resolver: yupResolver(DocumentSchema),
    defaultValues,
  });
  const {
    // reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    if(hasItemToCreate){
      enqueueSnackbar("El Documento Tiene Items por Asociar o Crear",  {
        variant: 'warning',
      });
      return;
    }
    try {      
      await new Promise((resolve) => setTimeout(resolve, 500));
      //  reset();
      // enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      setValue('sriSerieNumber', values.sriSerieNumber);
    } catch (error) {
      enqueueSnackbar(error);
    }
  });

  
const renderTaxesByItem = (taxDetail : ITaxDetail[]) => {
  // eslint-disable-next-line no-return-assign
  const total = taxDetail.reduce( (acum, curr) => acum += curr.taxAmount ,0) ?? 0;
  return total;
}

const renderTotal = (
  <>
    <StyledTableRow>
      <TableCell colSpan={6} />
      <TableCell sx={{ color: 'text.secondary' }}>
        <Box sx={{ mt: 2 }} />
        Subtotal
      </TableCell>
      <TableCell width={120} sx={{ typography: 'subtitle2' }}>
        <Box sx={{ mt: 2 }} />
        {fCurrency(sriDocument.subTotal)}
      </TableCell>
    </StyledTableRow>

    <StyledTableRow>
      <TableCell colSpan={6} />
      <TableCell sx={{ color: 'text.secondary' }}>Impuestos</TableCell>
      <TableCell width={120}>{fCurrency(Number(sriDocument.taxAmount))  }</TableCell>
    </StyledTableRow>

    <StyledTableRow>
      <TableCell colSpan={6} />
      <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
      <TableCell width={140} sx={{ typography: 'subtitle1' }}>
        {fCurrency(sriDocument.subTotal+sriDocument.taxAmount)}
      </TableCell>
    </StyledTableRow>
  </>
);
  const renderActions = (
    <>
      {mdUp && <Grid md={12} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '15px' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={sriDocument.invoiceId !== 0}
          loading={isSubmitting}
        >
          {!sriDocument ? 'Create Product' : 'Guardar'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <>
      <Helmet>
        <title> Dashboard: Sri Documentos</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={`${titleHeading}`}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Utilidades',
              href: paths.dashboard.utils.root,
            },
            {
              name: `Documento ${nroDocumento}`,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 1 },
          }}
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container >
            <Grid item md={12}>
              <Stack sx={{ width: 1 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Información de Contacto:
                </Typography>
              </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
                  <RHFTextField disabled name="cC_RUC_DNI" label="RUC/Cédula" />
                  <RHFTextField disabled name="name" label="Razón Social" value={values.name} />
                </Stack>
            </Grid>
            <Grid item md={12}>
              <Stack sx={{ width: 1 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Información de Comprobante:
                </Typography>
              </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                  <RHFTextField disabled name="sriSerieNumber" label="Serie" />

                  <RHFTextField
                    disabled
                    name="referenceNumber"
                    label="Número de Referencia"
                    value={values.referenceNumber}
                  />

                  <RHFSelect
                    fullWidth
                    size='small'
                    name="documentModelId"
                    label="Familia de Documento"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {docCatalog.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                <RHFTextField disabled name="sriAuthorization" label="Nro Autorización" />
                <RHFTextField disabled name="description" label="Descripción Documental" />
                </Stack>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                <RHFTextField disabled name="transactionDate" label="Fecha Autorización" />
                <RHFTextField  style={{textAlign:'right'}} disabled name="subTotal" label="SubTotal" />
                <RHFTextField disabled name="taxAmount" label="Impuesto" />
                <RHFTextField disabled name="total" label="Total" />
                </Stack>
            </Grid>
          </Grid>
          {renderActions}
        </FormProvider>
        <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Interno</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}>Consultado</TableCell>

              <TableCell>Cantidad</TableCell>

              <TableCell align="right">Precio Unitario</TableCell>
              <TableCell align="right">SubTotal</TableCell>
              <TableCell align="right">Impuestos</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sriDocument.details.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ width: 200 }}>
                    <Typography variant="subtitle2">BarCode: {row.productCode}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: 200 }}>
                    <Typography variant="subtitle2">Código: {row.itemBarCode}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.itemName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.quantity}</TableCell>

                <TableCell align="right">{fCurrency(row.priceAmount)}</TableCell>
                <TableCell align="right">{fCurrency(row.subtotal)}</TableCell>
                <TableCell align="right">{fCurrency(Number(renderTaxesByItem(row.taxDetails)))}</TableCell>

                <TableCell align="right">{fCurrency(Number(renderTaxesByItem(row.taxDetails)) + row.subtotal)}</TableCell>
              </TableRow>
            ))}
          {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
      </Container>
    </>
  );
}
