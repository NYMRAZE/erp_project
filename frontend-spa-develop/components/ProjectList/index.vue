<template>
  <div>
    <div class="mt-4">
      <ValidationObserver ref="observer" v-slot="{ errors }" tag="form">
        <div class="filter-area  form-row">
          <div class="col-xl-8 col-lg-7 col-md-8 col-sm-12">
            <div class="form-row d-flex">
              <div class="col-xl-6 col-lg-6 col-md-6 form-group">
                <label class="text-dark font-weight-bold" for="keyword-filter">{{ $t("Search") }}</label>
                <input
                    id="keyword-filter"
                    v-model.trim="submitForm.keyword"
                    class="form-control"
                    :class="{ 'is-invalid': errors[0] }"
                    type="text">
                <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 form-group d-flex align-items-end">
                <label class="label-hide-sm d-inline font-weight-bold">&#8205;</label>
                <button
                    type="submit"
                    class="btn btn-primary2 w-100px"
                    @click.prevent="handleFilterRequest">
                  <i class="fa fa-search"></i> {{ $t("Search") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="tbl-container text-nowrap mt-5">
          <table class="tbl-info">
            <thead class="text-left">
            <tr>
              <th>{{ $t("Project name") }}</th>
              <th>{{ $t("Project description") }}</th>
              <th>{{ $t("Manager") }}</th>
              <th>{{ $t("Updated date") }}</th>
              <th>{{ $t("Action") }}</th>
            </tr>
            </thead>
            <tbody class="text-left">
            <tr v-for="item in dataTable" :key="item.project_id">
              <td>
                {{ item.project_name }}
              </td>
              <td>
                <p v-b-popover.hover.top="item.description" class="description-cell">
                  {{ item.project_description }}
                </p>
              </td>
              <td>
                {{ item.managed_by }}
              </td>
              <td>
                {{ item.updated_at }}
              </td>
              <td class="btn-action-group">
                <template>
                  <div class="btn-action-group">
                    <button
                        type="button"
                        class="btn"
                        @click="editButton(item.project_id)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        title="Delete "
                        @click="deleteButton(item.project_id, item.project_name)">
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </div>
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </ValidationObserver>
    </div>
    <div class="mt-4">
      <b-pagination-nav
          v-model="submitForm.current_page"
          :link-gen="linkGen"
          use-router
          :number-of-pages="totalPages > 0 ? totalPages : 1"
          align="center"
          limit="7"
          class="brown-pagination float-right"
          @input="searchByPagination">
      </b-pagination-nav>
      <div class="form-inline float-right mr-4">
        <span
            class="mr-2 txt-to-page">To page</span>
        <input
            v-model="submitForm.current_page"
            type="number"
            min="1"
            :max="totalPages"
            class="form-control input-jump-page"
            @keyup.enter="searchByPagination" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
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
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
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
  errorProjectName: string = ''
  errorManagedBy: string = ''
  managerName: string = ''

  beforeMount() {
    const query = this.$route.query;

    this.submitForm.keyword = query.keyword ? query.keyword.toString() : '';
    this.submitForm.current_page = parseInt(query.current_page ? query.current_page.toString() : '1');
  }

  mounted() {
    this.title = this.$t('Manage Project') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fas fa-project-diagram';
    layoutAdminStore.setIconTopPage(this.topIcon);

    const $this = this;

    setTimeout(function () {
      $this.searchRequest();
    }, 100);
  }

  get dataTable() {
    return projectStore.arrProjectTable;
  }

  get totalRows() {
    return this.takePagination.total_row;
  }

  get rowPerPage() {
    return this.takePagination.row_per_page;
  }

  get takeUserList() {
    return projectStore.takeUserList;
  }

  get totalPages() {
    let totalPage;
    const totalRow = this.takePagination.total_row;
    const rowPerPage = this.takePagination.row_per_page;
    if (totalRow % rowPerPage !== 0) {
      totalPage = Math.floor(totalRow / rowPerPage) + 1;
    } else {
      totalPage = totalRow / rowPerPage;
    }

    return totalPage;
  }
  handleParticipate() {
    this.$router.push('/workflow/project-list');
  }

  get takePagination() {
    return projectStore.takePaginationProject;
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.keyword) {
      fullPath = '/workflow/project-list';
    } else {
      fullPath = `/workflow/project-list?current_page=${this.submitForm.current_page}&keyword=${this.submitForm.keyword}`;
    }

    if (decodeURIComponent(this.$route.fullPath) !== fullPath && this.isSubmited) {
      try {
        await this.$router.replace(fullPath);
      } catch (e) {
      }
    }
    return fullPath;
  }

  async searchRequest() {
    this.$nuxt.$loading.start();

    try {
      await projectStore.searchProjectTable(this.submitForm);
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

  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.current_page = 1;
      this.isSubmited = true;
      this.linkGen();
      this.searchRequest();
    }
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

  gotoBoard(projectID: number) {
    this.$router.push('/workflow/boards/' + projectID);
  }

  editButton(projectID: number) {
    if (this.isManageMemberRole) {
      this.$router.push('/workflow/edit-project/' + projectID);
    } else {
      this.$router.push('/workflow/view-project/' + projectID);
    }
  }

  deleteButton(projectID: number, projectName: string) {
    const msgModalConfirm = this.$t('Do you want to <b>delete</b> project {0}?', {
      0: projectName
    }) as string;

    const $this = this;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.deleteProject(projectID);
    });
  }

  async deleteProject(projectID: number) {
    this.$nuxt.$loading.start();
    try {
      await projectStore.deleteProject(projectID);
      this.searchRequest();
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
    this.memberName = this.takeUserList.get(key.toString()) || '';
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
      this.memberName = this.takeUserList.get(this.createProjectForm.managed_by.toString()) || '';
      this.errorManagedBy = '';
      this.isShow = false;
      break;
    }
  }

  searchByPagination() {
    this.isSubmited = true;
    this.linkGen();
    this.searchRequest();
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.takeUserList.entries(), ([key, value]) => {
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
    return this.takeUserList.get(key.toString());
  }

  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Delete project'),
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      cancelTitle     : this.$t('Cancel'),
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.projectError = err;
    });
  }
};
</script>

<style scoped>
.message-cell {
  white-space: nowrap;
}
#tbl-request {
  overflow: hidden;
}

table.uploadFile > tbody > tr > td {
  border: none !important;
}
.table > thead > tr > th {
  vertical-align: bottom;
  text-align: center;
}
.table-middle {
  vertical-align: middle;
  text-align: center;
}

.totalrow {
  position: relative;
}

.required:after {
  content: " *";
  color:red;
}
/* The search field */
.myInput > b-form-input {
  border: 1px solid #ced4da;
  background-repeat: no-repeat;
  font-size: 16px;
  padding: 5px;
  width: 100%;
}
.list-actions {
  position: absolute;
  width: 100px;
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

</style>
