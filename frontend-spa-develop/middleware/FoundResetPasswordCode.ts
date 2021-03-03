import { Middleware } from '@nuxt/types';
import { userStore } from '~/store/';

const FoundResetPasswordCode: Middleware = (context) : any => {
  if (userStore.resetPasswordParamsObj.user_id === 0) {
    return context.redirect('/');
  }
};

export default FoundResetPasswordCode;
