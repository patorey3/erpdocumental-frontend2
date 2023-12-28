import { useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useEnterpriseInfo } from 'src/hooks/use-contact';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ContacNewPerson from '../contact-new-person';

//  import PurchaseNewEditForm from '../purchase-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string ;
};

export default function ContactEditPersonView({ id }: Props) {
 // const settings = useSettingsContext();
 const queryContact = useEnterpriseInfo(id);

 useEffect(() => {
  if (queryContact.isFetched) {
    console.log('queryEnterprise', queryContact.data);
    // setEnterprise({
    //   id: queryEnterprise.data.id,
    //   name: queryEnterprise.data.name,
    //   cC_RUC_DNI: queryEnterprise.data.cC_RUC_DNI,
    //   isPerson: queryEnterprise.data.isPerson,
    //   sector: queryEnterprise.data.sector.name,
    //   phone: queryEnterprise.data.phone,
    //   email: queryEnterprise.data.email,
    //   accountId: queryEnterprise.data.accountId,
    //   c_imagen: queryEnterprise.data.c_imagen,
    // });
    // console.log('enterprise', enterprise);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [queryContact.data]);

 // const [currentContact, setCurrentContact] = useState<IContactPerson>()

  return (
    <Container style={{ maxWidth: '1400px' }}>
      <CustomBreadcrumbs
        heading="Editar Contacto"
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
            name: 'Editar Persona',
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
