import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { sridocument } from 'src/api/sri/sri';

const key = 'job-transactions-list';
const key_transaction = 'job-transactions-list';

const setErrorMessage = (errors) => {
  const errorMsg = errors.map((error, index) => `(${index + 1}) ${error}`).join(',');
  return errorMsg;
};

export const useListJobTransactions = (pageIndex, sizePage, dateJob) =>
  useQuery({
    queryKey: [key, pageIndex, sizePage, dateJob],
    queryFn: sridocument.getAll,
    staleTime: 10 * (60 * 1000), // 10 mins
  });

export const useJobTransactions = (jobTransaction) =>
  useQuery({
    queryKey: [key_transaction, jobTransaction],
    queryFn: sridocument.getJobTransactionRQ,
    enabled: jobTransaction !== '',
  });

export const useMutationCreateProcessSRI = (accessKeys, onMessage) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sridocument.createSriProcess(accessKeys),
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      onMessage('success', 'Proceso Creado Satisfactoriamente');
    },
    onError: (error) => {
      const errorObject = error.response.data;
      if (errorObject.Succeced === false) {
        onMessage('warning', setErrorMessage(errorObject.Errors));
      } else {
        onMessage('warning', `Ha ocurrido un error al Crear Proceso de Consulta SRI`);
      }
    },
  });
};
