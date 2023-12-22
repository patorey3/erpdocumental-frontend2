import { Helmet } from 'react-helmet-async';

import { ContactView } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function ContactListPage() {
  return (
    <>
      <Helmet>
        <title> Contacto: Listado de Contactos</title>
      </Helmet>
      <ContactView />
    </>
  );
}
