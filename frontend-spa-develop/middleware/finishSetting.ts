import { Middleware } from '@nuxt/types';
import { GeneralManagerRoleID } from '~/utils/responsecode';
import { FINISHSETTING } from '~/utils/common-const';

const finishSetting: Middleware = (context: any) : any => {
  const settingStep = context.$auth.user.setting_step;
  if (!settingStep || (settingStep && settingStep !== FINISHSETTING)) {
    return context.$auth.user.role_id === GeneralManagerRoleID
      ? context.redirect('/settings/organization-email')
      : context.redirect('/home-admin');
  }
};

export default finishSetting;
