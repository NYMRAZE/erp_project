import { Middleware } from '@nuxt/types';
import { GeneralManagerRoleID, ManagerRoleID } from '~/utils/responsecode';

const ManageMemberRole: Middleware = (context: any) : any => {
  const editUserId = context.route.params.id;

  if (editUserId) {
    if (context.$auth.user.role_id !== GeneralManagerRoleID &&
      context.$auth.user.role_id !== ManagerRoleID) {
      return context.redirect('/home-admin');
    }
  }
};

export default ManageMemberRole;