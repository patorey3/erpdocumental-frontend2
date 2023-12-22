import { instance } from '../base.api';

const endpoint = 'DocumentModel';
const itemEndpoint = 'Item/forPurchase';
const itemCollectioniEndpoint = 'ItemCollection';
const contactEndpoint = 'Partners';
const partnerCollectionEndpoint = 'PartnerCollection';
const taxesCollectionEndpoint = 'TaxesCollection';
const IdentityDocumentTypeEndpoint = 'IdentityDocumentType';

export const getAllDocumentModelType = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, invoiceType] = queryKey.queryKey;
  const response = await instance.get(`${endpoint}?InvoiceType=${invoiceType}`);
  return response.data.data;
};

export const getItemsPurchasesByNameNotRelated = async (itemName: string, partnerId: number) => {
  const response = await instance.get(
    `${itemEndpoint}?Name=${itemName}&FilterNoRelatedVendorPartnerId=${partnerId}`
  );
  return response.data.data;
};

export const getItemsPurchasesByBarCode = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, barcode] = queryKey.queryKey;
  const response = await instance.get(`${itemEndpoint}?BarCode=${barcode}`);
  return response.data.data;
};

export const getItemsPurchasesByName = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, name] = queryKey.queryKey;
  const response = await instance.get(`${itemEndpoint}?Name=${name}`);
  return response.data.data;
};

export const getCatalogItemCollectionRQ = async () => {
  const response = await instance.get(
    `${itemCollectioniEndpoint}?IsVisible=true&IsTopic=true&HasDocumentModelForPurchase=true`
  );
  return response.data;
};

export const getCatalogCitiesRQ = async () => {
  const response = await instance.get(
    `${partnerCollectionEndpoint}/locationsCollection?IsCity=true`
  );
  return response.data.data;
};

export const getCatalogCitiesByNameRQ = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, name] = queryKey.queryKey;
  const response = await instance.get(
    `${partnerCollectionEndpoint}/locationsCollection?Name=${name}`
  );
  return response.data;
};

export const getContactListRQ = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, page, pageSize, filter] = queryKey.queryKey;
  const response = await instance.get(
    `${contactEndpoint}?PageIndex=${page}&PageSize=${pageSize}${filter}`
  );
  return response.data;
};

export const getSectorListRQ = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, name] = queryKey.queryKey;
  const response = await instance.get(
    `${partnerCollectionEndpoint}/sectorsCollection?IsSector=true&Name=${name}`
  );
  return response.data;
};

export const getEnterpriseInfoRQ = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, enterpriseId] = queryKey.queryKey;
  const response = await instance.get(`${contactEndpoint}/${enterpriseId}`);
  return response.data.data;
};

export const getTaxesCollectionPercentsRQ = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await instance.get(`${taxesCollectionEndpoint}/percents`);
  return response.data.data;
};

export const getIdentityDocumentType = async () => {
  const response = await instance.get(`${IdentityDocumentTypeEndpoint}`);
  return response.data.data;
};
