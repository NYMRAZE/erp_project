<template>
  <div @click="unfocusList($event)">
    <div class="pb-3 padding-sm-x btn-group-nav">
      <button
        class="btn btn-secondary-no-bg font-weight-bold bg-white mr-2"
        @click.prevent="goToCreateEval">
        {{ $t("Create new evaluation") }}
      </button>
      <button
        class="btn btn-primary-no-bg font-weight-bold bg-white"
        @click.prevent="goToMemberEval">
        {{ $t("Member evaluation list") }}
      </button>
    </div>
    <!-- filter container -->
    <div class="filter-area mt-4">
      <ValidationObserver ref="observer">
        <div class="form-row">
          <div class="col-xl-9 col-sm-12">
            <div class="form-row">
              <div v-if="isGeneralManager || isManager" class="form-group col-xl-4 col-md-4 col-sm-12">
                <label class="text-dark font-weight-bold" for="name">{{ $t('User') }}</label>
                <div ref="dropdown_list" class="dropdown">
                  <input
                    ref="nameInput"
                    v-model="memberNameInput"
                    type="text"
                    :placeholder="`${$t('Search')}...`"
                    class="form-control"
                    @click.prevent="showDropdown"
                    @input="handleChangeInput"
                    @keydown.enter.prevent="selectMemberPressKey($event)">
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
              <div class="form-group col-xl-4 col-md-4 col-sm-12">
                <label class="text-dark font-weight-bold text-capitalize" for="quarter-filter">{{ $t('quarter') }}</label>
                <select
                  id="quarter-filter"
                  v-model.number="submitForm.quarter"
                  class="form-control">
                  <option :key="0" :value="0">{{ $t("All") }}</option>
                  <option v-for="value in quarterListBox" :key="value" :value="value">{{ value }}</option>
                </select>
              </div>
              <div class="form-group col-xl-4 col-md-4 col-sm-12">
                <label class="text-dark font-weight-bold" for="year">{{ $t('Year') }}</label>
                <select id="year" v-model.number="submitForm.year" class="form-control">
                  <option :key="0" :value="0">{{ $t("All") }}</option>
                  <option
                    v-for="year in getYears"
                    :key="year"
                    :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
              <div v-if="isMember" class="form-group col-xl-4 col-md-4 col-sm-12">
                <label class="text-dark font-weight-bold" for="rank-filter">{{ $t('Rank') }}</label>
                <select
                  id="rank-filter"
                  v-model.number="submitForm.rank"
                  class="form-control">
                  <option :key="0" :value="0">{{ $t("All") }}</option>
                  <option v-for="(value, key) in rankListBox" :key="key" :value="key">{{ value }}</option>
                </select>
              </div>
            </div>
            <b-collapse id="more-search-area">
              <div class="form-row">
                <div v-if="isGeneralManager || isManager" class="form-group col-xl-4 col-md-4 col-sm-12">
                  <label class="text-dark font-weight-bold" for="branch-filter">{{ $t('Branch') }}</label>
                  <select
                    id="branch-filter"
                    v-model.number="submitForm.branch"
                    class="form-control">
                    <option :key="0" :value="0">{{ $t("All") }}</option>
                    <option v-for="(value, key) in branchListBox" :key="key" :value="key">
                      {{ $t(value) }}
                    </option>
                  </select>
                </div>
                <div v-if="isGeneralManager || isManager" class="form-group col-xl-4 col-md-4 col-sm-12">
                  <label class="text-dark font-weight-bold" for="rank-filter">{{ $t('Rank') }}</label>
                  <select
                    id="rank-filter"
                    v-model.number="submitForm.rank"
                    class="form-control">
                    <option :key="0" :value="0">{{ $t("All") }}</option>
                    <option v-for="(value, key) in rankListBox" :key="key" :value="key">{{ value }}</option>
                  </select>
                </div>
                <div v-if="isGeneralManager || isManager" class="form-group col-xl-4 col-md-4 col-sm-12">
                  <label class="text-dark font-weight-bold" for="branch-filter">{{ $t('Project') }}</label>
                  <select
                    id="project-filter"
                    v-model.number="submitForm.project_id"
                    class="form-control">
                    <option :key="0" :value="0">{{ $t("All") }}</option>
                    <option v-for="(value, key) in projectsBox" :key="key" :value="key">
                      {{ value }}
                    </option>
                  </select>
                </div>
              </div>
            </b-collapse>
          </div>
          <div class="col-xl-3 col-sm-12 d-flex align-items-end">
            <div class="form-row">
              <div class="col form-group">
                <label class="label-hide-sm font-weight-bold">&#8205;</label>
                <div class="wrap-btn-group">
                  <button
                    type="button"
                    class="btn btn-primary2 w-100px mr-2"
                    @click="handleFilterRequest">
                    <i class="fa fa-search"></i>
                    {{ $t("Search") }}
                  </button>
                  <button
                    v-if="isGeneralManager"
                    v-b-toggle.more-search-area
                    type="button"
                    class="btn-more-less btn btn-secondary2 w-100px font-weight-bold mr-3">
                    <span class="when-closed">{{ $t("More") }}</span>
                    <span class="when-opened">{{ $t("Less") }}</span>
                    <i class="fas fa-caret-down fa-pull-right line-height-inherit when-closed"></i>
                    <i class="fas fa-caret-up fa-pull-right line-height-inherit when-opened"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
      <div>
        <p class="text-danger"> {{ $t(evaluationError) }} </p>
      </div>
    </div>
    <div v-if="isGeneralManager || isManager" class="padding-sm-x py-4 d-flex">
      <button
        type="button"
        class="btn btn-success2 mr-2"
        @click.prevent="exportResultExcel">
        {{ $t('Export selected to xlsx') }}
      </button>
      <button
        type="button"
        class="btn btn-primary2"
        @click.prevent="exportExcel">
        {{ $t('Export all to xlsx') }}
      </button>
      <!-- End filter container-->
    </div>
    <!-- table request container -->
    <div class="tbl-container text-nowrap">
      <table class="tbl-info">
        <thead>
          <tr>
            <th style="padding: 20px">
              <input v-model="selectAll" type="checkbox">
            </th>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Quarter') }}</th>
            <th>{{ $t('Year') }}</th>
            <th>{{ $t('Branch') }}</th>
            <th>{{ $t('Rank') }}</th>
            <th>{{ $t('Last Updated') }}</th>
            <th>{{ $t('Updated By') }}</th>
            <th>{{ $t("Detail") }}</th>
            <th v-if="isGeneralManager">{{ $t("Action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataTable" :key="item.id">
            <td style="padding: 20px">
              <input v-model="checkedEvaluations" type="checkbox" :value="item.id">
            </td>
            <td>
              <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
              <span class="txt-with-img">{{ item.name }}</span>
            </td>
            <td>
              {{ item.quarter }}
            </td>
            <td>
              {{ item.year }}
            </td>
            <td>
              {{ branchListBox[item.branch] }}
            </td>
            <td>
              {{ rankListBox[item.rank] }}
            </td>
            <td>
              {{ item.last_updated }}
            </td>
            <td>
              {{ item.updated_by_name }}
            </td>
            <td>
              <span
                class="d-flex align-items-center icon_manager"
                @click="editButton(item.id)">
                <i class="fas fa-info-circle icon_detail"></i>
              </span>
            </td>
            <td>
              <span
                v-if="isGeneralManager"
                class="d-flex align-items-center icon_manager"
                @click="deleteButton(item.id)">
                <i class="fas fa-trash-alt icon_action"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End table request container -->

    <!-- Pagination container -->
    <div class="mt-4">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import JSZip from 'jszip';
import { EvaluationListSubmit, Pagination, ExportEvaluationExcel } from '~/types/evaluation';
import { evaluationStore, layoutAdminStore, projectStore } from '~/store/';
import { GeneralManagerRoleID, ManagerRoleID, UserRoleID } from '~/utils/responsecode';
import slugify from '~/utils/unaccent';

@Component({})
export default class extends Vue {
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  isGeneralManager : boolean = this.$auth.user.role_id === GeneralManagerRoleID
  isManager : boolean = this.$auth.user.role_id === ManagerRoleID
  isMember : boolean = this.$auth.user.role_id === UserRoleID

  title: string = ''
  topIcon: string = ''
  submitForm: EvaluationListSubmit = {
    user_ids     : [],
    name         : '',
    quarter      : 0,
    year         : 0,
    branch       : 0,
    rank         : 0,
    status       : 0,
    current_page : 1,
    project_id   : 0
  }

  evaluationError : string = ''
  pagination      : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page: 0
  }
  quarterListBox  : [] = []
  branchListBox   : [] = []
  rankListBox     : [] = []
  statusListBox   : [] = []
  userListBox     : Map<string, string> = new Map()
  projectsBox     : [] = []
  currentYear = new Date().getFullYear()
  isShow: boolean = false
  isSubmited: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  checkedEvaluations: number[] = [];

  beforeMount() {
    const query = this.$route.query;
    this.submitForm = {
      user_ids     : [],
      name         : query.name ? query.name.toString() : '',
      quarter      : parseInt(query.quarter ? query.quarter.toString() : '0'),
      year         : parseInt(query.year ? query.year.toString() : '0'),
      branch       : parseInt(query.branch ? query.branch.toString() : '0'),
      rank         : parseInt(query.rank ? query.rank.toString() : '0'),
      status       : parseInt(query.status ? query.status.toString() : '0'),
      current_page : parseInt(query.current_page ? query.current_page.toString() : '1'),
      project_id   : parseInt(query.project_id ? query.project_id.toString() : '0')
    };
  }

  mounted() {
    const $this = this;
    this.title = 'Evaluation';
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-tasks';
    layoutAdminStore.setIconTopPage(this.topIcon);

    setTimeout(async function () {
      await $this.getUsersManagedList();
      await $this.searchRequest();
    }, 100);
  }

  get getYears() {
    const years: number[] = [];
    for (let index = this.currentYear + 1; index >= this.currentYear - 6; index--) {
      years.push(index);
    }
    return years;
  }

  get selectAll() {
    return this.takeEvaluations.length && this.checkedEvaluations.length
      ? this.checkedEvaluations.length === this.takeEvaluations.length : false;
  }

  set selectAll(value) {
    const selected: number[] = [];
    if (value) {
      this.takeEvaluations.forEach(function (evaluation) {
        selected.push(evaluation.id);
      });
    }

    this.checkedEvaluations = selected;
  }

  get dataTable() {
    return evaluationStore.arrEvaluationTable;
  }

  get usersManagedList() {
    return evaluationStore.takeUsersManagedList;
  }

  get totalRows() {
    return this.pagination.total_row;
  }

  get rowPerPage() {
    return this.pagination.row_per_page;
  }

  get takeUsersManageList() {
    return projectStore.takeUsersManageList;
  }

  get userIDParam() {
    let userList: number[] = [];
    if (this.isGeneralManager) { return userList; }

    if (Array.isArray(this.takeUsersManageList) && this.takeUsersManageList.length) {
      userList = this.takeUsersManageList.slice();
    }

    if (!userList.includes(this.$auth.user.id)) {
      userList.push(this.$auth.user.id);
    }

    return userList;
  }

  get takeEvaluations() {
    return evaluationStore.arrEvaluationTable;
  }

  async getUsersManagedList() {
    try {
      await projectStore.getUserManaged();
      this.submitForm.user_ids = this.userIDParam;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.evaluationError = err.response.data.message;
      } else {
        this.evaluationError = err.message;
      }
    }
  }

  async searchRequest() {
    this.$nuxt.$loading.start();

    try {
      const res = await evaluationStore.searchEvaluationTable(this.submitForm);
      this.rankListBox = res.rank_select_box;
      this.branchListBox = res.branch_select_box;
      this.statusListBox = res.status_select_box;
      this.quarterListBox = res.quarter_select_box;
      this.projectsBox = res.projects;
      this.userListBox = new Map(Object.entries(res.users));
      this.getUserListSearching();
      this.pagination = res.pagination;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.evaluationError = err.response.data.message;
      } else {
        this.evaluationError = err.message;
      }
    } finally {
      this.isSubmited = false;
      this.$nuxt.$loading.finish();
    }
  }

  editButton(evaluationID: number) {
    const route = this.$router.resolve({ path: `/evaluation/view-eval-user/${evaluationID}` });
    window.open(route.href, '_blank');
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

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.year && !this.submitForm.quarter &&
        !this.submitForm.name && !this.submitForm.branch && !this.submitForm.branch &&
        !this.submitForm.rank && !this.submitForm.status && !this.submitForm.project_id) {
      fullPath = '/evaluation/evaluation-list';
    } else {
      fullPath = `/evaluation/evaluation-list?current_page=${this.submitForm.current_page}`;
      if (this.submitForm.year !== 0) {
        fullPath += `&year=${this.submitForm.year}`;
      }
      if (this.submitForm.quarter !== 0) {
        fullPath += `&quarter=${this.submitForm.quarter}`;
      }
      if (this.submitForm.name !== '') {
        fullPath += `&name=${this.submitForm.name}`;
      }
      if (this.submitForm.branch !== 0) {
        fullPath += `&branch=${this.submitForm.branch}`;
      }
      if (this.submitForm.rank !== 0) {
        fullPath += `&rank=${this.submitForm.rank}`;
      }
      if (this.submitForm.status !== 0) {
        fullPath += `&status=${this.submitForm.status}`;
      }
      if (this.submitForm.project_id !== 0) {
        fullPath += `&project_id=${this.submitForm.project_id}`;
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

  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.evaluationError = '';
      this.submitForm.current_page = 1;
      this.submitForm.name = this.memberNameInput;
      this.isSubmited = true;
      this.linkGen();
      this.searchRequest();
    }
  }

  searchByPagination() {
    this.isSubmited = true;
    this.linkGen();
    this.searchRequest();
  }

  resetFilter() {
    this.submitForm.current_page = 1;
    this.submitForm.name = '';
    this.submitForm.quarter = 0;
    this.submitForm.year = 0;
    this.submitForm.branch = 0;
    this.submitForm.rank = 0;
    this.submitForm.status = 0;
    this.submitForm.project_id = 0;
    this.isSubmited = true;
    this.memberNameInput = '';
  }

  deleteButton(evaluationID: number, evaluationName: string) {
    const title = this.$tc('Confirm delete');
    const msgModalConfirm = this.$tc('Do you want to DELETE evaluation?').replace('$1', '<font color="red"><strong>' +
    'DELETE</strong></font>').replace('$2', '<strong>' + evaluationName + '</strong>');
    const $this = this;
    this.showModalConfirm(title, msgModalConfirm, function() {
      $this.deleteEvaluation(evaluationID);
    });
  }

  async deleteEvaluation(evaluationID: number) {
    this.$nuxt.$loading.start();
    try {
      await evaluationStore.deleteEvaluation(evaluationID);
      this.searchRequest();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.evaluationError = err.response.data.message;
      } else {
        this.evaluationError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

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

  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async exportExcel() {
    if (this.checkedEvaluations.length) {
      try {
        const response: ExportEvaluationExcel[] = await evaluationStore.exportToExcel(this.checkedEvaluations);
        const zip = new JSZip();
        for (const res of response) {
          const byteArray = this.base64ToArrayBuffer(res.buf);
          const filename = `${res.file_name.replace(/\s/g, '')}.xlsx`;
          zip.file(filename, byteArray);
        }

        zip.generateAsync({ type:'blob' }).then((blobData) => {
          const link = window.document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([blobData]));
          link.setAttribute('download', 'compress.zip');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.evaluationError = err.response.data.message;
        } else {
          this.evaluationError = err.message;
        }
      }
    }
  }

  async exportResultExcel() {
    try {
      const response = await evaluationStore.exportEvaluationList(this.submitForm);
      const link = document.createElement('a');
      const filename = `evaluations.xlsx`;
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.evaluationError = err.response.data.message;
      } else {
        this.evaluationError = err.message;
      }
    }
  }

  goToCreateEval() {
    this.$router.push('/evaluation/create-eval-user');
  }

  goToMemberEval() {
    this.$router.push('/evaluation/evaluation-list');
  }

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }

  showModalConfirm(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      cancelTitle     : this.$t('Cancel') as string,
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.evaluationError = err;
    });
  }
};
</script>

<style scoped>
.icon_manager {
  margin-left: 10px;
  font-size: 25px;
  cursor: pointer;
}
.icon_detail {
  color: #109CF1;
}
.icon_action {
  color: #FF1700;
}
.btn-action-group {
  width: 90px;
}
.btn-export-excel {
  width: 185px;
}
#adv-search-btn {
  cursor: pointer;
}
input[type="checkbox"]:not(:checked),
input[type="checkbox"]:checked {
  position: relative;
  cursor: pointer;
  z-index: 0;
}
input[type="checkbox"]:not(:checked)::before,
input[type="checkbox"]:checked::before {
  content: '';
    position: absolute;
    top: -3px;
    right: -3px;
    width: 24px;
    height: 24px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    border-radius: 8px;
    background: #fff;
    z-index: 1;
}

input[type="checkbox"]:not(:checked)::after,
input[type="checkbox"]:checked::after {
  content: '\2713\0020';
    position: absolute;
    right: 1px;
    font-size: 1.3em;
    line-height: 0.8;
    color: #09ad7e;
    font-weight: 600;
    transition: all .2s;
    z-index: 2;
}
[type="checkbox"]:not(:checked):after {
  opacity: 0;
  transform: scale(0);
}
[type="checkbox"]:checked:after {
  opacity: 1;
  transform: scale(1);
}
/* disabled checkbox */
[type="checkbox"]:disabled:not(:checked),
[type="checkbox"]:disabled:checked {
  box-shadow: none;
  border-color: #bbb;
  background-color: #ddd;
}
[type="checkbox"]:disabled:checked {
  color: #999;
}
[type="checkbox"]:disabled {
  color: #aaa;
}
.wrap-btn-group {
  width: 220px;
}
@media (max-width: 1199px) {
  .label-hide-sm {
    display: none;
  }
}
.mr-3{
  margin-right: -1rem !important;
}
</style>
