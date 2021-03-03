import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import { RecruitmentParams, Pagination, RecruitmentSearchParams, CV, CreateCvParam, CVComments, CVStatistic } from '~/types/recruitment';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/recruitment'
})

export default class RecruitmentModule extends VuexModule {
  recruitments: RecruitmentParams[] = []
  recruitment: RecruitmentParams | null = null
  pagination: Pagination = {
    current_page: 0,
    row_per_page: 0,
    total_row: 0
  }
  branches: Map<string, string> = new Map()
  users: Map<string, string> = new Map()
  assignees: number[] = []
  avatars: Map<string, string> = new Map()
  cvList: CV[] = []
  cvStatistic: CVStatistic[] = []
  isShowCVComments: boolean = false
  mediasRecruitment: Map<number, string> = new Map([
    [1, 'TopCV'],
    [2, 'Vietnamworks'],
    [3, 'LinkedIn'],
    [4, 'Facebook'],
    [5, 'ITviec'],
    [6, 'JobNow'],
    [7, 'CareerBuilder']
  ])
  CvStatuses: Map<number, string> = new Map([
    [1, 'Pending'],
    [2, 'Pass round 1'],
    [3, 'Pass final'],
    [4, 'Reject'],
    [5, 'Not pass'],
    [6, 'Interview appointment']
  ]);

  statusColors: Map<number, string> = new Map([
    [1, '#ffc107'],
    [2, '#20c997 '],
    [3, '#28a745'],
    [4, '#fd7e14'],
    [5, '#dc3545 '],
    [6, '#c77d20']
  ]);
  cvComments: CVComments[] = []

  get takeMedias(): Map<number, string> {
    return this.mediasRecruitment;
  }

  get takeRecruitments(): RecruitmentParams[] {
    return this.recruitments;
  }

  get takeRecruitment(): RecruitmentParams | null {
    return this.recruitment;
  }

  get takeBranches(): Map<string, string> {
    return this.branches;
  }

  get takeUsers(): Map<string, string> {
    return this.users;
  }

  get takeAvatars(): Map<string, string> {
    return this.avatars;
  }

  get takeCVStatus(): Map<number, string> {
    return this.CvStatuses;
  }

  get takeStatusColors(): Map<number, string> {
    return this.statusColors;
  }

  get takeCVList(): CV[] {
    return this.cvList ? this.cvList : [];
  }

  get takePagination(): Pagination {
    return this.pagination;
  }

  get takeCVComments(): CVComments[] {
    return this.cvComments ? this.cvComments : [];
  }

  get checkShowCVComments(): boolean {
    return this.isShowCVComments;
  }

  get takeCVStatistic(): CVStatistic[] {
    return this.cvStatistic;
  }

  get takeAssignees(): number[] {
    return this.assignees;
  }

  @Mutation
  setRecruitment(res): void {
    if (res) {
      this.recruitment = res.recruitment;
      this.branches = new Map(Object.entries(res.branches));
      this.users = new Map(Object.entries(res.users));
      this.cvStatistic = res.cv_statistic;
    } else {
      this.recruitment = null;
    }
  }

  @Mutation
  setJob(res): void {
    this.recruitments = res.recruitments;
    this.pagination = res.pagination;
    this.branches = new Map(Object.entries(res.branches));
    this.users = new Map(Object.entries(res.users));
    this.avatars = new Map(Object.entries(res.avatars));
  }

  @Mutation
  setCVs(res): void {
    this.cvList = res.cvs;
    this.assignees = res.assignees;
  }

  @Mutation
  setShowCVComments(isShowCVComments: boolean): void {
    this.isShowCVComments = isShowCVComments;
  }

  @Mutation
  setCVComments(res): void {
    this.cvComments = res.comments;
    this.users = new Map(Object.entries(res.users));
  }

  @Action({ rawError: true })
  async createJob(params: RecruitmentParams) : Promise<any> {
    const res = await axios!.$post('/recruitment/create-job', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit:'setJob', rawError: true })
  async getJobs(params: RecruitmentSearchParams) : Promise<any> {
    const res = await axios!.$post('/recruitment/get-jobs', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit:'setRecruitment', rawError: true })
  async getJob(id: number) : Promise<any> {
    const res = await axios!.$post('/recruitment/get-job', { id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editJob(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/edit-job', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async uploadCV(params: CreateCvParam) : Promise<any> {
    const res = await axios!.$post('/recruitment/upload-cv', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeJob(id: number) : Promise<any> {
    const res = await axios!.$post('/recruitment/remove-job', { id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setCVs', rawError: true })
  async getCvs(recruitment_id: number) : Promise<any> {
    const res = await axios!.$post('/recruitment/get-cvs', { recruitment_id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editCv(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/edit-cv', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeCV(id: number) : Promise<any> {
    const res = await axios!.$post('/recruitment/remove-cv', { id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createCvComment(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/create-cv-comment', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editCvComment(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/edit-cv-comment', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeCvComment(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/remove-cv-comment', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setCVComments', rawError: true })
  async getCvComments(params: any) : Promise<any> {
    const res = await axios!.$post('/recruitment/get-cv-comments', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }
}
