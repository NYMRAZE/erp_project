<template>
  <div @click="unfocusList($event)">
    <h3
      id="page-title"
      class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Manage member information") }}
    </h3>
    <div class="row wrap-navigate-btn p-0 m-0">
      <div class="col-md-6 col-sm-12 p-0 group-btn-left">
        <div class="form-row p-sm-x">
          <div class="col-6">
            <button class="btn w-100 h-100 font-weight-bold btn-primary2 text-white">{{ $t("Manage overtime") }}</button>
          </div>
          <div class="col-6">
            <button @click.prevent="handleCreate" class="btn w-100 h-100 font-weight-bold btn-secondary2">{{ $t("Request overtime") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-area mt-4">
      <ValidationObserver
        ref="observer"
        v-slot="{}"
        tag="form">
        <div class="form-row">
          <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12">
            <div class="form-row">
              <div class="col-lg-4 col-md-6 form-group">
                <label class="font-weight-bold" for="input-search">{{ $t("Search") }}</label>
                <input
                  id="input-search"
                  ref="nameInput"
                  v-model="memberNameInput"
                  @click.prevent="showDropdown"
                  @input="handleChangeInput"
                  @keydown.enter.prevent="selectMemberPressKey($event)"
                  type="text"
                  class="form-control"
                  placeholder="...">
                <div id="myDropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                  <ul ref="userList" @mouseover="focusList" class="list-user">
                    <li
                      ref="item"
                      v-for="(key, index) in userListSearching"
                      :key="index"
                      :class="index + 1 === focusIndex && !isMouseOver && 'focus-item' || 'item'"
                      @click.prevent="selectMemeber(key)">
                      {{ getUserNameByKey(key) }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 form-group">
                <label class="font-weight-bold" for="branch-filter">{{ $t("Filter branch") }}</label>
                <select
                  id="branch-filter"
                  v-model.number="submitForm.branch"
                  class="form-control">
                  <option value="0"></option>
                  <option v-for="(item, index) in branchListBox" :key="index" :value="Number(index)">
                    {{ $t(item) }}
                  </option>
                </select>
              </div>
              <div class="col-lg-4 col-md-6 form-group">
                <label class="font-weight-bold" for="project">{{ $t("Project name") }}</label>
                <select
                    id="project-name"
                    v-model.number="submitForm.project_id"
                    class="form-control">
                  <option :key="0" :value="0">{{ $t("All") }}</option>
                  <option v-for="[key, value] in projectList" :key="key" :value="key">
                    {{ $t(value) }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 form-group d-flex align-items-start">
            <div class="form-row">
              <div class="col form-group">
                <label class="label-hide-sm font-weight-bold">&#8205;</label>
                <div>
                  <button
                    @click="handleFilterRequest()"
                    type="button"
                    class="btn btn-primary2 w-100px mr-2">
                    <i class="fa fa-search"></i>
                    {{ $t("Search") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="padding-sm-x mt-4">
      <button
          type="button"
          class="btn btn-success2 mr-2"
          @click.prevent="exportExcel">
        {{ $t('Export Excel') }}</button>
    </div>
    <div class="tbl-container text-nowrap mt-4">
      <table class="tbl-info">
        <thead>
          <tr>
            <th class="p-2">&#8205;</th>
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Project") }}</th>
            <th>{{ $t("Branch") }}</th>
            <th>{{ $t("Working date") }}</th>
            <th>{{ $t("Range time") }}</th>
            <th>{{ $t("Overtime type") }}</th>
            <th class="text-center">{{ $t("Detail") }}</th>
            <th class="text-center">{{ $t("Action") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in OTResponses" :key="key">
            <td
              :class="takeBgColorCell(item.status)"
              class="cell-rotate font-weight-bold align-middle">
              <div class="rotate-text-cell">
                {{ $t(item.status) }}
              </div>
            </td>
            <td>{{ item.full_name }}</td>
            <td>{{ item.project_name }}</td>
            <td>{{ $t(item.branch) }}</td>
            <td>{{ $t(item.date_overtime) }}</td>
            <td>{{ item.time_overtime }}</td>
            <td>{{ item.overtime_type }}</td>
            <td class="text-center">
              <button
                type="button"
                class="btn btn-lg btn-outline-primary border-0"
                :title="$t('Detail')"
                @click="viewOTReq(item.id)">
                <i class="fas fa-info-circle fa-lg"></i>
              </button>
            </td>
            <td class="text-center">
              <div>
                <button
                  v-if="isAllManager && item.status === 'Pending'"
                  type="button"
                  :title="$t('Accept')"
                  class="btn btn-lg btn-outline-success border-0"
                  @click="acceptReq(item.id)">
                  <i class="fas fa-check"></i>
                </button>
                <button
                  v-if="isAllManager && item.status === 'Pending'"
                  type="button"
                  class="btn btn-lg btn-outline-danger border-0"
                  :title="$t('Deny')"
                  @click="denyReq(item.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination container -->
    <div class="mt-4 overflow-auto totalrow">
      <b-pagination-nav
        v-model="submitForm.current_page"
        :link-gen="linkGen"
        use-router
        :number-of-pages="totalPages > 0 ? totalPages : 1"
        align="center"
        limit="7"
        @input="searchByPagination"
        class="brown-pagination float-right">
      </b-pagination-nav>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <input
          type="number"
          min="1"
          :max="totalPages"
          @keyup.enter="searchByPagination"
          v-model="submitForm.current_page"
          class="form-control input-jump-page" />
      </div>
      <!--<h6 class="font-weight-bold mt-2">{{ $t("Total records") + ":" + totalRows }}</h6>-->
    </div>
    <!-- End Pagination container -->
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { Deny, Accept } from '~/utils/leaverequesttypes';
import { GeneralManagerRoleID, ManagerRoleID } from '~/utils/responsecode';
import { overtimeStore, projectStore, layoutAdminStore } from '~/store/';
import { OvertimeRequest } from '~/types/overtime';
import slugify from '~/utils/unaccent';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
  isAllManager   : boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  submitForm: OvertimeRequest = {
    id: 0,
    users_id: [],
    project_id             : 0,
    status                 : 0,
    overtime_type          : 0,
    date_from              : '',
    date_to                : '',
    branch                 : 0,
    current_page           : 1,
    row_per_page           : 15
  }
  branchListBox      : [] = []
  responseMessage  : string = ''
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFilterFormat : string = 'YYYY/MM/DD';
  langDatepicker    : any = LangDatepicker;
  isShow: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  isSubmited: boolean = false
  userIdSelected: number = 0
  isAdvSearch: boolean = false

  beforeMount() {
    const query = this.$route.query;

    this.submitForm = {
      id: parseInt(query.id ? query.id.toString() : '0'),
      users_id: [],
      project_id: parseInt(query.project_id ? query.project_id.toString() : '0'),
      status: parseInt(query.status ? query.status.toString() : '0'),
      overtime_type: parseInt(query.overtime_type ? query.overtime_type.toString() : '0'),
      branch: parseInt(query.branch_id ? query.branch_id.toString() : '0'),
      date_from: query.date_from ? query.date_from.toString() : '',
      date_to: query.date_to ? query.date_to.toString() : '',
      current_page : parseInt(query.current_page ? query.current_page.toString() : '1'),
      row_per_page: 15
    };

    if (query.user_id) {
      this.userIdSelected = parseInt(query.user_id.toString());
      this.submitForm.users_id[0] = this.userIdSelected;
    }
  }

  mounted() {
    this.title = this.$t('Manage overtime') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-users';
    layoutAdminStore.setIconTopPage(this.topIcon);

    const $this = this;
    const query = this.$route.query;
    // when page loading finish, call search request for first time
    setTimeout(async function () {
      if (!query.user_id) {
        await $this.getUsersManagedList();
        $this.submitForm.users_id = $this.userIDParam;
      }
      await $this.searchRequest();
      $this.memberNameInput = $this.getUserNameByKey($this.userIdSelected.toString()) || '';
    }, 100);
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  searchByPagination() {
    this.isSubmited = true;

    this.linkGen();
    this.searchRequest();
  }

  handleCreate() {
    this.$router.push('/request/create-overtime');
  }

  async searchRequest() {
    this.$nuxt.$loading.start();
    try {
      const res = await overtimeStore.getOvertimeRequest(this.submitForm);
      this.branchListBox = res.branches;
      this.getUserListSearching();
      this.responseMessage = '';
      this.isSubmited = false;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async getUsersManagedList() {
    try {
      await projectStore.getUserManaged();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  get takeUsersManageList() {
    return projectStore.takeUsersManageList;
  }

  get takeProjectManagers() {
    return overtimeStore.takeProjectManagers;
  }

  get isProjectManager() {
    return this.takeProjectManagers && this.takeProjectManagers.includes(this.$auth.user.id);
  }

  get userIDParam() {
    let userList: number[] = [];
    if (this.isAllManager) { return userList; }

    if (Array.isArray(this.takeUsersManageList) && this.takeUsersManageList.length) {
      userList = this.takeUsersManageList.slice();
    }

    if (!userList.includes(this.$auth.user.id)) {
      userList.push(this.$auth.user.id);
    }

    return userList;
  }

  get totalRows() {
    return this.takePagination.total_row;
  }

  // search by filter
  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.current_page = 1;
      this.submitForm.id = 0;
      this.searchRequest();
      this.isSubmited = true;
    }
  }

  get OTResponses(): Map<string, string>[] {
    return overtimeStore.takeOTResponses;
  }

  get takePagination() {
    return overtimeStore.takePagination;
  }

  get projectList() {
    return overtimeStore.takeProjectList;
  }

  get userListBox() {
    return overtimeStore.takeUserList;
  }

  get overtimeTypeListBox() {
    return overtimeStore.takeOvertimeTypes;
  }

  get statusOvertimeTypeListBox() {
    return overtimeStore.takeStatusOvertimeTypes;
  }

  reset() {
    this.submitForm.users_id = this.userIDParam;
    this.submitForm.status = 0;
    this.submitForm.project_id = 0;
    this.submitForm.overtime_type = 0;
    this.submitForm.date_from = '';
    this.submitForm.date_to = '';
    this.submitForm.branch = 0;
    this.submitForm.current_page = 1;
    this.submitForm.id = 0;
    this.memberNameInput = '';
    this.userIdSelected = 0;
  }

  acceptReq(id: number) {
    try {
      const msgModalConfirm = this.$t(
        'Do you want to <span style="color: green; "><strong>ACCEPT</strong></span> this OT request?'
      ) as string;
      const $this = this;
      this.showModalConfirm(msgModalConfirm, async function() {
        await overtimeStore.updateOvertimeRequestStatus({
          request_id: id,
          status_request: Accept
        });
        await $this.searchRequest();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  denyReq(id: number) {
    try {
      const msgModalConfirm = this.$t(
        'Do you want to <span style="color: red; "><strong>DENY</strong></span> this OT request?'
      ) as string;
      const $this = this;
      this.showModalConfirm(msgModalConfirm, async function() {
        await overtimeStore.updateOvertimeRequestStatus({
          request_id: id,
          status_request: Deny
        });
        await $this.searchRequest();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
  }

  viewOTReq(id: number) {
    const route = this.$router.resolve({ path: `/request/view-overtime-request/${id}` });
    window.open(route.href, '_blank');
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }

    return '';
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
    this.userIdSelected = parseInt(key);
    this.submitForm.users_id = [];
    if (this.userIdSelected) {
      this.submitForm.users_id[0] = this.userIdSelected;
    }
    this.isShow = false;
    this.memberNameInput = (this.userListBox && this.userListBox.get(key.toString())) || '';
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
      this.userIdSelected = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.isShow = false;
      if (this.userIdSelected) {
        this.submitForm.users_id = [];
        this.submitForm.users_id[0] = this.userIdSelected;
        this.memberNameInput = (this.userListBox && this.userListBox.get(this.userIdSelected.toString())) || '';
      }
      break;
    }
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.submitForm.users_id = [];
    this.userListSearching = [];

    if (this.userListBox) {
      Array.from(this.userListBox.entries(), ([key, value]) => {
        if (this.checkContain(value)) {
          if (this.isAllManager || this.userIDParam.indexOf(parseInt(key))) {
            this.userListSearching.push(key);
          }
        }
      });
    }

    if (this.memberNameInput) {
      this.submitForm.users_id = this.userListSearching.map((id) => {
        return parseInt(id);
      });
    }
  }

  handleChangeInput() {
    this.focusIndex = 0;
    this.getUserListSearching();
  }

  getUserNameByKey(key: string) {
    return this.userListBox && this.userListBox.get(key);
  }

  async exportExcel() {
    try {
      const response = await overtimeStore.exportToExcel({
        id: this.submitForm.id,
        users_id: this.submitForm.users_id,
        project_id: this.submitForm.project_id,
        status: this.submitForm.status,
        overtime_type: this.submitForm.overtime_type,
        branch: this.submitForm.branch,
        date_from: this.submitForm.date_from,
        date_to: this.submitForm.date_to
      });
      const link = document.createElement('a');
      const filename = `overtime.xlsx`;
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    }
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

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.branch && !this.userIdSelected &&
      !this.submitForm.project_id && !this.submitForm.status && !this.submitForm.date_from && !this.submitForm.date_to &&
      !this.submitForm.overtime_type) {
      fullPath = '/request/manage-overtime';
    } else {
      fullPath = `/request/manage-overtime?current_page=${this.submitForm.current_page}`;

      if (this.userIdSelected !== 0) {
        fullPath += `&user_id=${this.userIdSelected}`;
      }
      if (this.submitForm.project_id !== 0) {
        fullPath += `&project_id=${this.submitForm.project_id}`;
      }
      if (this.submitForm.status !== 0) {
        fullPath += `&status=${this.submitForm.status}`;
      }
      if (this.submitForm.overtime_type !== 0) {
        fullPath += `&overtime_type=${this.submitForm.overtime_type}`;
      }
      if (this.submitForm.date_from !== '') {
        fullPath += `&date_from=${this.convertTimeToStr(new Date(this.submitForm.date_from), this.dateFilterFormat)}`;
      }
      if (this.submitForm.date_to !== '') {
        fullPath += `&date_to=${this.convertTimeToStr(new Date(this.submitForm.date_to), this.dateFilterFormat)}`;
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

  advSearch() {
    this.isAdvSearch = !this.isAdvSearch;
  }

  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Confirmation') as string,
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
      this.responseMessage = this.$t(err) as string;
    });
  }

  takeBgColorCell(statusRequest: string) {
    let className = '';

    switch (statusRequest) {
    case 'Pending':
      className = 'bg-color-pending';
      break;
    case 'Deny':
      className = 'bg-color-deny';
      break;
    case 'Accepted':
      className = 'bg-color-accepted';
      break;
    }

    return className;
  }
};
</script>

<style scoped>

.wrap-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#tbl-request {
  overflow: hidden;
}
.table-striped-cell thead tr th {
  background-color:#f2f2f2;
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

.table > thead > tr > th {
  vertical-align: middle;
  text-align: center;
}

.table-left {
  vertical-align: middle;
  text-align: left;
}

.table-middle {
  vertical-align: middle;
  text-align: center;
}
.wrap-content {
  position: relative;
}
.text-decoration {
  text-decoration: underline;
}
.btn-export-excel {
  width: 165px;
}
#adv-search-btn {
  cursor: pointer;
}
.adv-search {
  transition: all 0.3s ease;
}
.adv-search .form-row .col-xl-6 {
  background-color: #c1e7e1;
}
.btn-action-group {
  width: 150px;
}
@media (max-width: 768px) {
  .wrap-header {
    display: flex;
    flex-direction: column;
  }
}
</style>
