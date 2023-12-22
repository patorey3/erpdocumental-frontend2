// import { enqueueSnackbar } from 'notistack';
import { useQuery } from '@tanstack/react-query';

import { getEnterpriseInfoRQ } from 'src/api/catalogs/catalog';

const key = 'contact';

export const useEnterpriseInfo = (enterpriseId: string) =>
  useQuery({
    queryKey: [key, enterpriseId],
    queryFn: getEnterpriseInfoRQ,
  });
