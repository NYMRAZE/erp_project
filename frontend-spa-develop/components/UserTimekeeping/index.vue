<template>
  <div>
    <h3
      id="page-title"
      class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ title }}
    </h3>

    <!-- Back btn area-->
    <div class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-transparent border-0">
          <nuxt-link to="/hrm/timekeeping-list" class="text-decoration-none">
            <h4 class="sub-page-title font-weight-bold back-btn-area">
              <div class="container-icon-circle">
                <span class="fas fa-play fa-rotate-180"></span>
              </div>
              {{ $t('Back to member time keeping') }}
            </h4>
          </nuxt-link>
        </div>
      </div>
    </div>
    <!-- Clock area-->
    <div class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white py-5 px-3">
          <div class="row">
            <div class="col-6">
              <span class="text-dark align-middle font-weight-bold">
                {{ $t("Current date & time") }} :
              </span>
              <span class="text-secondary align-middle">
                {{ timeClock }}
              </span>
            </div>
            <div class="col-6">
              <div v-if="showNotCheckin">
                <span class="text-dark align-middle font-weight-bold">
                  {{ $t("Status") }}:
                </span>
                <span class="text-secondary align-middle">
                  {{ $t("Not checkin") }}
                </span>
              </div>
              <div v-if="showCheckinTime">
                <span class="text-dark align-middle font-weight-bold">
                  {{ $t("Last check-in today") }} :
                </span>
                <span class="text-secondary align-middle">
                  {{ timekeepingToday.check_in_time }}
                </span>
              </div>
              <div v-if="showCheckoutTime">
                <span class="text-dark align-middle font-weight-bold">
                  {{ $t("Last check-out today") }} :
                </span>
                <span class="text-secondary align-middle">
                  {{ timekeepingToday.check_out_time }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Check-in/out area-->
    <!-- Back btn area-->
    <div class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-transparent border-0">
          <div class="btn-area px-0">
            <button v-if="showBtnCheckin" type="button" class="btn btn-lg btn-primary2" @click.prevent="checkin"> {{ $t("Check-in") }} </button>
            <button v-if="showBtnCheckout" type="button" class="btn btn-lg btn-danger" @click.prevent="checkout"> {{ $t("Check-out") }} </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="btn-area mt-1">
      <button v-if="showBtnCheckin" type="button" class="btn btn-lg btn-primary2" @click.prevent="checkin"> {{ $t("Check-in") }} </button>
      <button v-if="showBtnCheckout" type="button" class="btn btn-lg btn-danger" @click.prevent="checkout"> {{ $t("Check-out") }} </button>
    </div> -->

    <!-- Time keeping history area-->
    <div class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t("History timekeeping") }}</h5>
          <div class="py-3 px-3">
            <ValidationObserver ref="observer" v-slot="{ }" tag="form" @submit.prevent="handleSearchUserTimekeeping()">
              <div class="form-row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 form-group">
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
                      v-model="dateFrom"
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
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12 form-group">
                  <ValidationProvider
                    v-slot="{ errors }"
                    :name="$t('Date to')"
                    vid="dateto">
                    <label class="text-dark font-weight-bold" for="date-to-filter">
                      {{ $t('Date to') }}
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
                      :rtl="true"
                      placeholder="YYYY/MM/DD"
                      name="date-to-filter">
                      <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                    </datepicker>
                    <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
                  </ValidationProvider>
                </div>
                <div class="col-lg-4 col-md-6 form-group">
                  <label class="col-12 transparent-text d-none d-md-block" for="date-to-filter"> x </label>
                  <button type="submit" class="btn btn-primary2 w-100px">
                    <i class="fa fa-search"></i>
                  {{ $t("Search") }}
                  </button>
                </div>
              </div>
            </ValidationObserver>
          </div>
          <div class="px-0">
            <table class="table">
              <thead>
                <tr>
                  <th class="cell-message text-left px-3">
                    {{ $t("Check-in") }}
                  </th>
                  <th class="cell-message text-left px-3">
                    {{ $t("Check-out") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in listUserTimekeeping" :key="index">
                  <td class="text-left align-top px-3">{{ item.check_in_time }}</td>
                  <td class="text-left align-top px-3">{{ item.check_out_time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination area -->
    <div class="mt-4 col-xl-6">
      <b-pagination
        v-model="submitForm.current_page"
        :total-rows="totalRows"
        :per-page="rowPerPage"
        @input="searchListUserKeepingtime"
        align="center"
        limit="7"
        class="brown-pagination float-right">
      </b-pagination>
      <div class="form-inline float-right mr-4">
        <span
          class="mr-2 txt-to-page">To page</span>
        <input
            type="number"
            min="1"
            :max="totalPages"
            @keyup.enter="searchByInputPage"
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
import { AdminRoleID, ManagerRoleID } from '~/utils/responsecode';
import { layoutAdminStore, timekeepingStore } from '~/store/index';
import { Timekeeping, SeachTimekeepingUserSubmit } from '~/types/user-timekeeping';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  title : string = '';
  submitForm : SeachTimekeepingUserSubmit = {
    date_from      : '',
    date_to        : '',
    current_page   : 1
  };

  inputPageNumber         : number | null = this.submitForm.current_page;
  isAdmin: boolean =  this.$auth.user.role_id === AdminRoleID || this.$auth.user.role_id === ManagerRoleID
  timekeepingToday  : Timekeeping = this.takeTimekeepingToday!;
  timeClockObj      : any = moment(this.takeTimekeepingToday!.time_server, 'YYYY/MM/DD h:mm:ss A');
  timeClock         : string = '';
  dateTo            : Date | null = null;
  dateFrom          : Date | null = null;
  datePickerFormat  : string = 'yyyy/MM/dd';
  dateFilterFormat  : string = 'YYYY-MM-DD';
  errorMessage      : string = '';
  errorListMessage  : string = '';
  langDatepicker    : any = LangDatepicker;

  mounted() {
    setInterval(() => {
      this.timeClockObj = this.timeClockObj.add(1, 'seconds');
      this.timeClock = this.timeClockObj.format('YYYY/MM/DD hh:mm:ss');
    }, 1000);

    this.title = this.$t('User timekeeping') as string;
    layoutAdminStore.setTitlePage(this.title);

    this.$nextTick(() => {
      this.searchListUserKeepingtime();
    });
  }

  // get total rows for pagination from store
  get totalRows() {
    return timekeepingStore.objPaginationManageRequest.total_row;
  }

  // get number rows per page for pagination from store
  get rowPerPage() {
    return timekeepingStore.objPaginationManageRequest.row_per_page;
  }

  get totalPages() {
    return this.$common.totalPage(this.totalRows, this.rowPerPage);
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get takeTimekeepingToday() {
    return timekeepingStore.takeTimekeeping;
  }

  get showNotCheckin() {
    return this.timekeepingToday.check_in_time === '' && this.timekeepingToday.check_out_time === '';
  }

  get showCheckinTime() {
    return this.timekeepingToday.check_in_time !== '' && this.timekeepingToday.check_out_time === '';
  }

  get showCheckoutTime() {
    return this.timekeepingToday.check_in_time !== '' && this.timekeepingToday.check_out_time !== '';
  }

  get showBtnCheckin() {
    return (this.timekeepingToday.check_in_time === '' && this.timekeepingToday.check_out_time === '') ||
            (this.timekeepingToday.check_in_time !== '' && this.timekeepingToday.check_out_time !== '');
  }

  get showBtnCheckout() {
    return this.timekeepingToday.check_in_time !== '' && this.timekeepingToday.check_out_time === '';
  }

  get listUserTimekeeping() {
    return timekeepingStore.takeListUserTimekeeping;
  }

  get objPagination() {
    return timekeepingStore.objPaginationManageRequest;
  }

  async checkin() {
    this.$nuxt.$loading.start();
    try {
      await timekeepingStore.Checkin();
      await this.loadCurrentTimekeeping();
      this.timekeepingToday = this.takeTimekeepingToday!;
      await this.searchListUserKeepingtime();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async checkout() {
    this.$nuxt.$loading.start();
    try {
      await timekeepingStore.Checkout();
      await this.loadCurrentTimekeeping();
      this.timekeepingToday = this.takeTimekeepingToday!;
      await this.searchListUserKeepingtime();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async loadCurrentTimekeeping() {
    this.$nuxt.$loading.start();

    try {
      await timekeepingStore.getTodayTimekeeping();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async handleSearchUserTimekeeping() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitForm.current_page = 1;
      this.searchListUserKeepingtime();
    }
  }

  async searchListUserKeepingtime() {
    this.$nuxt.$loading.start();

    try {
      this.submitForm.date_from = this.convertTimeToStr(this.dateFrom, this.dateFilterFormat);
      this.submitForm.date_to = this.convertTimeToStr(this.dateTo, this.dateFilterFormat);

      await timekeepingStore.LoadListUserTimekeeping(this.submitForm);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorListMessage = err.response.data.message;
      } else {
        this.errorListMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  searchByInputPage() {
    if (this.inputPageNumber != null) {
      this.submitForm.current_page = this.inputPageNumber;
      this.searchListUserKeepingtime();
    }
  }

  convertTimeToStr(time: Date | null, formatTime: string) : string {
    if (time) {
      return moment(time).format(formatTime);
    }

    return '';
  }

  backBtn() {
    this.$router.back();
  }

  clearSearchKeepingtime() {
    this.dateTo  = null;
    this.dateFrom  = null;
  }
};
</script>
<style scoped>

.transparent-text {
  color: transparent;
}

.btn-area {
  padding: 20px rem 20px 1rem;
  margin: 13px 0rem 13px 0rem;
}

.back-btn-area {
  padding-left: 0rem;
  margin-left: 0rem;
}

.totalrow {
  position: relative;
}
.totalrow h6 {
  position: absolute;
  top: 0;
  left: 0;
}
.layout-timekeeping td {
  padding: 5px;
}
#tbl-timekeeping th {
  color: #ffffff;
  background-color: #2191C9;
}
</style>
