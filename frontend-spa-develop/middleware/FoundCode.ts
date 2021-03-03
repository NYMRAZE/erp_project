import { Middleware } from '@nuxt/types';
import { registrationStore } from '~/store/';

const FoundCode: Middleware = (context) : any => {
  if (registrationStore.organizationObj.email === '' || registrationStore.organizationObj.code === '') {
    return context.redirect('/');
  }
};

export default FoundCode;
