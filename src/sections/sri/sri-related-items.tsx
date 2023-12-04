import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { Box, Grid, Card, Step, Stack, Paper, Button, Stepper, TextField, StepLabel, Typography, Autocomplete, StepIconProps } from '@mui/material';

import { getItemsPurchasesByNameNotRelated } from 'src/api/catalogs/catalog';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';

import { IItemToCreate } from 'src/types/purchases';
import { ICollectionItem } from 'src/types/transaction';

import SriCreateItemStep1 from './sri-create-item-step1';
import SriCreateItemStep2 from './sri-create-item-step2';
import { useCatalogItemCollection } from './hook/useCatalog';
import { ButtonStyle, ColorlibConnector, ColorlibStepIconRoot } from './styles/sri-style';


type Props = {
  item: IItemToCreate | undefined;
  onClose: VoidFunction;
  setItemTable: VoidFunction;
};

interface ITaxes {
  id: number;
  description: string;
  percentCode: string;
  tax: string;
  taxCode: string;
  percentValue: number;
}

interface ISearchResult {
  id: number;
  barCode: string | null;
  factoryPartnerId: number;
  name: string;
  collectionPath: string;
  taxes: ITaxes[];

  year: number;
}

const itemCollectionInitialState = {
  factoryPartnerId: null,
    vendorDetail: {
      vendorPartnerId: 0,
      productCode: "",
      description: "",
      cC_RUC_DNI: "",
      name: "",
    },
    itemNodeId: "",
    parentId: "",
    itemNodename: "",
	  itemNodePath: "",
    barCode: "",
    name: ""
}


function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Iconify icon="eva:layers-outline" width={24} />,
    2: <Iconify icon="eva:settings-2-outline" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

function SriRelatedItems({ item, onClose, setItemTable }: Props) {
  const settings = useSettingsContext();
  const [valueName, setValueName] = useState<string>('');
  const [itemToCreate, setItemToCreate] = useState<ICollectionItem>(itemCollectionInitialState);

  const [isLinkingItem, setIsLinkingItem] = useState(true);
  const [debouncedValueName, setDebouncedValueName] = useState<string>(valueName);
  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [itemCollection, setItemCollection] = useState([]);

  const queryCollection = useCatalogItemCollection();

  useEffect(() => {
    if (queryCollection.isFetched) {
      setItemCollection(queryCollection.data.data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCollection.data]);


  const handleSearchByName = async (query: string) => {
    const results: ISearchResult[] = await getItemsPurchasesByNameNotRelated(
      query,
      item?.partnerId ?? 1
    );
    setSearchResult(results);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValueName(valueName), 500);

    return () => clearTimeout(timer);
  }, [valueName]);
  // const [loading, setLoading] = useState(false)


  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueName(event.target.value);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  };

  const STEPS = ['Naturaleza del Item', 'Datos Generales'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
   // setConsulta(InitialStateConsulta);
  };


  useEffect(() => {
    const newItemQ:ICollectionItem  = {
      ...itemToCreate,
      vendorDetail: {
        vendorPartnerId: item?.partnerId ?? 0,
        cC_RUC_DNI: item?.cC_RUC_DNI ?? '',
        name: item?.name ?? '',
        productCode: item?.productCode ?? '',
        description: item?.description ?? '',
      },
	  name: item?.description ?? '',
	  barCode: item?.productCode ?? '', 

    };
    setItemToCreate(newItemQ);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  function getStepContent(step: number) {
    switch (step) {
      case 0: 
        return <SriCreateItemStep1 itemCollection ={itemCollection} itemToCreate={itemToCreate} setItemToCreate={setItemToCreate}/>;
      case 1:
        return  <SriCreateItemStep2 itemToCreate={itemToCreate} setItemToCreate={setItemToCreate} />;
      default:
        return 'Unknown step';
    }
  }


  const DocumentSchema = Yup.object().shape({
    cC_RUC_DNI: Yup.string().required('RUC/Cédula  es requerido'),
    name: Yup.string().required('Razón Social  es requerido'),
    itemId: Yup.number(),
    itemName: Yup.string().required('item Name  es requerido'),
    itemBarCode: Yup.string(),
    productCode: Yup.string(),
    description: Yup.string(),
    collectionPath: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      cC_RUC_DNI: item?.cC_RUC_DNI ?? '',
      name: item?.name ?? '',
      itemId: item?.itemId,
      itemName: '',
      itemBarCode: item?.itemBarCode ?? '',
      productCode: item?.productCode ?? '',
      description: item?.description ?? 'Sin Descripción',
      collectionPath: '',
    }),
    [item]
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

  useEffect(() => {
    if (debouncedValueName) {
      handleSearchByName(debouncedValueName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValueName]);



  const changeAutoComplete = (event: any, value: ISearchResult) => {
    setValue('collectionPath', value.collectionPath);
    setValue('itemName', value.name);
    setValue('itemBarCode', value.barCode ?? '');
    setValue('itemId', value.id);
  };

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //  reset();
      // enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      if (item) {
        item.itemId = values.itemId ?? 0;
        item.itemName = values.itemName;
        item.itemBarCode = values.itemBarCode ?? '';
      }
      console.log('setItemToRelated');
      setItemTable();
      onClose();
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
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '15px' }}
    >
      <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
        {!item ? 'Create Product' : 'Relacionar'}
      </LoadingButton>
    </Grid>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid
        xs={12}
        md={8}
        style={{
          display: 'flex' ,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingTop: '15px',
        }}
      >
        <Button
          variant="contained"
          startIcon={isLinkingItem ?  <Iconify icon="mingcute:add-line" /> : <Iconify icon="mingcute:align-arrow-left-line" />}
          color="primary"
          onClick={() => setIsLinkingItem(!isLinkingItem)}
        >
          {isLinkingItem ? 'Crear Nuevo Item' : 'Regresar'}
        </Button>
      </Grid>
      {isLinkingItem ? (
        <>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid item md={12}>
                <Stack sx={{ width: 1 }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    Información de Contacto:
                  </Typography>
                </Stack>
                <Card>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                    <RHFTextField disabled name="cC_RUC_DNI" label="RUC/Cédula" />
                    <RHFTextField disabled name="name" label="Razón Social" value={values.name} />
                  </Stack>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                    <RHFTextField disabled name="productCode" label="Código Consultado" />
                    <RHFTextField disabled name="description" label="Descripción Consultado" />
                  </Stack>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                    <div style={{ width: '100%' }}>
                      <Autocomplete
                        id="free-solo-2-demo"
                        disableClearable
                        onChange={changeAutoComplete} // prints the selected value
                        getOptionLabel={(option) => option.name}
                        options={searchResult}
                        autoHighlight
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <Stack>
                              <Typography>BarCode: {option.barCode}</Typography>
                              <Typography>Descripción: {option.name}</Typography>
                              <Typography>{option.collectionPath}</Typography>
                            </Stack>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Buscar Items"
                            onChange={handleChangeName}
                            InputProps={{
                              ...params.InputProps,
                              type: 'search',
                              endAdornment: <Iconify icon="mdi:feature-search-outline" />,
                            }}
                          />
                        )}
                      />
                    </div>
                  </Stack>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                    <RHFTextField disabled name="itemBarCode" label="Código Interno" />
                    <RHFTextField disabled name="itemName" label="Descripción Interno" />
                  </Stack>
                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 1 }}>
                    <RHFTextField disabled name="collectionPath" label="Path" />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
            {renderActions}
          </FormProvider>
          <Grid container style={{ marginTop: '30px' }}>
            <Grid item>
              <Stack spacing={2} sx={{ width: 300 }} />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === STEPS.length ? (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
          >
            <Typography sx={{ my: 1 }}>Completado el creación de Item</Typography>
          </Paper>

          <ButtonStyle onClick={handleReset} sx={{ mr: 1 }}>
            Reset
          </ButtonStyle>
        </>
      ) : (
        <>
          <div style={{ minHeight: '200px' }}>
            {getStepContent(activeStep)}
          </div>

          <Box sx={{ textAlign: 'right' }}>
            <ButtonStyle disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Regresar
            </ButtonStyle>
            <ButtonStyle variant="contained" disabled={itemToCreate.itemNodePath.length === 0} onClick={handleNext} sx={{ mr: 1 }}>
              {activeStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
            </ButtonStyle>
          </Box>
        </>
      )}
        </>
      )}
    </Container>
  );
}

export default SriRelatedItems;
