import { useSnackbar } from 'notistack';
import { useRef, useState } from 'react';

import { Grid, Button, TextField, Typography, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { IConsulta, IItemConsulta } from '../types';
import textImage from '../../../assets/images/texto.png';
import uploadImage from '../../../assets/images/upload.png';
import { ButtonStyle, DivGridStyle } from '../styles/sri-style';

type Props = {
  consulta: IConsulta;
  setConsulta: (consulta: IConsulta) => void;
};

function Step2Form({ consulta, setConsulta }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const [text, setText] = useState<string>("");

  const [key, setKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTextFromDialog = () => {
    extractNumbers(text);
    setText("");
    confirm.onFalse();
  };

  const extractNumbers = (textToExtract:string) => {
    const regex = /\b\d{49}\b/g;
    const matches:string[] = textToExtract.match(regex) ?? [];
    const uniqueMatches = Array.from(matches);
    const arregloSinRepetidos: string[] = uniqueMatches.filter(
      (valor, indice, arreglo) => arreglo.indexOf(valor) === indice
    );
    const gridContent :IItemConsulta[] = arregloSinRepetidos.map((ak, index) => {
       const comprobante = `${ak.substr(24,3)}-${ak.substr(27,3)}-${ak.substr(30,9)}`
      return {
        id: index+1,
        selected: false,
        accessKey: ak,
        razonSocial:'',
        comprobante,
        total: '',
      };
    });
    if (gridContent.length > 0) {
      const newConsulta = { ...consulta };
      newConsulta.items = gridContent;
      setConsulta(newConsulta);
      enqueueSnackbar(`Carga Exitosa! Se han cargado ${gridContent.length} documentos!`, {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`Error en Estructura de Archivo!`, {
        variant: 'warning',
      });
    }
  };

  const readFileAsync = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) {
          const content = e.target.result as string;
          resolve(content);
        }
      };

      reader.onerror = (e) => reject(e);

      reader.readAsText(file);
    });

  const onFileLoad = (content: string) => {

    const gridContent: IItemConsulta[] = [];
    const lines = content.split('\n');
    let lineId = 1;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines.length; i++) {
      const words = lines[i].split('	');
      if (i > 0 && words[9]) {
        gridContent.push({
          id: lineId,
          selected: false,
          accessKey: words[9],
          razonSocial: words[3],
          comprobante: words[1],
          total: Number(words[11]),
        });
        lineId += 1;
      }
    }
    if (gridContent.length > 0) {
      const newConsulta = { ...consulta };
      newConsulta.items = gridContent;
      setConsulta(newConsulta);
      setKey(key + 1);
      enqueueSnackbar(`Carga Exitosa! Se han cargado ${gridContent.length} documentos!`, {
        variant: 'success',
      });
    } else {
      enqueueSnackbar(`Error en Estructura de Archivo!`, {
        variant: 'warning',
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const content = await readFileAsync(file);
        onFileLoad(content);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    }
  };

  const onChangeNombre = (e: any) => {
    const newConsulta = { ...consulta };
    newConsulta.name = e.target.value;
    setConsulta(newConsulta);
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: '15px',
        paddingBottom: '15px',
        flexDirection: 'column',
      }}
    >
      <div>
        {' '}
        <TextField
          id="outlined-start-adornment"
          sx={{ width: '100%', height: '50px' }}
          size="small"
          autoFocus
          defaultValue={consulta.name}
          onChange={onChangeNombre}
          InputProps={{
            startAdornment: <InputAdornment position="start">Nombre de la consulta</InputAdornment>,
          }}
        />{' '}
      </div>
      <Grid container style={{ paddingLeft: '25px', paddingRight: '25px' }}>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
        >
          <DivGridStyle>
            <img
              src={`${textImage}`}
              width={75}
              style={{ marginBottom: '15px' }}
              alt="textImage"
              loading="lazy"
            />
            <Typography style={{ fontSize: '12px', paddingBottom: '5px', lineHeight: '1.5' }}>
              Copiar las claves de acceso en el <b>Reporte de Compras</b> del portal del Servicio de
              Rentas Internas (SRI) y pegar directamente
            </Typography>

            <ButtonStyle onClick={() => confirm.onTrue()}>Insertar Texto</ButtonStyle>
          </DivGridStyle>
          <DivGridStyle>
            <img
              src={`${uploadImage}`}
              width={75}
              style={{ marginBottom: '15px' }}
              alt="uploadImage"
              loading="lazy"
            />
            <Typography style={{ fontSize: '12px', paddingBottom: '5px', lineHeight: '1.5' }}>
              Subir <b>Reporte de Compras</b> Obtenido en el Portal del Servicio de Rentas Internas
              (SRI)
            </Typography>
            <ButtonStyle onClick={handleButtonClick}>Cargar Archivo</ButtonStyle>
            <div key={key}>
              <input
                type="file"
                ref={fileInputRef}
                accept=".txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </DivGridStyle>
        </Grid>
      </Grid>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Claves Texto SRI"
        content={
          <>
          <Typography style={{fontSize:'14px'}}>Pegue el texto a procesar</Typography>
          <TextField 
          id="key-sri-text"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
          </>
        }
        action={
          <Button
            variant="contained"
            color='primary'
            onClick={() => {
              // handleDeleteRows();
              handleTextFromDialog();
            }}
          >
            Procesar
          </Button>
        }
      />
    </div>
  );
}

export default Step2Form;
