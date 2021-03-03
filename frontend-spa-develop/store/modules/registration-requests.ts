import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { TableManageRequest, ManageRequestSubmit, Pagination, UpdateRequestStatusSubmit } from '~/types/registration-requests';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/registration-requests'
})

export default class RegistrationRequestsModule extends VuexModule {
  tableManageRequest : TableManageRequest[] = [];
  paginationManageRequest : Pagination = {
    current_page: 1,
    total_row:    0,
    row_perpage:  0
  }

  get objPagination() : Pagination {
    return this.paginationManageRequest;
  }

  get arrTableManageRequest() : TableManageRequest[] | [] {
    return this.tableManageRequest.length > 0 ? this.tableManageRequest : [];
  }

  @Mutation
  setListAndPagination(res: any) : void {
    this.paginationManageRequest = (res.pagination as Pagination);
    this.tableManageRequest = (res.list_request as TableManageRequest[]);
  }

  @Mutation
  public setCurrentPageNumber(pageNumber: number): void {
    this.paginationManageRequest.current_page = pageNumber;
  }

  @Action({ commit: 'setListAndPagination', rawError: true })
  async searchTableManageRequest(formManageRequest: ManageRequestSubmit) : Promise<any> {
    const res = await axios!.$post('/request/searchListRequest',
      formManageRequest
    );

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async updateRequestStatus(objUpdateRequestStatus: UpdateRequestStatusSubmit) : Promise<void> {
    const res = await axios!.$post('/request/updateRequestStatus',
      objUpdateRequestStatus
    );

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }
  }

  @Action({ rawError: true })
  async resendEmailRegister(requestId: number) : Promise<string> {
    const res = await axios!.$post('/request/resendEmailRegister',
      {
        request_id: requestId
      }
    );

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.message;
  }

  @Action({ rawError: true })
  async inviteUser(emailList: string[]) : Promise<any> {
    const response = await axios!.$post('/registration/inviteUser', { emailList: emailList });

    if (response.status === FailResponseCode) {
      throw new Array([response.message, response.data]);
    }

    return response;
  }

  @Action({ rawError: true })
  async downloadTemplate(typeFile: string): Promise<any> {
    const res = await axios!.$post(
      '/registration/download-template',
      { type_file: typeFile }, { responseType: 'blob' });
    return res;
  }
}
