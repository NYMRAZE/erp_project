<template>
  <div @click="unfocusList($event)">
    <!-- Filter area-->
    <div class="filter-area mt-3">
      <ValidationObserver ref="observer" v-slot="{ invalid }">
        <div class="form-row">
          <div class="col-xl-10 col-lg-12">
            <div class="form-row">
              <div class="form-group col-xl-3 col-lg-6 col-md-12">
                <label class="text-dark font-weight-bold" for="branch-filter">
                  {{ $t("User") }}
                </label>
                <div ref="dropdown_list" class="dropdown">
                  <input
                    ref="nameInput"
                    v-model="memberNameInput"
                    class="form-control"
                    type="text"
                    :placeholder="`${$t('Search')}...`"
                    @click.prevent="showDropdown"
                    @input="handleChangeInput"
                    @keydown.enter.prevent="selectMemberPressKey($event)">
                  <div id="myDropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                    <ul
                      ref="userList"
                      class="list-user"
                      @mouseover="focusList">
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
              <div class="form-group col-xl-3 col-lg-6 col-md-12">
                <label class="text-dark font-weight-bold">
                  {{ $t("Type") }}
                </label>
                <select
                  v-model.number="searchParams.subtract_day_off_type_id"
                  class="form-control">
                  <option key="0" value="0">{{ $t('All') }}</option>
                  <option
                    v-for="[key, value] of takeSubtractDayOffTypes"
                    :key="key"
                    :value="key">
                    {{ $t(value) }}
                  </option>
                </select>
              </div>
              <div class="form-group col-xl-3 col-lg-6 col-md-12">
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="$t('From date')"
                  rules="dateBeforeOrEqual:dateto"
                  vid="datefrom">
                  <label class="text-dark font-weight-bold" for="date-from-filter">
                    {{ $t("From date") }}:
                  </label>
                  <datepicker
                    id="date-from-filter"
                    v-model="dateFrom"
                    :format="datePickerFormat"
                    :typeable="true"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :input-class="{ 'is-invalid': errors[0] }"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd"
                    name="date-from-filter">
                  </datepicker>
                  <p v-show="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <div class="form-group col-xl-3 col-lg-6 col-md-12">
                <ValidationProvider v-slot="{ errors }" vid="dateto">
                  <label class="text-dark font-weight-bold" for="date-to-filter">
                    {{ $t("To date") }}:
                  </label>
                  <datepicker
                    id="date-to-filter"
                    v-model="dateTo"
                    :format="datePickerFormat"
                    :typeable="true"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd"
                    name="date-to-filter">
                  </datepicker>
                  <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="col-xl-2 col-lg-12 col-md-12 form-group">
            <label class="label-hide-lg font-weight-bold">&#8205;</label>
            <div>
              <button
                :disabled="invalid"
                class="btn btn-primary2 w-100px"
                type="button"
                @click.prevent="handleFilterRequest">
                <i class="fa fa-search"></i>
                {{ $t("Search") }}
              </button>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="py-4 p-sm-x">
      <button
        type="button"
        class="btn btn-primary2"
        @click.prevent="gotoLeaveManage">
        {{ $t('Leave management detail') }}
      </button>
    </div>
    <div class="container-tbl-leave text-nowrap">
      <table class="tbl-leave">
        <thead>
          <tr>
            <th class="head-default font-weight-bold cell-sticky">
              {{ $t("User") }}
            </th>
            <th
              v-for="(date, index) in datesOfWeek"
              :key="index"
              :class="classHeadDay(date)">
              <div class="d-flex flex-column font-weight-bold text-center">
                <div>{{ $t(convertTimeToWeekDay(date)) }}</div>
                <div>{{ convertTimeToStr(date, dateFilterFormat) }}</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(itemUser, userIndex) in takeUserLeave" :key="userIndex">
            <td class="cell-sticky">
              <img :src="avatarSrc(itemUser.avatar)" class="tbl-info-avatar rounded-circle" />
              <span class="txt-with-img">{{ itemUser.first_name }} {{ itemUser.last_name }}</span>
            </td>
            <td v-for="(dateW, d) in datesOfWeek" :key="d">
              <!--<div v-html="showLeaveDate(itemUser.leave_request, dateW)"></div>-->
              <template v-for="(itemLeave, leaveIndex) in itemUser.leave_request">
                <div
                  v-if="dateCheck(itemLeave.date_time_leave_from, itemLeave.date_time_leave_to, dateW)"
                  :key="leaveIndex"
                  class="type-leave"
                  :class="classLeave(itemLeave.leave_request_type_id)">
                  {{ `${getLeaveRequestTypeName(itemLeave.leave_request_type_id)}
                  ${getSubtractDayOffTypesName(itemLeave.subtract_day_off_type_id)}
                  ${getContentLeaveTime(itemLeave)}` }}<br>
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="float-left d-flex align-items-center block-range-date">
      <div class="container-control-week d-flex align-items-center">
        <div class="h1 cursor-pointer mb-0" @click="handlePrevNext(false)">
          <i class="fas fa-caret-left"></i>
        </div>
        <div class="align-items-center mx-3">{{ rangeDate }}</div>
        <div class="h1 cursor-pointer mb-0" @click="handlePrevNext(true)">
          <i class="fas fa-caret-right"></i>
        </div>
      </div>
      <div class="parallelogram"></div>
    </div>
    <!-- Pagination container -->
    <div class="mt-4 overflow-auto float-right">
      <b-pagination
        v-model="searchParams.current_page"
        class="brown-pagination float-right"
        align="center"
        :total-rows="takePagination.total_row"
        :per-page="takePagination.row_per_page"
        @input="searchByPagination">
      </b-pagination>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <b-form-input
          v-model="inputPageNumber"
          class="form-control input-jump-page"
          :max="takePagination.total_row"
          pattern="[0-9]"
          type="number"
          min="1"
          @keyup.enter="searchByInputPage"></b-form-input>
      </div>
    </div>
    <!-- End Pagination container -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import moment from 'moment';
import { dayleaveStore, notificationStore } from '~/store/';
import { SearchParams, LeaveHistory, LeaveRequest } from '~/types/history-dayleave';
import slugify from '~/utils/unaccent';
import { FullDayOff, MorningOff, AfternoonOff, WorkAtHome, BusinessTrip,
  GoOutside, LateForWork, LeaveEarly, Subtract } from '~/utils/leaverequesttypes';

@Component({
  components: {
    Datepicker
  }
})

export default class HistoryUserLeave extends Vue {
  searchParams: SearchParams = {
    id: 0,
    user_id: 0,
    user_name: '',
    datetime_leave_from: '',
    datetime_leave_to: '',
    subtract_day_off_type_id: 0,
    date_of_week: [],
    current_page: 1
  }
  responseMessage    : string = ''
  countPrev          : number = 0;
  countNext          : number = 0;
  dateTo             : Date | null = null;
  dateFrom           : Date | null = null;
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFilterFormat   : string = 'YYYY/MM/DD';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  timeFormat         : string = 'HH:mm';
  datesOfWeek        : Date[] = []
  perPage            : number = 10;

  firstday: Date = new Date()
  listLeaveHistory: LeaveHistory[] = []
  histories: LeaveHistory[] = []
  msgError: string = ''
  typeLeaveListBox: Map<string, string> = new Map()
  subtractDayOffListBox : Map<string, string> = new Map();
  typeLeaveColor = new Map([
    [1, '#36722B'],
    [2, '#CCB400'],
    [3, '#BC6D00'],
    [4, '#922010'],
    [5, '#55196C'],
    [6, '#0079BF'],
    [7, '#c92c8a'],
    [8, '#ff7373'],
    [9, '#7b8b95']
  ]);
  langDatepicker    : any    = LangDatepicker;
  isShow            : boolean = false;
  memberNameInput   : string = '';
  focusIndex        : number = 0;
  isMouseOver       : boolean = false;
  userListSearching : string[] = [];
  inputPageNumber   : number | null = this.searchParams.current_page;
  defaultAvatar     : string = require('~/assets/images/default_avatar.jpg');
  subtractID        : number = Subtract;

  mounted() {
    const query = this.$route.query;
    this.searchParams.user_name = query.user_name ? query.user_name.toString() : '';
    this.searchParams.user_id = parseInt(query.user_id ? query.user_id.toString() : '0');
    this.dateFrom = query.date_from ? new Date(query.date_from && query.date_from.toString()) : null;
    this.dateTo = query.date_to ? new Date(query.date_to && query.date_to.toString()) : null;
    this.searchParams.current_page = parseInt(query.current_page ? query.current_page.toString() : '1');

    if (this.dateFrom) {
      this.setDateOfWeek(this.dateFrom);
    } else {
      const currentDay = new Date();
      this.setDateOfWeek(currentDay);
    }

    setTimeout(async () => {
      await this.searchHistory();
      this.getUserListSearching();

      const query = this.$route.query;
      if (query && query.user_id) {
        this.memberNameInput = this.getUserNameByKey(query.user_id.toString()) as string;
      } else if (query && query.user_name) {
        this.memberNameInput = query.user_name.toString();
      }
    }, 100);
  }

  @Watch('dateFrom', { immediate: true, deep: true })
  watchDateFrom() {
    this.searchParams.datetime_leave_from = this.$common.convertTimeToStr(this.dateFrom, this.dateFormatDatabase);
  }

  @Watch('dateTo', { immediate: true, deep: true })
  watchDateTo() {
    this.searchParams.datetime_leave_to = this.$common.convertTimeToStr(this.dateTo, this.dateFormatDatabase);
  }

  @Watch('datesOfWeek', { immediate: true, deep: true })
  watchDatesOfWeek(newVal: Date[]) {
    if (newVal) {
      this.searchParams.date_of_week = [];

      newVal.forEach((item) => {
        this.searchParams.date_of_week.push(this.$common.convertTimeToStr(item, this.dateFormatDatabase));
      });
    }
  }

  get userListBox() {
    return dayleaveStore.takeUserList;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get takeUserLeave() {
    return dayleaveStore.takeUserLeaveList;
  }

  async searchHistory() {
    this.$nuxt.$loading.start();
    try {
      this.searchParams.user_name = this.memberNameInput;
      await dayleaveStore.getLeaveHistory(this.searchParams);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }

    this.inputPageNumber = this.searchParams.current_page;
  }

  get takePagination() {
    return dayleaveStore.takePaginationHistoryLeave;
  }

  get listLeaveRequestType() {
    return dayleaveStore.listLeaveRequestType!;
  }

  get takeSubtractDayOffTypes() {
    return dayleaveStore.takeSubtractDayOffTypes;
  }

  get rangeDate() {
    const dateFrom = moment(this.datesOfWeek[0]).format(this.dateFilterFormat);
    const dateTo = moment(this.datesOfWeek[this.datesOfWeek.length - 1]).format(this.dateFilterFormat);

    return dateFrom + ' - ' + dateTo;
  }

  displayedHistories () {
    let fullPath;

    if (this.searchParams.current_page === 1 &&
          !this.searchParams.user_name &&
          !this.searchParams.datetime_leave_from &&
          !this.searchParams.datetime_leave_to) {
      fullPath = '/hrm/history-user-leave';
    } else {
      fullPath = `/hrm/history-user-leave?current_page=${this.searchParams.current_page}`;
      if (this.searchParams.user_name !== '') {
        fullPath += `&user_name=${this.searchParams.user_name}`;
      }
      if (this.searchParams.user_id) {
        fullPath += `&user_id=${this.searchParams.user_id}`;
      }
      if (this.searchParams.datetime_leave_from) {
        fullPath += `&date_from=${this.searchParams.datetime_leave_from}`;
      }
      if (this.searchParams.datetime_leave_to) {
        fullPath += `&date_to=${this.searchParams.datetime_leave_to}`;
      }
    }

    try {
      if (decodeURIComponent(this.$route.fullPath) !== fullPath) {
        this.$router.replace(fullPath);
      }
    } catch (e) {}
  }

  searchByPagination() {
    this.searchHistory();
  }

  searchByInputPage() {
    if (this.inputPageNumber) {
      this.searchParams.current_page = this.inputPageNumber;
      this.searchHistory();
    }
  }

  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      if (this.searchParams.datetime_leave_from) {
        this.countNext = 0;
        this.countPrev = 0;
        this.setDateOfWeek(this.dateFrom);
      } else {
        this.setDateOfWeek(new Date());
      }
      notificationStore.setIsNavigateNoti(false);
      this.searchHistory();
      this.displayedHistories();
    }
  }

  getUserName(userID: number) {
    return this.userListBox.get(userID.toString());
  }

  get takeTotalRow() {
    return this.listLeaveHistory && this.listLeaveHistory.length;
  }

  isWeekend(date: Date) {
    const day = moment(date).isoWeekday();

    // 6 = Saturday, 7 = Sunday
    return day === 6 || day === 7;
  }

  styleLeaveColor(history: LeaveRequest) {
    let color: string | undefined;
    if (
      (history.leave_request_type_id === LateForWork || history.leave_request_type_id === GoOutside) &&
        history.subtract_day_off_type_id > 0 && history.subtract_day_off_type_id !== Subtract) {
      color = '#1aa39c';
    } else {
      color = this.typeLeaveColor.get(history.leave_request_type_id);
    }

    return `background-color: ${color}`;
  }

  getDates(startDate: Date) {
    const arr: Date[] = [];
    let dt = startDate;
    let count = 1;

    while (count <= 7) {
      arr.push(dt);
      dt = moment(dt).add(1, 'days').toDate();
      count++;
    }

    return arr;
  }

  handlePrevNext(isNext: boolean) {
    const dateSelect = this.dateFrom ? this.dateFrom : new Date();
    const isoWeek = moment(dateSelect).startOf('isoWeek');
    if (isNext) {
      this.countNext += 1;
      this.countPrev -= 1;
      this.firstday = new Date(isoWeek.add(this.countNext, 'w').isoWeekday(1).format(this.dateFilterFormat));
    } else {
      this.countNext -= 1;
      this.countPrev += 1;
      this.firstday = new Date(isoWeek.subtract(this.countPrev, 'w').isoWeekday(1).format(this.dateFilterFormat));
    }
    this.setDateOfWeek(this.firstday);
    this.searchHistory();
  }

  setDateOfWeek(date: Date | null) {
    if (date) {
      const arrDate: Date[] = [];
      const objWeek = moment(date).startOf('isoWeek');

      for (let i = 0; i < 7; i++) {
        arrDate.push(objWeek.isoWeekday(i + 1).toDate());
      }
      this.datesOfWeek = arrDate;
    }
  }

  isCurrentDay(date: string) {
    const currentDay = new Date();
    return this.checkDateIsSame(date, this.convertTimeToStr(currentDay, this.dateFilterFormat));
  }

  checkDateIsSame(date1: string, date2: string) {
    const date = date2.split(' ');
    return moment(date1).isSame(date[0]);
  }

  dateCheck(date_from: string, date_to: string, date_check: Date) {
    const fromDate = moment(date_from.split(' ')[0], 'YYYY/MM/DD');
    const toDate = moment(date_to.split(' ')[0], 'YYYY/MM/DD');
    const dateCheck = moment(moment(date_check).format('YYYY/MM/DD'));

    return dateCheck.isBetween(fromDate, toDate, 'days', '[]');
  }

  convertTimeToStr(time: Date | null, dateFormat: string) : string {
    if (time) {
      return moment(time).format(dateFormat);
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
    this.searchParams.user_id = parseInt(key);
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
      this.searchParams.user_id = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.isShow = false;
      if (this.searchParams.user_id) {
        this.memberNameInput = this.userListBox.get(this.searchParams.user_id.toString()) || '';
        this.searchParams.user_name = '';
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
    this.searchParams.user_id = 0;
    this.getUserListSearching();
  }

  getUserNameByKey(key: string) {
    return this.userListBox.get(key);
  }

  convertTimeToWeekDay(date: Date) {
    return moment(date).format('dddd');
  }

  gotoLeaveManage() {
    this.$router.push('/hrm/manage-leave-request');
  }

  classHeadDay(date) {
    if (this.isWeekend(date)) {
      return 'head-weekend';
    }

    return 'head-default';
  }

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }

  showLeaveDate(leaveRequestList: LeaveRequest[], dateCompare: Date) : any {
    let htmlStr = '';

    leaveRequestList.forEach((item) => {
      const dateFrom = moment(item.date_time_leave_from, this.dateFormatDatabase);
      if (moment(dateFrom).isSame(dateCompare, 'day')) {
        const nameTypeLeave = this.listLeaveRequestType.get(item.leave_request_type_id.toString());
        let subtractDayOffContent = '';
        let contentLeave = '';
        const className = this.classLeave(item.leave_request_type_id);

        if (item.leave_request_type_id === LateForWork ||
          item.leave_request_type_id === LeaveEarly ||
          item.leave_request_type_id === GoOutside) {
          const timeFrom = moment(item.date_time_leave_from, this.dateFormatDatabase + this.timeFormat).format(this.timeFormat);
          const timeTo = moment(item.date_time_leave_to, this.dateFormatDatabase + this.timeFormat).format(this.timeFormat);

          contentLeave += '</br>' + timeFrom + ' - ' + timeTo;
        }

        if (item.subtract_day_off_type_id && item.subtract_day_off_type_id !== Subtract) {
          subtractDayOffContent += '</br>(' + this.takeSubtractDayOffTypes.get(item.subtract_day_off_type_id.toString()) + ')';
        }
        htmlStr += '<div class="type-leave ' + className + '">' + nameTypeLeave + subtractDayOffContent + contentLeave + '</div>';
      }
    });

    return htmlStr;
  }

  classLeave(typeLeave: number) {
    let className = '';

    switch (typeLeave) {
    case FullDayOff :
      className = 'full-day-off';
      break;
    case MorningOff :
    case AfternoonOff :
      className = 'half-day-off';
      break;
    case WorkAtHome :
      className = 'work-at-home';
      break;
    case BusinessTrip :
      className = 'business-trip';
      break;
    case GoOutside :
      className = 'go-out-side';
      break;
    case LateForWork :
      className = 'late-for-work';
      break;
    case LeaveEarly :
      className = 'leave-early';
      break;
    default :
      className = 'OtherLeave';
    }

    return className;
  }

  getLeaveRequestTypeName(leaveRequestTypeID: number) {
    return this.listLeaveRequestType.get(leaveRequestTypeID.toString());
  }

  getSubtractDayOffTypesName(subtractDayOffTypeID: number) {
    return subtractDayOffTypeID !== this.subtractID
      ? `(${this.takeSubtractDayOffTypes.get(subtractDayOffTypeID.toString())})`
      : '';
  }

  getContentLeaveTime(itemLeave: LeaveRequest) {
    let contentLeave = '';

    if (itemLeave.leave_request_type_id === LateForWork ||
      itemLeave.leave_request_type_id === LeaveEarly ||
      itemLeave.leave_request_type_id === GoOutside) {
      const timeFrom = moment(itemLeave.date_time_leave_from, this.dateFormatDatabase + this.timeFormat).format(this.timeFormat);
      const timeTo = moment(itemLeave.date_time_leave_to, this.dateFormatDatabase + this.timeFormat).format(this.timeFormat);

      contentLeave += timeFrom + '-' + timeTo;
    }

    return contentLeave;
  }
}
</script>
<style scoped>
.text-decoration {
  text-decoration: underline;
}
.cell-sticky {
  position: sticky;
  left: 0;
}
.tbl-container {
  width: 100%;
  overflow: auto;
  position: relative;
}
.tbl-leave {
  background: #fff;
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  border-style: hidden;
  box-shadow: 0 0 0 1px #EBEFF2;
  color: #707683;
  border-bottom: 1px solid #EBEFF2;
}
.tbl-leave > thead > tr > th, .tbl-leave > tbody > tr > td {
  border:1px solid #EBEFF2;
  padding: 15px 10px;
  background-color: #fff;
  min-width: 245px
}
.tbl-leave > tbody > tr > td {
  height: 115px;
}
.tbl-leave-avatar {
  width: 24px;
  height: 24px;
}
.tbl-leave > thead > tr:first-child > th:first-child {
  border-radius: 8px 0 0 0;
}
.tbl-leave > thead > tr:first-child > th:last-child {
  border-radius: 0 8px 0 0;
}
.container-tbl-leave{
  width: 100%;
  overflow: auto;
  position: relative;
}
.head-default {
  background-color: #EFEFEF !important;
  color: #919FB0 !important;
}
.head-weekend {
  background-color: #C4C4C4 !important;
  color: #ffffff !important;
}
.container-control-week {
  background-color: #fff;
  color: #C4C4C4;
  padding: 5px 10px;
  height: 60px;
  border-radius: 0 0 7px 5px;
}
.parallelogram {
  border-top: 60px solid #fff;
  border-right: 50px solid transparent;
  width: 50px;
  margin-left: -4px;
}
</style>
