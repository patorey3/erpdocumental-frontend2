import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import { alpha } from '@mui/material/styles';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepIconProps } from '@mui/material/StepIcon';

import { sridocument } from 'src/api/sri/sri';

import Iconify from 'src/components/iconify';

import Step1Form from './step1-form';
import Step2Form from './step2-form';
import Step3Form from './step3-form';
import { IConsulta, IItemConsulta } from '../types';
import { ButtonStyle, ColorlibConnector, ColorlibStepIconRoot } from '../styles/sri-style';

// ----------------------------------------------------------------------

const STEPS = ['Nombrar Consulta', 'Cargar Archivo', 'Validar Comprobantes'];

const InitialStateConsulta: IConsulta = {
  name: '',
  items: [],
};

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Iconify icon="eva:edit-outline" width={24} />,
    2: <Iconify icon="eva:cloud-upload-outline" width={24} />,
    3: <Iconify icon="eva:checkmark-square-fill" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

function getStepContent(step: number, consulta: IConsulta, setConsulta: any) {
  switch (step) {
    case 0:
      return <Step1Form consulta={consulta} setConsulta={setConsulta} />;
    case 1:
      return <Step2Form consulta={consulta} setConsulta={setConsulta} />;
    case 2:
      return <Step3Form consulta={consulta} setConsulta={setConsulta} />;
    default:
      return 'Unknown step';
  }
}

export default function SriConsultNewForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [consulta, setConsulta] = useState<IConsulta>(InitialStateConsulta);
  const onMessage = (
    type: 'default' | 'error' | 'success' | 'info' | 'warning' | undefined,
    message: string
  ) => {
    enqueueSnackbar(message, {
      variant: type,
    });
  };
  const queryClient = useQueryClient();

  const createProcessSRI = async () => {
    const akList = consulta.items.filter((kl) => kl.selected).map((itemkey) => itemkey.accessKey);
    const result = await sridocument.createSriProcess({
      description: consulta.name,
      accessKeys: akList,
    });
    return result.data.succeced;
  };

  const hasSelected = (items: IItemConsulta[]): boolean => {
    const indexSelected = items.findIndex((item) => item.selected === true);
    return indexSelected >= 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && consulta.name.length === 0) {
      enqueueSnackbar(`Debe proporcionar nombre a la consulta!`, {
        variant: 'warning',
      });
      return;
    }
    if (activeStep === 1 && (consulta.items.length === 0 || consulta.name.length === 0)) {
      enqueueSnackbar(`No se ha cargado ningún documento o no tiene nombre la consulta!`, {
        variant: 'warning',
      });
      return;
    }
    if (activeStep === 2 && !hasSelected(consulta.items)) {
      enqueueSnackbar(`Se debe seleccionar almenos un documento!`, {
        variant: 'warning',
      });
      return;
    }
    if (activeStep === 2 && hasSelected(consulta.items)) {
      createProcessSRI()
        .then((value) => {
          if (value) {
            onMessage('success', 'Proceso creado satisfactoriamente');
            queryClient.invalidateQueries({ queryKey: ['job-transactions-list'] });
          } else {
            onMessage('warning', 'Error en la creación del Proceso');
          }
        })
        .catch((err) => {
          onMessage('warning', err);
        });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    console.log('activeStep', consulta);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setConsulta(InitialStateConsulta);
  };
  return (
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
            <Typography sx={{ my: 1 }}>Completado el proceso de carga de documentos</Typography>
          </Paper>

          <ButtonStyle onClick={handleReset} sx={{ mr: 1 }}>
            Reset
          </ButtonStyle>
        </>
      ) : (
        <>
          <div style={{ minHeight: '200px' }}>
            {getStepContent(activeStep, consulta, setConsulta)}
          </div>

          <Box sx={{ textAlign: 'right' }}>
            <ButtonStyle disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Regresar
            </ButtonStyle>
            <ButtonStyle variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
              {activeStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
            </ButtonStyle>
          </Box>
        </>
      )}
    </>
  );
}
