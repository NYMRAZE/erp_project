import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import { Branches, JobTitle, InterestTechnology } from '~/types/setting';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/setting'
})

export default class SettingModule extends VuexModule {
  branches: Branches[] = []

  get takeBranches(): Branches[] {
    return this.branches;
  }

  @Mutation
  setBranches(branches : Branches[]) : void {
    this.branches = branches;
  }

  @Action({ rawError: true })
  async getBranches() : Promise<any> {
    const res = await axios!.$post('/setting/branch/get-branches');
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editBranch(branch: Branches) : Promise<any> {
    const res = await axios!.$post('/setting/branch/edit-branch', branch);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeBranch(id: number) : Promise<any> {
    const res = await axios!.$post('/setting/branch/remove-branch', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createBranch(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/branch/create-branch', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async sortPrioritizationBranches(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/branch/sort-prioritization', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createJobTitle(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/job-title/create-job-title', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async getJobTitle() : Promise<any> {
    const res = await axios!.$post('/setting/job-title/get-job-titles');
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editJobTitle(jobTitle: JobTitle) : Promise<any> {
    const res = await axios!.$post('/setting/job-title/edit-job-title', jobTitle);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeJobTitle(id: number) : Promise<any> {
    const res = await axios!.$post('/setting/job-title/remove-job-title', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async sortPrioritizationJobTitle(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/job-title/sort-prioritization', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async getTechnologies() : Promise<any> {
    const res = await axios!.$post('/setting/technology/get-technologies');
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editTechnologies(technology: InterestTechnology) : Promise<any> {
    const res = await axios!.$post('/setting/technology/edit-technology', technology);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeTechnologies(id: number) : Promise<any> {
    const res = await axios!.$post('/setting/technology/remove-technology', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createTechnologies(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/technology/create-technology', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async sortPrioritizationTechnologies(params: any) : Promise<any> {
    const res = await axios!.$post('/setting/technology/sort-prioritization', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
