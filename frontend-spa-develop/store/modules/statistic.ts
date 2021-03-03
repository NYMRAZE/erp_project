import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import {
  TechnologyStatistic,
  TechnologyStatisticDetail,
  StatisticPagination,
  NumberPeopleBranch,
  NumberPeopleJobTitle,
  UserRankLog,
  NumberPeopleJapaneseLevel,
  NumberPeopleInterestTechnology,
  EvaluationRank,
  NumberPeopleProject,
  JobTitleStatistic,
  JobTitleStatisticDetail,
  BranchStatistic,
  BranchStatisticDetail,
  JpLevelStatistic,
  JpLevelStatisticDetail,
  CommentStatisticDetail,
  CommentStatisticParams
} from '~/types/statistic';
@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/statistic'
})

export default class DayLeaveModule extends VuexModule {
  dayOffInfo: Map<string, string> = new Map<string, string>();
  technologyList: Map<string, string> = new Map<string, string>();
  total: Map<string, string> = new Map<string, string>();
  numberPeopleBranch: NumberPeopleBranch[] = [];
  numberPeopleJobTitle: NumberPeopleJobTitle[] = [];
  userRankLogs: UserRankLog[] = [];
  numberPeopleJapaneseLevel: NumberPeopleJapaneseLevel[] = [];
  numberPeopleInterestTechnology: NumberPeopleInterestTechnology[] = [];
  evaluationRank: EvaluationRank = {
    datetime: [],
    datasets: []
  };
  techStatisticDetail: TechnologyStatisticDetail | null = null
  techStatisticPagination: StatisticPagination | null = null
  jobTitleStatisticDetail: JobTitleStatisticDetail | null = null
  jobTitleStatisticPagination: StatisticPagination | null = null
  branchStatisticDetail: BranchStatisticDetail | null = null
  branchStatisticPagination: StatisticPagination | null = null
  jpLevelStatisticDetail: JpLevelStatisticDetail | null = null
  jpLevelStatisticPagination: StatisticPagination | null = null
  numberPeopleProject: NumberPeopleProject[] = [];
  commentStatistic: CommentStatisticDetail[] = []

  get takeTechnologyList(): Map<string, string> {
    return this.technologyList;
  }

  get takeDayOffInfo(): Map<string, string> {
    return this.dayOffInfo;
  }

  get takeTotal(): Map<string, string> {
    return this.total;
  }

  get takeNumberPeopleBranch(): NumberPeopleBranch[] {
    return this.numberPeopleBranch ? this.numberPeopleBranch : [];
  }

  get takeNumberPeopleJobTitle(): NumberPeopleJobTitle[] {
    return this.numberPeopleJobTitle ? this.numberPeopleJobTitle : [];
  }

  get takeUserRankLogs(): UserRankLog[] {
    return this.userRankLogs ? this.userRankLogs : [];
  }

  get takeNumberPeopleJapaneseLevel(): NumberPeopleJapaneseLevel[] {
    return this.numberPeopleJapaneseLevel ? this.numberPeopleJapaneseLevel : [];
  }

  get takeNumberPeopleInterestTechnology(): NumberPeopleInterestTechnology[] {
    return this.numberPeopleInterestTechnology ? this.numberPeopleInterestTechnology : [];
  }

  get takeEvaluationRank(): EvaluationRank {
    return this.evaluationRank ? this.evaluationRank : {
      datetime: [],
      datasets: []
    };
  }

  get takeNumberPeopleProject(): NumberPeopleProject[] {
    return this.numberPeopleProject ? this.numberPeopleProject : [];
  }

  get takeBranchStatisticDetail(): BranchStatisticDetail | null {
    return this.branchStatisticDetail;
  }

  get takeTechnologyStatisticDetail(): TechnologyStatisticDetail | null {
    return this.techStatisticDetail;
  }

  get takeJpLevelStatisticDetail(): JpLevelStatisticDetail | null {
    return this.jpLevelStatisticDetail;
  }

  get takeRowPerPageTechStatistic(): number {
    return this.techStatisticPagination ? this.techStatisticPagination.row_per_page : 0;
  }

  get takeTotalRowTechStatistic(): number {
    return this.techStatisticPagination ? this.techStatisticPagination.total_row : 0;
  }

  get takeJobTitleStatisticDetail(): JobTitleStatisticDetail | null {
    return this.jobTitleStatisticDetail;
  }

  get takeRowPerPageJobTitleStatistic(): number {
    return this.jobTitleStatisticPagination ? this.jobTitleStatisticPagination.row_per_page : 0;
  }

  get takeTotalRowJobTitleStatistic(): number {
    return this.jobTitleStatisticPagination ? this.jobTitleStatisticPagination.total_row : 0;
  }

  get takeRowPerPageBranchStatistic(): number {
    return this.branchStatisticPagination ? this.branchStatisticPagination.row_per_page : 0;
  }

  get takeTotalRowBranchStatistic(): number {
    return this.branchStatisticPagination ? this.branchStatisticPagination.total_row : 0;
  }

  get takeRowPerPageJpLevelStatistic(): number {
    return this.jpLevelStatisticPagination ? this.jpLevelStatisticPagination.row_per_page : 0;
  }

  get takeTotalRowJpLevelStatistic(): number {
    return this.jpLevelStatisticPagination ? this.jpLevelStatisticPagination.total_row : 0;
  }

  get takeCommentStatistic(): CommentStatisticDetail[] {
    return this.commentStatistic;
  }

  @Mutation
  setStatistic(response): void {
    this.dayOffInfo = new Map(Object.entries(response.day_off_info));
    this.total = new Map(Object.entries(response.total));
    this.numberPeopleBranch = response.number_people_branch;
    this.numberPeopleJobTitle = response.number_people_job_title;
    this.userRankLogs = response.user_rank_logs;
    this.numberPeopleJapaneseLevel = response.number_people_japanese_level;
    this.numberPeopleInterestTechnology = response.number_people_interest_technology;
    this.evaluationRank.datetime = response.evaluation_rank.datetime;
    this.evaluationRank.datasets = response.evaluation_rank.datasets;
  }

  @Mutation
  setTechStatisticDetail(res): void {
    this.techStatisticDetail = res.statistic_detail;
    this.techStatisticPagination = res.pagination;
  }

  @Mutation
  setJobTitleStatisticDetail(res): void {
    this.jobTitleStatisticDetail = res.statistic_detail;
    this.jobTitleStatisticPagination = res.pagination;
  }

  @Mutation
  setBranchStatisticDetail(res): void {
    this.branchStatisticDetail = res.statistic_detail;
    this.branchStatisticPagination = res.pagination;
  }

  @Mutation
  setJpLevelStatisticDetail(res): void {
    this.jpLevelStatisticDetail = res.statistic_detail;
    this.jpLevelStatisticPagination = res.pagination;
  }

  @Mutation
  setProjectStatistic(response): void {
    this.numberPeopleProject = response.number_people_project;
  }

  @Mutation
  setCommentStatistic(res): void {
    this.commentStatistic = res;
  }

  @Action({ commit: 'setStatistic', rawError: true })
  async getStatistic() : Promise<any> {
    const res = await axios!.$post('/statistic/general');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setProjectStatistic', rawError: true })
  async getProjectStatistic(paginationObj: object) : Promise<any> {
    const res = await axios!.$post('/statistic/project-statistic-detail', paginationObj);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setTechStatisticDetail', rawError: true })
  async getTechStatisticDetail(params: TechnologyStatistic) : Promise<any> {
    const res = await axios!.$post('/statistic/technology-statistic-detail', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setJobTitleStatisticDetail', rawError: true })
  async getJobTitleStatisticDetail(params: JobTitleStatistic) : Promise<any> {
    const res = await axios!.$post('/statistic/job-title-statistic-detail', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setBranchStatisticDetail', rawError: true })
  async getBranchStatisticDetail(params: BranchStatistic) : Promise<any> {
    const res = await axios!.$post('/statistic/branch-statistic-detail', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setJpLevelStatisticDetail', rawError: true })
  async getJpLevelStatisticDetail(params: JpLevelStatistic) : Promise<any> {
    const res = await axios!.$post('/statistic/jp-level-statistic-detail', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setCommentStatistic', rawError: true })
  async getCommentTwoConsecutiveQuarter(params: CommentStatisticParams) : Promise<any> {
    const res = await axios!.$post('/evaluation/get-comment-two-consecutive-quarter', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }
}
