<template>
  <div @click="unfocusList($event)">
    <div class="mt-4">
      <ValidationObserver ref="observer" v-slot="{}">
        <div class="form-group row padding-sm-x">
          <div class="col-xl-6">
            <div class="form-group form-row">
              <div class="col-md-12 col-xl-12">
                <label for="project-name" :class="{ 'text-dark font-weight-bold required': !isUser }">
                  {{ $t("Project name") }}
                </label>
                <input
                  id="project-name"
                  v-model="project.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errorProjectName }"
                  :readonly="isUser"
                  @input="inputProjectName" />
                <p v-if="errorProjectName" class="invalid-feedback">{{ errorProjectName }}</p>
              </div>
            </div>
            <div class="form-group form-row">
              <div class="col-md-12 col-xl-12">
                <label
                  class="text-dark font-weight-bold"
                  for="project-managed-by"
                  :class="{ 'required': !isUser }">
                  {{ $t("Manager") }}
                </label>
                <div ref="dropdown_list" class="dropdown">
                  <select
                    id="project-managed-by"
                    class="form-control"
                    :class="{ 'is-invalid': errorManagedBy }"
                    :disabled="isUser"
                    @click.prevent="showDropDown('manager')">
                    <option v-if="memberName" :value="memberName" class="d-none" selected>{{ memberName }}</option>
                  </select>
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
                        @click.prevent="selectMember(key, 'manager')">
                        {{ getUserNameByKey(key) }}
                      </li>
                    </ul>
                  </div>
                </div>
                <p v-if="errorManagedBy" class="invalid-feedback d-block text-left">{{ errorManagedBy }}</p>
              </div>
            </div>
            <div class="form-group form-row">
              <div class="col-md-12 col-xl-12">
                <label class="text-dark font-weight-bold required">
                  {{ $t("Assignee") }}:
                </label>
                <div ref="assignee_list" class="d-flex">
                  <div style="float: left">
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
                    <span class="d-flex align-items-center justify-content-center bg-dark assign-member" @click.prevent="showDropDown('member')">
                      <i class="fas fa-plus text-white"></i>
                    </span>
                  </div>
                  <div id="assignee-dropdown" :class="isShowListUser ? 'dropdown-content d-block' : 'dropdown-content'">
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
                        @click.prevent="selectMember(key, 'assignee')">
                        {{ getUserNameByKey(key) }}
                      </li>
                    </ul>
                  </div>
                </div>
                <span class="d-inline text-danger mt-2">{{ errorAddMember }}</span>
              </div>
            </div>
            <div class="form-group form-row">
              <div class="col-md-12 col-xl-12">
                <label for="project-description">
                  <b>{{ $t("Description") }}</b>
                </label>
                <textarea
                  id="project-description"
                  v-model="project.description"
                  class="form-control"
                  rows="15"
                  :readonly="isUser">
                </textarea>
              </div>
            </div>
          </div>
          <div class="col-xl-6">
            <div class="row">
              <div v-if="project.targets.length" class="col-md-12 col-xl-12">
                <div v-for="(item, index) in project.targets" :key="index" class="block-card card mb-3">
                  <div
                    class="card-header-profile card-header bg-light"
                    :class="item.isShow && 'd-none'"
                    @click="showDetail(index)">
                    <div class="d-flex justify-content-between">
                      <h4 class="card-title-profile card-title text-dark">
                        <span>{{ item.content }}</span>
                      </h4>
                      <div class="d-flex align-items-center">
                        <span class="mr-1 font-weight-bold">
                          {{ $t("More") }}
                        </span>
                        <i class="fas fa-caret-down"></i>
                      </div>
                    </div>
                  </div>
                  <div class="container-card-body" :class="!item.isShow && 'd-none'">
                    <div class="card-body border-top">
                      <ValidationObserver
                        ref="observerModalEditTarget"
                        v-slot="{}">
                        <div class="form-row">
                          <div class="form-group col-6">
                            <label class="text-dark font-weight-bold required" for="create-year-target">
                              {{ $t("Year") }}
                            </label>
                            <ValidationProvider
                              ref="valid_add_year"
                              v-slot="{ errors }"
                              rules="required"
                              :name="$t('Year')">
                              <select
                                id="create-year-target"
                                class="form-control"
                                :class="{'is-invalid': submittedAddTarget && errors[0]}"
                                :disabled="!item.isEnableEdit">
                                <option v-for="(year, i) in listYearTarget" :key="i" :value="item.year" selected>{{ item.year }}</option>
                              </select>
                              <span v-if="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>
                          <div class="form-group col-6">
                            <label class="text-dark font-weight-bold required" for="create-quarter-target">
                              {{ $t("Quarter") }}
                            </label>
                            <ValidationProvider
                              ref="valid_add_quarter"
                              v-slot="{ errors }"
                              rules="required"
                              :name="$t('Quarter')">
                              <select
                                id="create-quarter-target"
                                class="form-control"
                                :class="{'is-invalid': submittedAddTarget && errors[0]}"
                                :disabled="!item.isEnableEdit">
                                <option v-for="(quarter, j) in listQuarter" :key="j" :value="item.quarter" selected>{{ quarter }}</option>
                              </select>
                              <span v-if="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-12">
                            <label class="text-dark font-weight-bold required" for="create-target-description">
                              {{ $t("Target") }}
                            </label>
                            <ValidationProvider
                              v-slot="{ errors }"
                              rules="required"
                              :name="$t('Target')">
                              <textarea
                                id="create-target-description"
                                v-model="item.content"
                                class="form-control"
                                :class="{'is-invalid': submittedAddTarget && errors[0]}"
                                :disabled="!item.isEnableEdit"
                                rows="6">
                              </textarea>
                              <span v-show="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>
                        </div>
                        <div class="d-flex justify-content-end">
                          <button type="button" class="btn btn-secondary2 w-100px mr-2" @click="editTargetProject(index)">
                            {{ $t("Edit") }}
                          </button>
                          <button type="button" class="btn btn-danger2" @click="removeTarget(index)">
                            <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                          </button>
                        </div>
                      </ValidationObserver>
                    </div>
                  </div>
                  <div
                    class="card-footer bg-light"
                    :class="!item.isShow && 'd-none'"
                    style="cursor: pointer"
                    @click="showDetail(index)">
                    <div class="d-flex justify-content-end">
                      <div class="d-flex align-items-center">
                        <span class="mr-1 font-weight-bold">
                          {{ $t("Less") }}
                        </span>
                        <i class="fas fa-caret-up"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isAddTarget" class="col-md-12 col-xl-12 mb-3 mt-3">
                <div class="card">
                  <div class="card-body">
                    <ValidationObserver
                      ref="observerModalAddTarget"
                      v-slot="{}">
                      <div class="form-row">
                        <div class="form-group col-6">
                          <label class="text-dark font-weight-bold required" for="create-year-target">
                            {{ $t("Year") }}
                          </label>
                          <ValidationProvider
                            ref="valid_add_year"
                            v-slot="{ errors }"
                            rules="required"
                            :name="$t('Year')">
                            <select
                              id="create-year-target"
                              v-model.number="targetItem.year"
                              class="form-control"
                              :class="{'is-invalid': submittedAddTarget && errors[0]}">
                              <option :value="null"></option>
                              <option v-for="(item, index) in listYearTarget" :key="index" :value="item">{{ item }}</option>
                            </select>
                            <span v-if="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                          </ValidationProvider>
                        </div>
                        <div class="form-group col-6">
                          <label class="text-dark font-weight-bold required" for="create-quarter-target">
                            {{ $t("Quarter") }}
                          </label>
                          <ValidationProvider
                            ref="valid_add_quarter"
                            v-slot="{ errors }"
                            rules="required"
                            :name="$t('Quarter')">
                            <select
                              id="create-quarter-target"
                              v-model.number="targetItem.quarter"
                              class="form-control"
                              :class="{'is-invalid': submittedAddTarget && errors[0]}">
                              <option :value="null"></option>
                              <option v-for="(item, index) in listQuarter" :key="index" :value="item">{{ item }}</option>
                            </select>
                            <span v-if="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                          </ValidationProvider>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group col-12">
                          <label class="text-dark font-weight-bold required" for="create-target-description">
                            {{ $t("Target") }}
                          </label>
                          <ValidationProvider
                            v-slot="{ errors }"
                            rules="required"
                            :name="$t('Target')">
                            <textarea
                              id="create-target-description"
                              v-model="targetItem.content"
                              class="form-control"
                              :class="{'is-invalid': submittedAddTarget && errors[0]}"
                              rows="6">
                            </textarea>
                            <span v-show="submittedAddTarget && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                          </ValidationProvider>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group col-12 d-flex justify-content-end">
                          <button
                            type="button"
                            class="btn btn-secondary2 w-100px mr-2"
                            @click="cancelAddTarget">
                            {{ $t("Cancel") }}
                          </button>
                          <button
                            type="button"
                            class="btn btn-primary2 w-100px"
                            @click="addNewTarget">
                            {{ $t("Add") }}
                          </button>
                        </div>
                      </div>
                    </ValidationObserver>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-xl-12 pb-3 mt-3">
                <div class="add-target d-flex justify-content-center align-items-center h-100" @click="handleAddTarget">
                  <span class="font-weight-bold">{{ $t('+ Add target') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6">
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-secondary2 w-100px mr-2"
                @click="backBtn()">
                {{ $t("Cancel") }}
              </button>
              <button
                v-if="isManageMemberRole"
                type="button"
                class="btn btn-danger2 w-100px"
                @click.prevent="handleEditProject">
                {{ $t("Submit All") }}
              </button>
            </div>
            <div v-if="isManageMemberRole">
              <p v-if="editProjectError" :class="{ 'd-block': editProjectError !== '' }" class="invalid-feedback">
                {{ $t(editProjectError) }}
              </p>
            </div>
          </div>
        </div>
        <!-- End Pagination container -->
      </ValidationObserver>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { PaginationTargetProject, Project, TargetProject, UserProject } from '~/types/project';
import { GeneralManagerRoleID, ManagerRoleID, UserRoleID } from '~/utils/responsecode';
import { layoutAdminStore, projectStore } from '~/store/';
import NavMenu from '~/components/EditProject/NavMenu/index.vue';
import slugify from '~/utils/unaccent';

@Component({
  components: {
    NavMenu
  }
})
export default class extends Vue {
  @Prop() title!: string;
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  project: Project = this.takeProject;
  userList: Map<string, string> = this.takeUserList;
  isManageMemberRole: boolean =  this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID;
  isUser: boolean = this.$auth.user.role_id === UserRoleID

  // model variable for modal add item
  targetItem : TargetProject = {
    year: null,
    quarter: null,
    content: null,
    isShow: false,
    isEnableEdit: false
  }

  listYearTarget : number[] | [] = this.arrYearTarget;
  listQuarter : number[] = [1, 2, 3, 4];
  submitted : boolean = false;
  submittedAddTarget : boolean = false;
  editProjectError : string = '';
  msgSuccessEditProject : string = '';
  paginationObj : PaginationTargetProject = {
    current_page: 1,
    total_rows : this.totalRows,
    per_page : 10,
    limit_page : 7
  }
  isShow: boolean = false
  memberName: string = ''
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  errorProjectName: string = ''
  errorManagedBy: string = ''
  isAddTarget: boolean = false
  isShowListUser: boolean = false
  memberAssigned: UserProject[] = []
  projectId: number = 0
  responseMessage: string = ''
  errorAddMember: string = ''

  beforeMount() {
    this.$nextTick(() => {
      this.getUserProjectJoined();
    });
  }

  mounted() {
    layoutAdminStore.setTitlePage(this.title);
    this.memberName = (this.project &&
        this.project.managed_by &&
        this.getUserNameByKey(this.project.managed_by.toString())
    ) || '';
    this.projectId = parseInt(this.$route.params.id);
  }

  get arrYearTarget() {
    let arrYear : number[] | [] = [];
    const currentYear : number = new Date().getFullYear();

    for (let i = 0; i <= 10; i++) {
      arrYear = [ ...arrYear, (currentYear + i) ];
    }
    return arrYear;
  }

  get totalRows() {
    return this.project.targets ? this.project.targets.length : 1;
  }

  get takeUserList(): Map<string, string> {
    return new Map(JSON.parse(JSON.stringify(Array.from(projectStore.takeUserList))));
  }

  get takeProject() {
    const newObject : Project = Object.assign({}, projectStore.takeProject);
    let newArrTarget : TargetProject[] | [] = [];

    if (projectStore.takeProject && projectStore.takeTargetProject.length > 0) {
      projectStore.takeTargetProject.forEach((value) => {
        const itemTarget : TargetProject = Object.assign({}, { ...value, isShow: false, isEnableEdit: false });

        newArrTarget = [ ...newArrTarget, itemTarget ];
      });
    }

    newObject.targets = newArrTarget;
    return newObject;
  }

  get takeAvatars() {
    return projectStore.takeAvatars;
  }

  get takeUserProject() {
    return projectStore.takeUserProject;
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

  checkValidPagination(index: number) {
    const offset : number = (this.paginationObj.current_page - 1) * this.paginationObj.per_page;

    return index >= offset && index < offset + this.paginationObj.per_page;
  }

  removeTarget(indexTargetProject) {
    if (this.project.targets.length > 0) {
      this.project.targets = this.project.targets.filter(function(item, index) {
        return index !== indexTargetProject;
      });
    }
  }

  inputProjectName() {
    if (this.project.name) {
      this.errorProjectName = '';
    }
  }

  handleValidateForm() {
    const errorMsg = this.$t('This field is required') as string;

    if (this.project.managed_by && this.project.name) {
      return true;
    } else if (!this.project.managed_by) {
      this.errorManagedBy = errorMsg;
    } else if (!this.project.name) {
      this.errorProjectName = errorMsg;
    }

    return false;
  }

  async getUserProjectJoined() {
    try {
      await projectStore.getUserProject({
        project_id: this.projectId
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

  async addUserProject(userID: number) {
    try {
      await projectStore.addUserProject({
        user_id: userID,
        project_id: this.projectId
      });
      await this.getUserProjectJoined();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorAddMember = err.response.data.message;
      } else {
        this.errorAddMember = err.message;
      }
    } finally {
      setTimeout(() => {
        this.errorAddMember = '';
      }, 3000);
    }
  }

  async addNewTarget() {
    const observer: any = this.$refs.observerModalAddTarget;
    const isValid = await observer.validate();
    this.submittedAddTarget = true;

    if (isValid) {
      if (this.checkExistTarget(this.targetItem.year!, this.targetItem.quarter!, null)) {
        const errorTargetExist = this.$t('The target year: {0} and quarter: {1} is already exist.', {
          0: this.targetItem.year,
          1: this.targetItem.quarter
        }) as string;
        (this.$refs.valid_add_year as any).applyResult({
          errors: [errorTargetExist],
          valid: false,
          failedRules: {}
        });

        (this.$refs.valid_add_quarter as any).applyResult({
          errors: [errorTargetExist],
          valid: false,
          failedRules: {}
        });

        return false;
      }

      this.submittedAddTarget = false;
      const newTargetItem = Object.assign({}, this.targetItem);
      this.project.targets = [ ...this.project.targets, newTargetItem ];
      this.paginationObj.total_rows = this.totalRows;
      this.paginationObj.current_page = Math.ceil(this.paginationObj.total_rows / this.paginationObj.per_page);

      this.targetItem.year = null;
      this.targetItem.quarter = null;
      this.targetItem.content = null;
    }
  }

  cancelAddTarget() {
    this.isAddTarget = false;
  }

  handleAddTarget() {
    this.isAddTarget = true;
  }

  showDetail(index: number) {
    this.project.targets[index].isShow = !this.project.targets[index].isShow;
  }

  editTargetProject(index: number) {
    this.project.targets[index].isEnableEdit = true;
  }

  handleEditProject() {
    const isValid = this.handleValidateForm();
    this.msgSuccessEditProject = '';
    this.editProjectError = '';
    this.submitted = true;

    this.submitted = false;
    const msg = this.$t('Are you sure to edit project?') as string;
    const $this = this;

    if (isValid) {
      this.showModalConfirm(msg, function() {
        $this.saveEditProject();
      });
    }
  }

  async saveEditProject() {
    this.$nuxt.$loading.start();

    try {
      if (this.project) {
        this.project.managed_by = parseInt(this.project.managed_by ? this.project.managed_by.toString() : '0');
        const res = await projectStore.editProject(this.project);
        const msgSuccessEditProject = res.message;
        const $context = this;
        this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditProject);
        await this.reloadData();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.editProjectError = err.response.data.message;
      } else {
        this.editProjectError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await projectStore.getProject(this.project.project_id);
      this.project = this.takeProject;
      this.paginationObj.current_page = 1;
      this.paginationObj.total_rows = this.totalRows;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.editProjectError = err.response.data.message;
      } else {
        this.editProjectError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
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
      this.editProjectError = err;
    });
  }

  checkExistTarget(year: number, quater: number, indexTarget: number | null) {
    const targetCoincide = this.project.targets.find(function(item, index) {
      if (item.year === year && item.quarter === quater && index !== indexTarget) {
        return item;
      }
    });

    return !!targetCoincide;
  }

  backBtn() {
    this.$router.back();
  }

  showDropDown(type: string) {
    switch (type) {
    case 'manager':
      this.isShow = !this.isShow;
      this.$nextTick(() => {
        const nameInput = this.$refs.nameInput as SVGStyleElement;
        nameInput.focus();
      });
      break;
    case 'member':
      this.isShowListUser = !this.isShowListUser;
      break;
    }
    this.memberNameInput = '';
    this.getUserListSearching();
    this.focusIndex = 0;
    this.isMouseOver = false;
  }

  async selectMember(key: any, type: string) {
    switch (type) {
    case 'manager':
      this.project.managed_by = parseInt(key);
      this.memberName = this.userList.get(key.toString()) || '';
      this.errorManagedBy = '';
      this.isShow = false;
      this.$nextTick(() => {
        const nameInput = this.$refs.nameInput as SVGStyleElement;
        nameInput.focus();
      });
      break;
    case 'assignee':
      await this.addUserProject(parseInt(key));
      this.isShowListUser = false;
      break;
    }
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  unfocusList(event) {
    const managerElement = this.$refs.dropdown_list as SVGStyleElement;
    const assgineeElement = this.$refs.assignee_list as SVGStyleElement;

    if (managerElement || assgineeElement) {
      const isInsideManager = managerElement.contains(event.target);
      const isInsideAssignee = assgineeElement.contains(event.target);

      if (!isInsideManager) {
        this.isShow = false;
      }
      if (!isInsideAssignee) {
        this.isShowListUser = false;
      }
    }
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
      this.project.managed_by = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.memberName = this.getUserNameByKey(this.project.managed_by.toString()) || '';
      this.errorManagedBy = '';
      this.isShow = false;
      break;
    }
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.userList.entries(), ([key, value]) => {
      if (this.checkContain(value) || value === '') {
        this.userListSearching.push(key);
      }
    });
  }

  handleChangeInput() {
    this.focusIndex = 0;
    this.getUserListSearching();
  }

  getUserNameByKey(key: any) {
    return this.userList.get(key.toString());
  }

  getAvatarByKey(key: any) {
    return key ? this.takeAvatars.get(key.toString()) : null;
  }

  linkAvatar(avatar: string) {
    return avatar ? 'data:image/png;base64,' + avatar : this.defaultAvatar;
  }
}
</script>
<style scoped>
.wrap-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#target-label {
  padding: 0.5rem;
  margin-bottom: 0;
  background-color:#CCCCCC;
}
#btn-add-target {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid #007bff;
  display: inline-block;
  text-align: center;
  font-size: 1em;
  margin-left: 5px;
  line-height: 20px;
}
.table-striped-cell thead tr th {
  background-color:#f2f2f2;
  text-align: center;
}
.table-striped-cell tbody tr:nth-of-type(even) td {
  background-color: #f2f2f2;
}
.table-striped-cell tbody tr:nth-of-type(odd) td {
  background-color: #fff;
}
.cell-sticky {
  position: sticky;
  left: 0;
}
.scroll-none {
  overflow-y: hidden !important;
}
.border-none {
  border-width: 0;
}
.btn-action-group {
  width: 140px;
}
.add-target {
  height: 70px !important;
  border: 1px dashed #9FA2B4;
  border-radius: 10px;
  background-color: #fff;
  cursor: pointer;
}
#assignee-dropdown {
  top: 70px;
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
.avatars-member:hover > .flex-column {
  opacity: 1;
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
.card .card-header {
  border: 1px solid #EBEFF2;
  box-sizing: border-box;
  border-radius: 5px;
}
.card-title-profile {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 85%;
}
@media (max-width: 768px) {
  .wrap-header {
    display: flex;
    flex-direction: column;
  }
}
.mt-3{
  margin-top: 2rem !important;
}
</style>
