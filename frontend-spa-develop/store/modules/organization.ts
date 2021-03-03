import * as querystring from 'querystring';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { Organization, OrganizationSetting } from '~/types/organization';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/organization'
})
export default class OrganizationModule extends VuexModule {
  organization: Organization | null = null;
  organizationSetting: OrganizationSetting | null = null;

  get objOrganization() : Organization | null {
    return this.organization ? this.organization : null;
  }

  get takeOrganizationSetting() : OrganizationSetting | null {
    return this.organizationSetting;
  }

  get idOrganization() : number {
    return this.organization ? this.organization.id : 0;
  }

  get organizationName() : string {
    return this.organization ? this.organization.name : '';
  }

  @Mutation
  setOrganization(organization: Organization | null) : void {
    this.organization = organization;
  }

  @Mutation
  setOrganizationSetting(organizationSetting: OrganizationSetting) : void {
    this.organizationSetting = organizationSetting;
  }

  @Action({ commit: 'setOrganization', rawError: true })
  async findOrganization(tagOrganization: string) : Promise<Organization> {
    const obj = {
      tag_organization: tagOrganization
    };

    const res = await axios!.$post('/api/organization/find-organization',
      querystring.stringify(obj)
    );

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as Organization);
  }

  @Action({ commit: 'setOrganization' })
  resetOrganization() : null {
    return null;
  }

  @Action({ commit: 'setOrganization' })
  saveOrganization(organization: Organization) : Organization {
    return organization;
  }

  @Action({ commit: 'setOrganizationSetting', rawError: true })
  async getOrganizationSetting() : Promise<any> {
    const res = await axios!.$post('/setting/get-organization-setting');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data);
  }

  @Action({ rawError: true })
  async editOrganizationEmail(organizationEmail: any) : Promise<any> {
    const res = await axios!.$post('/setting/edit-organization-email', organizationEmail);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editExpirationResetDayOff(expiration: number) : Promise<any> {
    const res = await axios!.$post('/setting/edit-expiration-reset-day-off', { expiration });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
