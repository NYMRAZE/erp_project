<template>
  <div>
    <h3
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Manage overtime") }}
    </h3>
    <div class="row wrap-navigate-btn p-0 m-0">
      <div class="col-md-6 col-sm-12 p-0 group-btn-left">
        <div class="form-row p-sm-x">
          <div class="col-6">
            <button
                @click.prevent="handleManagerOvertime"
                class="btn w-100 h-100 font-weight-bold btn-secondary2">{{ $t("Manage overtime") }}</button>
          </div>
          <div class="col-6">
            <button class="btn w-100 h-100 font-weight-bold btn-primary2 text-white">{{ $t("Request overtime") }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="padding-sm-x mt-4">
      <ValidationObserver ref="observer" v-slot="{}" tag="form">
        <div class="row">
          <div class="col-sm ml-3 mr-sm-2 form_OT_mobile">
            <div class="mx-n3">
              <label class="text-dark font-weight-bold required" for="date-from-filter">
                {{ $t("Date") }}:
              </label>
              <datepicker
                  id="date-from-filter"
                  ref="datepicker"
                  v-model="dateFrom"
                  :value="dateFrom"
                  name="date-from-filter"
                  :format="datePickerFormat"
                  :typeable="false"
                  :bootstrap-styling="true"
                  :calendar-button="true"
                  calendar-button-icon="fas fa-calendar datepicker_icon"
                  :input-class="{ 'is-invalid': dateFromRequire }"
                  placeholder="YYYY/MM/dd"
                  :language="datePickerLang"
                  :disabled="isview"
                  @selected="dateFromSelect()">
              </datepicker>
              <p v-if="dateFromRequire" class="invalid-feedback d-block">{{ $t(dateFromRequire) }}</p>
            </div>
            <div class="mx-n3 d-flex mt-3">
              <div class="w-50">
                <label class="text-dark font-weight-bold required" for="from_timeh_leave">
                  {{ $t("From") }}:
                </label>
                <div class="d-flex">
                  <div class="mr-1 widthTime">
                    <select
                        id="from_timeh_leave"
                        v-model.number="from_timeh_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="isview"
                        @change="onChangeTimeh($event, true)">
                      <option :value="null"></option>
                      <option
                          v-for="(h, index) in 24"
                          :key="h"
                          :value="index">
                        {{ index }}
                      </option>
                    </select>
                  </div>
                  <div class="widthTime">
                    <select
                        id="from_timem_leave"
                        v-model="from_timem_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="isview"
                        @change="onChangeTimem($event, true)">
                      <option :value="null"></option>
                      <option
                          v-for="(m, index) in minutes_from"
                          :key="index"
                          :value="m">
                        {{ m }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="w-50 ml-1">
                <label class="text-dark font-weight-bold required" for="to_timeh_leave">
                  {{ $t("To") }}:
                </label>
                <div class="d-flex">
                  <div class="widthTime mr-1">
                    <select
                        id="to_timeh_leave"
                        v-model.number="to_timeh_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="isview"
                        @change="onChangeTimeh($event, false)">
                      <option :value="null"></option>
                      <option
                          v-for="(h, index) in 24"
                          :key="h"
                          :value="index">
                        {{ index }}
                      </option>
                    </select>
                  </div>
                  <div class="widthTime">
                    <select
                        id="to_timem_leave"
                        v-model="to_timem_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="isview"
                        @change="onChangeTimem($event, false)">
                      <option :value="null"></option>
                      <option
                          v-for="(m, index) in minutes_to"
                          :key="index"
                          :value="m">
                        {{ m }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="mx-n3">
              <p v-if="timeError" class="invalid-feedback d-block mb-0">{{ $t(timeError) }}</p>
            </div>
            <div v-show="isShowWorkAtNoon" class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required">
                {{ $t("Work at noon") }}:
              </label>
              <b-form-radio-group v-model="workAtNoon" class="d-flex mt-2">
                <b-form-radio :value="2" :disabled="isview">{{ $t('No') }}</b-form-radio>
                <b-form-radio :value="1" :disabled="isview">{{ $t('Yes') }}</b-form-radio>
              </b-form-radio-group>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required" for="date-from-filter">
                {{ $t("Reason") }}:
              </label>
              <input
                  v-model="reasonOT"
                  class="form-control"
                  :class="{ 'is-invalid': errReasonMsg }"
                  :disabled="isview"
                  @input="checkFieldNotEmpty($event, 'reason')"/>
              <p v-if="errReasonMsg" class="invalid-feedback d-block">{{ errReasonMsg }}</p>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required">
                {{ $t("Project name") }}:
              </label>
              <select
                  v-model.number="projectIndex"
                  class="form-control"
                  :disabled="isview"
                  @change="onChangeProjectJoin">
                <option :key="null" :value="null"></option>
                <option
                    v-for="(project, key) in takeProjectUserJoin"
                    :key="key"
                    :value="key"
                    :selected="project.project_id === projectID">
                  {{ project.project_name }}
                </option>
              </select>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required">
                {{ $t("Type") }}:
              </label>
              <b-form-radio-group v-model="otType" class="d-flex mt-2">
                <b-form-radio :value="1" :disabled="isview">{{ $t('Take Day Off') }}</b-form-radio>
                <b-form-radio :value="2" :disabled="isview">{{ $t('Take Money') }}</b-form-radio>
              </b-form-radio-group>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required">
                {{ $t("To") }}:
              </label>
              <div class="tags-input">
                    <span
                        v-for="(tag, key) in sendToMailList"
                        :key="key"
                        class="tags-input-tag"
                        :style="isview && 'opacity: 0.75;'">
                      <span>{{ tag }}</span>
                      <button
                          type="button"
                          class="tags-input-remove"
                          :class="isview && 'd-none'"
                          @click="removeTag(tag, 'send-to')">
                        &times;
                      </button>
                    </span>
                <input
                    v-model="sendToMailInput"
                    class="tags-input-text"
                    placeholder=""
                    :readonly="isview"
                    @keydown="selectMemberPressKey($event, 'send-to')"
                    @input="checkFieldNotEmpty($event, 'send_to')">
              </div>
              <p v-if="errSendToMailMsg" class="invalid-feedback d-block">{{ errSendToMailMsg }}</p>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold">
                {{ $t("Cc") }}:
              </label>
              <div class="tags-input">
                    <span
                        v-for="(tag, key) in ccMailList"
                        :key="key"
                        class="tags-input-tag"
                        :style="isview && 'opacity: 0.75;'">
                      <span>{{ tag }}</span>
                      <button
                          type="button"
                          class="tags-input-remove"
                          :class="isview && 'd-none'"
                          @click="removeTag(tag, 'send-cc')">
                        &times;
                      </button>
                    </span>
                <input
                    ref="dropdown_list"
                    v-model="ccMailInput"
                    class="tags-input-text"
                    placeholder=""
                    :readonly="isview"
                    @input="handleChangeInput"
                    @keydown="selectMemberPressKey($event, 'send-cc')">
              </div>
              <p v-if="errSendCcMailMsg" class="invalid-feedback d-block">{{ errSendCcMailMsg }}</p>
              <div id="myDropdown" :class="isShowCcList ? 'dropdown-content d-block' : 'dropdown-content'">
                <ul ref="userList" class="list-user" @mouseover="focusList">
                  <li
                      v-for="(key, index) in userListSearching"
                      ref="item"
                      :key="index"
                      :class="index + 1 === focusIndex && !isMouseOver && 'focus-item'"
                      @click.prevent="selectOption(key)">
                    {{ getUserNameByKey(key) }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold">
                {{ $t("Subject") }}:
              </label>
              <input v-model="titleEmail" type="text" class="form-control" :readonly="isview">
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold">
                {{ $t("Content email") }}:
              </label>
              <textarea v-model="contentEmail" class="form-control" rows="6" :readonly="isview"></textarea>
            </div>
            <div class="mx-n3 mt-3">
              <p class="text-danger"> {{ $t(msgError) }} </p>
            </div>
            <div class="mx-n3 mt-3 mb-3" :class="isview && 'd-none'">
              <button type="button" class="button_sm_add search_button" @click="addOTRequest()">
                {{ $t("Add") }} <i class="fa fa-plus"></i>
              </button>
              <b-button
                  type="button"
                  class="button_sm_enabled search_button align-self-end"
                  :class="isview && 'd-none'"
                  size="sm"
                  variant="primary"
                  @click.prevent="handleSubmitRequest">{{ $t("Save") }}
              </b-button>
            </div>
          </div>
          <div class="col-sm right-request-OT">
            <div v-for="(item, index) in listOTRequest" :key="index" class="card-header-profile card-header">
              <div class="mx-n1 mt-2">
                <h5 class="card-title-profile card-title text-dark title-request">
                  <i class="far fa-calendar-plus"></i>
                  <span>{{ titleOTRequest(item.datetime_overtime_from, item.datetime_overtime_to) }}</span>
                  <div :class="item.isShow && 'd-none'" class="float-right" @click="showDetail(index)">
                        <span class="mr-1 font-weight-bold">
                          {{ $t("More") }}
                        </span>
                    <i class="fas fa-caret-down"></i>
                  </div>
                </h5>
              </div>
              <div :class="!item.isShow && 'd-none'">
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("Reason") }}
                  </label>
                  <p>{{ item.reason }}</p>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("Project") }}
                  </label>
                  <p>{{ getProjectNameByKey(item.project_id) }}</p>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold required">
                    {{ $t("Work at noon") }}:
                  </label>
                  <b-form-radio-group v-model="item.work_at_noon" class="d-flex mt-2">
                    <b-form-radio :value="2" :disabled="true">{{ $t('No') }}</b-form-radio>
                    <b-form-radio :value="1" :disabled="true">{{ $t('Yes') }}</b-form-radio>
                  </b-form-radio-group>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold required">
                    {{ $t("Type") }}
                  </label>
                  <b-form-radio-group v-model="item.overtime_type" class="d-flex mt-2">
                    <b-form-radio :value="1" :disabled="true">{{ $t('Take Day Off') }}</b-form-radio>
                    <b-form-radio :value="2" :disabled="true">{{ $t('Take Money') }}</b-form-radio>
                  </b-form-radio-group>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("To") }}:
                  </label>
                  <div>
                    <span v-for="(tag, key) in item.send_to" :key="key" class="tags-input-tag" style="opacity: 0.75;">
                      <span>{{ tag }}</span>
                    </span>
                  </div>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("Cc") }}:
                  </label>
                  <div>
                    <span v-for="(tag, key) in item.send_cc" :key="key" class="tags-input-tag" style="opacity: 0.75;">
                      <span>{{ tag }}</span>
                    </span>
                  </div>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("Subject") }}:
                  </label>
                  <p>{{ item.email_title }}</p>
                </div>
                <div class="mx-n1 mt-3">
                  <label class="text-dark font-weight-bold">
                    {{ $t("Content email") }}:
                  </label>
                  <textarea v-model="item.email_content" class="form-control" id="email_content" rows="6" readonly>
                  </textarea>
                </div>
                <div class="mx-n1 mt-3 border-bottom">
                  <button type="button" class="btn btn-danger mb-3" @click="removeLeaveDay(index)">
                    <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                  </button>
                </div>
                <div class="mb-5">
                  <h5 class="text-dark">
                    <div :class="!item.isShow && 'd-none'" class="d-flex float-right" @click="showDetail(index)">
                        <span class="mr-1 font-weight-bold" style="font-size: 15px !important;">
                          {{ $t("Less") }}
                        </span>
                      <i class="fas fa-caret-up" style="font-size: 15px !important;"></i>
                    </div>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import moment from 'moment';
import slugify from '../../utils/unaccent';
import { Pending } from '~/utils/leaverequesttypes';
import { CreateOvertimeParams } from '~/types/overtime';
import { ProjectTable } from '~/types/project';
import { userProfileStore, overtimeStore, projectStore, layoutAdminStore } from '~/store/';
@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  @Prop()
  isview!: boolean;
  minutes_from: string[] = ['00', '15', '30', '45'];
  minutes_to: string[] = ['00', '15', '30', '45'];
  contentEmail       : string = this.OTDetail ? this.OTDetail.email_content : '';
  titleEmail         : string = this.OTDetail ? this.OTDetail.email_title : '';
  dateFrom           : Date | null = this.dateOTFrom
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  msgError           : string = ''
  msgSuccess         : string = ''
  timeError          : string = ''
  from_timeh_leave   : number | null = parseInt(this.timeOTFrom[0]) || null
  from_timem_leave   : string | null = this.timeOTFrom[1] || null
  to_timeh_leave     : number | null = parseInt(this.timeOTTo[0]) || null
  to_timem_leave     : string | null = this.timeOTTo[1] || null
  timeFrom           : number | null = this.from_timeh_leave
  timeTo             : number | null = this.to_timeh_leave
  // Date time hide show by type leave request
  langDatepicker    : any    = LangDatepicker

  listOTRequest : CreateOvertimeParams[] = []
  dateFromRequire: string | null = null
  userListSearching: string[] = []

  otType: number = this.OTDetail ? this.OTDetail.overtime_type : 1
  reasonOT: string = this.OTDetail ? this.OTDetail.reason : ''
  projectID: number = this.OTDetail ? this.OTDetail.project_id : 0
  projectIndex: number | null = this.getProjectIndexSelected
  isShowCcList: boolean = false
  ccMailList: string[] = this.OTDetail ? this.OTDetail.send_cc : []
  sendToMailList: string[] = this.OTDetail ? this.OTDetail.send_to : []
  ccMailInput: string = ''
  sendToMailInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  errorProjectMsg: string = ''
  errSendCcMailMsg: string = ''
  errSendToMailMsg: string = ''
  errReasonMsg: string = ''
  isShowField: boolean = false;
  usersIdNotification: number[] = [];
  workAtNoon: number = this.OTDetail && this.OTDetail.work_at_noon ? this.OTDetail.work_at_noon : 2;
  isShowWorkAtNoon: boolean = false;
  title : string = '';
  topIcon: string = '';

  mounted() {
    this.title = this.$t('Manage overtime') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-users';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  get OTDetail() {
    return overtimeStore.takeOTFromDetail;
  }

  get userListBox() {
    return overtimeStore.takeUserList;
  }

  get takeProjectUserJoin(): ProjectTable[] | null {
    return projectStore.takeProjectUserJoin;
  }

  get emailsGMAndPM() {
    return overtimeStore.takeEmailsGMAndPM;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get takeTitleEmail() {
    let titleMail = '';

    if (!this.OTDetail) {
      if (this.dateFrom && this.from_timeh_leave !== null && this.to_timeh_leave !== null &&
      this.from_timem_leave && this.to_timem_leave) {
        titleMail = `【${this.$t('Important')}】【${this.$t('Overtime')}】【${this.takeDurationOvertime()}】【${this.fullUserName}】`;
      }
    } else {
      titleMail = this.OTDetail.email_title;
    }

    return titleMail;
  }

  // get full name user
  get fullUserName() {
    if (userProfileStore.userProfileInfo &&  this.$route.params.id !== this.$auth.user.id) {
      const userProfile = userProfileStore.userProfileInfo;
      return userProfile.first_name + ' ' + userProfile.last_name;
    }
    return this.$auth.user.first_name + ' ' + this.$auth.user.last_name;
  }

  get dateOTFrom() {
    const date = this.OTDetail ? this.OTDetail.datetime_overtime_from.split(' ')[0] : '';
    return date ? new Date(date) : null;
  }

  getTimeOT(dateTime: string) {
    return dateTime.split(' ')[1].split(':');
  }

  get timeOTFrom() {
    return this.OTDetail ? this.getTimeOT(this.OTDetail.datetime_overtime_from) : ['', ''];
  }

  get timeOTTo() {
    return this.OTDetail ? this.getTimeOT(this.OTDetail.datetime_overtime_to) : ['', ''];
  }

  get takeContentEmail() {
    let content = '';

    if (this.OTDetail) {
      content = this.OTDetail.email_content;
    } else if (this.projectID && this.dateFrom && !this.timeError && this.from_timeh_leave !== null &&
    this.to_timeh_leave !== null && this.from_timem_leave && this.to_timem_leave) {
      content = this.$t('Dear all,') + '\n';
      content += this.$t(`I'm {0}`).toString().replace('{0}', this.fullUserName) + '\n';
      content += this.$t('I am working on {0} project.', {
        0: this.takeProjectUserJoin && this.projectIndex !== null && this.takeProjectUserJoin[this.projectIndex].project_name
      }) + '\n';
      content += this.$t('I {0} so I {1}.', {
        0: this.reasonOT,
        1: '【Overtime】' + '【' + this.takeDurationOvertime() + '】'
      }) + '\n';

      content += this.$t('Best regard.');
    }

    return content;
  }

  get getProjectIndexSelected() {
    let projectIndex: number | null = null;
    this.takeProjectUserJoin && this.takeProjectUserJoin.forEach((project, key) => {
      if (project.project_id === this.projectID) {
        projectIndex = key;
      }
    });

    return projectIndex;
  }

  showDetail(index: number) {
    this.listOTRequest[index].isShow = !this.listOTRequest[index].isShow;
  }

  onChangeProjectJoin() {
    this.sendToMailList = [];
    this.ccMailList = [];
    this.usersIdNotification = [];
    if (this.projectIndex !== null && this.takeProjectUserJoin && this.takeProjectUserJoin.length) {
      const projectJoined = this.takeProjectUserJoin[this.projectIndex] as ProjectTable;
      this.projectID = projectJoined.project_id;
      const email = this.emailsGMAndPM.get(projectJoined.managed_by.toString()) || '';
      this.sendToMailList.push(email);
      this.usersIdNotification.push(projectJoined.managed_by);
      this.errSendToMailMsg = '';
      this.contentEmail = this.takeContentEmail;
    }
  }

  handleValidateForm() {
    this.errorProjectMsg = this.handleValidateRequire(this.projectID);
    this.dateFromRequire = this.handleValidateRequire(this.dateFrom);
    this.errReasonMsg = this.handleValidateRequire(this.reasonOT);
    this.errSendToMailMsg = this.handleValidateRequire(this.sendToMailList.length);
    this.timeError = this.from_timeh_leave == null || this.to_timeh_leave == null ||
      !this.from_timem_leave || !this.to_timem_leave ? 'This field is required' : '';
  }

  async addOTRequest() {
    this.handleValidateForm();
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid && !this.timeError && !this.errorProjectMsg &&
    !this.errSendToMailMsg && !this.errSendCcMailMsg && !this.errReasonMsg && !this.dateFromRequire) {
      this.listOTRequest.push(
        {
          user_id: this.$auth.user.id,
          reason: this.reasonOT,
          datetime_overtime_from: this.getOTDateTime(this.dateFrom, this.from_timeh_leave, this.from_timem_leave),
          datetime_overtime_to: this.getOTDateTime(this.dateFrom, this.to_timeh_leave, this.to_timem_leave),
          status: Pending,
          project_id: this.projectID,
          email_title: this.titleEmail,
          email_content: this.contentEmail,
          send_to: this.sendToMailList,
          send_cc: this.ccMailList,
          overtime_type: this.otType,
          isShow: false,
          users_id_notification: this.usersIdNotification,
          work_at_noon: this.workAtNoon
        });
      this.resetLeaveRequest();
    }
  }

  handleManagerOvertime() {
    this.$router.push('/request/manage-overtime');
  }

  cancelOTRequest() {
    this.resetLeaveRequest();
  }

  getOTDateTime(date: Date | null, timeh: number | null, timem: string | null) {
    return `${this.convertTimeToStr(date, this.dateFormatDatabase)} ${timeh}:${timem}`;
  }

  titleOTRequest(dateTimeFrom: string, dateTimeTo: string) {
    return this.$t('Overtime') as string + `(${dateTimeFrom} - ${dateTimeTo})`;
  }

  removeLeaveDay(id: number) {
    this.listOTRequest.splice(id, 1);
  }

  showEmail(id: number) {
    this.listOTRequest[id].isShow = !this.listOTRequest[id].isShow;
  }

  handleSubmitRequest() {
    const $this = this;

    if (this.listOTRequest.length) {
      const msg = this.$t('Do you want to send email?') as string;
      this.showModalConfirm(msg, function() {
        $this.createLeaveReq();
        $this.resetLeaveRequest();
        $this.listOTRequest = [];
      });
    } else {
      const msgError = this.$t('Please enter the information requested.') as string;
      const $context = this;
      this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', msgError);
    }
  }

  backBtn() {
    return this.isview ? window.close() : this.$router.back();
  }

  async createLeaveReq() {
    try {
      this.$nuxt.$loading.start();
      const res = await overtimeStore.createOvertimeRequest(this.listOTRequest);
      const msgSuccess = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccess);
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

  onChangeTimem(event, isFrom: boolean) {
    const value = event.target.value;
    const minutes = value ? parseInt(value) : 0;

    if (this.from_timeh_leave !== null && isFrom) {
      this.timeFrom = this.from_timeh_leave * 60 + minutes;
    }
    if (this.to_timeh_leave !== null && !isFrom) {
      this.timeTo = this.to_timeh_leave * 60 + minutes;
    }

    if (this.timeFrom !== null && this.timeTo !== null && this.timeFrom >= this.timeTo) {
      this.timeError = this.$t('Time from should be less than time to') as string;
    } else {
      this.timeError = '';
    }

    this.isShowWorkAtNoon = !!(this.timeTo && this.timeTo > 720 && this.timeFrom && this.timeFrom < 810);
    this.titleEmail = this.takeTitleEmail;
    this.contentEmail = this.takeContentEmail;
  }

  onChangeTimeh(event, isFrom: boolean) {
    const value = event.target.value;
    if (this.from_timem_leave !== null && isFrom) {
      this.timeFrom = value * 60 + parseInt(this.from_timem_leave);
    }
    if (this.to_timem_leave !== null && !isFrom) {
      this.timeTo = value * 60 + parseInt(this.to_timem_leave);
    }

    if (this.timeFrom !== null && this.timeTo !== null && this.timeFrom >= this.timeTo) {
      this.timeError = this.$t('Time from should be less than time to') as string;
    } else {
      this.timeError = '';
    }

    this.isShowWorkAtNoon = !!(this.timeTo && this.timeTo > 720 && this.timeFrom && this.timeFrom < 810);
    this.titleEmail = this.takeTitleEmail;
    this.contentEmail = this.takeContentEmail;
  }

  dateFromSelect() {
    if (this.$refs.datepicker) {
      this.dateFromRequire = '';
      this.isShowField = true;
    }
    this.$nextTick(() => {
      this.titleEmail = this.takeTitleEmail;
      this.contentEmail = this.takeContentEmail;
    });
  }

  resetLeaveRequest() {
    this.dateFrom = null;
    this.from_timeh_leave = null;
    this.from_timem_leave = null;
    this.to_timeh_leave = null;
    this.to_timem_leave = null;
    this.timeTo = null;
    this.timeFrom = null;
    this.sendToMailList = [];
    this.ccMailList = [];
    this.contentEmail = '';
    this.titleEmail = '';
    this.reasonOT = '';
    this.projectIndex = null;
    this.isShowField = false;
    this.isShowWorkAtNoon = false;
    this.otType = 1;
    this.workAtNoon = 2;
  }

  handleValidateRequire(field: any) {
    return !field ? 'This field is required' : '';
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }
    return '';
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
      title           : this.$t('Confirm') as string,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : this.$t('Yes') as string,
      cancelTitle     : this.$t('No') as string,
      hideHeaderClose : false,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.msgError = err;
    });
  }

  takeDurationOvertime() {
    return `${
      this.getOTDateTime(
        this.dateFrom,
        this.from_timeh_leave,
        this.from_timem_leave
      )} - ${this.to_timeh_leave}:${this.to_timem_leave}`;
  }

  removeTag(tag: string, type: string) {
    switch (type) {
    case 'send-cc':
      this.ccMailList.splice(this.ccMailList.indexOf(tag), 1);
      break;
    case 'send-to':
      this.sendToMailList.splice(this.sendToMailList.indexOf(tag), 1);
      break;
    }

    const index = this.usersIdNotification.indexOf(parseInt(this.getKeyByValue(this.emailsGMAndPM, tag)));
    if (index > -1) {
      this.usersIdNotification.splice(index, 1);
    }
  }

  selectOption(key: any) {
    if (key) {
      const ccMail = this.emailsGMAndPM.get(key.toString()) || '';
      if (this.sendToMailList.includes(ccMail) || this.ccMailList.includes(ccMail)) {
        this.errSendCcMailMsg = 'This email is existed.';
      } else {
        this.usersIdNotification.push(parseInt(key));
        this.ccMailList.push(ccMail);
        this.ccMailInput = '';
      }
    }
    this.isShowCcList = false;
    setTimeout(() => {
      this.errSendCcMailMsg = '';
    }, 2000);
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  selectMemberPressKey(event, type: string) {
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
        if (this.focusIndex % 7 === 0) {
          wrapperUserList.scrollTop += 200;
        }
      }
      break;
    case 13:
      switch (type) {
      case 'send-cc':
        const user_id = parseInt(this.userListSearching[this.focusIndex - 1]);
        if (user_id) {
          const ccMail = this.emailsGMAndPM.get(user_id.toString()) || '';
          if (this.sendToMailList.includes(ccMail) || this.ccMailList.includes(ccMail)) {
            this.errSendCcMailMsg = 'This email is existed.';
          } else {
            this.usersIdNotification.push(user_id);
            this.ccMailList.push(ccMail);
            this.ccMailInput = '';
          }
        } else if (this.isEmail(this.ccMailInput)) {
          this.ccMailList.push(this.ccMailInput);
          this.ccMailInput = '';
        } else {
          this.errSendCcMailMsg = 'This field must be a valid email';
        }
        this.isShowCcList = false;
        break;
      case 'send-to':
        if (this.isEmail(this.sendToMailInput)) {
          if (this.sendToMailList.includes(this.sendToMailInput) || this.ccMailList.includes(this.sendToMailInput)) {
            this.errSendToMailMsg = 'This email is existed.';
          } else {
            this.sendToMailList.push(this.sendToMailInput);
            this.sendToMailInput = '';
          }
        } else {
          this.errSendToMailMsg = 'This field must be a valid email';
        }
      }
      setTimeout(() => {
        this.errSendCcMailMsg = '';
        this.errSendToMailMsg = '';
      }, 2000);
      break;
    }
  }

  checkContain(value: string) {
    const str = this.ccMailInput;
    return !str || slugify(value).includes(slugify(str));
  }

  isEmail(str: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  checkFieldNotEmpty(event: any, type: string) {
    if (event.target.value !== null) {
      switch (type) {
      case 'reason':
        this.errReasonMsg = '';
        this.contentEmail = this.takeContentEmail;
        break;
      case 'send_to':
        this.errSendToMailMsg = '';
        break;
      }
    }
  }

  getListSearching() {
    this.userListSearching = [];

    if (this.userListBox) {
      Array.from(this.userListBox.entries(), ([key, value]) => {
        if (this.checkContain(value) || value === '') {
          this.userListSearching.push(key);
        }
      });
    }
  }

  handleChangeInput() {
    if (this.ccMailInput.trim()) {
      this.isShowCcList = true;

      this.focusIndex = 0;
      this.getListSearching();
      this.focusIndex = 0;
      this.isMouseOver = false;
    } else {
      this.isShowCcList = false;
    }
  }

  getUserNameByKey(key: string) {
    return this.userListBox && this.userListBox.get(key);
  }

  getProjectNameByKey(projectID: number) {
    if (this.takeProjectUserJoin) {
      for (const project of this.takeProjectUserJoin) {
        if (project.project_id === projectID) {
          return project.project_name;
        }
      }
    }
  }

  getKeyByValue(map: Map<string, string>, val: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const elm = [...map].find(([key, value]) => val === value);
    return elm ? elm[0] : '';
  }
}
</script>
<style scoped>
.widthTime {
  width: 50%
}

.required:after {
  content: " *";
  color:red;
}
.sent-to-email {
  outline: none;
  border: none;
  flex-grow: 1;
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

.tags-input-text {
  flex: 1;
  background: inherit;
  border: none;
  outline: 0;
  padding-top: .2rem;
  padding-bottom: .1rem;
  margin-left: .5rem;
}
#email_content {
  border: none;
  background-color: transparent;
  resize: none;
  outline: none;
}
</style>
