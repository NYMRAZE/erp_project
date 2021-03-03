<template>
  <div>
    <div class="padding-sm-x" :class="!isUser && !isCreate ? '': 'd-none'">
      <nuxt-link to="/hrm/manage-day-leave" class="text-decoration-none d-inline-block">
        <h4 class="sub-page-title font-weight-bold">
          <div class="container-icon-circle">
            <span class="fas fa-play fa-rotate-180"></span>
          </div>
          {{ $t('Back to day off information') }}
        </h4>
      </nuxt-link>
    </div>
    <div class="filter-area mt-3 bg-white border rounded" :class="!isUser && !isCreate ? '': 'd-none'">
      <div class="form-row">
        <div class="col-xl-12 col-lg-12">
          <div class="form-row mb-n4">
            <div class="form-group col-xl-3 col-lg-6 col-md-12">
              <div>
                <label class="text-gray font-weight-bold">
                  {{ $t("Name") }}
                </label>
                <p>{{ fullUserName }}</p>
              </div>
            </div>
            <div class="form-group col-xl-3 col-lg-6 col-md-12">
              <div>
                <label class="text-gray font-weight-bold">
                  {{ $t("Email") }}
                </label>
                <p>{{ emailUser }}</p>
              </div>
            </div>
            <div class="form-group col-xl-3 col-lg-6 col-md-12">
              <div>
                <label class="text-gray font-weight-bold">
                  {{ $t("Day was used") }}
                </label>
                <p>{{ takeDayUsed.toFixed(2) }}</p>
              </div>
            </div>
            <div class="form-group col-xl-3 col-lg-6 col-md-12">
              <div>
                <label class="text-gray font-weight-bold">
                  {{ $t("Current day off") }}
                </label>
                <p>{{ takeDayRemaining.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="padding-sm-x" :class="!isUser && !isCreate ? 'mt-4': 'mt-5'">
      <ValidationObserver ref="observer" v-slot="{}" tag="form">
        <div class="row">
          <div class="col-sm ml-3 mr-sm-2 form_OT_mobile">
            <div class="mx-n3 mt-3" v-if="isUser || isCreate">
              <div class="filter-area bg-white border rounded">
                <div class="form-row mb-n4">
                  <div class="col-xl-12 col-lg-12">
                    <div class="form-row">
                      <div class="form-group col-xl-6 col-lg-6 col-md-12">
                        <div>
                          <label class="text-gray font-weight-bold">
                            {{ $t("Available day off") }}
                          </label>
                          <p>{{ takeDayRemaining.toFixed(2) + ' ' + $t("days") }}</p>
                        </div>
                      </div>
                      <div class="form-group col-xl-6 col-lg-6 col-md-12">
                        <div>
                          <label class="text-gray font-weight-bold">
                            {{ $t("New available day off") }}
                          </label>
                          <p>{{ takeNewDayOff + ' ' + $t("days") }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mx-n3 mt-3">
              <label class="text-dark font-weight-bold required" for="date-from-filter">
                {{ $t("Leave type") }}:
              </label>
              <select
                  v-model.number="type_leave"
                  class="form-control"
                  :class="{ 'is-invalid': errTypeLeaveRequire }"
                  @change="onchangeTypeLeave($event)">
                <option :value="null"></option>
                <option
                    v-for="[key, value] of listLeaveRequestType"
                    :key="key"
                    :value="key">
                  {{ $t(value) }}
                </option>
              </select>
              <p v-if="errTypeLeaveRequire" class="invalid-feedback d-block">
                {{ $t(errTypeLeaveRequire) }}
              </p>
            </div>
            <div class="mx-n3 d-flex mt-3">
              <div v-if="showDateFromArea" :class="showDateFromArea && showDateToArea ? 'w-50' : 'w-100'">
                <ValidationProvider
                    v-slot="{ errors }"
                    rules="dateBeforeOrEqual:dateTo|dateBeforeCurrentDate:dateTo|normalDay"
                    vid="dateFrom"
                    :name="$t('From date')">
                  <label class="text-dark font-weight-bold required" for="date-from-filter">
                    {{ $t("From date") }}:
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
                      :input-class="{ 'is-invalid': errors[0] || dateFromRequire }"
                      placeholder="YYYY/MM/dd"
                      :language="datePickerLang"
                      @selected="dateFromSelect()">
                  </datepicker>
                  <p v-if="dateFromRequire" class="invalid-feedback d-block">{{ $t(dateFromRequire) }}</p>
                  <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <div v-if="showDateToArea" class="ml-1" :class="showDateFromArea && showDateToArea ? 'w-50' : 'w-100'">
                <ValidationProvider v-slot="{ errors }" vid="dateTo">
                  <label class="text-dark font-weight-bold" for="date-to-filter|normalDay">
                    {{ $t("To date") }}:
                  </label>
                  <datepicker
                      id="date-to-filter"
                      v-model="dateTo"
                      name="date-to-filter"
                      :format="datePickerFormat"
                      :typeable="false"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fas fa-calendar datepicker_icon"
                      placeholder="YYYY/MM/dd"
                      :language="datePickerLang"
                      :disabled="disableTodate()"
                      @selected="dateToSelect()">
                    <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                  </datepicker>
                  <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
            </div>
            <div class="mx-n3 d-flex mt-3">
              <div v-if="showTimeFromArea" class="w-50">
                <div class="d-flex">
                  <div class="mr-2 widthTime">
                    <label class="text-dark font-weight-bold required" for="from_timeh_leave">
                      {{ $t("From") }}:
                    </label>
                    <select
                        id="from_timeh_leave"
                        v-model.number="from_timeh_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="disableTimeBox()"
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
                    <label class="text-dark font-weight-bold" for="from_timem_leave"></label>
                    <select
                        id="from_timem_leave"
                        v-model="from_timem_leave"
                        class="form-control mt-2"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="disableTimeBox()"
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
              <div v-if="showTimeToArea" class="w-50 ml-1">
                <div class="d-flex">
                  <div class="widthTime mr-2">
                    <label class="text-dark font-weight-bold required" for="to_timeh_leave">
                      {{ $t("To") }}:
                    </label>
                    <select
                        id="to_timeh_leave"
                        v-model.number="to_timeh_leave"
                        class="form-control"
                        :class="{ 'is-invalid': timeError || timeToError }"
                        :disabled="disableTimeBox()"
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
                    <label class="text-dark font-weight-bold" for="to_timem_leave"></label>
                    <select
                        id="to_timem_leave"
                        v-model="to_timem_leave"
                        class="form-control mt-2"
                        :class="{ 'is-invalid': timeError }"
                        :disabled="disableTimeBox()"
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
              <p v-if="timeError" class="invalid-feedback d-block mb-0">{{ $t(timeError) }}</p>
              <p v-if="timeToError" class="invalid-feedback d-block mb-0">{{ $t(timeToError) }}</p>
            </div>
            <div class="mx-n3" v-if="showInputText" :class="showTimeFromArea && showTimeToArea ? 'mt-3' : ''">
              <label class="text-dark font-weight-bold required" for="reason">
                {{ $t("Reason") }}:
              </label>
              <input
                  id="reason"
                  v-model="reason"
                  type="text"
                  :class="{ 'is-invalid': errorsReasonRequire }"
                  class="form-control"
                  @input="onChangeReason($event)">
              <p v-if="errorsReasonRequire" class="invalid-feedback d-block">
                {{ $t(errorsReasonRequire) }}
              </p>
            </div>
            <div class="mx-n3 mt-3" v-if="showInputText">
              <p class="text-dark font-weight-bold">{{ $t("Subject") }}:</p>
              <input
                  v-model="titleEmail"
                  type="text"
                  class="form-control" />
            </div>
            <div class="mx-n3 mt-3" v-if="showInputText">
              <p class="text-dark font-weight-bold">{{ $t("Content email") }}</p>
              <textarea v-model="contentEmail" class="form-control" rows="6" />
            </div>
            <div class="mx-n3" :class="!!type_leave ? 'mt-3' : 'mt-n4'">
              <p class="text-danger"> {{ $t(msgError) }} </p>
              <button type="button" class="button_sm_add search_button" @click="addLeaveDay()">
                {{ $t("Add") }} <i class="fa fa-plus"></i>
              </button>
              <b-button
                  type="button"
                  class="button_sm_enabled search_button align-self-end"
                  size="sm"
                  variant="primary"
                  @click.prevent="handleSubmitRequest">{{ $t("Save") }}
              </b-button>
            </div>
          </div>
          <div class="col-sm" :class="!isUser && !isCreate ? 'mt-5': 'mt-3'">
            <div v-for="(item, index) in listDayLeaveRequest" :key="index" class="card-header-profile card-header">
              <div class="mx-n1 mt-2">
                <h5 class="card-title-profile card-title text-dark title-request">
                  <i :class="iconLeaveRequest(item.leave_request_type_id)"></i>
                  <span>{{ titleLeaveRequest(item.leave_request_type_id, item.datetime_leave_from, item.datetime_leave_to) }}</span>
                  <div :class="item.isShow && 'd-none'" class="float-right" @click="showEmail(index)">
                        <span class="mr-1 font-weight-bold"></span>
                    <i class="fas fa-caret-down"></i>
                  </div>
                </h5>
              </div>
              <div :class="!item.isShow && 'd-none'">
                <div class="mx-n1 mt-3">
                  <p class="text-dark font-weight-bold">{{ $t("Reason") }}</p>
                  <input
                      :value="item.reason"
                      type="text"
                      class="form-control"
                      readonly>
                </div>
                <div class="mx-n1 mt-3">
                  <p class="text-dark font-weight-bold">{{ $t("Subject") }}</p>
                  <input
                      :value="item.email_title"
                      type="text"
                      class="form-control"
                      readonly>
                </div>
                <div class="mx-n1 mt-3">
                  <p class="text-dark font-weight-bold">{{ $t("Content email") }}</p>
                  <textarea v-model="item.email_content" class="form-control" rows="6" readonly></textarea>
                </div>
                <div class="mx-n1 mt-3 border-bottom">
                  <button type="button" class="btn btn-danger mb-3" @click="removeLeaveDay(index)">
                    <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                  </button>
                </div>
                <div class="mb-5">
                  <h5 class="text-dark">
                    <div :class="!item.isShow && 'd-none'" class="d-flex float-right" @click="showEmail(index)">
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
import { UserRoleID } from '~/utils/responsecode';
import { DayLeaveRequest, OtherType } from '~/types/dayleave';
import { dayleaveStore, userProfileStore, layoutAdminStore } from '~/store/';
import {
  AfternoonOff,
  BusinessTrip,
  FullDayOff,
  GoOutside,
  LateForWork,
  LeaveEarly,
  MorningOff,
  WorkAtHome,
  OtherLeave,
  Subtract,
  Event,
  ExtraWork
} from '~/utils/leaverequesttypes';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  title : string = '';
  isUser: boolean = this.$auth.user.role_id === UserRoleID;
  minutes_from: string[] = ['00', '15', '30', '45'];
  minutes_to: string[] = ['00', '15', '30', '45'];
  reason             : string | undefined = '';
  contentEmail       : string = ''
  type_leave         : number | null = null
  dateTo             : Date | null = null;
  dateFrom           : Date | null = null;
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  dateFormatSelect   : string = 'YYYY/MM/DD';
  msgError           : string = ''
  successMsg         : string = ''
  timeError          : string = ''
  timeToError        : string = ''
  from_timeh_leave   : number | null = null
  from_timem_leave   : string | null = null
  to_timeh_leave     : number | null = null
  to_timem_leave     : string | null = null
  timeFrom           : number | null = this.from_timeh_leave
  timeTo             : number | null = this.to_timeh_leave
  dayRemaining       : number = this.takeDayRemaining
  typeLeaveListBox = this.listLeaveRequestType
  titleEmail: string = ''
  // Date time hide show by type leave request
  showDateFromArea  : boolean = false;
  showDateToArea    : boolean = false;
  showTimeFromArea  : boolean = false;
  showTimeToArea    : boolean = false;
  showInputText     : boolean = false;
  showCheckInput    : boolean = false;
  langDatepicker    : any    = LangDatepicker
  extraTime     : number | null = null

  @Prop() isCreate!: boolean

  listDayLeaveRequest : DayLeaveRequest[] = []
  errorsReasonRequire: string | null = null
  errExtraTime: string | null = null
  errTypeLeaveRequire: string | null = null
  dateFromRequire: string | null = null
  paramID: number | null = null
  isJoinEvent: boolean = false

  subtractDayOff: OtherType = {
    type: '',
    value: Subtract
  }
  options: OtherType[] = [
    { type: '', value: Subtract },
    { type: 'Extra work', value: ExtraWork },
    { type: 'Event', value: Event }
  ]

  mounted() {
    this.title = this.$t('Create leave request') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.paramID = parseInt(this.$route.params.id);
    this.reason = '';
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get takeTitleEmail() {
    if (this.listLeaveRequestType && this.type_leave) {
      const nameTypeLeave = this.listLeaveRequestType.get(this.type_leave.toString()) as string;
      let titleMail = `【${this.$t('Important')}】【${this.$t(nameTypeLeave)}`;
      if (this.subtractDayOff.value !== Subtract) {
        titleMail += ` (${this.$t(this.subtractDayOff.type)})`;
      }
      titleMail += `】【${this.takeDurationLeave(this.type_leave)}】【${this.fullUserName}】`;
      return titleMail;
    }

    return '';
  }

  // get full name user
  get fullUserName() {
    if (userProfileStore.userProfileInfo &&  this.$route.params.id !== this.$auth.user.id) {
      const userProfile = userProfileStore.userProfileInfo;
      return userProfile.first_name + ' ' + userProfile.last_name;
    }
    return this.$auth.user.first_name + ' ' + this.$auth.user.last_name;
  }

  get emailUser() {
    if (userProfileStore.userProfileInfo &&  this.$route.params.id !== this.$auth.user.id) {
      const userProfile = userProfileStore.userProfileInfo;
      return userProfile.email;
    }
    return this.$auth.user.email;
  }

  get takeDayRemaining() {
    return dayleaveStore.takeDayRemaining;
  }

  get takeContentEmail() {
    let content = '';
    if (this.type_leave && this.listLeaveRequestType) {
      const durationLeave = this.takeDurationLeave(this.type_leave);
      const nameTypeLeave = this.$t(this.listLeaveRequestType.get(this.type_leave.toString()) as string);
      content = this.$t('Dear all,') + '\n';
      content += this.$t(`I'm {0}`).toString().replace('{0}', this.fullUserName) + '\n';
      content += this.$t('I have {0} so  I take a {1}.', {
        0: this.reason,
        1: '【' + nameTypeLeave + '】' + '【' + durationLeave + '】'
      }) + '\n';
      if (this.extraTime) {
        content += this.$t('I will extra work {0} hours.', {
          0: this.extraTime
        }) + '\n';
      }
      content += this.$t('Best regard.');

      return content;
    }
  }

  get takeDayUsed() {
    return dayleaveStore.takeDayUsed;
  }

  get takeNewDayOff() {
    return parseFloat((this.takeDayRemaining - this.calculateTimeUsed).toFixed(2));
  }

  handleValidateForm() {
    this.errTypeLeaveRequire = this.handleValidateRequire(this.type_leave);
    this.dateFromRequire = this.handleValidateRequire(this.dateFrom);
    this.errorsReasonRequire = this.handleValidateRequire(this.reason);

    if (this.type_leave && this.type_leave >= LateForWork && this.type_leave <= GoOutside) {
      this.timeError = this.from_timeh_leave === null || this.to_timeh_leave === null ||
      !this.from_timem_leave || !this.to_timem_leave ? 'This field is required' : '';
    }

    if (this.type_leave && this.type_leave === LateForWork && ((this.timeFrom && this.timeFrom > 720) ||
    (this.timeTo && this.timeTo > 720))) {
      this.timeError = 'This field must be less than 12:00';
    }

    if (this.type_leave && this.type_leave === LeaveEarly && this.timeTo && this.timeTo < 810) {
      this.timeToError = 'This field must be over than 13:30';
    }
  }

  async addLeaveDay() {
    this.handleValidateForm();
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid && !this.timeError && !this.timeToError && !this.dateFromRequire &&
    !this.errTypeLeaveRequire && !this.errorsReasonRequire) {
      this.dayRemaining = this.takeDayRemaining;
      this.listDayLeaveRequest.push(
        {
          user_id: this.paramID ? this.paramID : this.$auth.user.id,
          leave_request_type_id: this.type_leave,
          date_from: this.dateFrom,
          date_to: this.dateTo,
          from_timeh_leave: this.from_timeh_leave,
          from_timem_leave: this.from_timem_leave,
          to_timem_leave: this.to_timem_leave,
          to_timeh_leave: this.to_timeh_leave,
          datetime_leave_from: this.handleDateTime(
            this.type_leave,
            this.dateFrom,
            this.from_timeh_leave,
            this.from_timem_leave,
            false
          ),
          datetime_leave_to: this.handleDateTime(
            this.type_leave,
            this.dateTo ? this.dateTo : this.dateFrom,
            this.to_timeh_leave,
            this.to_timem_leave,
            false
          ),
          email_title: this.titleEmail,
          email_content: this.contentEmail,
          reason: this.reason,
          isShow: false,
          subtract_day_off_type_id: this.subtractDayOff.value,
          extra_time: this.extraTime
        });
      this.type_leave = null;
      this.resetLeaveRequest();
    }
  }

  get calculateTimeUsed() {
    let timeUsed = 0;
    if (this.listDayLeaveRequest) {
      this.listDayLeaveRequest.forEach((dayLeave) => {
        const t1 = moment(dayLeave.datetime_leave_from, 'YYYY-MM-DD hh:mm');
        const t2 = moment(dayLeave.datetime_leave_to, 'YYYY-MM-DD hh:mm');
        const lunchBreakStart = moment(
          `${dayLeave.datetime_leave_from.split(' ')[0]} 12:00`,
          'YYYY-MM-DD hh:mm'
        );
        const lunchBreakEnd = moment(
          `${dayLeave.datetime_leave_from.split(' ')[0]} 13:30`,
          'YYYY-MM-DD hh:mm'
        );
        let timeDiff;
        switch (dayLeave.leave_request_type_id) {
        case FullDayOff:
        case MorningOff:
        case AfternoonOff:
          timeUsed += this.calcAmountBusinessDays(dayLeave.leave_request_type_id, dayLeave.date_from, dayLeave.date_to);
          break;
        case LateForWork:
          if (dayLeave.subtract_day_off_type_id !== Subtract && !dayLeave.extra_time) {
            timeUsed += 0;
            break;
          } else if (t2.isSameOrBefore(lunchBreakStart)) {
            timeDiff = t2.diff(t1, 'minutes') / 480;
          } else if (t2.isBetween(lunchBreakStart, lunchBreakEnd)) {
            timeDiff = lunchBreakStart.diff(t1, 'minutes') / 480;
          } else {
            timeDiff = (lunchBreakStart.diff(t1, 'minutes') + t2.diff(lunchBreakEnd, 'minutes')) / 480;
          }
          timeUsed += dayLeave.extra_time ? timeDiff - dayLeave.extra_time / 8 : timeDiff;
          break;
        case LeaveEarly:
          if (lunchBreakEnd.isSameOrBefore(t1)) {
            timeUsed += t2.diff(t1, 'minutes') / 480;
            break;
          } else if (t1.isBetween(lunchBreakStart, lunchBreakEnd)) {
            timeUsed += t2.diff(lunchBreakEnd, 'minutes') / 480;
            break;
          } else {
            timeUsed += (lunchBreakStart.diff(t1, 'minutes') + t2.diff(lunchBreakEnd, 'minutes')) / 480;
            break;
          }
        case GoOutside:
          const diffFromHour = lunchBreakStart.diff(t1, 'minutes');
          const diffToHour = t2.diff(lunchBreakEnd, 'minutes');

          if (dayLeave.subtract_day_off_type_id !== Subtract && !dayLeave.extra_time) {
            timeUsed += 0;
            break;
          } else if (t2.isSameOrBefore(lunchBreakStart) || lunchBreakEnd.isSameOrBefore(t1)) {
            timeDiff = t2.diff(t1, 'minutes') / 480;
          } else if (diffFromHour >= 0 && t2.isBetween(lunchBreakStart, lunchBreakEnd)) {
            timeDiff = diffFromHour / 480;
          } else if (diffToHour >= 0 && t1.isBetween(lunchBreakStart, lunchBreakEnd)) {
            timeDiff = diffToHour / 480;
          } else if (diffFromHour >= 0 && diffToHour >= 0)  {
            timeDiff = (diffToHour + diffFromHour) / 480;
          } else {
            timeUsed += 0;
            break;
          }
          timeUsed += dayLeave.extra_time ? timeDiff - dayLeave.extra_time / 8 : timeDiff;
          break;
        default:
          timeUsed += 0;
        }
      });
    }
    return timeUsed;
  }

  get listLeaveRequestType() {
    return dayleaveStore.listLeaveRequestType;
  }

  titleLeaveRequest(leaveTypeID: number, dateTimeFrom: string, dateTimeTo: string) {
    const leaveType = this.typeLeaveListBox && this.typeLeaveListBox.get(leaveTypeID.toString());
    if (dateTimeTo === '') {
      return leaveType && this.$t(leaveType) + ' (' + dateTimeFrom + ')';
    } else {
      return leaveType && this.$t(leaveType) + ' (' + dateTimeFrom + ' - ' + dateTimeTo + ')';
    }
  }

  removeLeaveDay(id: number) {
    this.listDayLeaveRequest.splice(id, 1);
  }

  disableTimeBox() {
    return this.type_leave && (this.type_leave <= AfternoonOff);
  }

  showEmail(id: number) {
    this.listDayLeaveRequest[id].isShow = !this.listDayLeaveRequest[id].isShow;
  }

  handleSubmitRequest() {
    const $this = this;

    if (this.listDayLeaveRequest.length) {
      const msg = this.$t('Do you want to send email?') as string;
      this.showModalConfirm(msg, function() {
        $this.createLeaveReq();
        $this.type_leave = null;
        $this.resetLeaveRequest();
        dayleaveStore.setDayRemaining($this.takeNewDayOff);
        $this.listDayLeaveRequest = [];
      });
    } else {
      const msgError = this.$t('Please enter the information requested.') as string;
      const $context = this;
      this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', msgError);
    }
  }

  backBtn() {
    this.$router.push('/hrm/history-user-leave');
  }

  async createLeaveReq() {
    this.$nuxt.$loading.start();

    try {
      this.listDayLeaveRequest.forEach((leaveReq) => {
        leaveReq.datetime_leave_from = this.handleDateTime(
          leaveReq.leave_request_type_id,
          leaveReq.date_from,
          leaveReq.from_timeh_leave,
          leaveReq.from_timem_leave, true);

        leaveReq.datetime_leave_to = this.handleDateTime(
          leaveReq.leave_request_type_id,
          leaveReq.date_to ? leaveReq.date_to : leaveReq.date_from,
          leaveReq.to_timeh_leave, leaveReq.to_timem_leave,
          true);
      });

      const res = await dayleaveStore.createLeaveRequest({ leave_request: this.listDayLeaveRequest });
      const successMsg = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
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

    this.extraTime = this.calculateExtraTime();

    this.titleEmail = this.takeTitleEmail;
    this.contentEmail = this.takeContentEmail || '';
  }

  onChangeTimeh(event, isFrom: boolean) {
    const value = event.target.value;
    this.timeToError = '';
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

    if (this.type_leave && this.type_leave >= LateForWork && value) {
      if (isFrom) {
        if (value === '12') {
          this.minutes_from = ['00'];
          this.from_timem_leave = null;
        } else if (value === '13') {
          this.from_timem_leave = null;
          this.minutes_from = ['30', '45'];
        } else {
          this.minutes_from = ['00', '15', '30', '45'];
        }
      } else if (value === '12') {
        this.minutes_to = ['00'];
        this.to_timem_leave = null;
      } else if (value === '13') {
        this.minutes_to = ['30', '45'];
        this.to_timem_leave = null;
      } else {
        this.minutes_to = ['00', '15', '30', '45'];
      }
    }

    this.extraTime = this.calculateExtraTime();

    this.titleEmail = this.takeTitleEmail;
    this.contentEmail = this.takeContentEmail || '';
  }

  onchangeTypeLeave(event) {
    const value = event.target.value;
    if (value) {
      this.resetLeaveRequest();
      this.errTypeLeaveRequire = '';
      this.timeError = '';
      this.errorsReasonRequire = '';
      this.dateFromRequire = '';
      this.titleEmail = this.takeTitleEmail;
      this.contentEmail = this.takeContentEmail || '';
    }

    switch (this.type_leave) {
    case FullDayOff:
    case WorkAtHome:
    case BusinessTrip:
    case OtherLeave:
      this.showDateFromArea = true;
      this.showDateToArea   = true;
      this.showTimeFromArea = false;
      this.showTimeToArea   = false;
      this.showInputText    = true;
      this.showCheckInput   = false;
      break;
    case MorningOff:
    case AfternoonOff:
      this.showDateFromArea = true;
      this.showDateToArea   = false;
      this.showTimeFromArea = false;
      this.showTimeToArea   = false;
      this.showInputText    = true;
      this.showCheckInput   = false;
      break;
    case LateForWork:
      this.showDateFromArea = true;
      this.showDateToArea   = false;
      this.showTimeFromArea = true;
      this.showTimeToArea   = true;
      this.showInputText    = true;
      this.showCheckInput   = true;
      this.isJoinEvent      = false;
      break;
    case LeaveEarly:
      this.showDateFromArea = true;
      this.showDateToArea   = false;
      this.showTimeFromArea = true;
      this.showTimeToArea   = true;
      this.showInputText    = true;
      this.showCheckInput   = false;
      break;
    case GoOutside:
      this.showDateFromArea = true;
      this.showDateToArea   = false;
      this.showTimeFromArea = true;
      this.showTimeToArea   = true;
      this.showInputText    = true;
      this.showCheckInput   = true;
      this.isJoinEvent      = true;
      break;
    }
  }

  onChangeSubtractType() {
    this.$nextTick(() => {
      this.titleEmail = this.takeTitleEmail;
      this.contentEmail = this.takeContentEmail || '';

      this.extraTime = this.calculateExtraTime();
      this.contentEmail = this.takeContentEmail || '';
    });
  }

  dateFromSelect() {
    if (this.$refs.datepicker) {
      this.dateFromRequire = '';
      this.$nextTick(() => {
        this.titleEmail = this.takeTitleEmail;
        this.contentEmail = this.takeContentEmail || '';
      });
    }
  }

  dateToSelect() {
    this.$nextTick(() => {
      this.titleEmail = this.takeTitleEmail;
      this.contentEmail = this.takeContentEmail || '';
    });
  }

  onChangeReason(event) {
    if (event.target.value) {
      this.errorsReasonRequire = '';
    }
    this.contentEmail = this.takeContentEmail || '';
  }

  onChangeExtraTime(event) {
    const input = event.target.value;
    if (event.target.value) {
      const extraTime = this.calculateExtraTime();
      if ((this.timeTo && this.timeFrom && this.extraTime &&
      extraTime < input) || typeof this.extraTime !== 'number' || input < 0) {
        this.errExtraTime = this.$t('Invalid working hours') as string;
      } else {
        this.errExtraTime = '';
      }
      this.contentEmail = this.takeContentEmail || '';
    }
  }

  calculateExtraTime() {
    let extraTime;
    if (this.subtractDayOff === this.options[1] && this.timeTo && this.timeFrom && this.timeTo > this.timeFrom) {
      if ((this.timeTo <= 720 && this.timeFrom < 720) || (this.timeFrom >= 810 && this.timeTo > 810)) {
        extraTime = parseFloat(((this.timeTo - this.timeFrom) / 60).toFixed(2));
      } else if (this.timeFrom <= 720 && this.timeTo >= 810) {
        extraTime = parseFloat(((720 - this.timeFrom + this.timeTo - 810) / 60).toFixed(2));
      }
    } else {
      extraTime = null;
    }

    return extraTime;
  }

  get showActualWorkingInput() {
    return JSON.stringify(this.subtractDayOff) === JSON.stringify(this.options[1]);
  }

  resetLeaveRequest() {
    this.showDateFromArea  = false;
    this.showTimeFromArea  = false;
    this.showDateToArea    = false;
    this.showTimeToArea    = false;
    this.showInputText     = false;
    this.showCheckInput    = false;
    this.isJoinEvent       = false;
    this.dateFrom = null;
    this.dateTo = null;
    this.from_timeh_leave = null;
    this.from_timem_leave = null;
    this.to_timeh_leave = null;
    this.to_timem_leave = null;
    this.reason = '';
    this.contentEmail = '';
    this.titleEmail = '';
    this.subtractDayOff = {
      type: '',
      value: Subtract
    };
  }

  calcAmountBusinessDays(leaveType: number | null, dDate1: Date | null, dDate2: Date | null) {
    const dates: Date[] = [];
    if (!dDate2 && leaveType === FullDayOff) { return 1; }
    if (!dDate2 && leaveType && leaveType <= AfternoonOff) { return 0.5; }
    if (dDate2 && dDate1) {
      const date: Date  = new Date(dDate1.getTime());
      if (moment(dDate1).isSame(dDate2) && date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(dDate1);
      } else {
        const holidays = dayleaveStore.takeHolidays;
        while (new Date(date) <= dDate2) {
          const dateFm = moment(date).format('YYYY-MM-DD');
          let count = 0;
          holidays.forEach((holiday) => {
            if (!moment(dateFm).isSame(new Date(holiday))) {
              count++;
            }
          });
          if (date.getDay() !== 0 && date.getDay() !== 6 && count === holidays.length) {
            dates.push(date);
          }
          date.setDate(date.getDate() + 1);
        }
      }
    }

    return dates.length;
  }

  handleDateTime(typeLeave: number | null, date: Date | null, hour: number | null, minute: string | null, isSubmit: boolean) {
    if (typeLeave && date && !hour && (
      typeLeave <= AfternoonOff || typeLeave === WorkAtHome ||
      typeLeave === BusinessTrip || typeLeave === OtherLeave
    )) {
      return isSubmit ? this.convertTimeToStr(date, this.dateFormatDatabase) +
      ' 08:00' : this.convertTimeToStr(date, this.dateFormatSelect);
    }

    minute = this.changeValueMinute(minute);
    return this.convertTimeToStr(date, isSubmit ? this.dateFormatDatabase : this.dateFormatSelect) +
    ' ' + hour + ':' + minute;
  }

  disableTodate() {
    return this.type_leave && this.type_leave >= MorningOff && this.type_leave <= GoOutside;
  }

  handleValidateRequire(field: any) {
    return !field ? 'This field is required' : '';
  }

  changeValueMinute(minute: any) {
    return minute !== null && minute !== '0' ? minute : '00';
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }
    return '';
  }

  iconLeaveRequest(idLeaveRequest: number) {
    let iconLeaveRequest = '';

    switch (idLeaveRequest) {
    case FullDayOff:
      iconLeaveRequest = 'fas fa-universal-access';
      break;
    case MorningOff:
      iconLeaveRequest = 'fas fa-sun';
      break;
    case AfternoonOff:
      iconLeaveRequest = 'fas fa-moon';
      break;
    case LateForWork:
      iconLeaveRequest = 'fas fa-user-clock';
      break;
    case LeaveEarly:
      iconLeaveRequest = 'fas fa-car';
      break;
    case GoOutside:
      iconLeaveRequest = 'fas fa-walking';
      break;
    case WorkAtHome:
      iconLeaveRequest = 'fas fa-home';
      break;
    }

    return iconLeaveRequest;
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

  showMsgBoxOk(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: this.$t(message) }
      }
    );

    this.$bvModal.msgBoxOk([messageNodes], {
      title           : this.$t(title) as string,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }

  takeDurationLeave(idTypeLeave: number) {
    let strDurationLeave = '';

    switch (idTypeLeave) {
    case FullDayOff:
    case BusinessTrip:
    case MorningOff:
    case AfternoonOff:
    case WorkAtHome:
    case OtherLeave:
      strDurationLeave += this.convertTimeToStr(this.dateFrom, this.dateFormatSelect);
      if (this.dateTo) {
        strDurationLeave += ' - ' + this.convertTimeToStr(this.dateTo, this.dateFormatSelect);
      }
      break;
    case LateForWork:
    case LeaveEarly:
    case GoOutside:
      strDurationLeave += this.convertTimeToStr(this.dateFrom, this.dateFormatSelect);
      if (this.from_timeh_leave != null) {
        strDurationLeave += ' ' + this.from_timeh_leave;
        if (this.from_timem_leave != null) {
          strDurationLeave += ':' + this.from_timem_leave;
        }
      }

      if (this.to_timeh_leave != null) {
        strDurationLeave += ' - ' + this.to_timeh_leave;
        if (this.to_timem_leave != null) {
          strDurationLeave += ':' + this.to_timem_leave;
        }
      }
      break;
    }

    return strDurationLeave;
  }
}
</script>
<style scoped>
table tr td {
  border: none;
}
.widthTime {
  width: 50%
}

.required:after {
  content: " *";
  color:red;
}
#extraTime {
  border: 0;
  padding: 0;
  outline: 0;
  border-bottom: 2px solid #03a8f45e;
  border-radius: 0;
}
#extraTime:focus {
  box-shadow: none;
}
.other-options {
  display: flex;
}
@media (max-width: 767px) {
  .other-options {
    display: inline;
  }
}
</style>
