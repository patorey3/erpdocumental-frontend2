import axios from 'axios';

import { BASE_ERP_DOCUMENTAL_API } from 'src/config-global';

export const instance = axios.create({
  baseURL: BASE_ERP_DOCUMENTAL_API,
});
