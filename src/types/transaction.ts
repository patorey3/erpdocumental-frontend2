export type IJobsItem = {
  totalKeys: number;
  processedKeys: number;
  processedPurchases: number;
  savedPurchases: number;
  processedTaxWithHoldings: number;
  savedTaxWithHoldings: number;
  processedCreditMemos: number;
  savedCreditMemos: number;
  notDownloadedYet: number;
  jobTransaction: string;
  description: string;
  created: string;
  status: string;
};

export interface IVendorDetail {
  vendorPartnerId: number;
  productCode: string;
  description: string;
  cC_RUC_DNI: string;
  name: string;
}

export interface ICollectionItem {
  factoryPartnerId: number | null;
  vendorDetail: IVendorDetail;
  itemNodeId: string;
  parentId: string;
  itemNodename: string;
  itemNodePath: string;
  barCode: string;
  name: string;
}
