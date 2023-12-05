import { Helmet } from 'react-helmet-async';

import { PurchaseCreateView } from 'src/sections/purchase/view';

// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  return (
    <>
      <Helmet>
        <title> Compras: Crear Factura</title>
      </Helmet>
       <PurchaseCreateView /> 
    </>
  );
}
