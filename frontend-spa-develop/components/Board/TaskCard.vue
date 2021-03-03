<template>
  <div class="d-flex flex-column task">
    <div v-if="task" class="w-100 d-flex flex-column bold task-info pr-1 pl-2 py-1 ml-2">
      <div v-if="task.due_date" class="w-100 d-flex">
        <span class="task-status" :style="checkTaskStatus(task.due_date, task.status)"></span>
      </div>
      <div class="d-flex justify-content-between">
        <span
          v-if="task && task.title"
          class="w-100 add-new-task"
          :style="(task && !task.due_date && !task.assignees) && 'min-height: 55px'"
          @click="goToTask(task.kanban_task_id)">
          {{ task.title }}
        </span>
        <b-nav-item-dropdown class="d-flex align-items-center edit-task" no-caret>
          <template v-slot:button-content>
            <i class="fas fa-edit mr-2 mt-1 text-gray"></i>
          </template>
          <template>
            <b-dropdown-item-button aria-describedby="dropdown-header-label" class="item-button" @click="goToTask(task.kanban_task_id)">
              <div class="d-flex align-items-center">
                <i class="fas fa-edit mr-1"></i>
                {{ $t('Edit') }}
              </div>
            </b-dropdown-item-button>
            <b-dropdown-item-button aria-describedby="dropdown-header-label" class="item-button" @click="removeTask(task.kanban_task_id)">
              <div class="d-flex align-items-center">
                <i class="fas fa-archive mr-1"></i>
                {{ $t('Archive') }}
              </div>
            </b-dropdown-item-button>
          </template>
        </b-nav-item-dropdown>
      </div>
      <div class="d-flex flex-column" @click="goToTask(task.kanban_task_id)">
        <span
          v-if="task && task.due_date"
          class="due-date"
          :style="getDueDateStatus(task.due_date, task.status)">
          {{ getDueDate(task.due_date, task.status) }}
        </span>
        <div class="d-flex">
          <span
            v-for="(assigneeID, index) in task.assignees"
            :key="index">
            <img
              width="30"
              height="30"
              class="rounded-circle mr-2"
              :title="getUserNameByKey(assigneeID)"
              :src="linkAvatar(getAvatarByKey(task.avatars, assigneeID, 'column'))" />
          </span>
        </div>
      </div>
    </div>
    <TaskDetail v-if="takeKanbanTask && task.kanban_task_id === taskID" :key="!!kanbanTask" :column-id="columnId" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import moment from 'moment';
import TaskDetail from '@/components/Board/TaskDetail.vue';
import { notificationStore, taskStore } from '~/store';
import { Checklist, Task } from '~/types/task-project';

@Component({
  components: {
    TaskDetail,
    VueCtkDateTimePicker
  }
})
export default class extends Vue {
  @Prop() task!: any
  @Prop() taskIndex!: number
  // @Prop() column!: any
  @Prop() columnIndex!: number
  @Prop() columnId!: number

  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  projectID: number = 0
  boardID: number = 0
  taskID: number = 0
  errResponse: string = ''
  TASKDONE: number = 1
  taskParam: Task = {
    id: 0,
    project_id: 0,
    title: this.task ? this.task.title : '',
    assignees: [],
    due_date: null,
    description: '',
    status: false,
    checklists: [],
    new_kanban_list_id: 0,
    kanban_list_id: 0,
    kanban_board_id: 0
  };
  assignees: number[] = []
  checkLists: Checklist[] = []
  kanbanTask: Task | null = this.takeKanbanTask

  beforeMount() {
    const query = this.$route.query;
    this.projectID = query && parseInt(query.project_id.toString());
    this.boardID = query && parseInt(query.id.toString());
    this.taskID = query.task_id ? parseInt(query.task_id.toString()) : 0;
  }

  mounted() {
    this.assignees = this.task && this.task.assignees ? [ ...this.task.assignees ] : [];
  }

  get subTaskArr() {
    let newArray : Checklist[] | [] = [];

    if (this.kanbanTask && this.kanbanTask.checklists) {
      this.kanbanTask.checklists.forEach((value) => {
        const subTask : Checklist = Object.assign({}, { ...value, isEnableEdit: false });

        newArray = [ ...newArray, subTask ];
      });
    }

    return newArray;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get memberList() {
    return taskStore.takeUsers;
  }

  get avatars() {
    return taskStore.takeAvatars;
  }

  get takeColumns() {
    return taskStore.takeColumns;
  }

  get sortListFromTask() {
    return taskStore.takeSortFromTask;
  }

  get sortListToTask() {
    return taskStore.takeSortToTask;
  }

  get taskIdToMove() {
    return taskStore.takeTaskIdToMove;
  }

  get progressValue() {
    const listItemDone = this.checkLists.filter((item) => {
      return item.status;
    });

    return listItemDone ? listItemDone.length : 0;
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

  get takeKanbanTask() {
    return taskStore.takeTask;
  }

  linkAvatar(avatar: string) {
    return avatar
      ? 'data:image/png;base64,' + avatar
      : this.defaultAvatar;
  }

  async goToTask (taskID: number) {
    try {
      notificationStore.setIsShowNoti(false);
      await this.$router.replace(`/workflow/project-board?project_id=${this.projectID}&id=${this.boardID}&task_id=${taskID}`);
    } catch (e) {}
  }

  async removeTask(taskID: number) {
    try {
      await taskStore.REMOVE_TASK(this.columnIndex, this.taskIndex);
      await taskStore.removeKanbanTask({
        project_id: this.projectID,
        id: taskID
      });

      this.taskParam = {
        project_id: this.projectID,
        kanban_list_id: this.columnId,
        new_kanban_list_id: this.columnId,
        sort_position_list: this.sortListFromTask
      };
      await taskStore.editTask(this.taskParam);
      await this.getKanbanTasks();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  getUserNameByKey(key: number) {
    return this.memberList && this.memberList.get(key.toString());
  }

  getAvatarByKey(avatars: any, key: number, type: string) {
    let avatar;
    switch (type) {
    case 'column':
      avatar = new Map(Object.entries(avatars)).get(key.toString());
      break;
    case 'task':
      avatar = avatars.get(key.toString());
      break;
    }

    return avatar;
  }

  formatDueDate(date: string, formatType: string) {
    return date ? moment(new Date(date)).format(formatType) : '';
  }

  getDueDate(d: string, status: number) {
    if (status === this.TASKDONE) {
      return 'Done';
    }

    return this.formatDueDate(d, 'LL');
  }

  checkTaskStatus(d: string, status: number) {
    if (d && status) {
      const date = new Date(d);
      const currentDate = new Date();
      if (status === this.TASKDONE) {
        return 'background-color: #1ad698';
      }

      return currentDate < date ? 'background-color: #f8bd1c' : 'background-color: #f7685b';
    }
  }

  getDueDateStatus(d: string, status: number) {
    const date = new Date(d);
    const currentDate = new Date();
    if (status === this.TASKDONE) {
      return 'color: #1ad698';
    }

    return currentDate < date ? 'color: #f8bd1c' : 'color: #f7685b';
  }

  getSubTaskProgress(progressDoing:number, progressTotal: number) {
    return progressDoing / progressTotal === 1 ? 'background-color: #61bd4f' : 'background-color: #6c757d';
  }
};
</script>

<style scoped>
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
.task-info {
  min-height: 70px;
}
.task-info i:nth-child(0) {
  display: none;
}
.task-info:hover > i:nth-child(0){
  display: block;
}
.edit-task {
  width: 50px;
  height: 20px;
}
.prevent-add-item {
  font-size: 35px;
  width: 35px;
  height: 25px !important;
  cursor: pointer;
}
.add-new-task {
  word-wrap: break-word;
  max-width: 224px;
}
.item-button > button {
  background-color: inherit;
  outline: none;
}
</style>
