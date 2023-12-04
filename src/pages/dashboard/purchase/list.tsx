import { Helmet } from 'react-helmet-async';

import { PurchaseListView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

export default function PurchaseListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Listado de Compras</title>
      </Helmet>
      <PurchaseListView />
    </>
  );
}
