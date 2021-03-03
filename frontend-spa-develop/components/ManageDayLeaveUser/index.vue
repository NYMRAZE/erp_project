<template>
  <div @click="unfocus($event)">
    <!-- filter container -->
    <div class="filter-area mt-4">
      <ValidationObserver ref="observer" v-slot="{ invalid }">
        <div class="upload-file-relative">
          <div class="form-row">
            <div class="col-xl-6 col-lg-7 col-md-8 col-sm-12">
              <div class="form-row">
                <div class="col-lg-6 col-md-6 form-group">
                  <label class="text-dark font-weight-bold" for="input-search">
                    {{ $t("Search") }}
                  </label>
                  <div ref="dropdown_list" class="dropdown">
                    <input
                      ref="nameInput"
                      v-model="memberNameInput"
                      type="text"
                      :placeholder="`${$t('Search')}...`"
                      class="form-control"
                      @click.prevent="showDropdown"
                      @input="handleChangeInput"
                      @keydown="selectMemberPressKey($event)">
                    <div id="myDropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                      <ul ref="userList" class="list-user" @mouseover="focusList">
                        <li
                          v-for="(key, index) in userListSearching"
                          ref="item"
                          :key="index"
                          :class="index + 1 === focusIndex && !isMouseOver && 'focus-item' || 'item'"
                          @click.prevent="selectMemeber(key)">
                          {{ getUserNameByKey(key) }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 form-group">
                  <label class="font-weight-bold" for="branch-filter">
                    {{ $t("Branch") }}
                  </label>
                  <select
                    id="branch-filter"
                    v-model.number="submitForm.branch"
                    class="form-control">
                    <option :key="0" :value="0"> {{ $t('All') }} </option>
                    <option v-for="[key, value] in branchListBox" :key="key" :value="key">
                      {{ $t(value) }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-xl-6 col-lg-5 col-md-4 col-sm-12 form-group">
              <label class="label-hide-sm font-weight-bold">&#8205;</label>
              <div class="btn-container w-100">
                <button
                  type="button"
                  class="btn btn-primary2 w-100px mr-2"
                  :disabled="invalid"
                  @click="handleFilterRequest">
                  <i class="fa fa-search"></i>
                  {{ $t("Search") }}
                </button>
                <button
                  ref="btnShowUpload"
                  type="button"
                  class="btn btn-secondary2 btn-display-upload font-weight-bold"
                  @click.prevent="showUploadModal($event)">
                  {{ $t("Upload") }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-group text-center">
            <p class="text-danger">{{ $t(responseMessage) }}</p>
          </div>
          <div v-if="isShowUpload" ref="uploadFile" class="border-wrap">
            <table class="table uploadFile mb-0">
              <tbody>
                <tr>
                  <td>
                    <span>{{ $t("Download File") }}</span>
                  </td>
                  <td>
                    <div class="d-flex">
                      <a
                        href="#"
                        class="mr-2"
                        @click.prevent="downloadTemplateFile('xlsx')">
                        <i class="fas fa-download"></i>
                        {{ $t("Download xlsx") }}
                      </a>
                      <a
                        href="#"
                        @click.prevent="downloadTemplateFile('csv')">
                        <i class="fas fa-download"></i>
                        {{ $t("Download csv") }}
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>{{ $t("Locale File") }}</span>
                  </td>
                  <td>
                    <b-form-file v-if="isUploadReady" v-model="fileUpload" accept=".csv, .xlsx" size="sm"></b-form-file>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <button type="button" class="btn btn-sm btn-success ml-1" @click="importBonus">
                      {{ $t("Upload") }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <!-- End filter container-->
    <div class="d-flex justify-content-end mb-1">
    </div>
    <!-- table request container -->
    <div class="tbl-container text-nowrap mt-5">
      <table class="tbl-info">
        <thead>
          <tr>
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Email") }}</th>
            <th>{{ $t("Branch") }}</th>
            <th>{{ $t("Day off used") }}</th>
            <th>{{ $t("Day off remaining") }}</th>
            <th v-show="isManageMemberRole" class="btn-action-group">&#8205;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataTable" :key="index">
            <td>
              <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
              <span class="txt-with-img">{{ item.full_name }}</span>
            </td>
            <td>
              {{ item.email }}
            </td>
            <td>
              {{ getBranchByKey(item.branch) }}
            </td>
            <td>
              {{ item.day_used.toFixed(2) }}
            </td>
            <td>
              {{ item.day_remaining.toFixed(2) }}
            </td>
            <td v-show="isManageMemberRole" class="btn-action-group">
              <div class="btn-action-group">
                <button
                  type="button"
                  class="btn btn-success-radius btn-sm mr-2"
                  @click.prevent="addLeaveBonus(item.user_id)">
                  {{ $t("Add leave bonus") }}
                </button>
                <button
                  type="button"
                  class="btn btn-primary-radius btn-sm"
                  @click.prevent="createLeave(item.user_id)">
                  {{ $t("Create leave") }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End table request container -->

    <!-- Pagination container -->
    <div class="mt-4 overflow-auto">
      <b-pagination-nav
        v-model="submitForm.current_page"
        class="brown-pagination float-right"
        :link-gen="linkGen"
        use-router
        :number-of-pages="totalPages > 0 ? totalPages : 1"
        align="center"
        limit="7"
        @input="searchByPagination">
      </b-pagination-nav>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <input
          v-model="submitForm.current_page"
          class="form-control input-jump-page"
          type="number"
          min="1"
          :max="totalPages"
          @keyup.enter="searchByPagination" />
      </div>
    </div>
    <!-- End Pagination container -->
    <AddLeaveBonus :key="isShowBonusLeaveModal" :is-show-modal="isShowBonusLeaveModal" :user-id="userId" />
  </div>
</template>

<script lang="ts">
// import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import { ManagerRoleID, GeneralManagerRoleID } from '~/utils/responsecode';
// import { Pagination } from '../../types/registration-requests';
import { dayleaveStore, layoutAdminStore } from '~/store/';
import slugify from '~/utils/unaccent';
import AddLeaveBonus from '~/components/AddLeaveBonus/index.vue';

@Component({
  components: {
    AddLeaveBonus,
    Datepicker
  }
})
export default class extends Vue {
  isManageMemberRole   : boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  submitForm = {
    user_name              : '',
    branch                 : 0,
    current_page           : 1
  }
  responseMessage  : string = ''
  branchListBox    : Map<string, string> = new Map()
  typeLeaveListBox : Map<string, string> = new Map()
  userListBox      : Map<string, string> = new Map()
  pagination = {
    current_page: 1,
    total_row: 0,
    row_per_page: 0
  };
  dataTable  = [];
  isUploadReady: boolean = true;
  fileUpload: string = '';
  isShowUpload: boolean = false
  isShow: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  isSubmited: boolean = false
  title: string = ''
  userId: number = 0

  beforeMount() {
    const query = this.$route.query;
    this.submitForm = {
      user_name: query.user_name ? query.user_name.toString() : '',
      branch: parseInt(query.branch ? query.branch.toString() : '0'),
      current_page: parseInt(query.current_page ? query.current_page.toString() : '1')
    };
    dayleaveStore.setShowBonusLeaveModal(false);
  }

  mounted() {
    this.title = this.$t('Day off information') as string;
    layoutAdminStore.setTitlePage(this.title);
    const $this = this;
    // when page loading finish, call search request for first time
    setTimeout(function () {
      $this.searchRequest();
    }, 100);
  }

  async searchRequest() {
    this.$nuxt.$loading.start();
    try {
      const res = await dayleaveStore.getLeaveInfoAllUser(this.submitForm);
      this.branchListBox = new Map(Object.entries(res.branch_select_box));
      this.userListBox = new Map(Object.entries(res.user_list));
      this.pagination = res.pagination;
      this.dataTable = res.users_leave_info;
      this.getUserListSearching();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    } finally {
      this.isSubmited = false;
      this.isMouseOver = false;
      this.focusIndex = 0;
      this.$nuxt.$loading.finish();
    }
  }

  get totalPages() {
    let totalPage;
    const totalRow = this.pagination.total_row;
    const rowPerPage = this.pagination.row_per_page;
    if (totalRow % rowPerPage !== 0) {
      totalPage = Math.floor(totalRow / rowPerPage) + 1;
    } else {
      totalPage = totalRow / rowPerPage;
    }

    return totalPage;
  }

  get isShowBonusLeaveModal() {
    return dayleaveStore.checkShowBonusLeaveModal;
  }

  addLeaveBonus(userId: number) {
    dayleaveStore.setShowBonusLeaveModal(true);
    this.userId = userId;
  }

  createLeave(userID: number) {
    this.$router.push('/hrm/leave-for-someone/' + userID);
  }

  async downloadTemplateFile(type) {
    try {
      const response = await dayleaveStore.downloadTemplate(type);
      const link = document.createElement('a');
      const filename = type === 'xlsx' ? 'import-leave.xlsx' : 'import-leave.csv';
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async importBonus() {
    const formData = new FormData();
    formData.append('file', this.fileUpload);
    this.$nuxt.$loading.start();
    try {
      await dayleaveStore.importCsv(formData);
      const res = await dayleaveStore.getLeaveInfoAllUser(this.submitForm);
      this.dataTable = res.users_leave_info;
      this.isShowUpload = false;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.data
          ? `${err.response.data.message} at row ${err.response.data.data}`
          : err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    } finally {
      this.isUploadReady = false;
      this.$nextTick(() => {
        this.isUploadReady = true;
      });
      this.$nuxt.$loading.finish();
    }
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.user_name && !this.submitForm.branch) {
      fullPath = '/hrm/manage-day-leave';
    } else {
      fullPath = `/hrm/manage-day-leave?current_page=${this.submitForm.current_page}`;
      if (this.submitForm.user_name) {
        fullPath += `&user_name=${this.submitForm.user_name}`;
      }
      if (this.submitForm.branch !== 0) {
        fullPath += `&branch=${this.submitForm.branch}`;
      }
    }

    if (decodeURIComponent(this.$route.fullPath) !== fullPath && this.isSubmited) {
      try {
        await this.$router.replace(fullPath);
      } catch (e) {
      }
    }

    return fullPath;
  }

  getBranchByKey(key: number) {
    return this.branchListBox.get(key.toString());
  }

  showUploadModal() {
    this.isShowUpload = !this.isShowUpload;
  }

  // search by filterx
  showDropdown() {
    this.isShow = !this.isShow;
    this.focusIndex = 0;
    this.isMouseOver = false;
    this.$nextTick(() => {
      const nameInput = this.$refs.nameInput as SVGStyleElement;
      nameInput.focus();
    });
  }

  selectMemeber(key: any) {
    this.isShow = false;
    this.memberNameInput = this.userListBox.get(key.toString()) || '';
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  unfocus(event) {
    const dropDownList = this.$refs.dropdown_list as SVGStyleElement;
    const uploadFile = this.$refs.uploadFile as SVGStyleElement;
    const btnShowUpload = this.$refs.btnShowUpload as SVGStyleElement;

    if (dropDownList) {
      const isClickInside = dropDownList.contains(event.target);
      if (!isClickInside) {
        this.isShow = false;
      }
    }

    if (uploadFile && btnShowUpload) {
      const isInsideUploadForm = uploadFile.contains(event.target);
      const isClickUpload = btnShowUpload.contains(event.target);
      if (!isClickUpload) {
        this.isShowUpload = false;
      }
      if (isInsideUploadForm) {
        this.isShowUpload = true;
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
          wrapperUserList.scrollTop -= 120;
        }
      }
      break;
    case 40:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex < this.userListSearching.length) {
        this.focusIndex++;
        if (this.focusIndex % 7 === 0) {
          wrapperUserList.scrollTop += 120;
        }
      }
      break;
    case 13:
      const userID = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.isShow = false;
      if (userID) {
        this.memberNameInput = this.userListBox.get(userID.toString()) || '';
      }
      break;
    }
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.userListBox.entries(), ([key, value]) => {
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
    return this.userListBox.get(key);
  }

  // search by filter
  handleFilterRequest() {
    this.submitForm.current_page = 1;
    this.submitForm.user_name = this.memberNameInput;
    this.isSubmited = true;
    this.linkGen();
    this.searchRequest();
  }

  searchByPagination() {
    this.isSubmited = true;
    this.linkGen();
    this.searchRequest();
  }

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }
}
</script>
<style scoped>
table.uploadFile > tbody > tr > td {
  border: none !important;
}
.upload-file-relative {
  position: relative;
}
.border-wrap {
  background-color: #fff;
  border: 1px solid #ced4da;
  position: absolute;
  right: 0;
  bottom: 65px;
  box-shadow: 13px 13px 14px -7px rgba(0,0,0,0.31);
  z-index: 99;
}
.btn-action-group {
  width: 230px;
}
.btn-success-radius {
  background-color: #2ED47A;
  border-radius: 8px;
  color: #fff;
}
.btn-primary-radius {
  background-color: #109CF1;
  border-radius: 8px;
  color: #fff;
}
.btn-container {
  display: flex;
  justify-content: space-between;
}
@media (min-width: 320px) and (max-width: 480px) {
  .btn-container {
    display: inline;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .label-hide-sm {
    display: none;
  }
}
</style>
