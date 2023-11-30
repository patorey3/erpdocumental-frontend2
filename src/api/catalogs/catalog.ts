import { instance } from '../base.api';

const endpoint = 'DocumentModel';

export const getAllDocumentModelType = async (queryKey: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, invoiceType] = queryKey.queryKey;
  const response = await instance.get(`${endpoint}?InvoiceType=${invoiceType}`);
  return response.data.data;
};
