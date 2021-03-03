import { NuxtAxiosInstance } from '@nuxtjs/axios';

let axios: NuxtAxiosInstance | null = null;

export function setAxios(nxtAxios: NuxtAxiosInstance): void {
  axios = nxtAxios;
}

export { axios };
