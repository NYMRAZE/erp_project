<template>
  <div>
    <h3
      id="page-title"
      class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ title }}
    </h3>
    <div class="padding-sm-x">
      <nuxt-link to="/hrm/profile-list" class="text-decoration-none d-inline-block">
        <h4 class="sub-page-title font-weight-bold">
          <div class="container-icon-circle">
            <span class="fas fa-play fa-rotate-180"></span>
          </div>
          {{ $t('Back to manage info') }}
        </h4>
      </nuxt-link>
    </div>
    <!-- Filter area-->
    <div class="filter-area mt-3">
      <ValidationObserver
        ref="observer"
        v-slot="{ invalid }"
        @submit.prevent="handleFilterRequest()"
        tag="form">
        <div class="form-row">
          <div class="col-xl-9 col-lg-9 col-md-9 col-sm-12">
            <div class="form-row">
              <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 form-group">
                <ValidationProvider v-slot="{ errors }" :name="$t('Email')" rules="min:3">
                  <label class="text-dark font-weight-bold" for="email-filter">{{ $t("Email") }}</label>
                  <input
                    id="email-filter"
                    v-model.trim="submitForm.email"
                    :class="{ 'is-invalid': errors[0] }"
                    class="form-control"
                    type="text">
                  <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 form-group">
                <label class="text-dark font-weight-bold" for="type-request">
                  {{ $t("Type request") }}
                </label>
                <select
                  id="type-request"
                  v-model="submitForm.type"
                  class="form-control">
                  <option :value="defautSelectBox" selected>{{ $t("Choose") }}...</option>
                  <option :value="requestMemberType">{{ $t("Request") }}</option>
                  <option :value="requestInviteType">{{ $t("Invite") }}</option>
                </select>
              </div>
              <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 form-group">
                <label class="text-dark font-weight-bold" for="status-filter">
                  {{ $t("Status") }}
                </label>
                <select
                  id="status-filter"
                  v-model="submitForm.status"
                  class="form-control">
                  <option :value="defautSelectBox" selected>{{ $t("Choose") }}...</option>
                  <option :value="requestPendingStatus">{{ $t("Pending") }}</option>
                  <option :value="requestDenyStatus">{{ $t("Deny") }}</option>
                  <option :value="requestAcceptStatus">{{ $t("Accept") }}</option>
                  <option :value="requestRegisteredStatus">{{ $t("Registered") }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 form-group">
                <ValidationProvider
                  :name="$t('From date')"
                  v-slot="{ errors }"
                  rules="dateBeforeOrEqual:dateto"
                  vid="datefrom">
                  <label class="text-dark font-weight-bold" for="date-from-filter">
                    {{ $t("From date") }}
                  </label>
                  <datepicker
                    id="date-from-filter"
                    v-model="submitForm.date_from"
                    :typeable="true"
                    :format="datePickerFormat"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :input-class="{ 'is-invalid': errors[0] }"
                    :language="datePickerLang"
                    name="date-from-filter"
                    placeholder="YYYY/MM/dd">
                  </datepicker>
                  <p v-show="errors[0]" class="text-danger">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
              <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 form-group">
                <ValidationProvider
                  :name="$t('To date')"
                  v-slot="{ errors }"
                  vid="dateto">
                  <label class="text-dark font-weight-bold" for="date-to-filter">
                    {{ $t("To date") }}
                  </label>
                  <datepicker
                    id="date-to-filter"
                    :typeable="true"
                    :format="datePickerFormat"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    calendar-button-icon="fas fa-calendar datepicker_icon"
                    :language="datePickerLang"
                    v-model="submitForm.date_to"
                    name="date-to-filter"
                    placeholder="YYYY/MM/dd">
                    <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                  </datepicker>
                  <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 form-group">
            <label class="label-hide-sm font-weight-bold">&#8205;</label>
            <div>
              <button
                @click="handleFilterRequest()"
                :disabled="invalid"
                type="button"
                class="btn btn-primary2 w-100px mr-2">
                <i class="fa fa-search"></i>
                {{ $t("Search") }}
              </button>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <!-- End filter-area -->
<!--    <h6 class="font-weight-bold mt-5 text-right">{{ $t('Total records') + ': ' + totalRows }}</h6>-->
    <!-- table -->
    <div class="tbl-container text-nowrap mt-4">
      <table class="tbl-info">
        <thead>
          <tr>
            <th class="head-cell-rotate">&#8205;</th>
            <th
              class="cell-email text-left">
              {{ $t("Email") }}
            </th>
            <th class="cell-message text-left">
              {{ $t("Message") }}
            </th>
            <th class="cell-request-time text-left">
              {{ $t("Request time") }}
            </th>
            <th class="cell-type-request text-left">
              {{ $t("Type request") }}
            </th>
            <th class="cell-status text-left">
              {{ $t("Status") }}
            </th>
            <th class="cell-action text-left">
              {{ $t("Action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataTable" :key="item.id">
            <td
              :class="takeBgColorCell(item.status)"
              class="cell-rotate font-weight-bold align-middle">
              <div class="rotate-text-cell">
                {{ $t(item.status_name) }}
              </div>
            </td>
            <td class="text-left align-top">
              {{ item.email }}
            </td>
            <td class="align-top">
              <div class="text-left text-message-cell">
                {{ item.message }}
              </div>
            </td>
            <td class="text-left align-top">
              {{ item.time_request }}
            </td>
            <td class="text-left align-top">
              {{ $t(item.type_name) }}
            </td>
            <td class="text-left align-top">
              {{ $t(item.status_name) }}
            </td>
            <td class="text-left align-top">
              <!-- When status is pending -->
              <template v-if="item.status === requestPendingStatus">
                <button
                  @click="confirmAcceptOrDeny(item.id, item.email, requestAcceptStatus)"
                  type="button"
                  class="btn btn-sm btn-action-accepted">
                  {{ $t("Accept") }}
                </button>
                <button
                  @click="confirmAcceptOrDeny(item.id, item.email, requestDenyStatus)"
                  type="button"
                  class="btn btn-action-deny btn-sm">
                  {{ $t("Deny") }}
                </button>
              </template>
              <!-- When status is acepted -->
              <template v-else-if="item.status === requestAcceptStatus">
                <button
                  :disabled="item.allow_resend"
                  @click="confirmResendEmail(item.id, item.email)"
                  type="button"
                  class="btn btn-sm btn-action-pending">
                  {{ $t("Resend") }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- End table -->
    <!-- Pagination container -->
    <div class="mt-4">
      <b-pagination
        v-model="submitForm.current_page"
        :total-rows="totalRows"
        :per-page="rowPerPage"
        @input="searchRequest"
        align="center"
        limit="7"
        class="brown-pagination float-right">
      </b-pagination>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <b-form-input
          :max="totalPages"
          v-model="inputPageNumber"
          @keyup.enter="searchByInputPage"
          type="number"
          min="1"
          class="form-control input-jump-page"></b-form-input>
      </div>
      <!--<h6 class="font-weight-bold mt-2">{{ $t("Total records") + ":" + totalRows }}</h6>-->
    </div>
    <!-- End Pagination container -->
    <b-modal
      v-model="showModalError"
      @ok="handleOkModalError"
      title="Alert"
      ok-only
      header-text-variant="danger">
      {{ handleError }}
    </b-modal>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Vue, Component } from 'nuxt-property-decorator';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { ManageRequestSubmit, Pagination, UpdateRequestStatusSubmit } from '~/types/registration-requests';
import { layoutAdminStore, registrationRequestStore } from '~/store/';
import {
  RequestPendingStatus,
  RequestDenyStatus,
  RequestAcceptStatus,
  RequestRegisteredStatus,
  RequestMemberType,
  RequestInviteType
} from '~/utils/responsecode';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  title : string = '';
  submitForm: ManageRequestSubmit = {
    email           : '',
    type            : 0,
    status          : 0,
    date_from       : null,
    date_to         : null,
    current_page    : 1
  }

  inputPageNumber         : number | null = this.submitForm.current_page;
  datePickerFormat        : string = 'yyyy/MM/dd';
  dateFilterFormat        : string = 'YYYY/MM/DD';
  showModalError          : boolean = false;
  manageRequestError      : string = '';
  filterEmailError        : any = null;
  pagination              : Pagination = registrationRequestStore.objPagination;
  defautSelectBox         : number = 0;
  requestPendingStatus    : number = RequestPendingStatus;
  requestDenyStatus       : number = RequestDenyStatus;
  requestAcceptStatus     : number = RequestAcceptStatus;
  requestRegisteredStatus : number = RequestRegisteredStatus;
  requestMemberType       : number = RequestMemberType;
  requestInviteType       : number = RequestInviteType;
  langDatepicker          : any    = LangDatepicker;

  mounted() {
    this.title = this.$t('Manage member information') as string;
    layoutAdminStore.setTitlePage(this.title);

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

  // get data table request from store
  get dataTable() {
    return registrationRequestStore.arrTableManageRequest;
  }

  // get total rows for pagination from store
  get totalRows() {
    return registrationRequestStore.objPagination.total_row;
  }

  // get number rows per page for pagination from store
  get rowPerPage() {
    return registrationRequestStore.objPagination.row_perpage;
  }

  // show modal error
  get handleError() {
    if (this.manageRequestError !== '') {
      this.showModalError = true;
    } else {
      this.showModalError = false;
    }

    return this.manageRequestError;
  }

  get totalPages() {
    return this.$common.totalPage(this.totalRows, this.rowPerPage);
  }

  // send form submit to store
  async searchRequest() {
    this.$nuxt.$loading.start();

    try {
      await registrationRequestStore.searchTableManageRequest(this.submitForm);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.manageRequestError = err.response.data.message;
      } else {
        this.manageRequestError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  // search by filter
  async handleFilterRequest() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.current_page = 1;
      this.searchRequest();
    }
  }

  // action for button deny, accept update status request
  async updateRequestStatus(requestId: number, statusRequest: number) {
    this.$nuxt.$loading.start();
    try {
      const objUpdateRequestStatus : UpdateRequestStatusSubmit = {
        request_id: requestId,
        status_request: statusRequest
      };

      await registrationRequestStore.updateRequestStatus(objUpdateRequestStatus);
      this.searchRequest();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.manageRequestError = err.response.data.message;
      } else {
        this.manageRequestError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  // action button resend
  async resendEmailRegister(requestId: number) {
    this.$nuxt.$loading.start();
    try {
      const res = await registrationRequestStore.resendEmailRegister(requestId);
      await this.searchRequest();
      return res;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.manageRequestError = err.response.data.message;
      } else {
        this.manageRequestError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  // show modal confirm before accept, deny
  confirmAcceptOrDeny(requestId: number, email: string, statusRequest: number) {
    let action = '';

    if (statusRequest === this.requestDenyStatus) {
      action = this.$t('Deny') as string;
    } else if (statusRequest === this.requestAcceptStatus) {
      action = this.$t('Accept') as string;
    }

    const msgModalConfirm = this.$t('Do you want to <strong>{0}</strong> request from <strong>{1}</strong>?',
      {
        0: email,
        1: action
      }
    ) as string;

    const $this = this;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.updateRequestStatus(requestId, statusRequest);
    });
  }

  // show modal confirm before resend
  confirmResendEmail(requestId: number, email: string) {
    const msgModalConfirm = this.$t('Do you want to <strong>resend</strong> confirmation mail to <strong>{0}</strong>?',
      {
        0: email
      }
    ) as string;

    const $this = this;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.resendEmailRegister(requestId).then((message) => {
        const notification = message || 'Unexpected Error occurred! Try again in a few minutes!';
        if (notification === 'Success') {
          $this.showMsgBoxOk('A confirmation mail was sent to ' + email);
        } else {
          $this.showMsgBoxOk(notification);
        }
        setTimeout(() => {
          $this.$bvModal.hide('notiModal');
        }, 2000);
      });
    });
  }

  backBtn() {
    this.$router.back();
  }

  showMsgBoxOk(message: string) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxOk([messageNodes], {
      buttonSize      : 'sm',
      hideHeaderClose : true,
      centered        : true,
      id              : 'notiModal'
    });
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
      title           : 'Please Confirm',
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'YES',
      cancelTitle     : 'NO',
      hideHeaderClose : false,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.manageRequestError = err;
    });
  }

  // action button OK in modal error
  handleOkModalError() {
    this.manageRequestError = '';
  }

  searchByInputPage() {
    if (this.inputPageNumber != null) {
      this.submitForm.current_page = this.inputPageNumber;
      this.searchRequest();
    }
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }

    return '';
  }

  takeBgColorCell(statusRequest: number) {
    let className = '';

    switch (statusRequest) {
    case RequestPendingStatus:
      className = 'bg-color-pending';
      break;
    case RequestDenyStatus:
      className = 'bg-color-deny';
      break;
    case RequestAcceptStatus:
      className = 'bg-color-accepted';
      break;
    case RequestRegisteredStatus:
      className = 'bg-color-registered';
      break;
    }

    return className;
  }
};
</script>

<style >
.text-message-cell {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell-email {
  min-width: 250px;
}
.cell-message {
  min-width: 300px;
}
.cell-request-time {
  min-width: 200px;
}
.cell-type-request {
  min-width: 150px;
}
.cell-type-status {
  min-width: 150px;
}
.cell-action {
  min-width: 180px;
}
</style>
