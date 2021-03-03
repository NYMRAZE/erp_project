
import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators';
import { UserRequest, OrganizationRegister } from '~/types/registration';
import { Organization } from '~/types/organization';
import { axios } from '~/utils/axios-accessor';
import { FailResponseCode } from '~/utils/responsecode';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/registration'
})

export default class RegistrationModule extends VuexModule {
  email                 : string = ''
  registrationCode      : string | null = null
  organizationRegister  : OrganizationRegister = {
    organization_name   : '',
    organization_tag    : '',
    request_id          : 0,
    email               : '',
    code                : '',
    first_name          : '',
    last_name           : '',
    password            : ''
  }

  get emailConfirm() : string {
    return this.email;
  }

  get emailRegister() : string {
    return this.organizationRegister.email;
  }

  get organizationObj() : OrganizationRegister {
    return this.organizationRegister;
  }

  @Mutation
  setEmail(email: string) : void {
    this.email = email;
  }

  @Mutation
  setEmailCodeOrganization(organizationRegister: OrganizationRegister) : void {
    this.organizationRegister.request_id = organizationRegister.request_id;
    this.organizationRegister.email = organizationRegister.email;
    this.organizationRegister.code = organizationRegister.code;
  }

  @Mutation
  setRegistrationRegisterInfo(organizationRegister: OrganizationRegister) : void {
    this.organizationRegister = organizationRegister;
  }

  @Mutation
  setRegistrationCode(registrationCode: string) : void {
    this.registrationCode = registrationCode;
  }

  @Mutation
  setOrganization(organizationRegister: any) : void {
    this.organizationRegister.organization_name = organizationRegister.name;
    this.organizationRegister.organization_tag = organizationRegister.tag;
  }

  @Action({ commit: 'setRegistrationRegisterInfo' })
  saveRegistrationRegisterInfo(organizationRegister: OrganizationRegister) : OrganizationRegister {
    return organizationRegister;
  }

  @Action({ commit: 'setEmail' })
  saveEmail(email: string) : string {
    return email;
  }

  @Action({ commit: 'setEmail', rawError: true })
  async sendMail(email: string) : Promise<string> {
    const response = await axios!.$post('/registration/checkEmail', { email: email });
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response.data.email;
  }

  @Action({ commit: 'setEmailCodeOrganization', rawError: true })
  async checkExpired(registrationCode: string) : Promise<any> {
    const response = await axios!.$post('/registration/checkRegistrationCode', { registrationCode: registrationCode });
    if (response.status === FailResponseCode) {
      throw response.message;
    }

    return response.data;
  }

  @Action({ commit: 'setOrganization', rawError: true })
  async checkOrganization(organizationRegister: OrganizationRegister) : Promise<any> {
    const response = await axios!.$post('/registration/checkOrganization', organizationRegister);
    if (response.status === FailResponseCode) {
      throw response.message;
    }

    return response.data;
  }

  @Action({ rawError: true })
  async registerOrganization(organizationRegister: OrganizationRegister) : Promise<Organization>  {
    let response;
    if (organizationRegister.request_id === 0) {
      response = await axios!.$post('/registration/registerOrganization', organizationRegister);
    } else {
      response = await axios!.$post('/registration/registerInviteLink', organizationRegister);
    }

    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return (response.data as Organization);
  }

  @Action({ commit: 'setEmail', rawError: true })
  async sendRequest(userRequest: UserRequest) : Promise<any> {
    const response = await axios!.$post('/registration/requestRegistration', userRequest);
    if (response.status === FailResponseCode) {
      throw new Error(response.message);
    }

    return response;
  }
}
