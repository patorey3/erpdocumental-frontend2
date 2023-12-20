import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { purchase } from 'src/api/purchase/purchase';

const key = 'purchase';
const key_pruchase_by_id = 'purchase-by-id';

const setErrorMessage = (errors: any) => {
  const errorMsg = errors.map((error: any, index: number) => `(${index + 1}) ${error}`).join(',');
  return errorMsg;
};

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

export const useMutationCreatePurchase = (purchaseReg: any) =>
  //  const queryClient = useQueryClient();
  useMutation({
    mutationFn: () => purchase.createPurchase(purchaseReg),
    onSuccess: () => {
      enqueueSnackbar('Factura de Compra Creada Satisfactoriamente!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      // console.log('Error', error);
      const errorObject = error.response.data;
      if (errorObject.Succeced === false) {
        enqueueSnackbar(setErrorMessage(errorObject.Errors), {
          variant: 'warning',
        });
      } else {
        enqueueSnackbar(`Ha ocurrido un error al Crear Factura de Compra`, {
          variant: 'warning',
        });
      }
    },
  });

export const useMutationUpdatePurchase = (purchaseReg: any, documentId: string) =>
  //  const queryClient = useQueryClient();
  useMutation({
    mutationFn: () => purchase.updatePurchase(purchaseReg, documentId),
    onSuccess: () => {
      enqueueSnackbar('Factura de Compra Modificada Satisfactoriamente!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      // console.log('Error', error);
      const errorObject = error.response.data;
      if (errorObject.Succeced === false) {
        enqueueSnackbar(setErrorMessage(errorObject.Errors), {
          variant: 'warning',
        });
      } else {
        enqueueSnackbar(`Ha ocurrido un error al Modificar Factura de Compra`, {
          variant: 'warning',
        });
      }
    },
  });
