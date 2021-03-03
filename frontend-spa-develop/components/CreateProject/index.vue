<template>
  <div @click="unfocusList($event)">
    <div class="filter-area_no_bg mt-4">
      <ValidationObserver ref="observer" tag="form">
        <div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required" for="project-name">
              {{ $t("Project name") }}
            </label>
            <input
                id="project-name"
                v-model.trim="createProjectForm.project_name"
                class="form-control"
                :class="{ 'is-invalid': errorProjectName }"
                type="text"
                @input="inputProjectName">
            <p v-if="errorProjectName" class="invalid-feedback">{{ errorProjectName }}</p>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required" for="project-managed-by">
              {{ $t("Manager") }}
            </label>
            <div ref="dropdown_list" class="dropdown">
              <select
                  id="project-managed-by"
                  class="form-control"
                  :class="{ 'is-invalid': errorManagedBy }"
                  @click.prevent="showDropdown">
                <option v-if="memberName" class="d-none" selected>{{ memberName }}</option>
              </select>
              <div
                  id="myDropdown"
                  :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                <div class="myInput">
                  <input
                      ref="nameInput"
                      v-model="memberNameInput"
                      type="text"
                      :placeholder="`${$t('Search')}...`"
                      @input="handleChangeInput"
                      @keydown="selectMemberPressKey($event)">
                </div>
                <ul
                    ref="userList"
                    class="list-user"
                    @mouseover="focusList">
                  <li
                      v-for="(key, index) in userListSearching"
                      ref="item"
                      :key="index"
                      :class="index + 1 === focusIndex && !isMouseOver && 'focus-item' || 'item'"
                      @click.prevent="selectMember(key)">
                    {{ getUserNameByKey(key) }}
                  </li>
                </ul>
              </div>
            </div>
            <p v-if="errorManagedBy" class="invalid-feedback d-block text-left">{{ errorManagedBy }}</p>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <ValidationProvider
                v-slot="{ errors }"
                :name="$t('Deadline')"
                rules="dateBeforeOrEqual:dateto"
                vid="deadline">
              <label class="text-dark font-weight-bold" for="date-from-filter">
                {{ $t("Deadline") }}
              </label>
              <datepicker
                  id="date-from-filter"
                  v-model="dateFrom"
                  :format="datePickerFormat"
                  :typeable="false"
                  :bootstrap-styling="true"
                  :calendar-button="true"
                  calendar-button-icon="fas fa-calendar datepicker_icon"
                  :input-class="{ 'is-invalid': errors[0] }"
                  :language="datePickerLang"
                  name="date-from-filter"
                  placeholder="YYYY/MM/dd">
              </datepicker>
              <p v-show="errors[0]" class="text-danger">{{ errors[0] }}</p>
            </ValidationProvider>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold" for="project-description">
              {{ $t("Description") }}
            </label>
            <textarea
                id="project-description"
                v-model.trim="createProjectForm.project_description"
                rows="10"
                class="form-control"
                type="text">
              </textarea>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <button
                type="button"
                class="btn btn-primary2 w-100px"
                @click="createProjectOk()">
              {{ $t("Submit") }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import Datepicker from 'vuejs-datepicker';
import { ProjectSubmit, CreateProjectSubmit, Pagination } from '~/types/project';
import { layoutAdminStore, projectStore } from '~/store/';
import { ManagerRoleID, GeneralManagerRoleID } from '~/utils/responsecode';
import slugify from '~/utils/unaccent';

@Component({
  components: {
    Datepicker
  }
})
export default class CreateProject extends Vue {
  @Prop() page ?: string
  title : string = '';
  responseMessage    : string = '';
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFrom           : Date | null = null;
  langDatepicker    : any    = LangDatepicker;
  submitForm: ProjectSubmit = {
    keyword      : '',
    current_page : 1,
    row_per_page : 8
  }

  createProjectForm: CreateProjectSubmit = {
    project_name        : '',
    managed_by          : null,
    project_description : ''
  }

  createProjectModal : boolean = false;
  projectError       : string = ''
  pagination         : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page: 0
  }
  isManageMemberRole : boolean =  this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  isShow: boolean = false
  isSubmited: boolean = false
  memberName: string = ''
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  memberList: Map<string, string> = new Map()
  errorProjectName: string = ''
  errorManagedBy: string = ''
  successMsg: string = ''

  beforeMount() {
    const query = this.$route.query;

    this.submitForm.keyword = query.keyword ? query.keyword.toString() : '';
    this.submitForm.current_page = parseInt(query.current_page ? query.current_page.toString() : '1');
  }

  mounted() {
    this.title = this.$t('Create New Project') as string;
    layoutAdminStore.setTitlePage(this.title);
    const $this = this;

    setTimeout(function () {
      $this.searchRequest();
    }, 100);
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }
  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  createProject() {
    if (!this.createProjectModal) {
      this.createProjectModal = true;
      this.createProjectForm.project_name = '';
      this.createProjectForm.project_description = '';
    } else {
      this.createProjectModal = false;
    }
    this.isShow = false;
    this.memberName = '';
    this.createProjectForm.managed_by = null;
    this.errorProjectName = '';
    this.errorManagedBy = '';
  }

  inputProjectName() {
    if (this.createProjectForm.project_name) {
      this.errorProjectName = '';
    }
  }

  handleValidateForm() {
    const errorMsg = this.$t('This field is required') as string;

    if (this.createProjectForm.managed_by && this.createProjectForm.project_name) {
      return true;
    } else {
      if (!this.createProjectForm.managed_by) {
        this.errorManagedBy = errorMsg;
      }
      if (!this.createProjectForm.project_name) {
        this.errorProjectName = errorMsg;
      }

      return false;
    }
  }
  async searchRequest() {
    this.$nuxt.$loading.start();

    try {
      const res = await projectStore.searchProjectTable(this.submitForm);
      this.pagination = res.pagination;
      this.memberList = new Map(Object.entries(res.users));
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.projectError = err.response.data.message;
      } else {
        this.projectError = err.message;
      }
    } finally {
      this.isSubmited = false;
      this.$nuxt.$loading.finish();
    }
  }

  async createProjectOk() {
    const isValid = this.handleValidateForm();

    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        const res = await projectStore.createProject(this.createProjectForm);
        const successMsg = res.message;
        const $context = this;
        this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
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

  selectMember(key: any) {
    this.memberName = this.memberList.get(key.toString()) || '';
    this.createProjectForm.managed_by = parseInt(key.toString());
    this.errorManagedBy = '';
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

  unfocusList(event) {
    const specifiedElement = this.$refs.dropdown_list as SVGStyleElement;
    if (specifiedElement) {
      const isClickInside = specifiedElement.contains(event.target);
      if (!isClickInside) {
        this.isShow = false;
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
      this.createProjectForm.managed_by = parseInt(this.userListSearching[this.focusIndex - 1].toString());
      this.memberName = this.memberList.get(this.createProjectForm.managed_by.toString()) || '';
      this.errorManagedBy = '';
      this.isShow = false;
      break;
    }
  }

  searchByPagination() {
    this.isSubmited = true;
    this.searchRequest();
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

  getUserNameByKey(key: string) {
    return this.memberList.get(key);
  }
};

</script>
