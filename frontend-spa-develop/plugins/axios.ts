import { Plugin } from '@nuxt/types';
import { setAxios } from '~/utils/axios-accessor';

const myPlugin: Plugin = ({ $axios }) : void => {
  setAxios($axios);
};

export default myPlugin;
