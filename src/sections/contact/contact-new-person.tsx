import * as Yup from 'yup';

// ----------------------------------------------------------------------

import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, MenuItem } from '@mui/material';

import { useIdentityDocumentType } from 'src/hooks/use-catalog';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// type CountryData = {
//   latlng: number[];
//   address: string;
//   phoneNumber: string;
// };

interface IContact {
  id: number;
  identityDocumentTypeId: string;
  name: string;
  cC_RUC_DNI: string;
}

type Props = {
  currentContact?: IContact;
};

export default function ContacNewPerson({ currentContact }: Props) {
  const queryTypeDocument = useIdentityDocumentType();
  const [documentsType, setDocumentsType] = useState([]);

  const NewContactSchema = Yup.object().shape({
    id: Yup.number(),
    name: Yup.string().required('Nombre es requerido'),
    cC_RUC_DNI: Yup.string().required('Cédula RUC es requerido'),
    identityDocumentTypeId: Yup.string().required('Tipo de Documento es requerido'),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentContact?.id ?? 0,
      name: currentContact?.name ?? '',
      cC_RUC_DNI: currentContact?.cC_RUC_DNI ?? '',
      identityDocumentTypeId: currentContact?.identityDocumentTypeId ?? '05',
    }),
    [currentContact]
  );

  const methods = useForm({
    resolver: yupResolver(NewContactSchema),
    defaultValues,
  });

  const {
    //  reset,
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

      // trigger()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContact]);

  useEffect(() => {
    if (queryTypeDocument.isFetched) {
      setDocumentsType(queryTypeDocument.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTypeDocument.data]);
  console.log('Values', values);

  const handleSaveContact = handleSubmit(async (data) => {
    // console.info('DATA', JSON.stringify(data, null, 2));
    console.info('values', JSON.stringify(values, null, 2));

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

  return (
    <Card style={{ margin: '15px' }}>
      <FormProvider methods={methods}>
        <Grid style={{ margin: '15px' }} container columnSpacing={2}>
          <Grid item xs={12} sm={5} md={2}>
            <Stack>
              <RHFTextField disabled name="id" label="Código" />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5} md={3}>
            <Stack>
              <RHFTextField  name="name" label="Nombre o Razón Social" />
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
              <RHFTextField  name="cC_RUC_DNI" label="Número de Identificación" />
            </Stack>
          </Grid>
        </Grid>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton
            color="primary"
            size="large"
            variant="outlined"
            loading={isSubmitting}
            onClick={handleSaveContact}
          >
            Guardar
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
