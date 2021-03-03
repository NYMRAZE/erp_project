<template>
  <div @click="unfocusList">
    <div class="row wrap-navigate-btn p-0 m-0">
      <div class="col-md-6 col-sm-12 p-0 group-btn-left">
        <div class="form-row p-sm-x">
          <div class="col-6">
            <button @click.prevent="handleManageRecruitment" class="btn w-100 h-100 font-weight-bold btn-secondary2">{{ $t("Manage recruitment") }}</button>
          </div>
          <div class="col-6">
            <button class="btn w-100 h-100 font-weight-bold btn-primary2 text-white">{{ $t("Create recruitment") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-area_no_bg mt-4">
      <ValidationObserver ref="observer" tag="form">
        <div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required">
              {{ $t("Job name") }}:
            </label>
            <ValidationProvider
                ref="jobName"
                v-slot="{ errors }"
                rules="required"
                :name="$t('Job name')">
              <input
                  v-model="submitParams.job_name"
                  type="text"
                  class="form-control"
                  :class="{'is-invalid': errors[0]}"
                  :readonly="isView">
              <span v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required">
              {{ $t("Assignee") }}:
            </label>
            <div ref="assignee" class="d-flex">
              <div class="d-flex" style="float: left">
                <span v-for="(assigneeID, index) in submitParams.assignees" :key="index" class="avatars-member">
                    <img
                        width="30"
                        height="30"
                        class="rounded-circle mr-2"
                        :title="getUserByKey(assigneeID)"
                        :src="linkAvatar(getAvatarByKey(assigneeID))" />
                    <span
                        v-if="routerPath !== 'view-recruitment-id'"
                        class="d-flex align-items-center justify-content-center"
                        @click="removeTag(index, 'assignee')">
                      &times;
                    </span>
                  </span>
                <span v-if="routerPath !== 'view-recruitment-id'" class="d-flex align-items-center justify-content-center assign-member" @click.prevent="showDropDown('assign')">
                    <i class="fas fa-plus"></i>
                  </span>
              </div>
              <div id="assignee-list" :class="isShowListUser ? 'dropdown-content d-block' : 'dropdown-content'">
                <div class="p-2">
                  <input
                      v-model="memberNameInput"
                      type="text"
                      class="form-control"
                      @input="handleChangeInput('assign')"
                      @keydown="selectPressKey($event, 'assign')">
                </div>
                <ul ref="itemList" @mouseover="focusList">
                  <li
                      v-for="[key, value] in userListBox"
                      ref="item"
                      :key="key"
                      :class="key === focusIndex && !isMouseOver && 'focus-item'"
                      @click.prevent="selectMember(key)">
                    {{ value }}
                  </li>
                </ul>
              </div>
            </div>
            <span v-show="errUserInput" class="invalid-feedback d-block">{{ errUserInput }}</span>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <div class="form-row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <label class="text-dark font-weight-bold required" for="date-to">
                  {{ $t('Start date') }}:
                </label>
                <ValidationProvider ref="startDate" v-slot="{ errors }" rules="dateBeforeOrEqual:expiryDate|required" vid="startDate" :name="$t('Start Date')">
                  <datepicker
                      id="date-to"
                      v-model="startDate"
                      :format="datePickerFormat"
                      :typeable="true"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      :input-class="{ 'is-invalid': errors[0] }"
                      placeholder="YYYY/MM/dd"
                      :language="datePickerLang"
                      :disabled="isView">
                  </datepicker>
                  <span v-show="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <label class="text-dark font-weight-bold required" for="date-from-filter">
                  {{ $t('Expiry date') }}:
                </label>
                <ValidationProvider ref="expiryDate" v-slot="{ errors }" rules="required" vid="expiryDate" :name="$t('Expiry Date')">
                  <datepicker
                      id="date-from-filter"
                      v-model="expiryDate"
                      :format="datePickerFormat"
                      :typeable="true"
                      :input-class="{ 'is-invalid': errors[0] }"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      placeholder="YYYY/MM/dd"
                      :language="datePickerLang"
                      :disabled="isView">
                  </datepicker>
                  <span v-show="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required">
              {{ $t("Branch") }}:
            </label>
            <div class="tags-input" :class="errBranchInput && 'border-danger'" :style="isView && 'background-color: #e9ecef'">
                      <span
                          v-for="(tag, key) in submitParams.branch_ids"
                          :key="key"
                          class="tags-input-tag"
                          :style="isView && 'opacity: 0.75;'">
                        <span>{{ getBranchByKey(tag) }}</span>
                        <button
                            type="button"
                            class="tags-input-remove"
                            :class="isView && 'd-none'"
                            @click="removeTag(key, 'branch')">
                          &times;
                        </button>
                      </span>
              <input
                  ref="branches"
                  v-model="branchNameInput"
                  class="tags-input-text"
                  placeholder=""
                  :readonly="isView"
                  @click="showDropDown('branch')"
                  @input="handleChangeInput('branch')"
                  @keydown="selectPressKey($event, 'branch')">
            </div>
            <div id="myDropdown" :class="isShowListBranch && !isView ? 'dropdown-content d-block' : 'dropdown-content'">
              <ul ref="itemList" @mouseover="focusList">
                <li
                    v-for="[key, value] in branchListBox"
                    ref="item"
                    :key="key"
                    :class="key === focusIndex && !isMouseOver && 'focus-item'"
                    @click.prevent="selectBranch(key)">
                  {{ value }}
                </li>
              </ul>
            </div>
            <span v-show="errBranchInput" class="invalid-feedback d-block">{{ errBranchInput }}</span>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment">
            <label class="text-dark font-weight-bold required">
              {{ $t("Description") }}:
            </label>
            <ValidationProvider
                ref="description"
                v-slot="{ errors }"
                rules="required"
                :name="$t('Description')">
                      <textarea
                          v-model="submitParams.description"
                          v-autosize
                          class="form-control"
                          :class="{'is-invalid': errors[0]}"
                          rows="15"
                          :readonly="isView"></textarea>
              <span v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mt-4 small-recruitment mb-3">
            <p class="text-danger"> {{ $t(msgError) }} </p>
            <b-button
                v-if="!isView"
                type="button"
                class="button_sm_enabled search_button"
                size="sm"
                variant="primary"
                @click.prevent="handleSubmitRequest">{{ $t("Save") }}
            </b-button>
            <button
                v-if="isView"
                type="button"
                class="btn btn-primary w-100px"
                @click.prevent="goToEdit">
              <i class="fa fa-save"></i> {{ $t("Edit") }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import moment from 'moment';
import slugify from '../../utils/unaccent';
import { recruitmentStore, layoutAdminStore } from '../../store';
import { RecruitmentParams } from '~/types/recruitment';
import DoughnutChart from '~/components/Charts/doughnut-chart.vue';

@Component({
  components: {
    Datepicker,
    DoughnutChart
  }
})

export default class extends Vue {
  @Prop() title !: string
  @Prop() isView !: boolean
  @Prop() isEdit !: boolean
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  headerTitle : string = '';
  topIcon: string = '';
  routerPath: string = 'create-recruitment';
  paramID: number = 0
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  langDatepicker    : any    = LangDatepicker
  startDate: Date | null = null
  expiryDate: Date | null = null
  submitParams: RecruitmentParams = {
    job_name: null,
    description: null,
    start_date: '',
    expiry_date: '',
    branch_ids: [],
    assignees: []
  }
  branches: Map<string, string> = new Map()
  users: Map<string, string> = new Map()
  branchNameInput: string = ''
  memberNameInput: string = ''
  dateFromRequire: string | null = null
  focusIndex: number = 0
  isShowListBranch: boolean = false
  isShowListUser: boolean = false
  isMouseOver: boolean = false
  errBranchInput: string = ''
  errUserInput: string = ''
  msgSuccess: string = ''
  msgError: string = ''
  branchSearching: number[] = []
  userListSearching: number[] = []
  branchListBox: Map<number, string> = new Map()
  userListBox: Map<number, string> = new Map()
  statisticData: object = {}
  cvStatisticOption: object = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: this.statisticCVs
  };

  beforeMount() {
    this.routerPath = this.$router.currentRoute.name || '';
    if (this.recruitmentDetail) {
      this.paramID = parseInt(this.$route.params.id);
      this.submitParams.job_name = this.recruitmentDetail.job_name;
      this.submitParams.description = this.recruitmentDetail.description;
      this.submitParams.branch_ids = this.recruitmentDetail.branch_ids.slice();
      this.submitParams.assignees = this.recruitmentDetail.assignees.slice();
      this.startDate = this.recruitmentDetail.start_date ? new Date(this.recruitmentDetail.start_date) : null;
      this.expiryDate = this.recruitmentDetail.expiry_date ? new Date(this.recruitmentDetail.expiry_date) : null;
    }
    this.branches = new Map(JSON.parse(JSON.stringify(Array.from(this.takeBranches))));
    this.getBranchSearching();
    this.users = new Map(JSON.parse(JSON.stringify(Array.from(this.takeUsers))));
    this.getUserSearching();
  }

  mounted() {
    if (this.cvStatistic) {
      this.statisticData = {
        labels: this.cvStatistic.map(cv => this.getStatusByKey(cv.cv_status)),
        datasets: [
          {
            backgroundColor: this.getColors(),
            data: this.cvStatistic.map(cv => cv.amount)
          }
        ]
      };
    }
    this.headerTitle = this.$t('Create recruitment') as string;
    layoutAdminStore.setTitlePage(this.headerTitle);
    this.topIcon = 'fas fa-user-plus';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  get cvStatistic() {
    return recruitmentStore.takeCVStatistic;
  }

  get recruitmentDetail() {
    return recruitmentStore.takeRecruitment;
  }

  get takeBranches() {
    return recruitmentStore.takeBranches;
  }

  get takeUsers() {
    return recruitmentStore.takeUsers;
  }

  get takeAvatars() {
    return recruitmentStore.takeAvatars;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get statusList() {
    return recruitmentStore.takeCVStatus;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;
    return this.langDatepicker[currentLang];
  }

  getColors(): string[] {
    return ['#f98faf', '#6ba8a9', '#a77fd5', '#47d1d4', '#9892db', '#c5a864', '#ffcc00', '#00ff00'];
  }

  getAvatarByKey(key: any) {
    return key ? this.takeAvatars.get(key.toString()) : null;
  }

  goToEdit() {
    this.$router.push(`/recruitment/edit-recruitment/${this.paramID}`);
  }

  handleManageRecruitment() {
    this.$router.push('/recruitment/manage-recruitment');
  }

  async handleSubmitRequest() {
    try {
      this.$nuxt.$loading.start();
      this.handleValidateBranch();
      this.handleValidateAssignee();
      const observer: any = this.$refs.observer;
      const isValid = await observer.validate();

      if (isValid && !this.errBranchInput && !this.errUserInput) {
        this.submitParams.start_date = this.convertTimeToStr(this.startDate, this.dateFormatDatabase);
        this.submitParams.expiry_date = this.convertTimeToStr(this.expiryDate, this.dateFormatDatabase);

        let res;
        if (!this.recruitmentDetail) {
          res = await recruitmentStore.createJob(this.submitParams);
          this.resetRecruitmentParam();
        } else {
          res = await recruitmentStore.editJob({
            id: this.paramID,
            ...this.submitParams
          });
        }
        if (res) {
          const successMsg = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
        }
      }
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

  linkAvatar(avatar: string) {
    return avatar ? 'data:image/png;base64,' + avatar : this.defaultAvatar;
  }

  handleValidateBranch() {
    this.errBranchInput = !this.submitParams.branch_ids.length ? this.$t('This field is required') as string : '';
  }

  handleValidateAssignee() {
    this.errUserInput = !this.submitParams.assignees.length ? this.$t('This field is required') as string : '';
  }

  selectBranch(key: any) {
    if (key) {
      if (this.submitParams.branch_ids.includes(parseInt(key))) {
        this.errBranchInput = this.$t('This branch is existed.') as string;
      } else {
        this.errBranchInput = '';
        this.submitParams.branch_ids.push(parseInt(key));
      }
    }
    this.isShowListBranch = false;
  }

  selectMember(key: any) {
    if (key) {
      if (this.submitParams.assignees.includes(parseInt(key))) {
        this.errUserInput = this.$t('This member is existed.') as string;
      } else {
        this.errUserInput = '';
        this.submitParams.assignees.push(parseInt(key));
      }
    }
    this.isShowListUser = false;
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  showDropDown(type: string) {
    switch (type) {
    case 'branch':
      this.isShowListBranch = true;
      break;
    case 'assign':
      this.isShowListUser = true;
      break;
    }
    this.focusIndex = 0;
    this.isMouseOver = false;
  }

  handleChangeInput(type: string) {
    switch (type) {
    case 'branch':
      this.getBranchSearching();
      break;
    case 'assign':
      this.getUserSearching();
      break;
    }
    this.focusIndex = 0;
    this.isMouseOver = false;
  }

  unfocusList(event) {
    const branchList = this.$refs.branches as SVGStyleElement;
    const userList = this.$refs.assignee as SVGStyleElement;

    if (branchList || userList) {
      const isClickBranch = branchList && branchList.contains(event.target);
      const isClickUser = userList && userList.contains(event.target);

      if (!isClickBranch) {
        this.isShowListBranch = false;
      }
      if (!isClickUser) {
        this.isShowListUser = false;
      }
    }
  }

  selectPressKey(event, type: string) {
    this.isMouseOver = false;
    const wrapperItemList = this.$refs.itemList as SVGStyleElement;
    switch (event.keyCode) {
    case 38:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex > 0) {
        this.focusIndex--;
        switch (type) {
        case 'branch':
          if ((this.branchSearching.length - this.focusIndex) % 7 === 0) {
            wrapperItemList.scrollTop -= 200;
          }
          break;
        case 'assign':
          if ((this.userListSearching.length - this.focusIndex) % 7 === 0) {
            wrapperItemList.scrollTop -= 200;
          }
          break;
        }
      }
      break;
    case 40:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else {
        switch (type) {
        case 'branch':
          if (this.focusIndex < this.branchSearching.length) {
            this.focusIndex++;
            if (this.focusIndex % 7 === 0) {
              wrapperItemList.scrollTop += 200;
            }
          }
          break;
        case 'assign':
          if (this.focusIndex < this.userListSearching.length) {
            this.focusIndex++;
            if (this.focusIndex % 7 === 0) {
              wrapperItemList.scrollTop += 200;
            }
          }
          break;
        }
      }
      break;
    case 13:
      switch (type) {
      case 'branch':
        const branchID = this.branchSearching[this.focusIndex - 1];
        if (this.submitParams.branch_ids.includes(branchID)) {
          this.errBranchInput = this.$t('This branch is existed.') as string;
        } else {
          this.errBranchInput = '';
          this.submitParams.branch_ids.push(branchID);
        }
        this.isShowListBranch = false;
        break;
      case 'assign':
        const userID = this.userListSearching[this.focusIndex - 1];
        if (this.submitParams.assignees.includes(userID)) {
          this.errUserInput = this.$t('This member is existed.') as string;
        } else {
          this.errUserInput = '';
          this.submitParams.assignees.push(userID);
        }
        this.isShowListUser = false;
        break;
      }
    }
  }

  removeTag(index: number, type: string) {
    switch (type) {
    case 'branch':
      this.submitParams.branch_ids.splice(index, 1);
      this.errBranchInput = '';
      break;
    case 'assignee':
      this.submitParams.assignees.splice(index, 1);
      this.errBranchInput = '';
      break;
    }
  }

  statisticCVs() {
    this.$router.push(`/recruitment/manage-cv?recruitment_id=${this.paramID}`);
  }

  getBranchSearching() {
    this.branchSearching = [];
    this.branchListBox = new Map();

    if (this.branches) {
      Array.from(this.branches.entries(), ([key, value]) => {
        if (this.checkContain(value, 'branch')) {
          this.branchSearching.push(parseInt(key));
          this.branchListBox.set(parseInt(key), value);
        }
      });
    }
  }

  getUserSearching() {
    this.userListSearching = [];
    this.userListBox = new Map();

    if (this.users) {
      Array.from(this.users.entries(), ([key, value]) => {
        if (this.checkContain(value, 'assign') || value === '') {
          this.userListSearching.push(parseInt(key));
          this.userListBox.set(parseInt(key), value);
        }
      });
    }
  }

  checkContain(value: string, type: string) {
    let str;
    switch (type) {
    case 'branch':
      str = this.branchNameInput;
      break;
    case 'assign':
      str = this.memberNameInput;
      break;
    }
    return !str || slugify(value).includes(slugify(str));
  }

  resetRecruitmentParam() {
    const jobName = this.$refs.jobName as any;
    jobName.reset();
    const description = this.$refs.description as any;
    description.reset();
    const startDate = this.$refs.startDate as any;
    startDate.reset();
    const expiryDate = this.$refs.expiryDate as any;
    expiryDate.reset();
    this.submitParams.job_name = null;
    this.submitParams.description = null;
    this.submitParams.branch_ids = [];
    this.startDate = null;
    this.expiryDate = null;
  }

  getBranchByKey(key: any) {
    return this.takeBranches.get(key.toString());
  }

  getUserByKey(key: any) {
    return this.takeUsers.get(key.toString());
  }

  backBtn() {
    this.$router.back();
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }
    return '';
  }

  getStatusByKey(key: number) {
    return this.statusList.get(key);
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
#myDropdown {
  width: 99%;
}
#assignee-list {
  top: 37px;
  right: 1px;
}
.required:after {
  content: " *";
  color:red;
}
ul {
  margin-bottom: 0;
}
.tags-input {
  display: flex;
  border: 1px solid #ced4da;
  flex-wrap: wrap;
  border-radius: .25rem;
  padding-left: .5rem;
  padding-right: 1rem;
  padding-top: .3rem;
  padding-bottom: 0.15rem;
}
.tags-input-text {
  flex: 1;
  background: inherit;
  border: none;
  outline: 0;
  padding-top: .2rem;
  padding-bottom: .1rem;
  margin-left: .5rem;
}
.tags-input-tag {
  display: inline-flex;
  line-height: 1;
  align-items: center;
  font-size: .875rem;
  background-color: #6c757d;
  color: #fff;
  border-radius: .25rem;
  user-select: none;
  padding: .25rem;
  margin-right: .5rem;
  margin-bottom: .25rem;
}
.tags-input-tag:last-of-type {
  margin-right: 0;
}
.tags-input-tag > span {
  cursor: pointer;
}
.tags-input-tag > button {
  color: #fff;
  background-color: inherit;
  border: none;
}
.tags-input-remove {
  line-height: 1;
}
.tags-input-remove:first-child {
  margin-right: .25rem;
}
.tags-input-remove:last-child {
  margin-left: .25rem;
}
.tags-input-remove:focus {
  outline: 0;
}
span.assign-member {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(9,30,66,.14);
  cursor: pointer;
}
span.assign-member:hover {
  background-color: rgba(9,30,66,.24);
}
.avatars-member {
  position: relative;
}
.avatars-member span {
  position: absolute;
  width: 13px;
  height: 13px;
  top: 0;
  right: 0px;
  font-size: 14px;
  border-radius: 50%;
  background-color: rgba(9,30,66,.14);
  cursor: pointer;
}
#assignee-list {
  width: 94% !important;
  top: 85px;
}
</style>
