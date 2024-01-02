import { enqueueSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createContact, updateContactById, getEnterpriseInfoRQ } from 'src/api/catalogs/catalog';

import { IContactPerson } from 'src/types/contact';

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

export const useMutationCreateContact = (contactReg: IContactPerson) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createContact(contactReg),
    onSuccess: () => {
      queryClient.invalidateQueries();
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
};

export const useMutationUpdateContact = (id: string, contactReg: IContactPerson) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateContactById(id, contactReg),
    onSuccess: () => {
      queryClient.invalidateQueries();
      enqueueSnackbar('Contacto Modificado Satisfactoriamente!', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      console.log('Error', error);
      const errorObject = error.response.data;
      if (errorObject.Succeced === false) {
        enqueueSnackbar(setErrorMessage(errorObject.Errors), {
          variant: 'warning',
        });
      } else {
        enqueueSnackbar(`Ha ocurrido un error al Modificar Contacto`, {
          variant: 'warning',
        });
      }
    },
  });
};
