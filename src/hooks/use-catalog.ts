import { useQuery } from '@tanstack/react-query';

import { getAllDocumentModelType, getCatalogItemCollectionRQ } from 'src/api/catalogs/catalog';

const key = 'doc-catalog-list';
const key_item_collection = 'catalog-itemcollection';

export const useListDocCatalog = (invoiceType: string) =>
  useQuery({
    queryKey: [key, invoiceType],
    queryFn: getAllDocumentModelType,
    staleTime: Infinity,
  });

export const useCatalogItemCollection = () =>
  useQuery({
    queryKey: [key_item_collection],
    queryFn: getCatalogItemCollectionRQ,
    staleTime: Infinity,
  });
