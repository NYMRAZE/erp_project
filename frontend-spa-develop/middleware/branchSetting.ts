import { Middleware } from '@nuxt/types';
import { GeneralManagerRoleID } from '~/utils/responsecode';

const branchSetting: Middleware = (context: any) : any => {
  if (!context.$auth.user.setting_step) {
    return context.$auth.user.role_id === GeneralManagerRoleID
      ? context.redirect('/settings/organization-email')
      : context.redirect('/home-admin');
  }
};

export default branchSetting;
