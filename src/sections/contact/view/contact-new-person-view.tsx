import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ContacNewPerson from '../contact-new-person';

//  import PurchaseNewEditForm from '../purchase-new-edit-form';

// ----------------------------------------------------------------------


export default function ContactNewPersonView() {
 // const settings = useSettingsContext();

  return (
    <Container style={{ maxWidth: '1400px' }}>
      <CustomBreadcrumbs
        heading="Crear Nuevo Contacto"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Lista de Contacto',
            href: paths.dashboard.contact.root,
          },
          {
            name: 'Nueva Persona',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
       <ContacNewPerson /> 
       
    </Container>
  );
}
