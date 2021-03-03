<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-basic-profile class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-user-edit"></i>
        <span>{{ $t("Profile") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-basic-profile" visible>
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleEditProfile()">
        <div class="card-body">
          <div class="form-row">
            <div class="col-md-4 col-lg-3 col-xl-2">
              <div id="container-avatar">
                <div id="container-avatar-img">
                  <img
                    :src="avatarSrc"
                    class="img-fluid"
                    alt="avatar">
                </div>
                <div id="container-btn-avatar">
                  <ValidationProvider
                    ref="provider_upload_avatar"
                    v-slot="{ errors, validate }"
                    rules="image|ext:jpeg,jpg,png,gif|size:300"
                    :name="$t('Avatar')">
                    <input
                      v-if="uploadFileReady"
                      id="upload-avatar"
                      type="file"
                      name="avatar"
                      @change="function($event) {
                        validate($event);
                        handleAvatarChange($event);
                      }">
                    <label for="upload-avatar">
                      <p class="btn btn-primary btn-responsive">
                        <i class="fa fa-camera"></i> {{ $t('Upload') }}
                      </p>
                    </label>
                    <button
                      type="button"
                      class="btn btn-danger btn-responsive"
                      @click="removeAvatar()">
                      <i class="fa fa-trash-alt"></i> {{ $t("Delete") }}
                    </button>
                    <span v-if="errors[0]" class="invalid-feedback" :class="{ 'd-block': errors[0] }">
                      {{ errors[0] }}
                    </span>
                  </ValidationProvider>
                </div>
              </div>
            </div>
            <div class="col-md-8 col-lg-9 col-xl-10">
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('First name')">
                    <p class="text-dark font-weight-bold">{{ $t("First name") }}</p>
                    <input
                      v-model.trim="formBasicInfo.first_name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }">
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('Last name')">
                    <p class="text-dark font-weight-bold">{{ $t('Last name') }}</p>
                    <input
                      v-model.trim="formBasicInfo.last_name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }">
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required|email" :name="$t('Email')">
                    <p class="text-dark font-weight-bold">{{ $t("Email") }}</p>
                    <input
                      v-model.trim="formBasicInfo.email"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }"
                      disabled>
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required|numeric" :name="$t('Phone number')">
                    <p class="text-dark font-weight-bold">{{ $t("Phone number") }}</p>
                    <input
                      v-model.trim="formBasicInfo.phone_number"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }"
                      type="text">
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required|dateBeforeToday|workingAge" :name="$t('Birthday')">
                    <p class="text-dark font-weight-bold">{{ $t("Birthday") }}</p>
                    <datepicker
                      v-model.trim="formBasicInfo.birthday"
                      :format="datePickerFormat"
                      :typeable="false"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                      :input-class="{ 'is-invalid': submitted && errors[0] }"
                      :language="datePickerLang"
                      placeholder="YYYY/MM/dd">
                    </datepicker>
                    <span v-show="errors[0]" class="text-error-date text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <p class="text-dark font-weight-bold">{{ $t("Role") }}</p>
                  <div class="w-100">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      :name="$t('Role')">
                      <select
                        v-model.number="formBasicInfo.role_id"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && errors[0] }"
                        :disabled="!isGeneralManger">
                        <option :value="generalManagerRoleID">{{ $t("General Manager") }}</option>
                        <option :value="managerRoleID">{{ $t("Manager") }}</option>
                        <option :value="userRoleID">{{ $t("Member") }}</option>
                      </select>
                      <span v-show="errors[0]" class="text-danger">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('Job title')">
                    <p class="text-dark font-weight-bold">{{ $t("Job title") }}</p>
                    <select
                      v-model.number="formBasicInfo.job_title"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }">
                      <option
                        v-for="(item, index) in jobTitleList"
                        :key="index"
                        :value="index">
                        {{ $t(item) }}
                      </option>
                    </select>
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <p class="text-dark font-weight-bold">{{ $t("Ranking") }}</p>
                  <div v-if="isGeneralManger || isManager" class="w-100">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      :name="$t('Ranking')">
                      <select
                        v-model.number="formBasicInfo.rank"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && errors[0] }">
                        <option
                          v-for="(item, index) in rankList"
                          :key="index"
                          :value="index">
                          {{ item }}
                        </option>
                      </select>
                      <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </div>
                  <div v-else class="w-100">
                    <select
                      v-model.trim="formBasicInfo.rank"
                      class="form-control"
                      :disabled="!isGeneralManger || !isManager">
                      <option
                        v-for="(item, index) in rankList"
                        :key="index"
                        :value="index">
                        {{ item }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider
                    ref="valid_date_start"
                    v-slot="{ errors }"
                    rules="required|dateBeforeToday"
                    :name="$t('Entering company')">
                    <p class="text-dark font-weight-bold">{{ $t("Entering company") }}</p>
                    <datepicker
                      v-model="formBasicInfo.company_joined_date"
                      :format="datePickerFormat"
                      :typeable="false"
                      :bootstrap-styling="true"
                      :calendar-button="true"
                      calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                      :input-class="{ 'is-invalid': submitted && errors[0] }"
                      :language="datePickerLang"
                      placeholder="YYYY/MM/dd">
                    </datepicker>
                    <span v-show="errors[0]" class="text-error-date text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <p class="text-dark font-weight-bold">{{ $t("Branch") }}</p>
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('Branch')">
                    <select
                      v-model.number="formBasicInfo.branch"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }">
                      <option
                        v-for="(item, index) in branchList"
                        :key="index"
                        :value="index">
                        {{ $t(item) }}
                      </option>
                    </select>
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-6 col-xl-4">
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('Employee id')">
                    <p class="text-dark font-weight-bold">{{ $t("Employee id") }}</p>
                    <input
                      v-model.trim="formBasicInfo.employee_id"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && errors[0] }">
                    <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer-profile card-footer">
          <div class="form-group">
            <p :class="{ 'd-block': errorEditBasicInfo!='' }" class="invalid-feedback">{{ $t(errorEditBasicInfo) }}</p>
          </div>
          <button
            type="submit"
            class="btn btn-success">
            <i class="fa fa-save"></i> {{ $t("Save") }}
          </button>
          <button
            type="submit"
            class="btn btn-secondary"
            @click.prevent="backBtn"> {{ $t("Back") }}
          </button>
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
import { FormEditBasicInfo } from '~/types/user-profile';
import {
  ManagerRoleID,
  UserRoleID,
  GeneralManagerRoleID
} from '~/utils/responsecode';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  uploadAvatar : string = '';
  formBasicInfo : FormEditBasicInfo = {
    avatar              : this.userProfile ? this.userProfile.avatar : '',
    flag_edit_avatar    : false,
    first_name          : this.userProfile ? this.userProfile.first_name : '',
    last_name           : this.userProfile ? this.userProfile.last_name : '',
    email               : this.userProfile ? this.userProfile.email : '',
    phone_number        : this.userProfile ? this.userProfile.phone_number : '',
    birthday            : this.userProfile ? this.userProfile.birthday : null,
    role_id             : this.userProfile ? this.userProfile.role_id : 0,
    job_title           : this.userProfile ? this.userProfile.job_title : 0,
    rank                : this.userProfile ? this.userProfile.rank : 0,
    company_joined_date : this.userProfile ? this.userProfile.company_joined_date : null,
    branch              : this.userProfile ? this.userProfile.branch : 0,
    employee_id         : this.userProfile ? this.userProfile.employee_id : ''
  };

  isGeneralManger: boolean = this.$auth.user.role_id === GeneralManagerRoleID
  isManager: boolean = this.$auth.user.role_id === ManagerRoleID
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  submitted: boolean = false;
  generalManagerRoleID: number = GeneralManagerRoleID;
  managerRoleID: number = ManagerRoleID;
  userRoleID: number = UserRoleID;
  errorEditBasicInfo: string = '';
  msgSuccessEditInfo: string = '';
  uploadFileReady: boolean = true;
  langDatepicker : any = LangDatepicker

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get avatarSrc() {
    let linkAvatar : string = this.defaultAvatar;

    if (this.formBasicInfo.avatar) {
      linkAvatar = 'data:image/png;base64,' + this.formBasicInfo.avatar;
    }

    return linkAvatar;
  }

  get rankList() {
    return userProfileStore.takeRankList;
  }

  get branchList() {
    return userProfileStore.takeBranchList;
  }

  get jobTitleList() {
    return userProfileStore.takeJobTitleList;
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  async handleEditProfile() {
    this.submitted = true;
    this.errorEditBasicInfo = '';
    this.msgSuccessEditInfo = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const birthYear : number = moment(this.formBasicInfo.birthday || undefined).year();
      const companyJoinngYear: number = moment(this.formBasicInfo.company_joined_date || undefined).year();
      if (companyJoinngYear - birthYear < 18) {
        const errorCompanyJoinngYear = ' ';
        (this.$refs.valid_date_start as any).applyResult({
          errors: [errorCompanyJoinngYear],
          valid: false,
          failedRules: {}
        });
        return false;
      }

      const msgModalConfirm = this.$t('Are you sure to edit profile info?');

      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.updateProfileInfo();
      });

      this.submitted = false;
    }
  }

  async updateProfileInfo() {
    this.$nuxt.$loading.start();

    try {
      this.formBasicInfo.birthday = moment(this.formBasicInfo.birthday!).format(this.dateFormatDatabase);
      this.formBasicInfo.company_joined_date = moment(this.formBasicInfo.company_joined_date!).format(this.dateFormatDatabase);
      userProfileStore.editBasicInfo(this.formBasicInfo);
      const res = await userProfileStore.updateProfile();
      await this.$auth.fetchUser();
      const msgSuccessEditInfo = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditInfo);

      await this.reloadData();
      if (this.userProfile && this.userProfile.user_id === this.$auth.user.id) {
        userProfileStore.setBase64Avatar(this.formBasicInfo.avatar);
      }
      this.formBasicInfo.flag_edit_avatar = false;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditBasicInfo = err.response.data.message;
      } else {
        this.errorEditBasicInfo = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);

      if (this.userProfile) {
        this.formBasicInfo.avatar = this.userProfile.avatar;
        this.formBasicInfo.first_name = this.userProfile.first_name;
        this.formBasicInfo.last_name = this.userProfile.last_name;
        this.formBasicInfo.email = this.userProfile.email;
        this.formBasicInfo.phone_number = this.userProfile.phone_number;
        this.formBasicInfo.birthday = this.userProfile.birthday;
        this.formBasicInfo.role_id = this.userProfile.role_id;
        this.formBasicInfo.job_title = this.userProfile.job_title;
        this.formBasicInfo.rank = this.userProfile.rank;
        this.formBasicInfo.company_joined_date = this.userProfile.company_joined_date;
        this.formBasicInfo.branch = this.userProfile.branch;
        this.formBasicInfo.flag_edit_avatar = false;
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditBasicInfo = err.response.data.message;
      } else {
        this.errorEditBasicInfo = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async handleAvatarChange($event) {
    const observer: any = this.$refs.provider_upload_avatar;
    const objValid = await observer.validate();

    if (objValid.valid && $event.target.files.length > 0) {
      const newAvatarBase64 = await this.convertImgToBase64($event.target.files[0]);
      this.formBasicInfo.avatar = (newAvatarBase64 as string).split(',')[1];
      this.formBasicInfo.flag_edit_avatar = true;
    }

    // reset input upload file
    this.uploadFileReady = false;
    this.$nextTick(() => {
      this.uploadFileReady = true;
    });
  }

  backBtn() {
    this.$router.back();
  }

  convertImgToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  removeAvatar() {
    this.formBasicInfo.flag_edit_avatar = true;
    this.formBasicInfo.avatar = '';
  }
}
</script>
<style scoped>
.container-avatar {
  display: inline-block;
  border: 1px solid #DFDFDF;
}
#container-avatar-img {
  text-align: center;
}
#avatar-img {
  border: 1px solid #eeeeee;
}
#container-btn-avatar {
  margin-top: 10px;
  text-align: center;
}
#container-btn-avatar .btn {
  margin-top: 5px;
  margin-bottom: 5px;
}
.btn-responsive {
  padding: 6px 6px;
  font-size: 90%;
}
#upload-avatar {
  display: none;
}
</style>
