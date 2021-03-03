import { Middleware } from '@nuxt/types';
import { GeneralManagerRoleID } from '~/utils/responsecode';

const GeneralManagerRole: Middleware = (context: any) : any => {
  if (context.$auth.user.role_id !== GeneralManagerRoleID) {
    return context.redirect('/home-admin');
  }
};

export default GeneralManagerRole;
