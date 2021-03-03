import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { EvaluationListSubmit, EvaluationTable, Pagination } from '~/types/evaluation';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/evaluation'
})

export default class ProjectModule extends VuexModule {
  evaluationTable : EvaluationTable[] = [];
  paginationEvaluation : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page:  0
  }
  usersManagedList: number[] = []

  get arrEvaluationTable() : EvaluationTable[] | [] {
    return this.evaluationTable.length > 0 ? this.evaluationTable : [];
  }

  get takeUsersManagedList() : number[] {
    return this.usersManagedList;
  }

  @Mutation
  setListAndPagination(res: any) : void {
    this.evaluationTable = (res.evaluations as EvaluationTable[]);
  }

  @Mutation
  setListEval(res: any) : void {
    this.evaluationTable = res;
  }

  @Mutation
  setListUsersManaged(res: any) : void {
    this.usersManagedList = res;
  }

  @Mutation
  public setCurrentPageNumber(pageNumber: number): void {
    this.paginationEvaluation.current_page = pageNumber;
  }

  @Action({ commit: 'setListAndPagination', rawError: true })
  async searchEvaluationTable(evaluationListSubmit: EvaluationListSubmit) : Promise<any> {
    const res = await axios!.$post('/evaluation/search-evaluation-list', evaluationListSubmit);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setListEval', rawError: true })
  async getEvaluationTable() : Promise<any> {
    const res = await axios!.$post('/evaluation/get-evaluations-by-id');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async deleteEvaluation(evaluationID: number) : Promise<any> {
    const res = await axios!.$post('/evaluation/delete-evaluation', { 'evaluation_id': evaluationID });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async exportToExcel(evaluation_ids: number[]) : Promise<any> {
    const res = await axios!.$get(
      '/evaluation/export-excel',
      { params: { evaluation_ids: JSON.stringify(evaluation_ids) } }
    );
    return res.data;
  }

  @Action({ rawError: true })
  async exportEvaluationList(param: any) : Promise<any> {
    param.user_ids = JSON.stringify(param.user_ids);
    const res = await axios!.$get(
      '/evaluation/export-evaluation-list',
      { params: param, responseType: 'blob' }
    );
    return res;
  }
}
