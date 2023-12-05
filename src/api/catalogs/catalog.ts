import { instance } from '../base.api';

const endpoint = 'DocumentModel';
const itemEndpoint = 'Item/forPurchase';
const itemCollectioniEndpoint = 'ItemCollection';
const contactEndpoint = 'Partners';
const partnerCollectionEndpoint = 'PartnerCollection';

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

export const getContactListRQ = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, page, pageSize, filter] = queryKey.queryKey;
  const response = await instance.get(
    `${contactEndpoint}?PageIndex=${page}&PageSize=${pageSize}${filter}`
  );
  return response.data;
};
