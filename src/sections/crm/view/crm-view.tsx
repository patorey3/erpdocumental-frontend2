
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import ContactInfo from 'src/sections/contact/contact-info';

import CrmContactList from '../crm-contact-list';

// import ContactList from '../contact-list';

// ----------------------------------------------------------------------

export default function CrmView() {
  return (
    <Container style={{ maxWidth: '1400px'}}>
      <CustomBreadcrumbs
        heading="Lista de Contactos"
        links={[
          {
            name: 'Relación Comercial',
            href: paths.dashboard.contact.root,
          },
          {
            name: 'Lista de Contactos',
            href: paths.dashboard.contact.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <ContactInfo />
      <CrmContactList />
    </Container>
  );
}
