import React from 'react'

import { TextField, InputAdornment } from '@mui/material';

import { IConsulta } from '../types';


type Props = {
    consulta: IConsulta;
    setConsulta: (consulta: IConsulta) => void;
  };

function Step1Form({
    consulta,
    setConsulta
  }: Props)  {

    const onChangeNombre = (e: any) => {
        const newConsulta = { ...consulta };
        newConsulta.name = e.target.value;
        setConsulta(newConsulta);
    }

  return (
    <div style={{display:'flex', justifyContent:'center', alignContent:'center', paddingTop: '15px'}}>
        <TextField
          id="outlined-start-adornment"
          sx={{ width: '100%' }}
          size="small"
          autoFocus
          onChange={onChangeNombre}
          defaultValue={consulta.name}          
          InputProps={{
            startAdornment: <InputAdornment position="start">
               Nombre de la consulta
              </InputAdornment>,
          }}
        />      </div>  
  )
}

export default Step1Form