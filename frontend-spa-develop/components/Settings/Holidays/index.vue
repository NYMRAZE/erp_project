<template>
  <div>
    <div class="form-row">
      <label class="font-weight-bold mt-3">{{ $t('Step') + ' 6 - 7' }}</label>
    </div>
    <div class="form-row">
      <label class="font-weight-bold mt-4">{{ $t("Holidays") }} <span class="text-important">({{ $t('Holidays of the year') }})</span></label>
    </div>
    <div class="form-row">
      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-12">
        <div v-if="holidays">
          <table class="table table-bordered text-center mt-4">
            <div>
              <div class="d-flex prev-next float-right mt-3 mb-3 mr-3">
                <button
                    type="button"
                    @click="handlePrevNext(false)">
                  <i class="fas fa-angle-left"></i>
                </button>
                <span class="font-weight-bold mx-2">
                {{ year }}
              </span>
                <button
                    v-show="isShowNextBtn"
                    type="button"
                    @click="handlePrevNext(true)">
                  <i class="fas fa-angle-right"></i>
                </button>
              </div>
            </div>
            <tbody>
            <tr v-for="(item, index) in holidays" :key="index" class="holiday-item">
              <td>
                <div class="d-flex justify-content-start">
                  <div class="w-100 float-css" @click="showEditModal(item)">
                    <span>{{ item.holiday_date }}</span><br>
                    <span>{{ item.description }}</span>
                  </div>
                  <b-nav-item-dropdown class="d-flex align-items-center edit-item" no-caret>
                    <template v-slot:button-content>
                      <i class="fas fa-edit mr-2 mt-1"></i>
                    </template>
                    <template>
                      <b-dropdown-item-button aria-describedby="dropdown-header-label" @click="showEditModal(item)">
                        <div class="d-flex align-items-center">
                          <i class="fas fa-edit mr-1"></i>
                          {{ $t('Edit') }}
                        </div>
                      </b-dropdown-item-button>
                      <b-dropdown-item-button aria-describedby="dropdown-header-label" @click="removeHoliday(item.id)">
                        <div class="d-flex align-items-center">
                          <i class="fas fa-archive mr-1"></i>
                          {{ $t('Remove') }}
                        </div>
                      </b-dropdown-item-button>
                    </template>
                  </b-nav-item-dropdown>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-xl-5 col-lg-6 col-md-6 col-sm-12 right-form">
        <label class="text-dark font-weight-bold required" for="date-from">
          {{ $t("Date") }}:
        </label>
        <div class="form-group">
          <datepicker
              id="date-from"
              v-model="dateInput"
              name="date-from-filter"
              class="mb-2"
              :input-class="{ 'is-invalid': errDateInput}"
              :format="datePickerFormat"
              :typeable="true"
              :bootstrap-styling="true"
              :calendar-button="true"
              :open-date="dateOpen"
              calendar-class="calendar_class"
              calendar-button-icon="fas fa-calendar datepicker_icon"
              :language="datePickerLang"
              placeholder="YYYY/MM/DD">
          </datepicker>
          <p v-if="errDateInput" class="invalid-feedback d-block">{{ errDateInput }}</p>
        </div>
        <div class="form-group">
          <label class="text-dark font-weight-bold required" for="date-from-filter">
            {{ $t("Description") }}:
          </label>
          <input
              v-model="description"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errDesInput }"
              :placeholder="`${$t('Description')}...`">
          <p v-if="errDesInput" class="invalid-feedback">{{ errDesInput }}</p>
        </div>
        <div class="d-flex">
          <div class="mr-auto">
            <b-button
                class="btn-save-test w-100px"
                @click.prevent="handleAddHoliday">{{ $t('Save') }}
            </b-button>
          </div>
          <div>
            <b-button class="btn-save-previous" @click="previousSetting">Previous</b-button>
          </div>
          <div>
            <b-button class="btn-save-next ml-3" @click="nextSetting">Next</b-button>
          </div>
        </div>
      </div>
    </div>
    <ValidationObserver ref="observerEdit">
      <!-- Modal start  -->
      <b-modal v-model="editHolidayModal">
        <template v-slot:modal-header="{ close }">
          <h5 class="modal-title">{{ $t("Edit holiday") }}</h5>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </template>
        <template>
          <ValidationProvider v-slot="{ errors }" rules="eval_required" tag="div">
            <label class="text-dark font-weight-bold required" for="date-from">
              {{ $t("Date") }}:
            </label>
            <datepicker
                id="date-from"
                v-model="dateEdit"
                name="date-from-filter"
                class="mb-2"
                :input-class="{ 'is-invalid': errors[0] }"
                :format="datePickerFormat"
                :typeable="true"
                :bootstrap-styling="true"
                :calendar-button="true"
                calendar-class="calendar_class"
                calendar-button-icon="fas fa-calendar datepicker_icon"
                :language="datePickerLang"
                placeholder="YYYY/MM/DD">
            </datepicker>
            <p v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" rules="eval_required">
            <label class="text-dark font-weight-bold required" for="date-from-filter">
              {{ $t("Description") }}:
            </label>
            <input
                v-model="descriptionEdit"
                type="text"
                class="form-control mb-3"
                :class="{ 'is-invalid': errors[0] }"
                :placeholder="$t('Description...')">
            <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
        </template>
        <template v-slot:modal-footer="{ ok, cancel }">
          <button
              type="button"
              class="btn btn-sm btn-success"
              @click="editHoliday()">
            {{ $t("Save") }}
          </button>
          <button
              type="button"
              class="btn btn-sm btn-secondary"
              @click="cancel()">
            {{ $t("Cancel") }}
          </button>
        </template>
      </b-modal>
      <!-- Modal end  -->
    </ValidationObserver>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { holidaysStore } from '../../../store';
import { Holiday } from '~/types/holidays';

@Component({
  components: {
    Datepicker
  }
})

export default class extends Vue {
  errorMessage : string = ''
  successMsg   : string = ''
  responseMsg  : string = ''
  errDateInput : string = ''
  errDesInput  : string = ''
  holidays: Holiday[] = []
  dateInput           : Date | null = null;
  datePickerFormat   : string = 'yyyy/MM/dd';
  dateFilterFormat   : string = 'YYYY/MM/DD';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  langDatepicker     : any    = LangDatepicker
  description        : string = ''
  year               : number = new Date().getFullYear()
  editHolidayModal   : boolean = false
  dateEdit           : string = ''
  descriptionEdit    : string = ''
  recordID           : number = 0
  isShowNextBtn      : boolean = true
  dateOpen           : Date | null = null

  mounted() {
    const $this = this;
    this.year = new Date().getFullYear();
    setTimeout(function () {
      $this.getHolidays();
    }, 100);
  }

  async getHolidays() {
    try {
      this.$nuxt.$loading.start();
      await holidaysStore.getHolidays(this.year).then((res) => {
        this.holidays = res.holidays;
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
      this.$nuxt.$loading.finish();
    }
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;
    return this.langDatepicker[currentLang];
  }

  handleValidateInput() {
    this.errDateInput = this.handleValidateRequire(this.dateInput);
    this.errDesInput = this.handleValidateRequire(this.description);
  }

  async handleAddHoliday() {
    try {
      this.handleValidateInput();

      if (!this.errDateInput && !this.errDesInput) {
        const res = await holidaysStore.createHoliday({
          holiday_date: this.convertTimeToStr(this.dateInput, this.dateFormatDatabase),
          description: this.description
        });
        if (res) {
          const successMsg = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
          this.dateInput = null;
          this.description = '';
          await Promise.all([this.$auth.fetchUser(), this.getHolidays()]);
        }
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        const errorMessage = err.response.data.message;
        const $context = this;
        this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', errorMessage);
      } else {
        const errorMessage = err.message;
        const $context = this;
        this.$common.makeToast($context, 'danger', 'b-toaster-bottom-right', 'Notification', errorMessage);
      }
    } finally {
    }
  }

  async editHoliday() {
    try {
      const observer: any = this.$refs.observerEdit;
      const isValid = await observer.validate();
      if (isValid) {
        const res = await holidaysStore.editHoliday({
          holiday_date: this.convertTimeToStr(new Date(this.dateEdit), this.dateFormatDatabase),
          description: this.descriptionEdit,
          id: this.recordID
        });
        const responseMsg = res.message;
        const $context = this;
        this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', responseMsg);
        await this.getHolidays();
        this.editHolidayModal = false;
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err.message;
      }
    } finally {
    }
  }

  removeHoliday(id: number) {
    try {
      const msgModalConfirm = this.$t(
        'Do you want to <span style="color: red; "><strong>REMOVE</strong></span> this holiday?'
      ) as string;
      const $this = this;
      this.showModalConfirm(this.$t('Confirmation') as string, msgModalConfirm, async function() {
        const res = await holidaysStore.removeHoliday(id);
        $this.responseMsg = res.message;
        await $this.getHolidays();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.errorMessage = '';
        this.responseMsg = '';
      }, 3000);
    }
  }

  showEditModal(item: Holiday) {
    if (!this.editHolidayModal) {
      this.editHolidayModal = true;
      this.dateEdit = item.holiday_date;
      this.descriptionEdit = item.description;
      this.recordID = item.id;
    } else {
      this.editHolidayModal = false;
    }
  }

  handlePrevNext(isNext: boolean) {
    const currentYear = new Date().getFullYear();
    if (isNext) {
      this.year += 1;
      this.isShowNextBtn = this.year <= currentYear;
      this.getHolidays();
    } else {
      this.isShowNextBtn = true;
      this.year -= 1;
      this.dateOpen = new Date(this.year, 0, 1);
      this.getHolidays();
    }

    this.dateOpen = this.year === currentYear ? null : new Date(this.year, 0, 1);
  }

  handleValidateRequire(field: any) {
    return !field ? 'This field is required' : '';
  }

  convertTimeToStr(time: Date | null, dateFormat: string) : string {
    if (time) {
      return moment(time).format(dateFormat);
    }
    return '';
  }

  previousSetting() {
    this.$router.push('/settings/overtime');
  }

  nextSetting() {
    if (!this.holidays) {
      this.errorMessage = this.$t('Please enter holidays') as string;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      this.$router.push('/settings/finish');
    }
  }

  showModalConfirm(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true,
      cancelTitle     : this.$t('Cancel') as string
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }
}
</script>
<style scoped>
.table {
  background-color: #ffffff !important;
}

.float-css {
  text-align: left !important;
}
.table-bordered thead tr th {
  background-color:#f2f2f2;
  text-align: center;
}
.required:after {
  content: " *";
  color:red;
}
.prev-next > button {
  outline: none;
  border: none;
  background-color: inherit;
}
.col-width {
  width: 40%;
}
.edit-item {
  width: 40px;
  height: 20px;
}
.holiday-item {
  cursor: pointer;
}
</style>
