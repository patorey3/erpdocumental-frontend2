import { instance } from '../base.api';

const endpoint = 'Invoice';

export const purchase = {
  async getAllPurchases(queryKey: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, NotEmmittedYet, hasCredit, PageIndex] = queryKey.queryKey;
    const hasCreditTransform = typeof hasCredit === 'string' ? '' : hasCredit;
    const NotEmmittedYetTransform = typeof NotEmmittedYet === 'string' ? '' : NotEmmittedYet;
    const response = await instance.get(
      `${endpoint}?invoiceTransactionType=Purchase&PageIndex=${PageIndex}&hasCredit=${hasCreditTransform}&NotEmmittedYet=${NotEmmittedYetTransform}`
    );
    return response.data;
  },
  async getPurchaseById(queryKey: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, documentId] = queryKey.queryKey;
    const response = await instance.get(`${endpoint}/purchase/${documentId}`);
    return response.data.data;
  },
};
