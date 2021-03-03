import { Middleware } from '@nuxt/types';
import { TECHNOLOGYSETTING } from '~/utils/common-const';
import { GeneralManagerRoleID } from '~/utils/responsecode';

const overtimeSetting: Middleware = (context: any) : any => {
  const settingStep = context.$auth.user.setting_step;
  if (!settingStep || (settingStep && settingStep < TECHNOLOGYSETTING)) {
    return context.$auth.user.role_id === GeneralManagerRoleID
      ? context.redirect('/settings/organization-email')
      : context.redirect('/home-admin');
  }
};

export default overtimeSetting;
