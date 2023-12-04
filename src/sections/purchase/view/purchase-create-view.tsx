import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

 import PurchaseNewEditForm from '../purchase-new-edit-form';

// ----------------------------------------------------------------------

export default function PurchaseCreateView() {
 // const settings = useSettingsContext();

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Crear una Nueva Factura"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Lista de Facturas',
            href: paths.dashboard.purchase.root,
          },
          {
            name: 'Nueva Factura',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
       <PurchaseNewEditForm /> 
       
    </Container>
  );
}
