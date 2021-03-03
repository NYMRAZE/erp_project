<template>
  <div @click="unfocusList($event)">
    <h3 id="page-title" class="padding-sm-x d-none d-block d-lg-none font-weight-bold"> {{ $t("Manage timekeeping") }} </h3>
    <div class="padding-sm-x">
      <b-button
          size="lg"
          variant="primary"
          class="btn button_large_enabled btn-primary btn-lg"
          @click.prevent="handleCreate">{{ $t("User timekeeping") }}</b-button>
    </div>
    <div class="filter-area mt-4">
      <ValidationObserver
        ref="observer"
        v-slot="{}"
        tag="form">
        <div class="form-row">
          <div class="col-xl-6 col-lg-7 col-md-8 col-sm-12">
            <div class="form-row">
              <div class="col-lg-6 col-md-6 form-group">
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
              <div class="col-lg-6 col-md-6 form-group">
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
            </div>
            <b-collapse id="more-search-area">
              <div class="form-row">
                <div class="col-lg-6 col-md-6 form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('Date from')"
                    rules="dateBeforeOrEqual:dateto"
                    vid="datefrom">
                    <label class="text-dark font-weight-bold" for="date-from-filter">
                      {{ $t("Date from") }}
                    </label>
                    <datepicker
                      id="date-from-filter"
                      v-model="submitForm.date_from"
                      :format="datePickerFormat"
                      :typeable="true"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      :input-class="{ 'is-invalid': errors[0] }"
                      :language="datePickerLang"
                      name="date-from-filter"
                      placeholder="YYYY/MM/DD">
                    </datepicker>
                    <p v-show="errors[0]" class="text-danger">{{ errors[0] }}</p>
                  </ValidationProvider>
                </div>
                <div class="col-lg-6 col-md-6 form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('Date to')"
                    vid="dateto">
                    <label class="text-dark font-weight-bold" for="date-to-filter">
                      {{ $t('Date to') }}
                    </label>
                    <datepicker
                      id="date-to-filter"
                      v-model="submitForm.date_to"
                      :format="datePickerFormat"
                      :typeable="true"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      :language="datePickerLang"
                      :rtl="true"
                      placeholder="YYYY/MM/DD"
                      name="date-to-filter">
                      <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                    </datepicker>
                    <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                  </ValidationProvider>
                </div>
              </div>
            </b-collapse>
          </div>
          <div class="col-xl-6 col-lg-5 col-md-4 col-sm-12 form-group d-flex align-items-start">
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
                  <button
                    v-b-toggle.more-search-area
                    type="button"
                    class="btn-more-less btn btn-secondary2 w-100px font-weight-bold">
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
    </div>
    <div class="padding-sm-x mt-4">
      <button
          type="button"
          class="btn btn-success2 mr-2"
          @click.prevent="exportExcel">
        {{ $t('Export Excel') }}
      </button>
    </div>
    <div class="tbl-container text-nowrap mt-4">
      <table class="tbl-info">
        <thead>
          <tr>
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Email") }}</th>
            <th>{{ $t("Branch") }}</th>
            <th>{{ $t("Check-in") }}</th>
            <th>{{ $t("Check-out") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataTable" :key="item.id">
            <td>
              <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
              <span class="txt-with-img">{{ item.user_name }}</span>
            </td>
            <td>{{ item.email }}</td>
            <td>{{ $t(item.branch) }}</td>
            <td>{{ $t(item.check_in_time) }}</td>
            <td>{{ $t(item.check_out_time) }}</td>
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
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import moment from 'moment';
import { TimekeepingListSubmit, Pagination, TimekeepingsTable } from '~/types/user-timekeeping';
import { timekeepingStore, layoutAdminStore } from '~/store/';
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
  isManageMemberRole   : boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  submitForm: TimekeepingListSubmit = {
    user_name    : '',
    branch_id    : 0,
    date_from    : null,
    date_to      : null,
    current_page : 1
  }

  responseMessage    : string = ''
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  pagination         : Pagination = {
    current_page: 1,
    total_row:    0,
    row_per_page: 0
  }
  branchListBox      : [] = []
  timeKeepingListBox : TimekeepingsTable[] = []
  userListBox = new Map();
  langDatepicker          : any = LangDatepicker;
  isShow: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  isSubmited: boolean = false
  userListSearching: string[] = []
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');

  beforeMount() {
    const query = this.$route.query;

    this.submitForm = {
      user_name: query.user_name ? query.user_name.toString() : '',
      branch_id: parseInt(query.branch_id ? query.branch_id.toString() : '0'),
      date_from: query.date_from ? query.date_from.toString() : null,
      date_to: query.date_to ? query.date_to.toString() : null,
      current_page : parseInt(query.current_page ? query.current_page.toString() : '1')
    };
    this.memberNameInput = this.submitForm.user_name;
  }

  mounted() {
    this.title = this.$t('Manage timekeeping') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-users';
    layoutAdminStore.setIconTopPage(this.topIcon);

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

  get dataTable() {
    return timekeepingStore.arrTimeKeepingTable;
  }

  get totalRows() {
    return this.pagination.total_row;
  }

  get rowPerPage() {
    return this.pagination.row_per_page;
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

    if (this.submitForm.current_page === 1 && !this.submitForm.user_name && !this.submitForm.branch_id &&
            !this.submitForm.date_from && !this.submitForm.date_to) {
      fullPath = '/hrm/timekeeping-list';
    } else {
      fullPath = `/hrm/timekeeping-list?current_page=${this.submitForm.current_page}`;

      if (this.submitForm.user_name !== '') {
        fullPath += `&user_name=${this.submitForm.user_name}`;
      }
      if (this.submitForm.branch_id !== 0) {
        fullPath += `&branch=${this.submitForm.branch_id}`;
      }
      if (this.submitForm.date_from !== null && this.submitForm.date_from !== '') {
        fullPath += `&date_from=${this.convertTimeToStr(this.submitForm.date_from, this.dateFormatDatabase)}`;
      }
      if (this.submitForm.date_to !== null && this.submitForm.date_to !== '') {
        fullPath += `&date_to=${this.convertTimeToStr(this.submitForm.date_to, this.dateFormatDatabase)}`;
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

  async searchRequest() {
    this.$nuxt.$loading.start();

    try {
      const res = await timekeepingStore.searchTimekeepingTable(this.submitForm);
      this.userListBox = new Map(Object.entries(res.users_select_box));
      this.branchListBox = res.branch_select_box;
      this.pagination = res.pagination;
      this.getUserListSearching();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
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
      this.submitForm.date_from = this.convertTimeToStr(this.submitForm.date_from, this.dateFormatDatabase);
      this.submitForm.date_to = this.convertTimeToStr(this.submitForm.date_to, this.dateFormatDatabase);
      this.submitForm.user_name = this.memberNameInput;

      this.responseMessage = '';
      this.isSubmited = true;
      this.searchRequest();
    }
  }

  searchByPagination() {
    this.submitForm.date_from = this.convertTimeToStr(this.submitForm.date_from, this.dateFormatDatabase);
    this.submitForm.date_to = this.convertTimeToStr(this.submitForm.date_to, this.dateFormatDatabase);

    this.responseMessage = '';
    this.isSubmited = true;
    this.searchRequest();
  }

  handleCreate() {
    this.$router.push('/hrm/user-timekeeping');
  }

  resetFilter() {
    this.submitForm.current_page = 1;
    this.submitForm.user_name = '';
    this.submitForm.branch_id = 0;
    this.submitForm.date_from = null;
    this.submitForm.date_to = null;
    this.memberNameInput = '';
    this.isSubmited = true;
  }

  async exportExcel() {
    try {
      const response = await timekeepingStore.exportToExcel({
        date_from: this.convertTimeToStr(this.submitForm.date_from, this.dateFormatDatabase),
        date_to: this.convertTimeToStr(this.submitForm.date_to, this.dateFormatDatabase)
      });
      const link = document.createElement('a');
      const filename = `timekeeping.xlsx`;
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

  convertTimeToStr(time: string | null, formatTime: string) : string {
    if (time) {
      return moment(time!).format(formatTime);
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
    this.isShow = false;
    if (key) {
      this.memberNameInput = this.userListBox.get(key.toString()) || '';
    }
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

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }
};
</script>

</script>

<style scoped>
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

.totalrow {
  position: relative;
}

.totalrow h6 {
  position: absolute;
  top: 0;
  right: 0;
}
.text-decoration {
  text-decoration: underline;
}
a > h5 {
  font-weight: 400;
}
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
  bottom: 0;
  box-shadow: 13px 13px 14px -7px rgba(0,0,0,0.31);
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
.btn-link-profile {
  width: 152px;
}
@media (max-width: 767.98px) {
  #container-body {
    padding-left: 0;
    padding-right: 0;
  }
  .label-hide-sm {
    display: none;
  }
}
</style>
