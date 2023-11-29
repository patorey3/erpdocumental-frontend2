import { instance } from '../base.api';

const endpoint = 'SriDocument';

export const sridocument = {
  async getAll(queryKey: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, pageIndex, sizePage, dateJob] = queryKey.queryKey;
    const response = await instance.get(
      `${endpoint}?PageSize=${sizePage}&PageIndex=${pageIndex}&Date=${dateJob}`
    );
    return response.data;
  },
  async getJobTransactionRQ(queryKey: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, jobTransaction] = queryKey.queryKey;
    const response = await instance.get(
      `${endpoint}/GetPurchases?JobTransaction=${jobTransaction}&PageSize=1000000`
    );
    return response.data;
  },
  async createSriProcess(accessKeys: any) {
    return instance.post(`${endpoint}`, accessKeys);
  },
};
