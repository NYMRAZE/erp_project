<template>
  <!-- Modal start  -->
  <b-modal :id="`modal-${taskID}`" :key="taskID" size="xl" centered>
    <template v-slot:modal-header="{ close }">
      <div class="d-flex align-items-center w-100">
        <i class="fas fa-window-maximize mr-1"></i>
        <b-form-input
          v-model="taskParam.title"
          type="text"
          class="bg-transparent font-weight-bold title"
          :class="isEnableEdit && 'input-border'"
          :readonly="isEnableEdit"
          @click="enableEdit('task')"
          @blur.prevent="disableEdit('task')" />
      </div>
      <button type="button" class="close" @click="close()">
        <span aria-hidden="true">&times;</span>
      </button>
    </template>
    <template>
      <ValidationObserver ref="observer">
        <div class="form-row px-3" @click="unfocusList($event)">
          <div class="col-xl-6 px-3">
            <div class="form-row">
              <div class="col-12">
                <div class="d-flex align-items-center my-2">
                  <h3 class="font-weight-bold">{{ $t('Description') }}</h3>
                </div>
                <div class="pl-1">
                  <textarea
                    v-model="taskParam.description"
                    rows="5"
                    class="form-control"
                    type="text"
                    :placeholder="$t('Description')">
                  </textarea>
                </div>
              </div>
            </div>
            <div class="form-row mt-2">
              <div class="col-12 wrap-due-date">
                <div>
                  <h3 class="font-weight-bold mb-1">{{ $t('Due date') }}</h3>
                  <div class="d-flex">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="dateBeforeCurrentDate"
                      vid="dateFrom"
                      tag="div"
                      :name="$t('From date')">
                      <VueCtkDateTimePicker
                        v-model="taskParam.due_date"
                        :format="dateFormatDatabase"
                        :no-value-to-custom-elem="true"
                        :locale="codeCurrentLang">
                        <input
                          type="text"
                          class="due-date-input"
                          :class="{ 'is-invalid': errors[0] }"
                          :value="formatDueDate(taskParam.due_date, 'LLL')"
                          :placeholder="$t('Due date')" />
                      </VueCtkDateTimePicker>
                      <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <label class="label-hide font-weight-bold mb-0">&#8205;</label>
                  <div>
                    <span class="mr-2">{{ $t('Complete task') }}</span>
                    <input v-model="taskParam.status" type="checkbox">
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row my-2">
              <div class="col-12">
                <div class="mb-2">
                  <div class="d-flex flex-column mr-3" style="float: left">
                    <h3 class="font-weight-bold">{{ $t('Member') }}</h3>
                    <div ref="dropdown_list">
                      <div class="d-flex mt-2" style="float: left">
                        <span v-for="(assigneeID, index) in assignees" :key="index" class="avatars-member">
                          <img
                            width="30"
                            height="30"
                            class="rounded-circle mr-2"
                            :title="getUserNameByKey(assigneeID)"
                            :src="linkAvatar(getAvatarByKey(avatars, assigneeID, 'task'))" />
                          <span
                            class="d-flex align-items-center justify-content-center"
                            @click="removeAssignedMember(index)">
                            &times;
                          </span>
                        </span>
                        <span class="d-flex align-items-center justify-content-center assign-member" @click.prevent="showDropdown">
                          <i class="fas fa-plus"></i>
                        </span>
                      </div>
                      <div id="myDropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                        <div class="myInput">
                          <input
                            ref="nameInput"
                            v-model="memberNameInput"
                            type="text"
                            :placeholder="`${$t('Search')}...`"
                            @input="handleChangeInput"
                            @keydown="selectMemberPressKey($event)">
                        </div>
                        <ul ref="userList" class="list-user" @mouseover="focusList">
                          <li
                            v-for="(key, index) in userListSearching"
                            ref="item"
                            :key="index"
                            :class="index + 1 === focusIndex && !isMouseOver && 'focus-item' || 'item'"
                            @click.prevent="selectMember(key)">
                            {{ getUserNameByKey(parseInt(key)) }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 px-3">
            <div class="form-row">
              <div class="col-12">
                <div class="d-flex mb-2">
                  <h3 class="font-weight-bold">{{ $t('Checklist') }}</h3>
                </div>
                <div class="px-1">
                  <b-progress :max="checkLists.length">
                    <b-progress-bar
                      class="bg-success2"
                      :value="progressValue"
                      :label="`${(progressValue / checkLists.length * 100).toFixed(2)}%`" />
                  </b-progress>
                </div>
                <div class="list-subtask">
                  <div v-for="(item, index) in checkLists" :key="index" class="mt-2 mb-1">
                    <div class="d-flex px-1 subtask">
                      <input v-model="item.status" type="checkbox" class="ml-2 mt-2 mr-3">
                      <div style="width: 83%;">
                        <textarea
                          v-model="item.name"
                          v-autosize
                          class="form-control"
                          :class="item.isEnableEdit ? 'text-area-enable' : 'text-area-disable'"
                          :placeholder="$t('Enter item')"
                          :readonly="!item.isEnableEdit"
                          @click="enableEdit('subtask', index)"
                          @blur="disableEdit('subtask', index)" />
                      </div>
                      <div class="list-actions" :style="`z-index:${checkLists.length - index}`">
                        <i class="fas fa-ellipsis-v text-gray"></i>
                        <div class="group-actions-btn">
                          <span
                            class="d-flex align-items-center text-danger justify-content-between font-weight-bold"
                            @click="removeSubTask(index)">
                            <i class="fas fa-trash-alt mr-2"></i>{{ $t("Delete") }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <textarea
                    v-model="toDoName"
                    v-autosize
                    class="form-control mt-3 text-area-add-item"
                    :placeholder="$t('Add an item')"
                    @click="handleAddCheckItem"
                    @keydown.enter.prevent="handleAddItem" />
                  <div v-if="isAddItem" class="d-flex mt-2">
                    <button type="button" class="btn btn-sm btn-success add-card-btn mr-2" @click.prevent="handleAddItem">
                      {{ $t("Add") }}
                    </button>
                    <span
                      class="prevent-add-item d-flex align-items-center"
                      @click="preventAddItem">
                      &times;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="md-form mt-4">
          </div>
        </div>
      </ValidationObserver>
    </template>
    <template v-slot:modal-footer="{ cancel }">
      <input
        type="submit"
        :value="$t('Submit')"
        class="btn btn-success2 mr-2"
        @click.prevent="handleEditTask">
      <input
        type="submit"
        :value="$t('Cancel')"
        class="btn btn-secondary2 mr-2"
        @click.prevent="cancel">
    </template>
  </b-modal>
  <!-- Modal end  -->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import moment from 'moment';
import slugify from '~/utils/unaccent';
import { taskStore } from '~/store';
import { Checklist, Task } from '~/types/task-project';

@Component({
  components: {
    VueCtkDateTimePicker
  }
})
export default class extends Vue {
  @Prop() taskIndex!: number
  @Prop() column!: any
  @Prop() columnIndex!: number
  @Prop() columnId!: number

  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  projectID: number = 0
  boardID: number = 0
  taskID: number = 0
  isShowTask: boolean = false
  dueDate: string | null = null
  errResponse: string = ''
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD HH:mm';
  dateFormatSelect   : string = 'YYYY/MM/DD';
  langDatepicker : any = LangDatepicker
  memberName: string = ''
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  isShow: boolean = false
  isEnableEdit: boolean = true
  isAddItem: boolean = false
  userListSearching: string[] = []
  TASKDONE: number = 1
  TASKNOTDONE: number = 2
  toDoName: string = ''
  taskParam: Task = {
    id: 0,
    project_id: 0,
    title: '',
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

  beforeMount() {
    const query = this.$route.query;
    this.projectID = query && parseInt(query.project_id.toString());
    this.boardID = query && parseInt(query.id.toString());
    this.taskID = query.task_id ? parseInt(query.task_id.toString()) : 0;

    if (this.kanbanTask) {
      this.taskParam = {
        id: this.taskID,
        status: this.kanbanTask.status === this.TASKDONE,
        title: this.kanbanTask.title,
        description: this.kanbanTask.description,
        due_date: this.kanbanTask.due_date
      };
      this.assignees = this.kanbanTask.assignees ? [ ...this.kanbanTask.assignees ] : [];
      this.checkLists = this.subTaskArr;
    }
  }

  mounted() {
    this.taskID && this.navigateTaskByID(this.taskID);
  }

  beforeUpdate() {
    if (this.$route.query.task_id && this.$route.query.project_id) {
      this.$root.$on('bv::modal::hide', async (bvEvent, modalId) => {
        try {
          if (modalId === `modal-${this.taskID}`) {
            await this.$router.replace(`/workflow/project-board?project_id=${this.projectID}&id=${this.boardID}`);
          }
        } catch (e) {}
      });
    }
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

  get progressValue() {
    const listItemDone = this.checkLists.filter((item) => {
      return item.status;
    });

    return listItemDone ? listItemDone.length : 0;
  }

  async handleEditTask() {
    try {
      const observer: any = this.$refs.observer;
      const isValid = await observer.validate();

      if (isValid) {
        this.taskParam.status = this.taskParam.status ? this.TASKDONE : this.TASKNOTDONE;
        this.taskParam.kanban_board_id = parseInt(this.$route.query.id.toString());
        this.taskParam.checklists = [ ...this.checkLists ];
        this.taskParam.assignees = [ ...this.assignees ];

        await taskStore.editTask(this.taskParam);
        this.$bvModal.hide(`modal-${this.taskID}`);
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

  get kanbanTask() {
    return taskStore.takeTask;
  }

  linkAvatar(avatar: string) {
    return avatar
      ? 'data:image/png;base64,' + avatar
      : this.defaultAvatar;
  }

  enableEdit(type: string, index : number) {
    switch (type) {
    case 'task':
      this.isEnableEdit = false;
      break;
    case 'subtask':
      this.checkLists[index].isEnableEdit = true;
      break;
    }
  }

  disableEdit(type: string, index : number) {
    switch (type) {
    case 'task':
      this.isEnableEdit = true;
      break;
    case 'subtask':
      this.checkLists[index].isEnableEdit = false;
      break;
    }
  }

  removeSubTask(index : number) {
    this.checkLists.splice(index, 1);
  }

  removeAssignedMember(index : number) {
    this.assignees.splice(index, 1);
  }

  handleAddItem() {
    this.checkLists.push({
      name: this.toDoName,
      status: false,
      isEnableEdit: false
    });
    this.toDoName = '';
  }

  navigateTaskByID(taskID: number) {
    try {
      this.taskParam = {
        ...this.taskParam,
        id: this.taskID,
        project_id: this.projectID,
        kanban_list_id: this.columnId
      };
      this.$bvModal.show(`modal-${taskID}`);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  handleAddCheckItem() {
    this.isAddItem = true;
  }

  preventAddItem() {
    this.isAddItem = false;
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.memberList.entries(), ([key, value]) => {
      if (this.checkContain(value) || value === '') {
        this.userListSearching.push(key);
      }
    });
  }

  handleChangeInput() {
    this.focusIndex = 0;
    this.getUserListSearching();
  }

  unfocusList(event) {
    const specifiedElement = this.$refs.dropdown_list as SVGStyleElement;

    if (specifiedElement) {
      const isClickInside = specifiedElement.contains(event.target);
      if (!isClickInside) {
        this.isShow = false;
      }
    }
  }

  showDropdown() {
    this.memberNameInput = '';
    this.getUserListSearching();
    this.isShow = !this.isShow;
    this.focusIndex = 0;
    this.isMouseOver = false;

    this.$nextTick(() => {
      const nameInput = this.$refs.nameInput as any;
      nameInput.focus();
    });
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

  selectMember(key: any) {
    this.memberName = this.memberList.get(key.toString()) || '';
    const assigneeID = parseInt(key.toString());
    if (!this.assignees.includes(assigneeID)) {
      this.assignees.push(assigneeID);
    }
    this.isShow = false;
    this.$nextTick(() => {
      const nameInput = this.$refs.nameInput as SVGStyleElement;
      nameInput.focus();
    });
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  formatDueDate(date: string, formatType: string) {
    return date ? moment(new Date(date)).format(formatType) : '';
  }

  getSubTaskProgress(progressDoing:number, progressTotal: number) {
    return progressDoing / progressTotal === 1 ? 'background-color: #61bd4f' : 'background-color: #6c757d';
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
          wrapperUserList.scrollTop -= 180;
        }
      }
      break;
    case 40:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex < this.userListSearching.length) {
        this.focusIndex++;
        if (this.focusIndex % 8 === 0) {
          wrapperUserList.scrollTop += 180;
        }
      }
      break;
    case 13:
      const assigneeID = parseInt(this.userListSearching[this.focusIndex - 1].toString());
      this.memberName = this.memberList.get(assigneeID.toString()) || '';
      if (!this.assignees.includes(assigneeID)) {
        this.assignees.push(assigneeID);
      }
      this.isShow = false;
      break;
    }
  }
};
</script>

<style scoped>
.due-date-input {
  width: 190px;
  border: none;
  outline: none;
  border-bottom: 1px solid #03a8f45e;
  padding: 0 5px;
}
span.assign-member {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(9,30,66,.14);
  cursor: pointer;
}
span.assign-member:hover {
  background-color: rgba(9,30,66,.24);
}
.dropdown-content {
  width: 300px;
  top: 62px;
}
.input-border {
  border: none;
}
.prevent-add-item {
  font-size: 35px;
  width: 35px;
  height: 25px !important;
  cursor: pointer;
}
.task-item {
  position: relative;
}
.task-item span {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
  font-size: 18px;
  width: 15px;
  height: 15px;
  border: 1px solid;
  cursor: pointer;
  transition: all .2s;
}
.task-item:hover > span {
  opacity: 1;
}
.font-weight-bold {
  font-weight: 600 !important;
}
.avatars-member {
  position: relative;
}
.avatars-member span {
  position: absolute;
  width: 13px;
  height: 13px;
  top: 0;
  right: 0px;
  font-size: 14px;
  border-radius: 50%;
  background-color: rgba(9,30,66,.14);
  cursor: pointer;
}
h3 {
  color: #172b4d;
  font-size: 16px;
  margin-bottom: 0;
}
.item-header {
  letter-spacing: .04em;
}
.text-area-disable {
  border: none;
  padding-left: 1px;
  background: inherit;
  height: 30px;
  resize: none;
}
.text-area-enable {
  border: 1px solid #ced4da;
  height: fit-content;
  resize: vertical;
}
.text-area-add-item {
  border: 2px dashed #ced4da;
}
.bg-success2 {
  background-color: #2ed47a;
}
.subtask {
  position: relative;
}
.wrap-due-date {
  display: flex;
  justify-content: space-between;
}
textarea:focus {
  box-shadow: none;
  outline: none;
}
.list-actions {
  position: absolute;
  right: 0;
  width: 20px;
}
.list-actions > span {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-actions:hover .group-actions-btn {
  transition: all .3s;
  display: block;
}
.group-actions-btn {
  position: relative;
  top: -10px;
  right: 93px;
  width: 100px;
  text-align: left;
  border: 1px solid #EBEFF2;
  background-color: #fff;
  border-radius: 5px;
  display: none;
}
.group-actions-btn > span {
  padding: 10px;
  cursor: pointer;
}
.group-actions-btn::before {
  content: "";
  z-index: -1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
}
@media (min-width: 320px) and (max-width: 480px) {
  .wrap-due-date {
    display: flex;
    flex-direction: column;
  }
  .wrap-due-date .flex-column {
    margin-top: 5px;
  }
  .label-hide {
    display: none;
  }
}
</style>
