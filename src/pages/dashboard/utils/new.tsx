import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SriConsultNewForm from 'src/sections/sri/view/sri-new-consult-view';



// ----------------------------------------------------------------------

export default function SriCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear una nuva consulta"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Utilidades',
            href: paths.dashboard.utils.root,
          },
          {
            name: 'Nueva Consulta',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SriConsultNewForm />
    </Container>
  );
}
