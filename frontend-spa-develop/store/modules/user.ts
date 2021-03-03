import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import {
  ForgotPasswordParam,
  ResetPasswordParams,
  ResetPasswordResponse,
  ChangePasswordParams,
  ChangeEmailParams
} from '~/types/user';
import { LanguageSettingParams } from '~/types/language';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/user'
})
export default class UserModule extends VuexModule {
  resetCode      : string | null = null
  resetPasswordParams  : ResetPasswordParams = {
    user_id             : 0,
    email               : '',
    organization_id     : 0,
    reset_password_code : '',
    password            : ''
  }

  changeEmailParams  : ChangeEmailParams = {
    user_id             : 0,
    email               : '',
    organization_id     : 0,
    change_email_code   : ''
  }

  resetPasswordResponse  : ResetPasswordResponse = {
    organization_id   : 0,
    organization_name : '',
    organization_tag  : '',
    user_id           : 0
  }

  roleList: Map<number, string> = new Map([
    [1, 'Admin'],
    [2, 'Manager'],
    [3, 'Member'],
    [4, 'General Manager']
  ])

  get resetPasswordParamsObj() : ResetPasswordParams {
    return this.resetPasswordParams ? this.resetPasswordParams : {
      user_id             : 0,
      email               : '',
      organization_id     : 0,
      reset_password_code : '',
      password            : ''
    };
  }

  get changeEmailObj() : ChangeEmailParams {
    return this.changeEmailParams ? this.changeEmailParams : {
      user_id             : 0,
      email               : '',
      organization_id     : 0,
      change_email_code   : ''
    };
  }

  get takeRoleList() : Map<number, string> {
    return this.roleList;
  }

  @Mutation
  setResetPasswordParams(resetPasswordParams: ResetPasswordParams) : void {
    this.resetPasswordParams = resetPasswordParams;
  }

  @Mutation
  setChangeEmailParams(changeEmailParams: ChangeEmailParams) : void {
    this.changeEmailParams = changeEmailParams;
  }

  @Mutation
  setResetPasswordResponse(resetPasswordResponse: ResetPasswordResponse) : void {
    this.resetPasswordResponse = resetPasswordResponse;
  }

  @Action({ rawError: true })
  async forgotPassword(forgotPasswordParam: ForgotPasswordParam) : Promise<any> {
    const response = await axios!.$post('api/user/forgotPassword', forgotPasswordParam);
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response;
  }

  @Action({ commit: 'setResetPasswordParams' })
  saveResetPasswordParams(resetPasswordParams: ResetPasswordParams) : ResetPasswordParams {
    return resetPasswordParams;
  }

  @Action({ commit: 'setResetPasswordParams', rawError: true })
  async checkResetCode(resetCode: string) : Promise<any> {
    const response = await axios!.$post('/api/user/checkresetpasswordcode', { reset_password_code: resetCode });
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response.data;
  }

  @Action({ commit: 'setResetPasswordResponse', rawError: true })
  async resetPassword(resetPasswordParams: ResetPasswordParams) : Promise<any> {
    const response = await axios!.$post('/api/user/resetpassword', resetPasswordParams);
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response.data;
  }

  @Action({ commit: 'setResetPasswordParams' })
  clearResetPasswordParams() : null {
    return null;
  }

  @Action({ rawError: true })
  async requestChangeEmail(emailChange: string) : Promise<any> {
    const response = await axios!.$post('/api/user/insertnewemailforupdate', { email: emailChange });

    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response;
  }

  @Action({ rawError: true })
  async changePassword(changePasswordParams: ChangePasswordParams) : Promise<any> {
    const response = await axios!.$post('/api/user/changepassword', changePasswordParams);

    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response;
  }

  @Action({ commit: 'setChangeEmailParams', rawError: true })
  async changeEmail(changeEmailCode: string) : Promise<any> {
    const response = await axios!.$post('/api/user/changeemail', { change_email_code: changeEmailCode });
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response.data;
  }

  @Action({ commit: 'setChangeEmailParams' })
  saveChangeEmailParams(changeEmailParams: ChangeEmailParams) : ChangeEmailParams {
    return changeEmailParams;
  }

  @Action({ rawError: true })
  async displayLanguageSetting(languageSettingParams: LanguageSettingParams): Promise<any> {
    const response = await axios!.$post('/api/user/display-language-setting', languageSettingParams);
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response;
  }
}
