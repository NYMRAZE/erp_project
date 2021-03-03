import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { Pagination, CreateOvertimeParams, OvertimeWeight } from '~/types/overtime';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/overtime'
})

export default class DayLeaveModule extends VuexModule {
  OTResponses: Map<string, string>[] = [];
  users: Map<string, string> | null = null;
  projects: Map<string, string> = new Map();
  branches: Map<string, string> = new Map();
  otForm: CreateOvertimeParams | null = null
  emailsGMAndPM: Map<string, string> = new Map();
  overtimeTypes: Map<string, string> = new Map();
  statusOvertimeTypes: Map<string, string> = new Map();
  overtimeWeight: OvertimeWeight | null = null;
  pagination: Pagination = {
    current_page: 1,
    total_row: 0,
    row_per_page: 0
  };
  projectManagers: number[] = []

  get takeUserList(): Map<string, string> | null {
    return this.users;
  }

  get takeBranchList(): Map<string, string> {
    return this.branches;
  }

  get takeProjectList(): Map<string, string> {
    return this.projects;
  }

  get takeOTResponses(): Map<string, string>[] {
    return this.OTResponses;
  }

  get takeOTFromDetail(): CreateOvertimeParams | null {
    return this.otForm;
  }

  get takeEmailsGMAndPM(): Map<string, string> {
    return this.emailsGMAndPM;
  }

  get takeOvertimeTypes(): Map<string, string> {
    return this.overtimeTypes;
  }

  get takeStatusOvertimeTypes(): Map<string, string> {
    return this.statusOvertimeTypes;
  }

  get takeOTWeight(): OvertimeWeight | null {
    return this.overtimeWeight;
  }

  get takePagination() : Pagination {
    return this.pagination;
  }

  get takeProjectManagers() : number[] {
    return this.projectManagers;
  }

  @Mutation
  setOTResponses(res: any): void {
    this.OTResponses = res.ot_requests;
    this.pagination = res.pagination;
    this.projects = new Map(Object.entries(res.projects));
    this.branches = new Map(Object.entries(res.branches));
    this.users = new Map(Object.entries(res.users));
    this.overtimeTypes = new Map(Object.entries(res.overtime_types));
    this.statusOvertimeTypes = new Map(Object.entries(res.status_overtime_types));
    this.projectManagers = res.project_managers;
  }

  @Mutation
  setOTForm(res: any): void {
    this.otForm = res;
  }

  @Mutation
  setEmailsGMAndPM(res: any): void {
    this.emailsGMAndPM = new Map(Object.entries(res.emails));
    this.users = new Map(Object.entries(res.users));
  }

  @Mutation
  setOvertimeWeight(res: any): void {
    this.overtimeWeight = res;
  }

  @Action({ commit: 'setOTResponses', rawError: true })
  async getOvertimeRequest(params: any) : Promise<any> {
    const res = await axios!.$post('/overtime/get-overtime-requests', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createOvertimeRequest(params: CreateOvertimeParams[]) : Promise<any> {
    const res = await axios!.$post('/overtime/create-overtime-request', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async updateOvertimeRequestStatus(params: any) : Promise<any> {
    const res = await axios!.$post('/overtime/update-overtime-request-status', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setOTForm', rawError: true })
  async getOvertimeRequestById(id: number) : Promise<any> {
    const res = await axios!.$post('/overtime/get-overtime-request', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setEmailsGMAndPM', rawError: true })
  async getEmailsGMAndPM() : Promise<any> {
    const res = await axios!.$post('/overtime/get-emails-gm-and-pm');
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async exportToExcel(params: object) : Promise<any> {
    const res = await axios!.$post(
      '/overtime/export-excel', params, { responseType: 'blob' }
    );
    return res;
  }

  @Action({ rawError: true })
  async createOvertimeWeight(params: any) : Promise<any> {
    const res = await axios!.$post('/overtime/create-overtime-weight', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setOvertimeWeight', rawError: true })
  async getOvertimeWeight() : Promise<any> {
    const res = await axios!.$post('/overtime/get-overtime-weight');
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editOvertimeWeight(params: any) : Promise<any> {
    const res = await axios!.$post('/overtime/edit-overtime-weight', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
