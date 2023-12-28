import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { createContact, getEnterpriseInfoRQ } from 'src/api/catalogs/catalog';

const key = 'contact';

const setErrorMessage = (errors: any) => {
  const errorMsg = errors.map((error: any, index: number) => `(${index + 1}) ${error}`).join(',');
  return errorMsg;
};

export const useEnterpriseInfo = (enterpriseId: string) =>
  useQuery({
    queryKey: [key, enterpriseId],
    queryFn: getEnterpriseInfoRQ,
  });

export const useMutationCreateContact = (contactReg: any) =>
  // const queryClient = useQueryClient();
  useMutation({
    mutationFn: () => createContact(contactReg),
    onSuccess: () => {
      // queryClient.invalidateQueries(key);
      enqueueSnackbar('Contacto Creado Satisfactoriamente!', {
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
        enqueueSnackbar(`Ha ocurrido un error al Crear Contacto`, {
          variant: 'warning',
        });
      }
    },
  });
