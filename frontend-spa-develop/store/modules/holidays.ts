import { VuexModule, Module, Action } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import { Holiday, Pagination } from '~/types/holidays';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/holidays'
})

export default class DayLeaveModule extends VuexModule {
  pagination: Pagination | null = null
  holidays  : Holiday[] = []

  @Action({ rawError: true })
  async getHolidays(year: any) : Promise<any> {
    const res = await axios!.$post('/holiday/get-holidays', { year });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createHoliday(params: any) : Promise<any> {
    const res = await axios!.$post('/holiday/create-holiday', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeHoliday(id: any) : Promise<any> {
    const res = await axios!.$post('/holiday/remove-holiday', { id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editHoliday(params: any) : Promise<any> {
    const res = await axios!.$post('/holiday/edit-holiday', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
