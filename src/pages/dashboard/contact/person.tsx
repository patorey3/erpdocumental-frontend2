import { Helmet } from 'react-helmet-async';

import { PersonView } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function ContactPersonPage() {
  return (
    <>
      <Helmet>
        <title> Contacto: Persona</title>
      </Helmet>
      <PersonView />
    </>
  );
}
