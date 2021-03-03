import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {
  Project,
  TargetProject,
  ProjectTable,
  ProjectSubmit,
  CreateProjectSubmit,
  Pagination,
  UserProject,
  UserBranch } from '~/types/project';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/project'
})

export default class ProjectModule extends VuexModule {
  project: Project | null = null;
  userProject: UserProject[] = []
  projectTable : ProjectTable[] = [];
  projectUserJoin : ProjectTable[] | null = [];
  paginationProject : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page:  0
  }
  userBranch : UserBranch[] = []
  paginationUserProject :  Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page:  0
  }
  usersManagedList: number[] = []
  userList: Map<string, string> = new Map()
  usersIdJoinProject: number[] = [];
  avatars: Map<string, string> = new Map()

  get takeProject() : Project | null {
    return this.project;
  }

  get takeUsersIdJoinProject(): number[] {
    return this.usersIdJoinProject;
  }

  get takeTargetProject() : TargetProject[] | [] {
    if (this.project && this.project.targets) {
      return this.project.targets;
    }

    return [];
  }

  get arrProjectTable() : ProjectTable[] | [] {
    return this.projectTable.length > 0 ? this.projectTable : [];
  }

  get takeUserProject() : UserProject[] | null {
    return this.userProject;
  }

  get takeUserBranchList() : UserBranch[] {
    return this.userBranch;
  }

  get takePaginationUserProject() : Pagination {
    return this.paginationUserProject;
  }

  get takePaginationProject() : Pagination {
    return this.paginationProject;
  }

  get takeUserList() : Map<string, string> {
    return this.userList;
  }

  get takeUsersManageList() : number[] {
    return this.usersManagedList;
  }

  get takeProjectUserJoin(): ProjectTable[] | null {
    return this.projectUserJoin;
  }

  get takeAvatars(): Map<string, string> {
    return this.avatars;
  }

  @Mutation
  setProject(res: any) : void {
    this.project = res;
    if (res && res.users) {
      this.userList = new Map(Object.entries(res.users));
    }
    if (res && res.users_id_join_project) {
      this.usersIdJoinProject = res.users_id_join_project;
    }
    if (res && res.avatar) {
      this.avatars = new Map(Object.entries(res.avatars));
    }
  }

  @Mutation
  setProjectTable(data: any): void {
    this.projectTable = data;
  }

  @Mutation
  setUserProjectList(res: any) : void {
    this.userProject = res ? res.user_projects : null;
    if (res) {
      this.userList = new Map(Object.entries(res.user_box));
    }
  }

  @Mutation
  setProjectUserJoin(projects: ProjectTable[] | null): void {
    this.projectUserJoin = projects;
  }

  @Mutation
  setListAndPagination(res: any) : void {
    this.paginationProject = (res.pagination as Pagination);
    this.projectTable = (res.projects as ProjectTable[]);

    if (res && res.user) {
      this.userList = new Map(Object.entries(res.users));
    }
  }

  @Mutation
  setListUsersManaged(res: any) : void {
    this.usersManagedList = res;
  }

  @Mutation
  setUserList(userList: any) : void {
    this.userList = userList;
  }

  @Mutation
  public setCurrentPageNumber(pageNumber: number): void {
    this.paginationProject.current_page = pageNumber;
  }

  @Action({ commit: 'setListAndPagination', rawError: true })
  async searchProjectTable(searchProjectForm: ProjectSubmit) : Promise<any> {
    const res = await axios!.$post('/project/get-project-list', searchProjectForm);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setListAndPagination', rawError: true })
  async searchProjectsOfUser(searchProjectForm: ProjectSubmit): Promise<any> {
    const res = await axios!.$post('/project/get-projects-assigned', searchProjectForm);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createProject(createProjectForm: CreateProjectSubmit) : Promise<any> {
    const res = await axios!.$post('/project/add-project', createProjectForm);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async deleteProject(projectID: number) : Promise<any> {
    const res = await axios!.$post('/project/delete-project', { 'project_id': projectID });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setProject', rawError: true })
  async getProject(projectId: number) : Promise<Project> {
    const res = await axios!.$post('/project/get-project-details', { project_id: projectId });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data as Project);
  }

  @Action({ rawError: true })
  async editProject(projectObj: Project) : Promise<any> {
    const res = await axios!.$post('/project/update-project', projectObj);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setUserProjectList', rawError: true })
  async getUserProject(projectObj: any) : Promise<any> {
    const res = await axios!.$post('/user-project/get-user-project', projectObj);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async addUserProject(projectObj: any) : Promise<any> {
    const res = await axios!.$post('/user-project/create-user-project', projectObj);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async deleteUserProject(id: number) : Promise<any> {
    const res = await axios!.$post('/user-project/remove-user-from-project', { id });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }
    return res;
  }

  @Action({ commit: 'setListUsersManaged', rawError: true })
  async getUserManaged() : Promise<any> {
    const res = await axios!.$post('/user-project/get-user-ids-managed-by-manager');

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setProjectUserJoin', rawError: true })
  async getProjectUserJoin(user_id: number): Promise<any> {
    const res = await axios!.$post('/user-project/get-projects-user-join', { user_id });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }
    return res.data;
  }
}
