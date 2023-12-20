import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, ChangeEvent } from 'react';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { TabPanel, TabContext } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import { Tab, Grid, Tabs, Button, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useMutationUpdatePurchase } from 'src/hooks/use-purchase';

import { localStorageGetItem } from 'src/utils/storage-available';

import Iconify from 'src/components/iconify';
import ContactListDialog from 'src/components/modals/contact-list-dialog';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IPurchase } from 'src/types/purchases';

import PurchaseDetailForm from './purchase-detail-form';

// ----------------------------------------------------------------------

type Props = {
  currentPurchase?: IPurchase;
};

interface IProviderCatalog {
  id: number;
  name: string;
  ruc: string;
}

interface IContactResult {
  id: number;
  ruc: string;
  name: string;
  address: string;
}

const TABS_OPTIONS = [
  { value: 'general', label: 'Datos Encabezado', icon: 'ic:baseline-home' },
  { value: 'detalle', label: 'Detalle de Items', icon: 'fluent:box-multiple-20-filled' },
];
export default function PurchaseNewEditForm({ currentPurchase }: Props) {
  const router = useRouter();
  const [providers, setProviders] = useState<IProviderCatalog[]>([]);
  const [purchase, setPurchase] = useState<any>({});

  const [optionTab, setOptionTab] = useState(TABS_OPTIONS[0]);

  const handleOption = (event: React.SyntheticEvent, newValue: string) => {
    const selectedOption = TABS_OPTIONS.find((op) => op.value === newValue);
    setOptionTab(selectedOption ?? TABS_OPTIONS[0]);
    // setPurchases(docs);
  };

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();



  const objcatalog = JSON.parse(localStorageGetItem('doc-catalog') ?? '');
  const docCatalog = objcatalog.type_docs;
  const objcitiescatalog = JSON.parse(localStorageGetItem('cities-catalog') ?? '');
  const citiesCatalog = objcitiescatalog.cities;
  const NewPurchaseSchema = Yup.object().shape({
    documentId: Yup.number(),
    invoiceId: Yup.number(),
    documentModelId: Yup.number().min(1).required('Familia de Documento es requerido'),
    partnerId: Yup.number().min(1).required('Contacto es requerido'),
    nodeCityId: Yup.string().required('Ciudad es requerido'),
    transactionDate: Yup.mixed<any>().required('Fecha de Transacción es requerida'),
    description: Yup.string().required('Descripción es requerido'),
    creditDateLimit: Yup.mixed<any>().nullable(),
    create: Yup.mixed<any>().nullable(),
    cC_RUC_DNI: Yup.string().required('RUC/Cédula es requerido'),
    hasCredit: Yup.boolean(),
    daysForCredit: Yup.number(),
    sriSerieNumber: Yup.string().required('Serie es requerida'),
    referenceNumber: Yup.string().required('Número es requerido'),
    sriAuthorization: Yup.string().required('Autorización es requerido'),
    total: Yup.number().min(0.01).required('Total es requerido'),
    details: Yup.array(),    
    name: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      documentId: currentPurchase?.documentId ?? 0,
      invoiceId: currentPurchase?.invoiceId ?? 0,
      documentModelId: currentPurchase?.documentModelId ?? 0,
      partnerId: currentPurchase?.partnerId ?? 0,
      nodeCityId: currentPurchase?.nodeCityId ?? 'c05010101',
      transactionDate: currentPurchase?.transactionDate
        ? new Date(currentPurchase.transactionDate)
        : new Date(),
      description: currentPurchase?.description ?? '',
      creditDateLimit: currentPurchase?.creditDateLimit
        ? new Date(currentPurchase.creditDateLimit)
        : new Date(),
      cC_RUC_DNI: currentPurchase?.partner.cC_RUC_DNI ?? '',
      hasCredit: currentPurchase?.hasCredit ?? false,
      daysForCredit: currentPurchase?.daysForCredit ?? 0,
      create: currentPurchase?.created ? new Date(currentPurchase.created) : new Date(),
      sriSerieNumber: currentPurchase?.sriSerieNumber ?? '',
      referenceNumber: currentPurchase?.referenceNumber ?? '',
      sriAuthorization: currentPurchase?.sriAuthorization ?? '',
      total: currentPurchase?.total ?? 1,
      details: currentPurchase?.details ? currentPurchase.details : [],
      name: currentPurchase?.partner.name ?? '',
    }),
    [currentPurchase]
  );

  const methods = useForm({
    resolver: yupResolver(NewPurchaseSchema),
    defaultValues,
     
  });

  const {
    reset,    
    clearErrors,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const updatePurchaseMutation = useMutationUpdatePurchase(
    purchase,
    values.invoiceId?.toString() ?? '',
  );

  const calcTotal = () =>
  // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
  values?.details?.reduce(
    (accumulator: number, item: any) =>
      accumulator + item.subtotal * (1 + item.vatTaxDecimalPercent),
    0
  );

  const calcSubTotal = () =>
  // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
  values?.details?.reduce(
    (accumulator: number, item: any) =>
      accumulator + item.subtotal ,
    0
  );


  const handleSaveAsDraft = handleSubmit(async (data) => {
    // console.info('DATA', JSON.stringify(data, null, 2));
    console.info('values', JSON.stringify(values, null, 2));
    const subTotal = Number(Number(calcSubTotal() ?? 0).toFixed(2)) * 1;
    const total = Number(Number(calcTotal() ?? 0).toFixed(2)) * 1;
    const taxAmount = Number(Number(total - subTotal).toFixed(2)) * 1;
    const {details} = values;
    if (details){
      for (let index = 0; index < details.length; index += 1) {
        details[index].deleteTaxDetails = [];
  }
    }
    const purchaseRegister: any = {
      id: data.invoiceId,
      partnerId: data.partnerId,
      documentModelId: data.documentModelId,
      sriSerieNumber: data.sriSerieNumber,
      referenceNumber: data.referenceNumber,
      sriAuthorization: data.sriAuthorization,
      sriIssueDateLimit: null,
      transactionDate: data.transactionDate,
      created: data.create,
      hasCredit: data.hasCredit,
      daysForCredit: data.daysForCredit,
      creditDateLimit: data.creditDateLimit,
      nodeCityId: data.nodeCityId,
      subTotal,
      taxAmount,
      total,
      details,
      delete: []
    };

    setPurchase(purchaseRegister);
    console.log('purchaseRegister',purchase)
    updatePurchaseMutation.mutate(purchase, purchase.id);
    /*
    const purchaseRegister : IPurchaseRegister = {
      id: data.documentId,
      partnerId: data.partnerId,
      documentModelId: data.documentModelId,
      sriSerieNumber: data.s,
      referenceNumber: string | null;
      sriAuthorization: string | null;
      sriIssueDateLimit: string | null;
      sriPaymentType: string | null;
      transactionDate: string | null;
      created: string | null;
      description: string | null;
      hasCredit: false;
      daysForCredit: number;
      creditDateLimit: string | null;
      nodeCityId: string | null;
      subTotal: number;
      taxAmount: number;
      total: number;
      balanceAmount: number;
      allowEdit: boolean;
      details: []
    } */

    // loadingSave.onTrue();

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   loadingSave.onFalse();
    //   router.push(paths.dashboard.invoice.root);
    //   console.info('DATA', JSON.stringify(data, null, 2));
    // } catch (error) {
    //   console.error(error);
    //   loadingSave.onFalse();
    // }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  const onChangeCredit = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('hasCredit', Boolean(event.target.value));
  };

  useEffect(() => {
    if (currentPurchase) {
      const provider: IProviderCatalog = {
        id: currentPurchase.partnerId,
        name: currentPurchase.partner.name,
        ruc: currentPurchase.partner.cC_RUC_DNI,
      };

      setValue('documentId', currentPurchase.documentId);
      setValue('invoiceId', currentPurchase.invoiceId);
      setValue('documentModelId', currentPurchase.documentModelId);
      setValue('partnerId', currentPurchase.partnerId);
      setValue('transactionDate', new Date(currentPurchase.transactionDate ?? ''));
      setValue('description', currentPurchase.description ?? 'SIN DESCRIPCIÓN'); // PARA PATRICIO
      setValue('creditDateLimit', new Date(currentPurchase.creditDateLimit ?? new Date()));
      setValue('cC_RUC_DNI', currentPurchase.partner.cC_RUC_DNI);
      setValue('hasCredit', currentPurchase.hasCredit);
      setValue('daysForCredit', currentPurchase.daysForCredit);
      setValue('sriSerieNumber', currentPurchase.sriSerieNumber ?? '');
      setValue('referenceNumber', currentPurchase.referenceNumber ?? '');
      setValue('sriAuthorization', currentPurchase.sriAuthorization ?? '');
      setValue('nodeCityId', currentPurchase.nodeCityId ?? 'c05010101');
      setValue('total', currentPurchase.total ?? 0);
      setValue('details', currentPurchase.details);
      setValue('name', currentPurchase.partner.name);

      setProviders([provider]);
      trigger()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPurchase]);
  const from = useBoolean();

  const onSelect = (partner: IContactResult | null) => {
    if (partner) {
      const provider: IProviderCatalog = {
        id: partner.id,
        name: partner.name,
        ruc: partner.ruc,
      };
      setProviders([provider]);
      setValue('partnerId', provider.id);
      setValue('cC_RUC_DNI', provider.ruc);
      setValue('name', provider.name);
      clearErrors('partnerId');
      clearErrors('cC_RUC_DNI');
    }
  };

  return (
    <FormProvider methods={methods}>
      <TabContext value={optionTab.value}>
        <Tabs
          value={optionTab.value}
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
              disabled={tab.value === 'detalle' && !isValid}
            />
          ))}
        </Tabs>
        <TabPanel value={TABS_OPTIONS[0].value}>
          <Typography variant="h6" style={{ paddingBottom: '10px' }}>
            Información Documental
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={5} md={2}>
              <Stack>
                <RHFTextField
                  disabled
                  name="categoria"
                  label="Categoría Documental"
                  defaultValue="COMPRA"
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <Stack>
                <RHFSelect
                  size="small"
                  style={{ width: '100%' }}
                  name="documentModelId"
                  label="Familia de Documento"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                  value={values.documentModelId}
                >
                  {docCatalog.map((option: any) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <Stack>
                <RHFTextField
                  disabled
                  name="id-documental"
                  label="ID Documental"
                  value={values.documentModelId}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={3} style={{ display: 'flex', justifyContent: 'center' }}>
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
                      Adjuntar Documento
                    </Grid>
                  </Grid>
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8} sm={10}>
              <Stack>
                <RHFTextField name="description" label="Descripción" value={values.description} />
              </Stack>
            </Grid>
          </Grid>
          <Grid container columnSpacing={2} style={{ paddingTop: '25px' }}>
            <Grid item xs={12} sm={4} md={3}>
              <Stack
                direction="row"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <RHFTextField
                  disabled
                  name="req-document"
                  label="Documento de Requisición"
                  value={1}
                />
                <Iconify
                  style={{ width: '50px', color: '#0F8BE3', cursor: 'pointer' }}
                  icon="solar:link-bold"
                  onClick={undefined}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <RHFTextField
                disabled
                name="sys-user"
                label="Usuario de Sistema"
                value="Felipe Vargas"
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <DatePicker
                label="Fecha de Registro"
                format="dd/MM/yyyy"
                value={values.transactionDate}
                onChange={undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
            Contacto
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={4} md={4}>
              <Stack
                direction="row"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <RHFSelect
                  size="small"
                  style={{ width: '100%' }}
                  name="partnerId"
                  label="Proveedor"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                  value={values.partnerId}
                >
                  {providers.map((option: any) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <Iconify
                  style={{ width: '50px', color: '#0F8BE3', cursor: 'pointer' }}
                  icon="tdesign:user-search"
                  onClick={from.onTrue}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <RHFTextField
                disabled
                name="cC_RUC_DNI"
                label="RUC/Cédula"
                value={values.cC_RUC_DNI}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Stack>
                <RHFSelect
                  size="small"
                  style={{ width: '100%' }}
                  name="nodeCityId"
                  label="Ciudad"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                  value={values.nodeCityId}
                >
                  {citiesCatalog.map((option: any) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
            Información del Comprobante
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={4} md={4}>
              <RHFTextField name="sriSerieNumber" label="Serie" value={values.sriSerieNumber} />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <RHFTextField name="referenceNumber" label="Serie" value={values.referenceNumber} />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <DatePicker
                label="Fecha de Comprobante"
                format="dd/MM/yyyy"
                value={values.transactionDate}
                onChange={undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2} style={{ paddingTop: '25px' }}>
            <Grid item xs={12} sm={4} md={6}>
              <RHFTextField
                name="sriAuthorization"
                label="Nro de Autorización"
                value={values.sriAuthorization}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <RHFTextField disabled name="total" label="Total" value={calcTotal()?.toFixed(2)} />
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
            Información Financiera
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={5} md={4}>
              <RHFSelect
                size="small"
                style={{ width: '100%' }}
                name="hasCredit"
                label="Es a Crédito?"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={onChangeCredit}
                value={values.hasCredit}
              >
                <MenuItem value={true as any}>SI</MenuItem>
                <MenuItem value={false as any}>NO</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
              <RHFTextField
                disabled={!values.hasCredit}
                type="number"
                name="daysForCredit"
                label="Plazo de Crédito"
                value={values.daysForCredit}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={5}>
              <DatePicker
                label="Vencimiento de Pago"
                format="dd/MM/yyyy"
                value={values.creditDateLimit}
                onChange={undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                  },
                }}
                sx={{
                  maxWidth: { md: 200 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={8} sm={10}>
              <Stack style={{ paddingTop: '20px' }}>
                <RHFTextField
                  name="nota-pago"
                  label="Nota sobre detalle de Pago"
                  value={values.description}
                />
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
            Recepción de Compra
          </Typography>
          <Grid container columnSpacing={2}>
            <Grid item xs={12} sm={5} md={4}>
              <RHFTextField disabled name="pro-id" label="Sucursal" value={1} />
            </Grid>
            <Grid item xs={12} sm={5} md={6}>
              <RHFTextField
                name="nota-recepcion"
                label="Nota Sobre Recepción de Compra"
                value={1}
              />
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={TABS_OPTIONS[1].value}>
          <PurchaseDetailForm />
          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton
              color="primary"
              size="large"
              variant="outlined"
              loading={loadingSave.value && isSubmitting}
              onClick={handleSaveAsDraft}
            >
              Guardar como Borrador
            </LoadingButton>

            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              loading={loadingSend.value && isSubmitting}
              onClick={handleCreateAndSend}
            >
              {currentPurchase ? 'Modificar' : 'Crear'} & Emitir
            </LoadingButton>
          </Stack>
        </TabPanel>
      </TabContext>
      <ContactListDialog
        title="Contactos"
        open={from.value}
        onClose={from.onFalse}
        selected={(selectedId: string) => values.partnerId.toString() === selectedId}
        onSelect={(partner: IContactResult | null) => onSelect(partner)}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: 'flex-end' }}
          >
            Nuevo
          </Button>
        }
      />
    </FormProvider>
  );
}
