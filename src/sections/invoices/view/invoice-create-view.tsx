import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';


// ----------------------------------------------------------------------

export default function InvoiceCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear Nueva Factura"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Ventas',
            href: paths.dashboard.invoice.root,
          },
          {
            name: 'Nueva Factura',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <h1>InvoiceNewEditForm</h1>
      {/* <InvoiceNewEditForm /> */}
    </Container>
  );
}
