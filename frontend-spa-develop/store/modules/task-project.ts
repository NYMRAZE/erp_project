import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import {
  Pagination,
  ColumnBoard,
  Task,
  KanbanBoard,
  SortPositionInListParam,
  SortPositionInBoardParam } from '~/types/task-project';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/task-project'
})

export default class TaskProjectModule extends VuexModule {
  tasks: Task[] = []
  columns: ColumnBoard[] = []
  kanBanTask: Task | null = null
  users: Map<string, string> = new Map()
  avatars: Map<string, string> = new Map()
  pagination: Pagination = {
    current_page: 1,
    row_per_page: 15,
    total_row: 0
  }
  boardName: string = ''
  kanbanBoards: KanbanBoard[] = []
  fromTask: any | null = null
  sortFromTask: SortPositionInListParam[] = []
  sortToTask: SortPositionInListParam[] = []
  sortColumnList: SortPositionInBoardParam[] = []
  taskIdToMove: number = 0

  get takeColumns(): any {
    return this.columns;
  }

  get takeUsers(): Map<string, string> {
    return this.users;
  }

  get takeAvatars(): Map<string, string> {
    return this.avatars;
  }

  get takeTask(): Task | null {
    return this.kanBanTask;
  }

  get takeTasks(): Task[] {
    return this.tasks;
  }

  get takeFromTask(): any | null {
    return this.fromTask;
  }

  get takeKanbanBoard(): KanbanBoard[] {
    return this.kanbanBoards;
  }

  get takeSortFromTask(): SortPositionInListParam[] {
    return this.sortFromTask;
  }

  get takeSortToTask(): SortPositionInListParam[] {
    return this.sortToTask;
  }

  get takeSortListCol(): SortPositionInBoardParam[] {
    return this.sortColumnList;
  }

  get takeTaskIdToMove(): number {
    return this.taskIdToMove;
  }

  get takeBoardName(): string {
    return this.boardName;
  }

  @Mutation
  REMOVE_TASK(columnIndex: number, taskId: number): void {
    const tasks = [ ...this.columns[columnIndex].kanban_tasks ] as any;
    tasks.splice(taskId, 1);
    this.sortFromTask = [];
    for (const [index, task] of tasks.entries()) {
      this.sortFromTask.push({ id: task.kanban_task_id, position_in_list: index + 1 });
    }
  }

  @Mutation
  setDataResponse(res: any): void{
    this.boardName = res.kanban_board_name;
    this.columns = res.kanban_lists;
    this.users = res && new Map(Object.entries(res.users));
  }

  @Mutation
  setKanbanTask(res): void {
    this.kanBanTask = res && res.kanban_task;
    this.avatars = res && new Map(Object.entries(res.avatars));
  }

  @Action({ commit: 'setDataResponse', rawError: true })
  async getKanbanTasks(params: any) : Promise<any> {
    const res = await axios!.$post('/project/get-kanban-tasks', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data);
  }

  @Action({ commit: 'setKanbanTask', rawError: true })
  async getKanbanTask(params: any) : Promise<any> {
    const res = await axios!.$post('/project/get-kanban-task', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return (res.data);
  }

  @Action({ rawError: true })
  async createTask(params: any) : Promise<any> {
    const res = await axios!.$post('/project/create-kanban-task', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeTask(params: any) : Promise<any> {
    const res = await axios!.$post('/project/remove-task', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editTask(params: any) : Promise<any> {
    const res = await axios!.$post('/project/edit-kanban-task', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createKanbanList(params: any) : Promise<any> {
    const res = await axios!.$post('/project/create-kanban-list', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async createKanbanBoard(params: any) : Promise<any> {
    const res = await axios!.$post('/project/create-kanban-board', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setKanbanBoard', rawError: true })
  async getKanbanBoards(projectID: number) : Promise<any> {
    const res = await axios!.$post('/project/get-kanban-boards', { project_id: projectID });

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editKanbanBoard(params: any) : Promise<any> {
    const res = await axios!.$post('/project/edit-kanban-board', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeKanbanBoard(params: any) : Promise<any> {
    const res = await axios!.$post('/project/remove-kanban-board', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editKanbanList(params: any) : Promise<any> {
    const res = await axios!.$post('/project/edit-kanban-list', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeKanbanList(params: any) : Promise<any> {
    const res = await axios!.$post('/project/remove-kanban-list', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeKanbanTask(params: any) : Promise<any> {
    const res = await axios!.$post('/project/remove-kanban-task', params);

    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
