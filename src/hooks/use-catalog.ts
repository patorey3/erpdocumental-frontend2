import { useQuery } from '@tanstack/react-query';

import {
  getContactListRQ,
  getCatalogCitiesRQ,
  getAllDocumentModelType,
  getCatalogItemCollectionRQ,
} from 'src/api/catalogs/catalog';

const key = 'doc-catalog-list';
const key_item_collection = 'catalog-itemcollection';
const key_contact_catalog = 'catalog-contact';
const key_cities_catalog = 'catalog-cities';

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

export const useCatalogContact = (page: number = 1, pageSize: number = 10, filter: string = '') =>
  useQuery({
    queryKey: [key_contact_catalog, page, pageSize, filter],
    queryFn: getContactListRQ,
  });

export const useCatalogCitiesCollection = () =>
  useQuery({
    queryKey: [key_cities_catalog],
    queryFn: getCatalogCitiesRQ,
    staleTime: Infinity,
  });
