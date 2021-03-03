<template>
  <div @click="unfocusList($event)">
    <h3
      id="page-title"
      class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Leave management detail") }}
    </h3>
    <div class="padding-sm-x">
      <nuxt-link to="/hrm/history-user-leave" class="text-decoration-none d-inline-block">
        <h4 class="sub-page-title font-weight-bold">
          <div class="container-icon-circle">
            <span class="fas fa-play fa-rotate-180"></span>
          </div>
          {{ $t('Back to history leave') }}
        </h4>
      </nuxt-link>
    </div>
    <!-- filter container -->
    <div class="padding-sm-x filter-area mt-3">
      <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form">
        <div class="form-row">
          <div class="col-xl-5 col-md-12 col-sm-12" :class="isUser && 'd-none'">
            <div class="form-row">
              <div class="col-xl-6 col-md-6 col-sm-12 form-group">
                <label class="text-dark font-weight-bold" for="branch-filter">{{ $t("User") }}</label>
                <div ref="dropdown_list" class="dropdown">
                  <input
                    ref="nameInput"
                    v-model="memberNameInput"
                    type="text"
                    class="form-control"
                    :placeholder="`${$t('Search')}...`"
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
              <div class="col-xl-6 col-md-6 col-sm-12 form-group">
                <label class="text-dark font-weight-bold" for="branch-filter">
                  {{ $t("Branch") }}
                </label>
                <select
                  id="branch-filter"
                  v-model.number="submitForm.branch"
                  class="form-control">
                  <option :key="0" :value="0">
                    {{ $t("All") }}
                  </option>
                  <option v-for="[key, value] in branchListBox" :key="key" :value="key">
                    {{ $t(value) }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div :class="!isUser ? 'col-xl-5 col-md-12 col-sm-12' : 'col-xl-5 col-md-9 col-sm-12'">
            <div class="form-row">
              <div class="form-group col-xl-6 col-md-6 col-sm-12">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="dateBeforeOrEqual:dateto"
                  vid="datefrom"
                  :language="$t('From date')">
                  <label class="text-dark font-weight-bold" for="date-from-filter">
                    {{ $t("From date") }}
                  </label>
                  <datepicker
                    id="date-from-filter"
                    v-model="dateFrom"
                    name="date-from-filter"
                    :format="datePickerFormat"
                    :typeable="true"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :input-class="{ 'is-invalid': errors[0] }"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd">
                  </datepicker>
                  <p v-show="errors[0]" class="text-danger">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <div class="form-group col-xl-6 col-md-6 col-sm-12">
                <ValidationProvider v-slot="{ errors }" vid="dateto">
                  <label class="text-dark font-weight-bold" for="date-to-filter">
                    {{ $t("To date") }}
                  </label>
                  <datepicker
                    id="date-to-filter"
                    v-model="dateTo"
                    name="date-to-filter"
                    :format="datePickerFormat"
                    :typeable="true"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd">
                  </datepicker>
                  <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div :class="!isUser ? 'col-xl-2 col-md-12 col-sm-12' : 'col-xl-2 col-md-2 col-sm-12'">
            <label class="font-weight-bold" :class="isUser ? 'label-hide-sm' : 'label-hide-md'">&#8205;</label>
            <div>
              <button
                type="button"
                class="btn btn-primary2 w-100px "
                :disabled="invalid"
                @click.prevent="handleFilterRequest">
                <i class="fa fa-search"></i> {{ $t("Search") }}
              </button>
            </div>
          </div>
        </div>
        <div class="form-group text-center">
          <p class="text-danger">{{ $t(responseMessage) }}</p>
        </div>
      </ValidationObserver>
    </div>
    <!-- End filter container-->
    <div class="padding-sm-x py-4">
      <button
        type="button"
        class="btn btn-success2"
        @click.prevent="exportExcel">
        {{ $t('Export Excel') }}
      </button>
    </div>
    <!-- list leave container -->
    <div class="tbl-container text-nowrap">
      <table class="tbl-info">
        <thead>
          <tr>
            <th
              class="cell-email text-left">
              {{ $t("Name") }}
            </th>
            <th
              class="cell-email text-left">
              {{ $t("Email") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Leave type") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Date") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Reason") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Detail") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in listLeaveRequest" :key="item.id">
            <td>
              <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
              {{ item.full_name }}
            </td>
            <td>
              {{ item.email }}
            </td>
            <td>
              <div class="text-left text-message-cell">
                {{ getLeaveType(item.leave_request_type_id) }}
              </div>
            </td>
            <td>
              {{ item.datetime_leave_from }}
            </td>
            <td>
              {{ item.reason }}
            </td>
            <td>
              <span
                class="d-flex align-items-center icon_manager"
                @click="viewDetailReq(item)">
                <i class="fas fa-info-circle icon_detail"></i>
              </span>
            </td>
            <td>
              <span
                class="d-flex align-items-center icon_manager"
                @click="deleteButton(item.id)">
                <i class="fas fa-trash-alt icon_action"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End list leave container -->
    <b-modal
      v-model="isShowModal"
      size="lg"
      :hide-header="true"
      :hide-footer="true"
      centered>
      <div class="card border-0 py-4">
        <div class="card-body">
          <div>
            <div class="d-flex">
              <div class="avatar-user">
                <img width="30" :src="avatarSrc(avatarUser)" class="rounded-circle" />
              </div>
              <div class="content-right">
                <div class="wrap-request-content d-flex flex-column">
                  <h4 style="word-break: break-all;">{{ emailUser }}</h4>
                  <span class="text-gray">{{ dateLeave }}</span>
                  <span class="text-gray mt-3" style="white-space: pre-line;">{{ contentEmail }}</span>
                  <div class="my-4">
                    <button type="button" class="btn btn-danger2 w-100px" @click="deleteButton()">
                      <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                    </button>
                  </div>
                </div>
                <div class="leave-type">
                  <div class="d-flex justify-content-center align-items-center text-gray" style="line-height: 30px">
                    <i class="fas fa-calendar mr-2"></i>
                    <span class="font-weight-bold">{{ getLeaveType(leaveReqType) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <!-- Pagination container -->
    <div class="mt-4 wrap-pagination">
      <b-pagination
        v-model="submitForm.current_page"
        class="brown-pagination float-right"
        :total-rows="pagination.total_row"
        :per-page="pagination.row_per_page"
        align="center"
        limit="7"
        @input="searchRequest">
      </b-pagination>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <b-form-input
          v-model="inputPageNumber"
          type="number"
          class="form-control input-jump-page"
          min="1"
          :max="pagination.total_row"
          @keyup.enter="searchByInputPage">
        </b-form-input>
      </div>
    </div>
    <!-- End Pagination container -->
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { ManagerRoleID, GeneralManagerRoleID, UserRoleID } from '~/utils/responsecode';
import { LeaveRequestItem, Pagination } from '~/types/leave-request';
import { dayleaveStore, layoutAdminStore } from '~/store/';
import slugify from '~/utils/unaccent';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  isManageUserRole   : boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
  isUser             : boolean = this.$auth.user.role_id === UserRoleID
  fullName: string = this.$auth.user.first_name + ' ' + this.$auth.user.last_name
  submitForm = {
    user_name              : this.isUser ? this.fullName : '',
    leave_request_type_id  : 0,
    datetime_leave_from    : '',
    datetime_leave_to      : '',
    branch                 : 0,
    current_page           : 1
  }
  responseMessage  : string = ''
  dateTo           : Date | null = null;
  dateFrom         : Date | null = null;
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFilterFormat : string = 'YYYY/MM/DD';
  branchListBox    : Map<string, string> = new Map()
  typeLeaveListBox : Map<string, string> = new Map()
  userListBox      : Map<string, string> = new Map()
  listLeaveRequest : LeaveRequestItem[] = []
  pagination: Pagination = {
    current_page: 1,
    total_row: 0,
    row_per_page: 0
  };
  inputPageNumber         : number | null = this.submitForm.current_page;
  langDatepicker    : any = LangDatepicker;
  isShow: boolean = false
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  isShowModal: boolean = false
  avatarUser: string = ''
  emailUser: string = ''
  dateLeave: string = ''
  contentEmail: string = ''
  leaveReqType: number = 0
  leaveID: number = 0

  mounted() {
    const $this = this;
    // when page loading finish, call search request for first time
    const title = 'Leave management detail';
    layoutAdminStore.setTitlePage(title);
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

  async searchRequest() {
    this.$nuxt.$loading.start();
    try {
      const res = await dayleaveStore.getLeaveRequests(this.submitForm);
      this.branchListBox = new Map(Object.entries(res.branch_select_box));
      this.typeLeaveListBox = new Map(Object.entries(res.leave_request_types));
      this.userListBox = new Map(Object.entries(res.user_list));
      this.listLeaveRequest = res.leave_requests;
      this.pagination = res.pagination;
      this.getUserListSearching();
      this.responseMessage = '';
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

  searchByInputPage() {
    if (this.inputPageNumber != null) {
      this.submitForm.current_page = this.inputPageNumber;
      this.searchRequest();
    }
  }

  // search by filter
  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.datetime_leave_from = this.convertTimeToStr(this.dateFrom, this.dateFilterFormat);
      this.submitForm.datetime_leave_to = this.convertTimeToStr(this.dateTo, this.dateFilterFormat);
      this.submitForm.user_name = this.isUser ? this.fullName : this.memberNameInput;
      this.searchRequest();
    }
  }

  viewDetailReq(item: LeaveRequestItem) {
    this.isShowModal = true;
    this.avatarUser = item.avatar;
    this.emailUser = item.email;
    this.dateLeave = item.datetime_leave_from;
    this.contentEmail = item.email_content;
    this.leaveReqType = item.leave_request_type_id;
    this.leaveID = item.id;
  }

  getLeaveType(leaveID: number) {
    return this.typeLeaveListBox.get(leaveID.toString());
  }

  deleteButton(leaveID?: number) {
    const msgModalConfirm = this.$t('Do you want to <b>remove</b> this leave request?') as string;
    const $this = this;
    const leaveId = leaveID || this.leaveID;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.removeLeaveRequest(leaveId);
      $this.isShowModal = false;
    });
  }

  async exportExcel() {
    try {
      const response = await dayleaveStore.exportToExcel({
        leave_request_type_id: this.submitForm.leave_request_type_id,
        branch: this.submitForm.branch,
        datetime_leave_from: this.convertTimeToStr(this.dateFrom, this.dateFilterFormat),
        datetime_leave_to: this.convertTimeToStr(this.dateTo, this.dateFilterFormat)
      });
      const link = document.createElement('a');
      const filename = `leave.xlsx`;
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

  async removeLeaveRequest(leaveID: number) {
    this.$nuxt.$loading.start();
    try {
      await dayleaveStore.removeLeaveRequests(leaveID);
      this.searchRequest();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
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

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }

  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Remove') as string,
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
};
</script>

<style>
.content-right {
  display: flex;
  flex-direction: row;
}
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
.wrap-request-content {
  width: 75%;
}
.wrap-pagination {
  position: relative;
}
.wrap-pagination button.btn-success {
  position: absolute;
  top: 0;
  left: 0;
}
.text-decoration {
  text-decoration: underline;
}
.avatar-user {
  padding: 0 16px
}
@media (min-width: 320px) and (max-width: 1024px) {
  .card-body {
    padding: 5px;
  }
  .content-right {
    display: flex;
    flex-direction: column-reverse;
  }
  .wrap-request-content {
    width: 100%;
  }
  .avatar-user {
    padding: 30px 15px 0 0;
  }
  .leave-type {
    display: inline-flex;
  }
}
@media (max-width: 1199px) {
  .label-hide-md {
    display: none;
  }
}
@media (max-width: 767px) {
  .label-hide-sm {
    display: none;
  }
}
</style>
