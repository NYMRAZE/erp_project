<template>
  <div>
    <div class="row wrap-navigate-btn p-0 m-0">
      <div class="col-md-6 col-sm-12 p-0 group-btn-left">
        <div class="form-row p-sm-x">
          <div class="col-6">
            <button class="btn w-100 h-100 font-weight-bold  btn-primary2 text-white">{{ $t("Manage recruitment") }}</button>
          </div>
          <div class="col-6">
            <button @click.prevent="handleCreateRecruitment" class="btn w-100 h-100 font-weight-bold  btn-secondary2">{{ $t("Create recruitment") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-area mt-4">
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="handleFilterRequest()">
        <div class="form-row">
          <div class="col-xl-8 col-lg-10 col-md-10 col-sm-12">
            <div class="form-row">
              <div class="col-lg-3 col-md-3 form-group">
                <label class="font-weight-bold" for="input-search">{{ $t("Search") }}</label>
                <input
                    id="email-filter"
                    v-model.trim="submitForm.job_name"
                    class="form-control"
                    type="text">
              </div>
              <div class="col-lg-3 col-md-3 form-group">
                <label class="font-weight-bold" for="filter-branch">Fitler Branch</label>
                <select
                    id="branch-filter"
                    v-model.number="submitForm.branch_id"
                    class="form-control input_form">
                  <option value="0"></option>
                  <option v-for="[key, value] in takeBranches" :key="key" :value="key">
                    {{ $t(value) }}
                  </option>
                </select>
              </div>
              <div class="col-lg-3 col-md-3 form-group">
                <ValidationProvider
                    v-slot="{ errors }"
                    rules="dateBeforeOrEqual:expiryDate"
                    vid="startDate"
                    :name="$t('Start date')">
                  <label class="text-dark font-weight-bold" for="date-from-filter">
                    {{ $t('Start date') }}
                  </label>
                  <datepicker
                      id="date-from-filter"
                      class="input_form_calendar"
                      v-model="startDateSearch"
                      name="date-from-filter"
                      :format="datePickerFormat"
                      :typeable="true"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      :language="datePickerLang"
                      placeholder="YYYY/MM/dd">
                  </datepicker>
                  <span v-show="errors[0]" class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="col-lg-3 col-md-3 form-group">
                <ValidationProvider
                    v-slot="{ errors }"
                    vid="expiryDate"
                    :name="$t('Expiry date')">
                  <label class="text-dark font-weight-bold" for="date-to-filter">
                    {{ $t('Expiry date') }}
                  </label>
                  <datepicker
                      id="date-to-filter"
                      class="input_form_calendar"
                      v-model="expiryDateSearch"
                      name="date-to-filter"
                      :format="datePickerFormat"
                      :typeable="true"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      :language="datePickerLang"
                      placeholder="YYYY/MM/dd">
                    <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                  </datepicker>
                  <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-2 col-md-2 col-sm-12 form-group d-flex align-items-start">
            <div class="form-row">
              <div class="col form-group">
                <label class="label-hide-sm font-weight-bold">&#8205;</label>
                <div>
                  <b-button
                      class="btn btn-primary2 w-100px"
                      type="submit"
                      :disabled="invalid"><i class="fa fa-search"></i> {{ $t("Search") }}</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="tbl-container text-nowrap mt-5">
      <table class="tbl-info">
        <thead>
        <tr>
          <th scope="col">Recruiter</th>
          <th scope="col">{{ $t("Job name") }}</th>
          <th scope="col">{{ $t("Start date") }}</th>
          <th scope="col">{{ $t("Expiry date") }}</th>
          <th scope="col">{{ $t("Manage CV") }}</th>
          <th scope="col">{{ $t("Detail") }}</th>
          <th scope="col">{{ $t("Action") }}</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in recruitments" :key="index">
          <td><span v-for="(assigneeID, index) in item.assignees" :key="index" class="avatars-member">
                    <img
                        width="30"
                        height="30"
                        class="rounded-circle mr-2"
                        :title="getUserByKey(assigneeID)"
                        :src="linkAvatar(getAvatarByKey(assigneeID))" />
                  </span></td>
          <td>{{ item.job_name }}</td>
          <td>{{ item.start_date }}</td>
          <td>{{ item.expiry_date }}</td>
          <td>
            <button
                type="button"
                class="btn btn-lg btn-outline-success border-0"
                :title="$t('Manage CV')"
                @click="gotoManageCV(item.id)">
              <i class="fas fa-address-card fa-lg"></i>
            </button>
          </td>
          <td>
            <button
                type="button"
                class="btn btn-lg btn-outline-primary border-0"
                :title="$t('Detail')"
                @click="viewDetailJob(item.id)">
              <i class="fas fa-info-circle fa-lg"></i>
            </button>
          </td>
          <td>
            <button
                type="button"
                class="btn btn-lg btn-outline-danger border-0"
                :title="$t('Delete')"
                @click="deleteRecruitment(item.id)">
              <i class="fas fa-trash-alt fa-lg"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
        <span class="mr-2 txt-to-page">To page</span>
        <input
            type="number"
            min="1"
            :max="totalPages"
            @keyup.enter="searchByPagination"
            v-model="submitForm.current_page"
            class="form-control input-jump-page" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { recruitmentStore, layoutAdminStore } from '../../store';
import { RecruitmentSearchParams, RecruitmentParams } from '~/types/recruitment';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  submitForm: RecruitmentSearchParams = {
    job_name     : '',
    start_date   : '',
    expiry_date  : '',
    branch_id    : 0,
    current_page : 1,
    row_per_page : 15
  }
  responseMessage         : string = ''
  msgError                : string = ''
  startDateSearch         : Date | null = null;
  expiryDateSearch        : Date | null = null;
  langDatepicker          : any    = LangDatepicker
  datePickerFormat        : string = 'yyyy/MM/dd';
  dateFilterFormat        : string = 'YYYY/MM/DD';
  dateFormatDatabase      : string = 'YYYY-MM-DD';
  isShowModalCreate       : boolean = false;
  isHidden                : boolean = false;
  submitParams: RecruitmentParams = {
    job_name: null,
    description: null,
    start_date: null,
    expiry_date: null,
    branch_ids: [],
    assignees: []
  }
  branches: Map<string, string> = new Map()
  users: Map<string, string> = new Map()
  memberNameInput: string = ''
  dateFromRequire: string | null = null
  focusIndex: number = 0
  isShowListUser: boolean = false
  isMouseOver: boolean = false
  branchSearching: number[] = []
  userListSearching: number[] = []
  userListBox: Map<number, string> = new Map()
  branchListBox: Map<number, string> = new Map()

  mounted() {
    const $this = this;
    setTimeout(async function () {
      await $this.handleFilterRequest();
    }, 100);
    this.title = this.$t('Manage recruitment') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fas fa-user-plus';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  get recruitments() {
    return recruitmentStore.takeRecruitments;
  }

  get takeAvatars() {
    return recruitmentStore.takeAvatars;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;
    return this.langDatepicker[currentLang];
  }

  convertTimeToStr(time: Date | string, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }

    return '';
  }

  get pagination() {
    return recruitmentStore.takePagination;
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.job_name && !this.submitForm.start_date &&
        !this.submitForm.expiry_date && this.submitForm.branch_id === 0) {
      fullPath = '/recruitment/manage-recruitment';
    } else {
      fullPath = `/recruitment/manage-recruitment?current_page=${this.submitForm.current_page}`;

      if (this.submitForm.job_name !== '') {
        fullPath += `&job_name=${this.submitForm.job_name}`;
      }
      if (this.submitForm.start_date !== '') {
        fullPath += `&start_date=${this.submitForm.start_date}`;
      }
      if (this.submitForm.expiry_date !== '') {
        fullPath += `&expiry_date=${this.submitForm.expiry_date}`;
      }
      if (this.submitForm.branch_id !== 0) {
        fullPath += `&branch_id=${this.submitForm.branch_id}`;
      }
    }

    if (decodeURIComponent(this.$route.fullPath) !== fullPath) {
      try {
        await this.$router.replace(fullPath);
      } catch (e) {
      }
    }

    return fullPath;
  }

  searchByPagination() {
    this.submitForm.start_date = this.startDateSearch ? this.convertTimeToStr(this.startDateSearch, this.dateFormatDatabase) : '';
    this.submitForm.expiry_date = this.expiryDateSearch ? this.convertTimeToStr(this.expiryDateSearch, this.dateFormatDatabase) : '';
    this.linkGen();
    this.handleFilterRequest();
  }

  get totalRows() {
    return this.pagination.total_row;
  }

  get rowPerPage() {
    return this.pagination.row_per_page;
  }

  get totalPages() {
    let totalPage;
    const totalRow = this.totalRows;
    const rowPerPage = this.rowPerPage;
    if (totalRow % rowPerPage !== 0) {
      totalPage = Math.floor(totalRow / rowPerPage) + 1;
    } else {
      totalPage = totalRow / rowPerPage;
    }

    return totalPage;
  }

  get takeUsers() {
    return recruitmentStore.takeUsers;
  }

  get takeBranches() {
    return recruitmentStore.takeBranches;
  }

  handleCreateRecruitment() {
    this.$router.push('/recruitment/create-recruitment');
  }

  getUserByKey(key: any) {
    return this.takeUsers.get(key.toString());
  }

  getAvatarByKey(key: any) {
    return key ? this.takeAvatars.get(key.toString()) : null;
  }

  linkAvatar(avatar: string) {
    return avatar ? 'data:image/png;base64,' + avatar : this.defaultAvatar;
  }

  gotoManageCV(id: number) {
    this.$router.push(`/recruitment/manage-cv?recruitment_id=${id}`);
  }

  viewDetailJob(id: number) {
    this.$router.push(`/recruitment/view-recruitment/${id}`);
  }

  deleteRecruitment(id: number) {
    const msgModalConfirm = this.$t('Do you want to <b>delete</b> this recruitment?') as string;

    const $this = this;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.handleDeleteRecruitment(id);
    });
  }

  async handleDeleteRecruitment(id: number) {
    try {
      await recruitmentStore.removeJob(id);
      await this.handleFilterRequest();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    }
  }

  async handleFilterRequest() {
    this.$nuxt.$loading.start();
    try {
      this.submitForm.start_date = this.startDateSearch ? this.convertTimeToStr(this.startDateSearch, this.dateFormatDatabase) : '';
      this.submitForm.expiry_date = this.expiryDateSearch ? this.convertTimeToStr(this.expiryDateSearch, this.dateFormatDatabase) : '';

      const res = await recruitmentStore.getJobs(this.submitForm);
      this.responseMessage = res.message;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

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
      okTitle         : 'OK',
      cancelTitle     : this.$t('Cancel'),
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.msgError = err;
    });
  }
}
</script>
<style scoped>
.icon_manager {
  margin-left: 10px;
  font-size: 25px;
}
.icon_cv {
  color: lightcoral;
}
.icon_detail {
  color: #109CF1;
}
.icon_action {
  color: #FF1700;
}
.table_tr {
  border : 1px solid #EBEFF2;
}
.totalrow {
  position: relative;
}
.totalrow h6 {
  position: absolute;
  top: 0;
  right: 0;
}
@media (max-width: 767.98px) {
  .label-hide-sm {
    display: none;
  }
}
</style>
