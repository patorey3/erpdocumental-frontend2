import { useState, useEffect } from 'react';

import { Stack } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import { Box, Card, Grid, MenuItem, Typography } from '@mui/material';

import { useEnterpriseInfo } from 'src/hooks/use-contact';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';

interface IContactInfo {
  id: number;
  name: string;
  cC_RUC_DNI: string;
  isPerson: string;
  sector: string;
  phone: string;
  email: string;
  accountId: string;
  c_imagen: string;
  employees: any[];
}

const enterpriseDefault: IContactInfo = {
  id: 0,
  name: '',
  cC_RUC_DNI: '',
  isPerson: '',
  sector: '',
  phone: '',
  email: '',
  accountId: '',
  c_imagen: '',
  employees: [],
};

export default function ContactInfo() {
  const [enterprise, setEnterprise] = useState<IContactInfo>(enterpriseDefault);
  const popover = usePopover();

  const queryEnterprise = useEnterpriseInfo('1');
  useEffect(() => {
    if (queryEnterprise.isFetched) {
      console.log('queryEnterprise', queryEnterprise.data);
      setEnterprise({
        id: queryEnterprise.data.id,
        name: queryEnterprise.data.name,
        cC_RUC_DNI: queryEnterprise.data.cC_RUC_DNI,
        isPerson: queryEnterprise.data.isPerson,
        sector: queryEnterprise.data.sector.name,
        phone: queryEnterprise.data.phone,
        email: queryEnterprise.data.email,
        accountId: queryEnterprise.data.accountId,
        c_imagen: queryEnterprise.data.c_imagen,
        employees: queryEnterprise.data.employees,
      });
      console.log('enterprise', enterprise);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryEnterprise.data]);

  return (
    <Card
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        padding: '5px',
      }}
    >
      <Grid container style={{ width: '100%'}}>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Box
            component="img"
            alt="empty content"
            src={`data:image/png;base64, ${enterprise.c_imagen}`}
            sx={{ width: 1, maxWidth: 130, height: 84, maxHeight: 84 }}
          />
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >          
        <Stack>
            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{enterprise.name}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{enterprise.cC_RUC_DNI}</Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >          
                  <Label variant="soft" color={enterprise.isPerson ? 'default' : 'info'}>
            {enterprise.isPerson ? 'Persona' : 'Empresa'}
          </Label>
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >          
                    <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{enterprise.employees ? `${enterprise.employees.length} Contactos` : '0 Contactos'}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >          
                            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{enterprise.sector}</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >          <Stack direction="row">
                      <Stack>

            <Typography sx={{ fontSize: '14px', color:'#212B36', lineHeight:'22px', fontWeight: '400' }}>{enterprise.email}</Typography>
            <Typography sx={{ fontSize: '14px', color: '#919EAB', lineHeight:'22px', fontWeight: '400' }}>{enterprise.phone}</Typography>
            </Stack>
            <Stack>
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            // onEditRow(row.id.toString());
            popover.onClose();
          }}
          sx={{ color: '#1EAAE7' }}
        >
          <Iconify icon="ci:note-edit" />
          Editar Contacto
        </MenuItem>
      </CustomPopover>
    </Card>
  );
}
