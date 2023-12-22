import { useQuery } from '@tanstack/react-query';

import {
  getSectorListRQ,
  getContactListRQ,
  getCatalogCitiesRQ,
  getAllDocumentModelType,
  getItemsPurchasesByName,
  getCatalogCitiesByNameRQ,
  getCatalogItemCollectionRQ,
  getItemsPurchasesByBarCode,
  getTaxesCollectionPercentsRQ,
} from 'src/api/catalogs/catalog';

const key = 'doc-catalog-list';
const key_item_collection = 'catalog-itemcollection';
const key_contact_catalog = 'catalog-contact';
const key_cities_catalog = 'catalog-cities';
const key_cities_catalog_by_name = 'catalog-cities-by-name';
const key_taxes_catalog = 'catalog-taxes';
const key_item_by_barcode = 'catalog-item-barcode';
const key_item_by_name = 'catalog-item-name';
const key_sector = 'catalog-sector';

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

export const useSectorCatalog = (name: string = '') =>
  useQuery({
    queryKey: [key_sector, name],
    enabled: name !== '',
    queryFn: getSectorListRQ,
    staleTime: Infinity,
  });

export const useCatalogCitiesCollectionByName = (name: string = '') =>
  useQuery({
    queryKey: [key_cities_catalog_by_name, name],
    queryFn: getCatalogCitiesByNameRQ,
    enabled: name !== '',
    staleTime: Infinity,
  });

export const useCatalogCitiesCollection = () =>
  useQuery({
    queryKey: [key_cities_catalog],
    queryFn: getCatalogCitiesRQ,
    staleTime: Infinity,
  });

export const useCatalogTaxCollection = () =>
  useQuery({
    queryKey: [key_taxes_catalog],
    queryFn: getTaxesCollectionPercentsRQ,
    staleTime: Infinity,
  });

export const useItemByBarcode = (barcode: string) =>
  useQuery({
    queryKey: [key_item_by_barcode, barcode],
    enabled: barcode !== '',
    queryFn: getItemsPurchasesByBarCode,
    staleTime: Infinity,
  });

export const useItemByName = (name: string) =>
  useQuery({
    queryKey: [key_item_by_name, name],
    enabled: name !== '',
    queryFn: getItemsPurchasesByName,
  });
