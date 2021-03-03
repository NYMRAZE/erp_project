<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-education class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-user-graduate"></i>
        <span>{{ $t('Education') }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-education">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyEducation()">
        <div
          v-for="(item, index) in educationList"
          :key="index"
          class="container-education-body"
          :class="{ 'border-top' : index != 0 }">
          <!-- block-user-education -->
          <div class="block-user-education card-body">
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Qualification' + '(' + (index + 1) + ')')">
                  <p class="text-dark font-weight-bold">{{ $t('Qualification') }}</p>
                  <input
                    v-model.trim="item.title"
                    class="form-control"
                    type="text"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                  <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('School') + '(' + (index + 1) + ')'">
                  <p class="text-dark font-weight-bold">{{ $t('School') }}</p>
                  <input
                    v-model.trim="item.university"
                    class="form-control"
                    type="text"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                  <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  :rules="'required|dateBeforeToday|dateBeforeOrEqual:dateto' + index"
                  :vid="'datefrom' + index"
                  :name="$t('From date') + '(' + (index + 1) + ')'">
                  <p class="text-dark font-weight-bold">{{ $t("From date") }}</p>
                  <datepicker
                    v-model.trim="item.start_date"
                    :format="datePickerFormat"
                    :typeable="false"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    :input-class="{ 'is-invalid': errors[0] }"
                    calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd">
                  </datepicker>
                  <span v-show="errors[0]" class="text-error-date text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required|dateBeforeToday"
                  :name="$t('To date') + '(' + (index + 1) + ')'"
                  :vid="'dateto' + index">
                  <p class="text-dark font-weight-bold">{{ $t("To date") }}</p>
                  <datepicker
                    v-model.trim="item.end_date"
                    :format="datePickerFormat"
                    :typeable="false"
                    :bootstrap-styling="true"
                    :calendar-button="true"
                    :input-class="{ 'is-invalid': errors[0] }"
                    calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                    :language="datePickerLang"
                    placeholder="YYYY/MM/dd">
                  </datepicker>
                  <span v-show="errors[0]" class="text-error-date text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-8 col-xl-8">
                <p class="text-dark font-weight-bold">{{ $t("Achievements") }}</p>
                <textarea v-model.trim="item.achievement" class="form-control" rows="6"></textarea>
              </div>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-danger"
                @click="removeItemEducation(index)">
                <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
              </button>
            </div>
          </div>
          <!-- End block-user-education -->
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditEducation!='' }" class="invalid-feedback">{{ $t(errorEditEducation) }}</p>
          <div>
            <button
              type="submit"
              class="btn btn-success">
              <i class="fa fa-save"></i> {{ $t("Save") }}
            </button>
            <button
              type="button"
              class="btn btn-warning btn-add"
              @click="addItemEducation()">
              <i class="fa fa-plus"></i> {{ $t("Add") }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { userProfileStore } from '~/store/index';
import { Education } from '~/types/user-profile';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  educationList : Education[] | [] = this.educationArr;
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  submitted : boolean = false;
  errorEditEducation : string = '';
  msgSuccessEditEducation : string = '';
  langDatepicker    : any    = LangDatepicker

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get educationArr() {
    let newArray : Education[] | [] = [];

    if (this.userProfile && this.userProfile.education) {
      this.userProfile.education.forEach((value) => {
        const itemEducation : Education = Object.assign({}, value);

        newArray = [ ...newArray, itemEducation ];
      });
    }

    return newArray;
  }

  async handleModifyEducation() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitted = false;

      const msgModalConfirm = this.$t('Are you sure to edit education?');

      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveEducation();
      });
    }
  }

  async saveEducation() {
    this.$nuxt.$loading.start();
    this.errorEditEducation  = '';
    this.msgSuccessEditEducation = '';
    try {
      this.educationList.forEach((item) => {
        item.start_date = moment(item.start_date!).format(this.dateFormatDatabase);
        item.end_date = moment(item.end_date!).format(this.dateFormatDatabase);
      });

      userProfileStore.editEducation(this.educationList);
      const res = await userProfileStore.updateProfile();
      const msgSuccessEditEducation = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditEducation);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditEducation = err.response.data.message;
      } else {
        this.errorEditEducation = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  addItemEducation() {
    const newItemEducation : Education = {
      title: '',
      university: '',
      achievement: '',
      start_date: null,
      end_date: null
    };

    this.educationList = [ ...this.educationList, newItemEducation ];
  }

  removeItemEducation(indexEducationItem: number) {
    if (this.educationList.length > 0) {
      this.educationList = this.educationList.filter(function(item, index) {
        return index !== indexEducationItem;
      });
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.educationList = this.educationArr;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditEducation = err.response.data.message;
      } else {
        this.errorEditEducation = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
