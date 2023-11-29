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
