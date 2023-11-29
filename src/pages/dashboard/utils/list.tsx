import { Helmet } from 'react-helmet-async';

import SriListView from 'src/sections/sri/view/sri-list-view';


// ----------------------------------------------------------------------

export default function SriListPage() {
  return (
    <>
      <Helmet>
        <title>Consultas Sri</title>
      </Helmet>

      <SriListView />
    </>
  );
}
