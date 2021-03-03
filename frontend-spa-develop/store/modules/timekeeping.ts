import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {
  Timekeeping, TimekeepingItem, Pagination,
  SeachTimekeepingUserSubmit, TimekeepingListSubmit, TimekeepingsTable
} from '~/types/user-timekeeping';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/timekeeping'
})

export default class ProjectModule extends VuexModule {
  timekeeping: Timekeeping | null = null
  listUserTimekeeping : TimekeepingItem[] = [];
  timeKeepingsTable : TimekeepingsTable[] = []
  paginationTimekeepingList : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page:  0
  }
  paginationManageRequest : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page:  0
  }

  get takeTimekeeping() : Timekeeping | null {
    return this.timekeeping;
  }

  get takeListUserTimekeeping() : TimekeepingItem[] | [] {
    return this.listUserTimekeeping;
  }

  get objPaginationManageRequest() : Pagination {
    return this.paginationManageRequest;
  }

  get arrTimeKeepingTable() : TimekeepingsTable[] {
    return this.timeKeepingsTable;
  }

  @Mutation
  setTimekeeping(timekeeping : Timekeeping) : void {
    this.timekeeping = timekeeping;
  }

  @Mutation
  setListUserTimekeepingPagination(res: any) : void {
    this.listUserTimekeeping = res.timekeepings;
    this.paginationManageRequest = res.pagination;
  }

  @Action({ commit: 'setTimekeeping', rawError: true })
  async getTodayTimekeeping() : Promise<Timekeeping> {
    const res = await axios!.$post('/timekeeping/get-timekeeping-today');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as Timekeeping);
  }

  @Action({ rawError: true })
  async Checkin() : Promise<void> {
    const res = await axios!.$post('/timekeeping/check-in');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }
  }

  @Action({ rawError: true })
  async Checkout() : Promise<void> {
    const res = await axios!.$post('/timekeeping/check-out');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }
  }

  @Action({ commit: 'setListUserTimekeepingPagination', rawError: true })
  async LoadListUserTimekeeping(seachTimekeepingUserSubmit: SeachTimekeepingUserSubmit) : Promise<any> {
    const res = await axios!.$post('/timekeeping/get-all-timekeeping-user', seachTimekeepingUserSubmit);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Mutation
  setListAndPagination(res: any) : void {
    this.timeKeepingsTable = (res.timekeepings as TimekeepingsTable[]);
  }

  @Action({ commit: 'setListAndPagination', rawError: true })
  async searchTimekeepingTable(timekeepingListSubmit: TimekeepingListSubmit) : Promise<any> {
    const res = await axios!.$post('/timekeeping/get-all-timekeeping', timekeepingListSubmit);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async exportToExcel(params: object) : Promise<any> {
    const res = await axios!.$get(
      '/timekeeping/export-excel', { params: params, responseType: 'blob' }
    );
    return res;
  }
}
