import { useState } from 'react';

import Container from '@mui/material/Container';
import { Menu, Button, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import ContactInfo from '../contact-info';
import ContactList from '../contact-list';

// ----------------------------------------------------------------------

export default function ContactView() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container style={{ maxWidth: '1400px', backgroundColor: '#EDF1F6' }}>
      <CustomBreadcrumbs
        heading="Lista de Contactos"
        links={[
          {
            name: 'Relación Comercial',
            href: paths.dashboard.contact.root,
          },
          {
            name: 'Contactos',
            href: paths.dashboard.contact.root,
          },
        ]}
        action={
          <>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              variant="contained"
              color="primary"
              aria-expanded={open ? 'true' : undefined}
              startIcon={<Iconify icon="bxs:contact" />}
              onClick={handleClick}
            >
              Nuevo Contacto
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.contact.person}
                  color="inherit"
                  sx={{
                    alignItems: 'center',
                    typography: 'caption',
                    display: 'inline-flex',
                    alignSelf: 'flex-end',
                    fontWeight: 'fontWeightBold',
                    textDecoration: 'none',
                  }}
                >
                  <Iconify
                    style={{ color: '#06A9F1', marginRight: '10px' }}
                    icon="teenyicons:user-square-solid"
                  />
                  Persona
                </Button>
              </MenuItem>
              <MenuItem onClick={handleClose}>
              <Button
                  component={RouterLink}
                  href={paths.dashboard.purchase.new}
                  color="inherit"
                  sx={{
                    alignItems: 'center',
                    typography: 'caption',
                    display: 'inline-flex',
                    alignSelf: 'flex-end',
                    fontWeight: 'fontWeightBold',
                    textDecoration: 'none',
                  }}
                >
                  <Iconify
                    style={{ color: '#06A9F1', marginRight: '10px' }}
                    icon="carbon:enterprise"
                    />
                  Empresa
                </Button>
              </MenuItem>
            </Menu>
          </>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ContactInfo />
      <ContactList />
    </Container>
  );
}
