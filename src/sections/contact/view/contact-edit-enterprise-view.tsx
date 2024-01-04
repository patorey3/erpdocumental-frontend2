import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useEnterpriseInfo } from 'src/hooks/use-contact';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IContactEnterprise } from 'src/types/contact';

import ContacNewEnterprise from '../contact-new-enterprise';

//  import PurchaseNewEditForm from '../purchase-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string ;
};

export default function ContactEditEnterpriseView({ id }: Props) {
 // const settings = useSettingsContext();
 const [contact, setContact] = useState<IContactEnterprise| undefined>()
 const queryContact = useEnterpriseInfo(id);
 useEffect(() => {
  if (queryContact.isFetched) {
  //  console.log('queryEnterprise', queryContact.data);
    setContact({
      id: queryContact.data.id,
      identityDocumentTypeId: queryContact.data.identityDocumentTypeId,
      name: queryContact.data.name,
      cC_RUC_DNI: queryContact.data.cC_RUC_DNI,
      cityId: queryContact.data.cityId,
      address: queryContact.data.address,
      phone: queryContact.data.phone,
      emailBilling: queryContact.data.emailBilling,
      isPerson: queryContact.data.isPerson,
      isActive: queryContact.data.isActive,
      clientGroupId: '0',
      created: queryContact.data.created,
      emailCompany: queryContact.data.emailCompany,
      esFabricante: queryContact.data.esFabricante,
      c_proveedor_servicios: queryContact.data.c_proveedor_servicios,
      c_proveedor_mercaderia: queryContact.data.c_proveedor_mercaderia,
      c_distribuidor: queryContact.data.c_distribuidor,
      phone2: queryContact.data.phone2,
      phone3: queryContact.data.phone3,
      canHasCredit: queryContact.data.canHasCredit,
      creditAmount: queryContact.data.creditAmount,
      daysOfCredit: queryContact.data.daysOfCredit,
      additionalInformation: queryContact.data.additionalInformation,
      c_web: queryContact.data.c_web,
      sectorId: queryContact.data.sectorId,
    });
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
            name: `Editar Empresa RUC ${contact?.cC_RUC_DNI} ${contact?.name}`,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
       <ContacNewEnterprise currentContact={contact} /> 
       
    </Container>
  );
}
