import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { usePurchaseById } from 'src/hooks/use-purchase';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IPurchase } from 'src/types/purchases';

import PurchaseNewEditForm from '../purchase-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function PurchaseEditView({ id }: Props) {
  const queryPurchaseById = usePurchaseById(id);
 const [currentPurchase, setCurrentPurchase] = useState<IPurchase>()

  useEffect(() => {
    if (queryPurchaseById.isFetched) {
      setCurrentPurchase(queryPurchaseById.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryPurchaseById.data]);

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs 
        heading="Editar Factura de Compras"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Compras',
            href: paths.dashboard.purchase.root,
          },
          { name: currentPurchase?.referenceNumber? `Factura Nro. ${currentPurchase.sriSerieNumber}-${currentPurchase.referenceNumber}` : '' },
        ]}
      />
       <PurchaseNewEditForm currentPurchase={currentPurchase} /> 

    </Container>
  );
}
