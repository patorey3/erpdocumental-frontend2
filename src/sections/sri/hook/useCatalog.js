import { useQuery } from '@tanstack/react-query';

import { getAllDocumentModelType } from 'src/api/catalogs/catalog';

const key = 'doc-catalog-list';

export const useListDocCatalog = (invoiceType) =>
  useQuery({
    queryKey: [key, invoiceType],
    queryFn: getAllDocumentModelType,
    staleTime: Infinity,
  });
