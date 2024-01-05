import { Helmet } from 'react-helmet-async';

import { CrmView } from 'src/sections/crm/view';


// ----------------------------------------------------------------------

export default function CrmListPage() {
  return (
    <>
      <Helmet>
        <title> Crm: CRM y Documentos</title>
      </Helmet>
      <CrmView />
    </>
  );
}
