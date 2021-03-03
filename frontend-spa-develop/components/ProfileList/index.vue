<template>
  <div @click="unfocus($event)">
    <h3
      id="page-title"
      class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Manage member information") }}
    </h3>
    <div class="filter-area">
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
                  <label class="font-weight-bold" for="email-search">{{ $t("Email") }}</label>
                  <input
                    id="email-search"
                    v-model.trim="submitForm.email"
                    type="text"
                    class="form-control"
                    placeholder="...">
                </div>
                <div class="col-lg-6 col-md-6 form-group">
                  <label class="text-dark font-weight-bold" for="rank-filter">{{ $t("Rank") }}</label>
                  <select
                    id="rank-filter"
                    v-model.number="submitForm.rank"
                    class="form-control">
                    <option value="0"></option>
                    <option v-for="(item, index) in rankListBox" :key="index" :value="Number(index)">{{ item }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="col-lg-6 col-md-6 form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('Entering company from')"
                    rules="dateBeforeOrEqual:dateto"
                    vid="datefrom">
                    <label class="text-dark font-weight-bold" for="date-from-filter">
                      {{ $t("Entering company from") }}
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
                    :name="$t('Entering company to')"
                    vid="dateto">
                    <label class="text-dark font-weight-bold" for="date-to-filter">
                      {{ $t('Entering company to') }}
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
          @click.prevent="handleInviteMember"
          class="btn btn-primary2 btn-link-profile mr-2">
        {{ $t("Invite member") }}
      </button>
      <button
          @click.prevent="handleMemberRequest"
          class="btn btn-primary2 btn-link-profile">
        {{ $t("Request member") }}
      </button>
    </div>
    <div class="tbl-container text-nowrap mt-4">
      <table class="tbl-info">
        <thead>
          <tr>
            <th>{{ $t("Name") }}</th>
            <th>{{ $t("Email") }}</th>
            <th>{{ $t("Branch") }}</th>
            <th>{{ $t("Role") }}</th>
            <th>{{ $t("Entering company since") }}</th>
            <th>&#8205;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataTable" :key="item.user_id">
            <td>
              <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
              <span class="txt-with-img">{{ item.first_name }} {{ item.last_name }}</span>
            </td>
            <td>{{ item.email }}</td>
            <td>{{ $t(item.branch) }}</td>
            <td>{{ $t(item.role) }}</td>
            <td>
              {{ item.company_join_date }}
            </td>
            <td>
              <div
                @click="viewDetail(item.id)"
                class="cursor-pointer">
                <i class="fas fa-edit"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination container -->
    <div class="mt-4">
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
    <!-- Invite member -->
    <b-modal
      id="modal-invite-member"
      size="lg"
      body-class="p-30px"
      hide-header
      hide-footer
      centered>
      <InviteMember />
    </b-modal>
    <!-- End Invite member -->
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { ProfileListSearchParams, ProfileListPagination } from '~/types/user-profile';
import { layoutAdminStore, userProfileStore } from '~/store/';
import slugify from '~/utils/unaccent';
import InviteMember from '~/components/InviteUser/index.vue';

@Component({
  components: {
    Datepicker,
    InviteMember
  }
})
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
  submitForm: ProfileListSearchParams = {
    name         : '',
    email        : '',
    date_from    : null,
    date_to      : null,
    rank         : 0,
    branch       : 0,
    current_page : 1
  }
  responseMessage: string = ''
  dateTo                  : Date | null = null;
  dateFrom                : Date | null = null;
  datePickerFormat        : string = 'yyyy/MM/dd';
  dateFilterFormat        : string = 'YYYY/MM/DD';
  pagination              : ProfileListPagination = userProfileStore.objPagination;
  rankListBox             : [] = [];
  branchListBox           : [] = [];
  userListBox             : Map<string, string> = new Map()
  langDatepicker          : any = LangDatepicker;
  isUploadReady: boolean = true;
  fileUpload: string = ''
  isShowUpload: boolean = false
  isShow: boolean = false
  isSubmited: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  isAdvSearch: boolean = false
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');

  mounted() {
    this.title = this.$t('Manage member information') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-users';
    layoutAdminStore.setIconTopPage(this.topIcon);

    const query = this.$route.query;

    this.submitForm = {
      name: query.name ? query.name.toString() : '',
      email: query.email ? query.email.toString() : '',
      date_from: null,
      date_to: null,
      rank: parseInt(query.rank ? query.rank.toString() : '0'),
      branch: parseInt(query.branch ? query.branch.toString() : '0'),
      current_page: parseInt(query.current_page ? query.current_page.toString() : '1')
    };
    this.dateFrom = query.date_from ? new Date(query.date_from.toString()) : null;
    this.dateTo = query.date_to ? new Date(query.date_to.toString()) : null;
    this.memberNameInput = this.submitForm.name;
    // when page loading finish, call search request for first time
    this.$nextTick(() => {
      this.searchRequest();
    });
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get dataTable() {
    return userProfileStore.arrProfileListTable;
  }

  get totalRows() {
    return userProfileStore.objPagination.total_row;
  }

  get rowPerPage() {
    return userProfileStore.objPagination.row_perpage;
  }

  get totalPages() {
    return this.$common.totalPage(this.totalRows, this.rowPerPage);
  }

  async searchRequest() {
    this.$nuxt.$loading.start();
    try {
      const res = await userProfileStore.searchProfileListTable(this.submitForm);
      this.rankListBox = res.rank_select_box;
      this.branchListBox = res.branch_select_box;
      this.userListBox = new Map(Object.entries(res.users));
      this.getUserListSearching();
      this.responseMessage = '';
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    } finally {
      this.isSubmited = false;
      this.$nuxt.$loading.finish();
    }
  }

  // search by filter
  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.current_page = 1;
      this.submitForm.name = this.memberNameInput;
      this.isSubmited = true;

      this.linkGen();
      this.searchRequest();
    }
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.name && !this.submitForm.email &&
       !this.submitForm.date_from && !this.submitForm.date_to && !this.submitForm.rank && !this.submitForm.rank) {
      fullPath = '/hrm/profile-list';
    } else {
      fullPath = `/hrm/profile-list?current_page=${this.submitForm.current_page}`;

      if (this.submitForm.name !== '') {
        fullPath += `&name=${this.submitForm.name}`;
      }
      if (this.submitForm.email !== '') {
        fullPath += `&email=${this.submitForm.email}`;
      }
      if (this.submitForm.date_from) {
        fullPath += `&date_from=${this.submitForm.date_from}`;
      }
      if (this.submitForm.date_to) {
        fullPath += `&date_to=${this.submitForm.date_to}`;
      }
      if (this.submitForm.rank !== 0) {
        fullPath += `&rank=${this.submitForm.rank}`;
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

  searchByPagination() {
    this.isSubmited = true;

    this.linkGen();
    this.searchRequest();
  }

  async updateProfiles() {
    const formData = new FormData();
    formData.append('file', this.fileUpload);
    this.$nuxt.$loading.start();
    try {
      await userProfileStore.importCsv(formData);
      await userProfileStore.searchProfileListTable(this.submitForm);
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
      setTimeout(() => {
        this.responseMessage = '';
      }, 3000);
      this.$nuxt.$loading.finish();
    }
  }

  handleInviteMember() {
    this.$bvModal.show('modal-invite-member');
  }

  handleMemberRequest() {
    this.$router.push('/hrm/manage-request');
  }

  async downloadTemplateFile(type) {
    try {
      const response = await userProfileStore.downloadTemplate(type);
      const link = document.createElement('a');
      const filename = type === 'xlsx' ? 'import-profile.xlsx' : 'import-profile.csv';
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

  showUploadModal() {
    this.isShowUpload = !this.isShowUpload;
  }

  unfocus(event) {
    const uploadFile = this.$refs.uploadFile as SVGStyleElement;
    const btnShowUpload = this.$refs.btnShowUpload as SVGStyleElement;
    const dropdownList = this.$refs.dropdown_list as SVGStyleElement;

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

    if (dropdownList) {
      const isClickDropDown = dropdownList.contains(event.target);
      if (!isClickDropDown) {
        this.isShow = false;
      }
    }
  }

  reset() {
    this.submitForm.name = '';
    this.memberNameInput = '';
    this.submitForm.email = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.submitForm.rank = 0;
    this.submitForm.branch = 0;
    this.submitForm.current_page = 1;
    this.isSubmited = true;
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }

    return '';
  }

  viewDetail(id: number) {
    this.$router.push({ path: `/hrm/view-profile/${id}` });
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

  advSearch() {
    this.isAdvSearch = !this.isAdvSearch;
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

<style scoped>
.btn-link-profile {
  width: 152px;
}
</style>
