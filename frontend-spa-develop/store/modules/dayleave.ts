import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { LeaveInfo, LeaveBonus, LeaveRequestParams, AllUserName, LeaveBonusesResponse, UserInfo } from '~/types/dayleave';
import { SearchParams, UserLeave, Pagination } from '~/types/history-dayleave';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/dayleave'
})

export default class DayLeaveModule extends VuexModule {
  dayBonus: number = 0;
  dayRemaining: number = 0;
  dayUsed: number = 0;
  leaveBonusType: Map<string, string> | null = null;
  leaveRequestType: Map<string, string> | null = new Map();
  subtractDayOffTypes: Map<string, string> = new Map();
  userList: Map<string, string> = new Map();
  holidays: string[] = [];
  leaveBonuses: LeaveBonusesResponse[] = [];
  leaveBonus: LeaveBonus | null = null;
  totalRow: number = 0;
  userInfo: UserInfo | null = null;
  isShowBonusLeaveModal: boolean = false;
  isUpdateLeaveBonus: boolean = false;
  userLeaveList: UserLeave[] = [];
  paginationHistoryLeave : Pagination = {
    current_page  : 1,
    total_row     : 0,
    row_per_page  : 0
  }

  get listLeaveRequestType(): Map<string, string> | null {
    return this.leaveRequestType;
  }

  get listLeaveBonusType(): Map<string, string> | null {
    return this.leaveBonusType;
  }

  get takeDayRemaining(): number {
    return this.dayRemaining;
  }

  get takeDayUsed() : number {
    return this.dayUsed;
  }

  get takeHolidays() : string[] {
    return this.holidays;
  }

  get takeUserList(): Map<string, string> {
    return this.userList;
  }

  get takeLeaveBonuses(): LeaveBonusesResponse[] {
    return this.leaveBonuses;
  }

  get takeLeaveBonus(): LeaveBonus | null {
    return this.leaveBonus;
  }

  get takeTotalRow(): number {
    return this.totalRow;
  }

  get userName(): string {
    return (this.userInfo && this.userInfo.full_name) || '';
  }

  get userEmail(): string {
    return (this.userInfo && this.userInfo.email) || '';
  }

  get userAvatar(): string | null {
    return this.userInfo && this.userInfo.avatar;
  }

  get checkShowBonusLeaveModal(): boolean {
    return this.isShowBonusLeaveModal;
  }

  get hasUpdateLeaveBonus(): boolean {
    return this.isUpdateLeaveBonus;
  }

  get takeUserLeaveList(): UserLeave[] {
    return this.userLeaveList;
  }

  get takePaginationHistoryLeave() : Pagination {
    return this.paginationHistoryLeave;
  }

  get takeSubtractDayOffTypes() : Map<string, string> {
    return this.subtractDayOffTypes;
  }

  @Mutation
  setDayRemaining(value: number): void {
    this.dayRemaining = value;
  }

  @Mutation
  setHasUpdateLeaveBonus(value: boolean): void {
    this.isUpdateLeaveBonus = value;
  }

  @Mutation
  setShowBonusLeaveModal(value: boolean): void {
    this.isShowBonusLeaveModal = value;
  }

  @Mutation
  setLeaveInfo(res: LeaveInfo): void {
    this.leaveBonusType = res.leave_bonus_types && new Map(Object.entries(res.leave_bonus_types));
    this.leaveRequestType = res.leave_request_types && new Map(Object.entries(res.leave_request_types));
    this.dayRemaining = res.day_remaining;
    this.dayUsed = res.day_used;
    this.holidays = res.holidays;
    this.userInfo = res.user_info;
  }

  @Mutation
  setLeaveBonusHistory(res: any): void {
    this.leaveBonusType = res.leave_bonus_types && new Map(Object.entries(res.leave_bonus_types));
    this.userList = res.user_list && new Map(Object.entries(res.user_list));
    this.leaveBonuses = res.user_leave_bonuses;
    this.totalRow = res.pagination.total_row;
  }

  @Mutation
  setLeaveBonus(res: any): void {
    this.leaveBonus = res;
    if (res) {
      this.leaveBonusType = res.leave_bonus_types && new Map(Object.entries(res.leave_bonus_types));
    }
  }

  @Mutation
  setPaginationHistoryLeave(res: Pagination) : void {
    this.paginationHistoryLeave = res;
  }

  @Mutation
  setLeaveRequest(res: UserLeave[]): void {
    this.userLeaveList = res;
  }

  @Mutation
  setLeaveHistoryInfo(res: any) : void {
    this.userList = res.user_list && new Map(Object.entries(res.user_list));
    this.userLeaveList = res.user_leave;
    this.paginationHistoryLeave = res.pagination;
    this.leaveRequestType = res.leave_request_types && new Map(Object.entries(res.leave_request_types));
    this.subtractDayOffTypes = res.subtract_day_off_types && new Map(Object.entries(res.subtract_day_off_types));
  }

  @Action({ commit: 'setLeaveInfo', rawError: true })
  async getLeaveInfo(leaveParams: object) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-info', leaveParams);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createLeaveRequest(leaveRequest: object) : Promise<any> {
    const res = await axios!.$post('/leave/create-leave', leaveRequest);

    return res;
  }

  @Action({ commit: 'setLeaveHistoryInfo', rawError: true })
  async getLeaveHistory(searchObj: SearchParams) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-history', searchObj);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async getLeaveRequests(searchParams: LeaveRequestParams) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-requests', searchParams);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async addLeaveBonus(bonusParams: LeaveBonus[]) : Promise<any> {
    const res = await axios!.$post('/leave/create-leave-bonus', { leave_bonus: bonusParams });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeLeaveRequests(leave_id: number) : Promise<any> {
    const res = await axios!.$post('/leave/remove-leave', { leave_id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async getLeaveInfoAllUser(allUser: AllUserName) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-info-all-user', allUser);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setLeaveBonusHistory', rawError: true })
  async getLeaveBonuses(params: any) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-bonuses', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editLeaveBonuses(params: any) : Promise<any> {
    const res = await axios!.$post('/leave/edit-leave-bonus', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeLeaveBonus(params: any) : Promise<any> {
    const res = await axios!.$post('/leave/remove-leave-bonus', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setLeaveBonus', rawError: true })
  async getLeaveBonus(id: number) : Promise<any> {
    const res = await axios!.$post('/leave/get-leave-bonus', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async importCsv(formData: any): Promise<any> {
    const res = await axios!.$post(
      '/leave/import-bonuses',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } });
    return res;
  }

  @Action({ rawError: true })
  async downloadTemplate(typeFile: string): Promise<any> {
    const res = await axios!.$post(
      '/leave/download-template',
      { type_file: typeFile }, { responseType: 'blob' });
    return res;
  }

  @Action({ rawError: true })
  async exportToExcel(params: object) : Promise<any> {
    const res = await axios!.$get(
      '/leave/export-excel', { params: params, responseType: 'blob' }
    );
    return res;
  }
}
