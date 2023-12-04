import { useQuery } from '@tanstack/react-query';

import { purchase } from 'src/api/purchase/purchase';

const key = 'purchase';
const key_pruchase_by_id = 'purchase-by-id';

export const usePurchases = (
  NotEmmittedYet: boolean | string,
  hasCredit: boolean | string,
  PageIndex: number
) =>
  useQuery({
    queryKey: [key, NotEmmittedYet, hasCredit, PageIndex],
    queryFn: purchase.getAllPurchases,
  });

export const usePurchaseById = (documentId: string) =>
  useQuery({
    queryKey: [key_pruchase_by_id, documentId],
    queryFn: purchase.getPurchaseById,
  });
