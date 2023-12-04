import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Grid, Stack, Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';

import { ICollectionItem } from 'src/types/transaction';

type Props = {
  itemToCreate: ICollectionItem;
  setItemToCreate: (item: ICollectionItem) => void;
};

function SriCreateItemStep2({ itemToCreate, setItemToCreate }: Props) {
  const settings = useSettingsContext();
  const DocumentSchema = Yup.object().shape({
    cC_RUC_DNI: Yup.string().required('RUC/Cédula  es requerido'),
    name: Yup.string().required('Razón Social  es requerido'),
    itemNodePath: Yup.string().required('Path  es requerido'),
    barCode: Yup.string().required('BarCode es requerido'),
    barCodeAlt: Yup.string(),
    unidad: Yup.string(),
    impuesto: Yup.string(),
    perecedero: Yup.boolean(),
    description: Yup.string().required('Descripción es requerido'),
  });
  const defaultValues = useMemo(
    () => ({
      cC_RUC_DNI: itemToCreate?.vendorDetail.cC_RUC_DNI ?? '',
      name: itemToCreate?.vendorDetail.name ?? '',
      itemNodePath: itemToCreate?.itemNodePath ?? '',
      barCode: itemToCreate?.barCode ?? '',
      barCodeAlt: '',
      unidad: '',
      impuesto: '',
      perecedero: false,
      description: itemToCreate?.name,
    }),
    [itemToCreate]
  );
  const methods = useForm({
    resolver: yupResolver(DocumentSchema),
    defaultValues,
  });
  const {
    // reset,
    watch,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //  reset();
      // enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      //   if (item) {
      //     item.itemId = values.itemId ?? 0;
      //     item.itemName = values.itemName;
      //     item.itemBarCode = values.itemBarCode ?? '';
      //   }
      //   console.log('setItemToRelated');
      //   setItemTable();
      //   onClose();
      //  setValue('sriSerieNumber', values.sriSerieNumber);
    } catch (error) {
      // enqueueSnackbar(error);
      console.error(error);
    }
  });

  const renderActions = (
    <Grid
      xs={12}
      md={8}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: '15px',
        paddingBottom: '15px',
      }}
    >
      <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
        {!itemToCreate ? 'Create Product' : 'Crear Item'}
      </LoadingButton>
    </Grid>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField disabled name="cC_RUC_DNI" label="RUC/Cédula" />
              <RHFTextField disabled name="name" label="Razón Social" value={values.name} />
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField disabled name="itemNodePath" label="Naturaleza Documental" />
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField name="barCode" label="Barcode" />
              <RHFTextField name="barCodeAlt" label="Código Alternativo" />
              <RHFTextField name="impuesto" label="Impuesto" />
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField name="unidad" label="Unidad de Almacenamiento" />
              <RHFCheckbox
                style={{ fontSize: '12px' }}
                checked
                name="perecedero"
                label="El Producto es Perecedero?"
              />
            </Stack>
          </Grid>
          <Grid item md={12}>
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <RHFTextField name="description" multiline rows={3} label="Descripción del Item" />
            </Stack>
          </Grid>
        </Grid>
        {renderActions}
      </FormProvider>
    </Container>
  );
}

export default SriCreateItemStep2;
