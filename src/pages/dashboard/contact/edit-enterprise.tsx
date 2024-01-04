import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { ContactEditEnterpriseView } from 'src/sections/contact/view';



// ----------------------------------------------------------------------

export default function ContactEditEnterprisePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Contacto: Editar Empresa</title>
      </Helmet>

      <ContactEditEnterpriseView id={`${id}`} />
    </>
  );
}
