import { Middleware } from '@nuxt/types';
import { ManagerRoleID } from '~/utils/responsecode';

const ManagerRole: Middleware = (context: any) : any => {
  if (context.$auth.user.role_id !== ManagerRoleID) {
    return context.redirect('/home-admin');
  }
};

export default ManagerRole;
