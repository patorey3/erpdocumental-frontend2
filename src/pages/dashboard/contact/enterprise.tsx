import { Helmet } from 'react-helmet-async';

import { EnterpriseView } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function ContactEnterprisePage() {
  return (
    <>
      <Helmet>
        <title> Contacto: Empresa</title>
      </Helmet>
      <EnterpriseView />
    </>
  );
}
