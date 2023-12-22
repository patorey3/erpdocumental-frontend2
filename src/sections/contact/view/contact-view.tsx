import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import ContactInfo from '../contact-info';
import ContactList from '../contact-list';

// ----------------------------------------------------------------------

export default function ContactView() {
  return (
    <Container style={{ maxWidth: '1400px', backgroundColor:'#EDF1F6' }}>
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
        }
      ]}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.purchase.new}
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="teenyicons:user-square-solid" />}
        >
          Nuevo Contacto
        </Button>
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
