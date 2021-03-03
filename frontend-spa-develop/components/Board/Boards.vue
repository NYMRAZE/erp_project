<template>
  <div class="form-group form-row padding-sm-x mt-4" @click="unfocusList($event)">
    <div class="col-xl-4 col-sm-12 d-flex flex-column px-2">
      <div class="projects-container">
        <div class="wrap-header">
          <h4 class="text-blue font-weight-bold px-3 my-3">{{ $t("Project list") }}</h4>
        </div>
        <div class="px-3">
          <div class="d-flex py-4">
            <b-form-input
              v-model="submitForm.keyword"
              placeholder="Find project by name"
              @keydown.enter="searchProjectByName">
            </b-form-input>
            <button
              type="button"
              class="btn btn-primary2 w-100px ml-2"
              @click.prevent="searchProjectByName">
              {{ $t("Search") }}
            </button>
          </div>
        </div>
        <div class="d-flex align-items-center text-blue personal-project">
          <span class="text-uppercase">{{ $t('Name') }}</span>
        </div>
        <div>
          <div
            v-for="(project, index) in projectList"
            :key="index"
            class="project-el d-flex align-items-center"
            @click="gotoListBoard(project.project_id, project.project_name)">
            <span>{{ project.project_name }}</span>
          </div>
        </div>
        <!-- Pagination container -->
        <div class="mt-4 pr-3">
          <b-pagination
            v-model="submitForm.current_page"
            class="brown-pagination float-right"
            :total-rows="takePagination.total_row"
            :per-page="takePagination.row_per_page"
            align="center"
            limit="7"
            @input="searchByPagination">
          </b-pagination>
          <div class="form-inline float-right mr-4">
            <span
              class="mr-2 txt-to-page">To page</span>
            <input
              v-model="submitForm.current_page"
              class="form-control input-jump-page"
              type="number"
              min="1"
              max="7"
              @keyup.enter="searchByPagination" />
          </div>
        </div>
        <!-- End Pagination container -->
      </div>
    </div>
    <div class="col-xl-8 col-sm-12">
      <div class="form-row px-2">
        <div
          style="border-radius: 8px;"
          class="col-xl-12 d-flex bg-white px-2">
          <div class="d-flex align-items-center personal-board py-3">
            <i class="fab fa-flipboard mr-2"></i>
            <span class="text-capitalize">{{ `${projectName}` }}</span>
          </div>
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
      <div class="form-row">
        <div
          v-for="(board, index) in kanbanBoards"
          :key="index"
          class="col-sm-3 px-2">
          <div class="p-2 mt-3 d-flex justify-content-between bg-white board-item">
            <span class="w-100" @click="goToBoard(board.id)">{{ board.name }}</span>
            <b-nav-item-dropdown class="board-setting d-flex align-items-end" no-caret>
              <template v-slot:button-content>
                <i class="fas fa-ellipsis-h text-gray"></i>
              </template>
              <template>
                <b-dropdown-item-button aria-describedby="dropdown-header-label" @click="goToBoard(board.id)">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-eye mr-1"></i>
                    {{ $t('Detail') }}
                  </div>
                </b-dropdown-item-button>
                <b-dropdown-item-button aria-describedby="dropdown-header-label" @click="removeBoard(board.id)">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-archive mr-1"></i>
                    {{ $t('Archive') }}
                  </div>
                </b-dropdown-item-button>
              </template>
            </b-nav-item-dropdown>
          </div>
        </div>
        <div v-if="!errMessage" class="col-sm-3 px-2">
          <div class="p-2 mt-3 board-item d-flex justify-content-between align-items-center bg-white create-new">
            <b-form-input
              v-model="boardName"
              type="text"
              class="bg-transparent board-name-input"
              :placeholder="$t('+ Create new board')"
              @keyup.enter="createBoard" />
          </div>
        </div>
      </div>
      <b-alert class="mt-2" :show="!!errMessage" variant="danger">{{ errMessage }}</b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import { layoutAdminStore, projectStore, taskStore } from '../../store';
import { KanbanBoard } from '~/types/task-project';
import NavMenu from '~/components/EditProject/NavMenu/index.vue';
import { ProjectSubmit, ProjectTable, UserProject } from '~/types/project';
import slugify from '~/utils/unaccent';

@Component({
  components: {
    NavMenu,
    InfiniteLoading
  }
})
export default class extends Vue {
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  errMessage: string = ''
  projectID: number = 0
  boardName: string = ''
  kanbanBoards: KanbanBoard[] = []
  submitForm: ProjectSubmit = {
    keyword      : '',
    current_page : 1,
    row_per_page : 8
  }
  projectError: string = ''
  projectName: string = ''
  projectList: ProjectTable[] = []
  memberAssigned: UserProject[] = []
  resMessage: string = ''
  responseMessage: string = ''
  isShow: boolean = false
  memberName: string = ''
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  errorProjectName: string = ''
  errorManagedBy: string = ''

  created() {
    if (this.$refs.infiniteLoading) {
      (this.$refs.infiniteLoading as any).stateChanger.reset();
    }
  }

  mounted() {
    const title = 'Manage Project';
    layoutAdminStore.setTitlePage(title);
    this.$nextTick(async () => {
      await this.searchRequest();
      this.projectID = this.projectList[0].project_id;
      this.projectName = this.projectList[0].project_name;
      await this.getUserProjectJoined();
      await this.getKanbanBoards();
    });
  }

  get dataTable() {
    return projectStore.arrProjectTable;
  }

  get takePagination() {
    return projectStore.takePaginationProject;
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

  assignUserProjectList() {
    let memberAssigned: UserProject[] = [];

    if (projectStore.takeUserProject && projectStore.takeUserProject.length > 0) {
      projectStore.takeUserProject.forEach((value) => {
        const item: UserProject = Object.assign({}, value);

        memberAssigned = [ ...memberAssigned, item ];
      });
    }

    return memberAssigned;
  }

  async getKanbanBoards() {
    try {
      this.kanbanBoards = [];
      this.kanbanBoards = await taskStore.getKanbanBoards(this.projectID);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    }
  }

  async searchRequest() {
    try {
      await projectStore.searchProjectsOfUser(this.submitForm);
      this.projectList = [ ...this.dataTable ];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.projectError = err.response.data.message;
      } else {
        this.projectError = err.message;
      }
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

  async gotoListBoard(projectId: number, projectName: string) {
    try {
      this.$nuxt.$loading.start();
      this.errMessage = '';
      this.projectID = projectId;
      projectStore.setUserProjectList(null);
      await this.getKanbanBoards();
      await this.getUserProjectJoined();
      this.projectName = projectName;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.projectError = err.response.data.message;
      } else {
        this.projectError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async createBoard() {
    try {
      if (this.boardName) {
        await taskStore.createKanbanBoard({
          name: this.boardName,
          project_id: this.projectID
        });
        this.boardName = '';
        await this.getKanbanBoards();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      const $this = this;
      setTimeout(function () {
        $this.errMessage = '';
      }, 3000);
    }
  }

  async loadMore($state) {
    await this.searchRequest();
    if (this.submitForm.current_page === 1) {
      this.projectID = this.projectList[0].project_id;
      this.projectName = this.projectList[0].project_name;
      await this.getKanbanBoards();
    }
    if (Array.isArray(this.dataTable) && this.dataTable.length) {
      this.submitForm.current_page += 1;
      $state.loaded();
    } else {
      $state.complete();
    }
  }

  removeBoard(id: number) {
    try {
      const $this = this;
      const msgModalConfirm = this.$tc('Do you want to DELETE this board?');
      this.showModalConfirm(msgModalConfirm, async function() {
        await taskStore.removeKanbanBoard({
          id,
          project_id: $this.projectID
        });
        await $this.getKanbanBoards();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
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

  goToBoard(id: number) {
    this.$router.push({ path: `/workflow/project-board?project_id=${this.projectID}&id=${id}` });
  }

  searchProjectByName() {
    this.submitForm.current_page = 1;
    this.projectList = [];
    this.searchRequest();
  }

  searchByPagination() {
    this.searchRequest();
  }

  getAvatarByKey(key: any) {
    return key ? this.takeAvatars.get(key.toString()) : null;
  }

  linkAvatar(avatar: string) {
    return avatar ? 'data:image/png;base64,' + avatar : this.defaultAvatar;
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

  // modal confirm
  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Confirm'),
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : this.$t('Yes'),
      cancelTitle     : this.$t('No'),
      hideHeaderClose : false,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.errMessage = err;
    });
  }
};
</script>
<style scoped>
.wrap-header {
  border-bottom: 1px solid #EBEFF2;;
}
.board-item{
  height: 110px !important;
  border: 1px solid #EBEFF2;
  font-size: 16px;
  font-weight: 500;
  border-radius: .4em;
}
.create-new {
  font-weight: 400;
  border: 2px dashed #EBEFF2;
}
.board-setting {
  width: 40px;
  color: #fff;
  margin-top: -7px;
}
.board-name-input {
  border: none;
  border-radius: 0;
  padding-bottom: 0;
}
.board-name-input:focus {
  outline: none;
  box-shadow: none;
  border-bottom: 1px solid #80bdff;
}
.projects-container {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
}
.projects-container > [type="text"] {
  font-size: 13px;
}
.personal-project {
  border-bottom: 1px solid #EBEFF2;
  border-top: 1px solid #EBEFF2;
  font-weight: 600;
  text-transform: uppercase;
  padding: 10px 20px;
}
.personal-board {
  padding: 10px 20px;
  max-width: 300px;
  font-size: 16px;
  border-right: 1px solid #EBEFF2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-el {
  border-bottom: 1px solid #EBEFF2;
  font-size: 13px;
  font-weight: 500;
  min-height: 36px;
  padding: 20px;
  cursor: pointer;
}
.project-el:hover {
  background-color: rgba(9,30,66,.28);
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
  background-color: rgba(213,61,75);
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
</style>
