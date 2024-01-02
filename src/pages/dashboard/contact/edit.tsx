import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ContactEditPersonView } from 'src/sections/contact/view';



// ----------------------------------------------------------------------

export default function ContactEditPersonPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Contacto: Editar Persona</title>
      </Helmet>

      <ContactEditPersonView id={`${id}`} />
    </>
  );
}
