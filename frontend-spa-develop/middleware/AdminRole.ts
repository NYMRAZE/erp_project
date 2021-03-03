import { Middleware } from '@nuxt/types';
import { AdminRoleID } from '~/utils/responsecode';

const AdminRole: Middleware = (context: any) : any => {
  if (context.$auth.user.role_id !== AdminRoleID) {
    return context.redirect('/home-admin');
  }
};

export default AdminRole;
