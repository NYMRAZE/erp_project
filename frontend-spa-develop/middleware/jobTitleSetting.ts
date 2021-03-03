import { Middleware } from '@nuxt/types';
import { BRANCHSETTING } from '~/utils/common-const';
import { GeneralManagerRoleID } from '~/utils/responsecode';

const jobTitleSetting: Middleware = (context: any) : any => {
  const settingStep = context.$auth.user.setting_step;
  if (!settingStep || (settingStep && settingStep < BRANCHSETTING)) {
    return context.$auth.user.role_id === GeneralManagerRoleID
      ? context.redirect('/settings/organization-email')
      : context.redirect('/home-admin');
  }
};

export default jobTitleSetting;
