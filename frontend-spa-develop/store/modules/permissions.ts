import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { UserAndPermissions, FunctionPermission, Pagination } from '~/types/permissions';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/permissions'
})

export default class PermissionsModule extends VuexModule {
  userAndPermissionList: UserAndPermissions[] = []
  roleList: Map<number, string> = new Map([
    [2, 'Manager'],
    [3, 'Member'],
    [4, 'General Manager']
  ])
  permissionList: Map<number, string> = new Map([
    [2, 'Manage Profiles, Manage projects, Timekeeping, Manage leave, Evaluate the members in the project, Manage Overtime of the project members'],
    [3, 'Edit profile, View the project participation, Timekeeping,  Manage leave, Create overtime, Manage goal'],
    [4, 'All permissions']
  ])
  modulesOrg: Map<string, FunctionPermission[]> = new Map()
  pagination: Pagination = {
    current_page: 1,
    row_per_page: 15,
    total_row: 0
  }

  get takeUserAndPermissionList(): UserAndPermissions[] {
    return this.userAndPermissionList;
  }

  get takeRoleList(): Map<number, string> {
    return this.roleList;
  }

  get takePermissionList(): Map<number, string> {
    return this.permissionList;
  }

  get takeModuleList(): Map<string, FunctionPermission[]> {
    return this.modulesOrg;
  }

  get takePagination(): Pagination {
    return this.pagination;
  }

  @Mutation
  setUserAndPermissions(res: any): void {
    this.userAndPermissionList = res.user_permissions;
    this.pagination = res.pagination;
  }

  @Mutation
  setPermissions(res: any): void {
    this.modulesOrg = new Map(Object.entries(res));
  }

  @Action({ rawError: true })
  async createPermission(params: any): Promise<any> {
    const res = await axios!.$post('/user-permission/create-permission', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setPermissions', rawError: true })
  async getPermissions(user_id: number): Promise<any> {
    const res = await axios!.$post('/user-permission/get-permissions', { user_id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    console.log('function permission : ', res.data);
    return res.data;
  }

  @Action({ commit:'setUserAndPermissions', rawError: true })
  async getUserAndPermissions(params: any): Promise<any> {
    const res = await axios!.$post('/user-permission/get-user-permissions', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editPermissions(params: any): Promise<any> {
    const res = await axios!.$post('/user-permission/edit-permission', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
