import * as Yup from 'yup';

// ----------------------------------------------------------------------

import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, MenuItem, TextField, Typography, Autocomplete } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useMutationCreateContact, useMutationUpdateContact } from 'src/hooks/use-contact';
import { useIdentityDocumentType, useCatalogCitiesCollectionByName } from 'src/hooks/use-catalog';

import FormProvider, { RHFSelect, RHFCheckbox, RHFTextField } from 'src/components/hook-form';

import { IContactPerson } from 'src/types/contact';

type Props = {
  currentContact?: IContactPerson;
};

const emptyPerson: IContactPerson = {
    id: 0,
    identityDocumentTypeId: '0',
    name: '0',
    cC_RUC_DNI: '0',
    cityId: '0',
    address: '0',
    movilPhone: '0',
    phone: '0',
    emailBilling: '0',
    dateOfBirth: '0',
    isPerson: false,
    isActive: false,
    priceList: '0',
    created: '0',
    parentContactId: 0,
    c_oficina: '0',
    c_cargo: '0',
    emailCompany: '0',
    esFabricante: false,
    c_proveedor_servicios: false,
    c_proveedor_mercaderia: false,
    c_distribuidor: false,
    phone2: '',
    phone3: '',
    canHasCredit: false,
    creditAmount: 0,
    daysOfCredit: 0,
    additionalInformation: ''
  }


export default function ContacNewPerson({ currentContact }: Props) {
  const loadingSave = useBoolean();
  const queryTypeDocument = useIdentityDocumentType();
  const [documentsType, setDocumentsType] = useState([]);

  const [cityValue, setCityValue] = useState('');
  const [contact, setContact] = useState<IContactPerson>(emptyPerson);
  const [codeCity, setCodeCity] = useState('c05010101');
  const [debouncedCityValue, setDebouncedCityValue] = useState<string>(cityValue);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  console.log('codeCity',codeCity, contact)
  const createContactMutation = useMutationCreateContact(
    contact
  );
  const updateContactMutation = useMutationUpdateContact(
    contact?.id.toString() ?? '0',
    contact
  );
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCityValue(cityValue), 500);

    return () => clearTimeout(timer);
  }, [cityValue]);

  const queryCities = useCatalogCitiesCollectionByName(debouncedCityValue);

  useEffect(() => {
    if (queryCities.isFetched) {
      setCitiesList(
        queryCities.data.data
          .sort()
          .map((sector: any) => ({ id: sector.id, name: sector.name, parentId: sector.parentId }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCities.data]);

  const NewContactSchema = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required('Nombre es requerido'),
    cC_RUC_DNI: Yup.string().required('Cédula RUC es requerido'),
    identityDocumentTypeId: Yup.string().required('Tipo de Documento es requerido'),
    cityId: Yup.string().required('Ciudad es requerida'),
    address: Yup.string().required('Dirección es requerida'),
    movilPhone: Yup.string(),
    phone: Yup.string(),
    emailBilling: Yup.string().nullable(),
    dateOfBirth: Yup.mixed<any>(),
    isPerson: Yup.boolean(),
    isActive: Yup.boolean(),
    priceList: Yup.string(),
    created: Yup.mixed<any>(),
    parentContactId: Yup.number(),
    c_oficina: Yup.string(),
    c_cargo: Yup.string(),
    emailCompany: Yup.string(),
    esFabricante: Yup.boolean(),
    c_proveedor_servicios: Yup.boolean(),
    c_proveedor_mercaderia: Yup.boolean(),
    c_distribuidor: Yup.boolean(),
    phone2: Yup.string().nullable(),
    phone3: Yup.string().nullable(),
    canHasCredit: Yup.boolean(),
    creditAmount: Yup.number(),
    daysOfCredit: Yup.number(),
    additionalInformation: Yup.string(),

  });
  const defaultValues = useMemo(
    () => ({
      id: currentContact?.id ?? 0,
      name: currentContact?.name ?? '',
      cC_RUC_DNI: currentContact?.cC_RUC_DNI ?? '',
      identityDocumentTypeId: currentContact?.identityDocumentTypeId ?? '05',
      cityId: currentContact?.cityId ?? 'c05010101',
      address: currentContact?.address ?? '',
      movilPhone: currentContact?.movilPhone ?? '',
      phone: currentContact?.phone ?? '',
      emailBilling: currentContact?.emailBilling ?? '',
      dateOfBirth: currentContact?.dateOfBirth
      ? new Date(currentContact.dateOfBirth)
      : new Date(),
      isPerson: currentContact?.isPerson ?? true,
      isActive: currentContact?.isActive ?? true,
      priceList: currentContact?.priceList ?? '',
      created: currentContact?.created
      ? new Date(currentContact.created)
      : new Date(),
      parentContactId: currentContact?.parentContactId ?? 0,
      c_oficina: currentContact?.c_oficina ?? '',
      c_cargo: currentContact?.c_cargo ?? '',
      emailCompany: currentContact?.emailCompany ?? '',
      esFabricante: currentContact?.esFabricante ?? false,
      c_proveedor_servicios: currentContact?.c_proveedor_servicios ?? false,
      c_proveedor_mercaderia: currentContact?.c_proveedor_mercaderia ?? false,
      c_distribuidor: currentContact?.c_distribuidor ?? false,
      phone2: currentContact?.phone2 ?? '',
      phone3: currentContact?.phone3 ?? '',
      canHasCredit: currentContact?.canHasCredit ?? false,
      creditAmount: currentContact?.creditAmount ?? 0,
      daysOfCredit: currentContact?.daysOfCredit ?? 0,
      additionalInformation: currentContact?.additionalInformation ?? '',
    }),
    [currentContact]
  );

  const methods = useForm({
    resolver: yupResolver(NewContactSchema),
    defaultValues,
  });

  const {
    reset,
    //  clearErrors,
    watch,
    //  trigger,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentContact) {
      setValue('id', currentContact.id);
      setValue('name', currentContact.name);
      setValue('identityDocumentTypeId', currentContact.identityDocumentTypeId);
      setValue('address', currentContact.address);
      setValue('cC_RUC_DNI', currentContact.cC_RUC_DNI);
      setValue('cityId', currentContact.cityId);
      setValue('movilPhone', currentContact.movilPhone);
      setValue('isPerson', currentContact.isPerson);
      setValue('isActive', currentContact.isActive);
      setValue('dateOfBirth', new Date(currentContact.dateOfBirth ?? new Date()));
      setValue('emailBilling', currentContact.emailBilling);
      setValue('phone2', currentContact.phone2);
      setValue('phone3', currentContact.phone3);
      setValue('emailCompany', currentContact.emailCompany);
      setValue('esFabricante', currentContact.esFabricante);
      setValue('c_proveedor_servicios', currentContact.c_proveedor_servicios);
      setValue('c_proveedor_mercaderia', currentContact.c_proveedor_mercaderia);
      setValue('c_distribuidor', currentContact.c_distribuidor);
      setValue('canHasCredit', currentContact.canHasCredit);
      setValue('creditAmount', currentContact.creditAmount);
      setValue('daysOfCredit', currentContact.daysOfCredit);
      setValue('created', new Date(currentContact.created ?? new Date()));
      setValue('additionalInformation', currentContact.additionalInformation);
      
      
      // setValue('created', currentContact.created);
      
      // trigger()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContact]);

  useEffect(() => {
    if(createContactMutation.isSuccess){ 
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.contact.root);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createContactMutation])

  useEffect(() => {
    if(updateContactMutation.isSuccess){ 
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.contact.root);

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateContactMutation])
  

  useEffect(() => {
    if (queryTypeDocument.isFetched) {
      setDocumentsType(queryTypeDocument.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTypeDocument.data]);

  const handleSaveContact = handleSubmit(async (data: any) => {

    loadingSave.onTrue();
    try {
      console.info('DATA', JSON.stringify(data, null, 2));
      console.info('values', JSON.stringify(data, null, 2),router,  );
      const contactRegister  = {
        "id": data.id,
        "name": data.name,
        "cC_RUC_DNI": data.cC_RUC_DNI,
        "identityDocumentTypeId": data.identityDocumentTypeId,
        "cityId": data.cityId,
        "address": data.address,
        "movilPhone": data.movilPhone,
        "phone": data.phone,
        "emailBilling": data.emailBilling,
        "dateOfBirth": data.dateOfBirth,
        "isPerson": data.isPerson,
        "isActive": data.isActive,
        "priceList": data.priceList,
        "created": data.created,
        "parentContactId": data.parentContactId,
        "c_oficina": data.c_oficina,
        "c_cargo": data.c_cargo,
        "emailCompany": data.emailCompany,
        "esFabricante": data.esFabricante,
        "c_proveedor_servicios": data.c_proveedor_servicios,
        "c_proveedor_mercaderia": data.c_proveedor_mercaderia,
        "c_distribuidor": data.c_distribuidor ,
        "phone2": data.phone2 ,
        "phone3": data.phone3 ,
        "canHasCredit": data.canHasCredit ,
        "creditAmount": data.creditAmount ,
        "daysOfCredit": data.daysOfCredit ,
        "additionalInformation": data.additionalInformation,
        "sectorId":   ""
      }
      setContact(contactRegister);
      if(contactRegister.id === 0){
        createContactMutation.mutate();
      }else{
        updateContactMutation.mutate(
          contactRegister.id
        );
      }
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }


   // createContactMutation.mutate(contact);
   // router.push(paths.dashboard.contact.root);

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
  useEffect(() => {
    setCityValue('QUITO');
    setCitiesList([{ id: 'c05010101', name: 'QUITO', parentId: 'c0501' }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card style={{ margin: '15px' }}>
      <FormProvider methods={methods}>
        <Typography
          style={{
            paddingBottom: '10px',
            margin: '15px',
            fontSize: '16px',
            lineHeight: '28px',
            color: '#919EAB',
          }}
        >
          Datos Generales
        </Typography>
        <Grid style={{ margin: '15px' }} container columnSpacing={2}>
          <Grid item xs={12} sm={5} md={2}>
            <Stack>
              <RHFTextField disabled name="id" label="Código" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <Stack>
              <RHFTextField name="name" label="Nombre o Razón Social" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <Stack>
              <RHFSelect
                size="small"
                style={{ width: '100%' }}
                name="identityDocumentTypeId"
                label="Tipo de Identificación"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                value={values.identityDocumentTypeId}
              >
                {documentsType.map((option: any) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.description}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <Stack>
              <RHFTextField name="cC_RUC_DNI" label="Número de Identificación" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} style={{ paddingTop: '15px' }}>
            <Stack>
              <Autocomplete
                disablePortal
                id="cityId"
                size="small"
                onChange={(event, newVal) => setCodeCity(newVal.id)}
                getOptionLabel={(option) => option.name}
                options={citiesList}
                groupBy={(option) => option.parentId}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    {option.id} {'->'} {option.name}
                  </Box>
                )}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ubicación"
                    name="ubicacion"
                    value={cityValue}
                    onChange={(e: any) => setCityValue(e.target.value)}
                  />
                )}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={8} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="address" label="Dirección" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="movilPhone" label="Celular" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="phone" label="Teléfono Fijo" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={4} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="emailBilling" label="Email Facturación" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} style={{ paddingTop: '15px' }}>
            <Stack>
              <DatePicker
                label="Fecha de Nacimiento"
                format="dd/MM/yyyy"
                value={values.dateOfBirth}
                // onChange={handleFilterPurchaseDate}
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
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="isPerson" disabled label="Es Persona?" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="isActive" label="Contacto Activo" checked={values.isActive} />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={4} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="priceList" label="Lista de Precios en Venta" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <DatePicker
                label="Fecha de Registro"
                format="dd/MM/yyyy"
                disabled
                value={values.created}
                // onChange={handleFilterPurchaseDate}
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
            </Stack>
          </Grid>
        </Grid>
        <Typography
          style={{
            paddingBottom: '10px',
            margin: '15px',
            fontSize: '16px',
            lineHeight: '28px',
            color: '#919EAB',
          }}
        >
          Datos Corporativos
        </Typography>
        <Grid style={{ margin: '15px' }} container columnSpacing={2}>
          <Grid item xs={12} sm={5} md={4}>
            <Stack>
              <RHFTextField name="parentContactId" label="Empresa para la que Trabaja" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={4} >
            <Stack>
              <RHFTextField name="c_cargo" label="Posición/Cargo en la Empresa" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} >
            <Stack>
              <RHFTextField name="c_oficina" label="Departamento/Oficina" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="emailCompany" label="Correo Electrónico Empresarial" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="phone2" label="Celular/Teléfono 1" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField name="phone3" label="Celular/Teléfono 2" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="esFabricante" label="¿Es Fabricante?" />
            </Stack>
            </Grid>

            <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="c_proveedor_servicios" label="¿Es Proveedor de Servicios?" />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="c_proveedor_mercaderia" label="¿Es Mayorista?" />
            </Stack>
          </Grid>

          <Grid item xs={12} sm={5} md={2} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFCheckbox name="c_distribuidor" label="¿Es Subdistribuidor?" />
            </Stack>
          </Grid>                
        </Grid>
        <Typography
          style={{
            paddingBottom: '10px',
            margin: '15px',
            fontSize: '16px',
            lineHeight: '28px',
            color: '#919EAB',
          }}
        >
          Políticas de Crédito en Venta
        </Typography>
        <Grid style={{ margin: '15px' }} container columnSpacing={2}>
        <Grid item xs={12} sm={5} md={3} >
            <Stack>
              <RHFCheckbox name="canHasCredit" label="¿Habilitado para Crédito?" />
            </Stack>
          </Grid>   
          <Grid item xs={12} sm={5} md={3} >
            <Stack>
              <RHFTextField type='number' name="creditAmount" label="Límite de Crédito" />
            </Stack>
          </Grid>       
          <Grid item xs={12} sm={5} md={3} >
            <Stack>
              <RHFTextField type='number' name="daysOfCredit" label="Plazo Máximo" />
            </Stack>
          </Grid>  
          <Grid item xs={12} sm={5} md={10} style={{ paddingTop: '15px' }}>
            <Stack>
              <RHFTextField multiline rows={3} name="additionalInformation" label="Notas  Generales sobre Políticas de Crédito en Compra/Venta" />
            </Stack>
          </Grid>
        </Grid>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mr: 3, mb: 2 }}>
          <LoadingButton
            color="primary"
            variant="contained"
            loading={loadingSave.value && isSubmitting}
            onClick={handleSaveContact}
          >
            Guardar
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
