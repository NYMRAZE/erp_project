<template>
  <div class="padding-sm-x" @click="unfocusList($event)">
    <div
      class="board py-3"
      style="background-color: inherit">
      <div>
        <nuxt-link to="/workflow/boards" class="text-decoration-none d-inline-block">
          <h4 class="sub-page-title font-weight-bold">
            <div class="container-icon-circle">
              <span class="fas fa-play fa-rotate-180"></span>
            </div>
            {{ $t('Back to board') }}
          </h4>
        </nuxt-link>
      </div>
      <div class="form-row bg-white mx-0 mt-2" style="border-radius: 8px">
        <div class="col-xl-6">
          <div class="d-flex align-items-center personal-board py-3">
            <div class="board-title">
              <b-form-input
                :value="boardName"
                :readonly="isEnableEdit"
                type="text"
                class="bg-transparent border-0"
                @click="enableEdit('board')"
                @blur.prevent="editBoardName"
                @keyup.enter="editBoardName" />
            </div>
          </div>
        </div>
        <div class="col-xl-6">
          <div class="py-3 pl-2">
            <label class="text-dark font-weight-bold">
              {{ $t("Members") }}
            </label>
            <div ref="assignee_list" class="d-flex">
              <div>
                <div v-for="(assignee, index) in memberAssigned" :key="index" class="avatars-member">
                  <img
                    width="30"
                    height="30"
                    class="rounded-circle mr-2"
                    :src="linkAvatar(getAvatarByKey(assignee.user_id))" />
                  <div class="d-flex flex-column">
                    <span
                      class="d-flex align-items-center justify-content-center icon-trash"
                      @click="removeUserProject(assignee.id)">
                      <i class="fas fa-trash-alt text-white"></i>
                    </span>
                    <span class="user-name">{{ getUserNameByKey(assignee.user_id) }}</span>
                  </div>
                </div>
                <span
                  class="d-flex align-items-center justify-content-center bg-dark assign-member"
                  @click.prevent="showDropDown('member')">
                  <i class="fas fa-plus text-white"></i>
                </span>
              </div>
              <div id="assignee-dropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                <div class="p-2">
                  <input
                    v-model="memberNameInput"
                    type="text"
                    class="form-control"
                    @input="handleChangeInput"
                    @keydown="selectMemberPressKey($event)">
                </div>
                <ul ref="itemList" class="list-user" @mouseover="focusList">
                  <li
                    v-for="(key, index) in userListSearching"
                    ref="item"
                    :key="index"
                    :class="index + 1 === focusIndex && !isMouseOver && 'focus-item'"
                    @click.prevent="selectMember(key)">
                    {{ getUserNameByKey(key) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 overflow-auto">
        <div class="d-flex" style="min-width: 100vw; margin-bottom: 10rem;">
          <Draggable
            v-for="(column, index) in columnsData"
            :key="index"
            class="column">
            <div class="d-flex justify-content-between mb-2 column-name">
              <b-form-input
                ref="columnName"
                :value="column.kanban_list_name"
                type="text"
                class="w-100 bg-transparent font-weight-bold border-0 title"
                @click="enableEdit('column', index)"
                @blur.prevent="editListName($event, column)"
                @keyup.enter="editListName($event, column)" />
              <b-nav-item-dropdown class="d-flex align-items-center three-dots" no-caret>
                <template v-slot:button-content>
                  <i class="fas fa-ellipsis-h text-gray"></i>
                </template>
                <template>
                  <b-dropdown-header>
                    {{ $t('List Actions') }}
                  </b-dropdown-header>
                  <b-dropdown-item-button aria-describedby="dropdown-header-label" @click="removeList(column.kanban_list_id)">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-archive mr-1"></i>
                      {{ $t('Archive This List') }}
                    </div>
                  </b-dropdown-item-button>
                </template>
              </b-nav-item-dropdown>
            </div>
            <Draggable
              :list="column.kanban_tasks"
              ghost-class="ghost-card"
              group="tasks"
              @change="onChangeTask($event, index)">
              <TaskCard
                v-for="(task, i) in column.kanban_tasks"
                :key="i"
                :task="task"
                :column-id="column.kanban_list_id"
                :task-index="i"
                :column-index="index"
                class="mt-3 cursor-move">
              </TaskCard>
            </Draggable>
            <div class="mt-3">
              <b-form-input
                ref="inputTask"
                type="text"
                class="w-100 bg-white"
                rows="3"
                style="border-radius: 8px;
                border: 2px dashed #ced4da;
                height: 70px !important;"
                :placeholder="$t('+ Add a card')"
                @click.prevent="enableEdit('task', index)"
                @keyup.enter="createTask(column, index)" />
              <div ref="emptyCard" class="d-none">
                <div class="d-flex mt-2">
                  <button type="button" class="btn btn-sm btn-success add-card-btn mr-2" @click.prevent="createTask(column, index)">
                    {{ $t("Add") }}
                  </button>
                  <span
                    class="prevent-add-item d-flex align-items-center"
                    @click="preventAddItem(index)">
                    &times;
                  </span>
                </div>
              </div>
            </div>
          </Draggable>
          <div class="d-flex flex-column new-column">
            <b-form-input
              v-model="newColumnName"
              :placeholder="$t('+ Add a list')"
              type="text"
              class="p-3 mr-2 flex-grow border-0"
              @keyup.enter="createColumn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import TaskCard from '@/components/Board/TaskCard.vue';
import TaskDetail from '@/components/Board/TaskDetail.vue';
import Draggable from 'vuedraggable';
import { taskStore, notificationStore, projectStore, layoutAdminStore } from '../../store';
import { UserProject } from '~/types/project';
import slugify from '~/utils/unaccent';
import { Task } from '~/types/task-project';

@Component({
  components: {
    TaskCard,
    TaskDetail,
    Draggable
  },
  middleware: ['auth'],
  layout: 'Admin'
})
export default class extends Vue {
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  isEnableEdit: boolean = true
  projectID: number = 0
  boardID: number = 0
  taskID: number = 0
  errResponse: string = ''
  height: number = 0
  newColumnName: string = ''
  isTaskOpen: boolean = false
  responseMessage: string = ''
  isShow: boolean = false
  memberName: string = ''
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  memberAssigned: UserProject[] = []
  errorProjectName: string = ''
  errorManagedBy: string = ''
  isEnableEditColumn: boolean = true
  isEnableEditCard: boolean = true
  isAddItem: boolean = false
  taskParam: Task = {}
  taskInput: string = ''

  beforeMount() {
    const $this = this;

    const query = this.$route.query;
    this.projectID = parseInt(query.project_id.toString());
    this.boardID = parseInt(query.id.toString());
    this.taskID = query.task_id ? parseInt(query.task_id.toString()) : 0;

    const title = 'Manage Tasks';
    layoutAdminStore.setTitlePage(title);

    setTimeout(async() => {
      await $this.getKanbanBoard();
      await $this.getUserProjectJoined();
    }, 100);
  }

  get boardName() {
    return taskStore.takeBoardName;
  }

  get kanbanTask() {
    return taskStore.takeTask;
  }

  get takeAvatars() {
    return projectStore.takeAvatars;
  }

  get takeUserProject() {
    return projectStore.takeUserProject;
  }

  get takeUserList(): Map<string, string> {
    return new Map(JSON.parse(JSON.stringify(Array.from(projectStore.takeUserList))));
  }

  get takeColumns() {
    return taskStore.takeColumns;
  }

  get columnsData() {
    return this.takeCloneColumns(this.takeColumns);
  }

  async navigateTaskByID(taskID: number) {
    try {
      await taskStore.getKanbanTask({
        kanban_task_id: taskID,
        project_id: this.projectID
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async getKanbanBoard() {
    try {
      this.$nuxt.$loading.start();
      if (notificationStore.takeIsNavigateNoti || !this.taskID) {
        await this.getKanbanTasks();
        taskStore.setKanbanTask(null);
      }

      if (this.taskID) {
        this.taskID && await this.navigateTaskByID(this.taskID);
      }
    } catch (err) {
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  enableEdit(type: string, index?: number) {
    switch (type) {
    case 'board':
      this.isEnableEdit = false;
      break;
    case 'column':
      if (index) {
        const columnName = this.$refs.columnName;
        (columnName[index] as any).autofocus = false;
      }
      break;
    case 'task':
      if (index) {
        const emptyCard = this.$refs.emptyCard;
        (emptyCard[index] as any).className = 'd-block';
      }
      break;
    }
  }

  takeCloneColumns(columns: any[]) {
    let cloneColumns: any[] = [];

    if (columns) {
      columns.forEach((value) => {
        let tasks: any[] = [];
        if (value.kanban_tasks) {
          (value.kanban_tasks as any[]).forEach((item) => {
            const task : any = Object.assign({}, item);
            tasks = [ ...tasks, task ];
          });
        }
        const column : any = Object.assign({},
          { ...value, kanban_tasks: tasks, inputTask: '', isAddCard: false, isEnableEditColumn: true });
        cloneColumns = [ ...cloneColumns, column ];
      });
    }

    return cloneColumns;
  }

  async createColumn () {
    try {
      await taskStore.createKanbanList({
        project_id: parseInt(this.$route.query.project_id.toString()),
        name: this.newColumnName,
        kanban_board_id: this.boardID,
        position_in_board: this.columnsData ? this.columnsData.length + 1 : 1
      });
      this.newColumnName = '';
      await this.getKanbanTasks();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async editBoardName(e) {
    try {
      if (!this.isEnableEdit) {
        if (this.boardName !== e.target.value) {
          await taskStore.editKanbanBoard({
            id: this.boardID,
            name: e.target.value,
            project_id: this.projectID
          });
        }
        this.isEnableEdit = true;
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async selectMember(key: any) {
    await this.addUserProject(parseInt(key));
    this.isShow = false;
  }

  async addUserProject(userID: number) {
    try {
      await projectStore.addUserProject({
        user_id: userID,
        project_id: this.projectID
      });
      await this.getUserProjectJoined();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.responseMessage = '';
      }, 3000);
    }
  }

  async getUserProjectJoined() {
    try {
      await projectStore.getUserProject({
        project_id: this.projectID
      });
      this.memberAssigned = this.takeUserProject ? this.takeUserProject.slice() : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  async removeUserProject(id: number) {
    try {
      await projectStore.deleteUserProject(id);
      await this.getUserProjectJoined();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  showDropDown() {
    this.isShow = !this.isShow;
    this.memberNameInput = '';
    this.getUserListSearching();
    this.focusIndex = 0;
    this.isMouseOver = false;
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.takeUserList.entries(), ([key, value]) => {
      if (this.checkContain(value) || value === '') {
        this.userListSearching.push(key);
      }
    });
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  handleChangeInput() {
    this.focusIndex = 0;
    this.getUserListSearching();
  }

  selectMemberPressKey(event) {
    this.isMouseOver = false;
    const wrapperUserList = this.$refs.userList as SVGStyleElement;
    switch (event.keyCode) {
    case 38:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex > 0) {
        this.focusIndex--;
        if ((this.userListSearching.length - this.focusIndex) % 7 === 0) {
          wrapperUserList.scrollTop -= 200;
        }
      }
      break;
    case 40:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex < this.userListSearching.length) {
        this.focusIndex++;
        if (this.focusIndex % 8 === 0) {
          wrapperUserList.scrollTop += 200;
        }
      }
      break;
    case 13:
      const userID = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.memberName = this.getUserNameByKey(userID.toString()) || '';
      this.errorManagedBy = '';
      this.isShow = false;
      break;
    }
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  getUserNameByKey(key: any) {
    return this.takeUserList.get(key.toString());
  }

  getAvatarByKey(key: any) {
    return key ? this.takeAvatars.get(key.toString()) : null;
  }

  linkAvatar(avatar: string) {
    return avatar ? 'data:image/png;base64,' + avatar : this.defaultAvatar;
  }

  async editListName(e, column: any) {
    try {
      if (column.kanban_list_name !== e.target.value) {
        await taskStore.editKanbanList({
          id: column.kanban_list_id,
          name: e.target.value,
          kanban_board_id: this.boardID,
          project_id: this.projectID
        });
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async removeList(columnId: number) {
    try {
      await taskStore.removeKanbanList({
        id: columnId,
        kanban_board_id: this.boardID,
        project_id: this.projectID
      });
      await this.getKanbanTasks();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  unfocusList(event) {
    const assgineeElement = this.$refs.assignee_list as SVGStyleElement;

    if (assgineeElement) {
      const isInside = assgineeElement.contains(event.target);

      if (!isInside) {
        this.isShow = false;
      }
    }
  }

  sortPositionList(tasks: any[]) {
    const positionList: any[] = [];
    tasks.forEach((task, index) => {
      positionList.push({ id: task.kanban_task_id, position_in_list: index + 1 });
    });

    return positionList;
  }

  onChangeTask(event, index: number) {
    if (event.moved) {
      this.taskParam = {
        id: event.moved.element.kanban_task_id,
        kanban_list_id: this.columnsData[index].kanban_list_id,
        new_kanban_list_id: this.columnsData[index].kanban_list_id,
        sort_position_list: this.sortPositionList(this.columnsData[index].kanban_tasks)
      };
    } else {
      if (event.added) {
        this.taskParam = {
          ...this.taskParam,
          id: event.added.element.kanban_task_id,
          kanban_board_id: parseInt(this.$route.query.id.toString()),
          new_kanban_list_id: this.columnsData[index].kanban_list_id,
          sort_new_position_list: this.sortPositionList(this.columnsData[index].kanban_tasks)
        };
      }

      if (event.removed) {
        this.taskParam = {
          ...this.taskParam,
          kanban_list_id: this.columnsData[index].kanban_list_id,
          sort_position_list: this.sortPositionList(this.columnsData[index].kanban_tasks)
        };
      }
    }

    this.$nextTick(async () => {
      await this.editKanbanTask();
      await this.getKanbanTasks();
    });
  }

  async editKanbanTask() {
    try {
      await taskStore.editTask({
        project_id: this.projectID,
        ...this.taskParam
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  async getKanbanTasks() {
    try {
      await taskStore.getKanbanTasks({
        kanban_board_id: this.boardID,
        project_id: this.projectID
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  preventAddItem(index: number) {
    const emptyCard = this.$refs.emptyCard;
    (emptyCard[index] as any).className = 'd-none';
  }

  async createTask(column: any, index: number) {
    try {
      const inputTask = (this.$refs.inputTask[index] as any).localValue;
      if (inputTask.trim()) {
        const kanbanTasks = column.kanban_tasks;
        await taskStore.createTask({
          project_id: parseInt(this.$route.query.project_id.toString()),
          kanban_list_id: column.kanban_list_id,
          title: inputTask,
          important: 2,
          position_in_list: kanbanTasks ? kanbanTasks.length + 1 : 1
        });
        (this.$refs.inputTask[index] as any).localValue = '';
        await this.getKanbanTasks();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }
};
</script>

<style scoped>
.board-title > [type="text"] {
  font-size: 2rem;
  font-weight: 500;
}
input[type="text"]:focus {
  outline: none;
  box-shadow: none;
}
.title:hover {
  border-radius: 3px;
  background-color: rgba(217, 217, 217, 0.7) !important;
  cursor: pointer;
}
.board {
  background-color: inherit;
}
.new-column {
  min-width: 300px;
  padding: 5px;
  height: 50px;
  background-color: #fff;
  border-radius: 8px;
}
.task {
  flex-wrap: wrap;
  min-height: 77px;
  cursor: pointer;
  margin-bottom: .5rem;
  padding: .1rem;
  background-color: #fff;
  color: #3d4852;
  text-decoration: none;
  border-radius: 8px;
  padding: 15px 0;
}
.column {
  position: relative;
  margin-right: 1rem;
  width: 300px;
}
span.assign-member {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  float: left;
}
span.assign-member:hover {
  background-color: rgba(9,30,66,.24);
}
.avatars-member {
  position: relative;
  float: left;
}
.avatars-member .flex-column {
  position: absolute;
  top: 0;
  opacity: 0;
}
.avatars-member .icon-trash {
  width: 30px;
  height: 30px;
  font-size: 14px;
  border-radius: 50%;
  background-color: rgb(213,61,75);
  cursor: pointer;
  transition: all .15s;
}
.avatars-member .user-name {
  bottom: -25px;
  transform: translate(-30%, 0);
  font-size: 11px;
  font-weight: 600;
  position: absolute;
  width: max-content;
  background-color: #dedede;
  padding: 4px;
  border-radius: 5px;
}
.avatars-member .flex-column {
  position: absolute;
  top: 0;
  opacity: 0;
}
.avatars-member:hover > .flex-column {
  opacity: 1;
}
.dropdown-content {
  top: 82px;
  width: 400px;
}
.column-name {
  width: 300px;
  border-radius: 8px;
  background-color: #fff;
  padding: 5px;
}
.three-dots {
  width: 40px;
}
textarea:focus {
  box-shadow: none;
  outline: none;
}
.prevent-add-item {
  font-size: 35px;
  width: 35px;
  height: 25px !important;
  cursor: pointer;
}
.due-date {
  float: left;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
}
.task-status {
  width: 25%;
  height: 8px;
  border-radius: 10px;
}
</style>
