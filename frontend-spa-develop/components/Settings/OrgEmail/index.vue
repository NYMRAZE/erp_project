<template>
  <div>
    <div class="form-row">
      <div class="col-xl-7 col-lg-10 col-md-10 col-sm-12">
        <div>
          <label class="font-weight-bold mt-3">{{ $t('Step') + ' 1 - 7' }}</label>
        </div>
        <div>
          <label class="font-weight-bold mt-4">{{ $t('Setting leave') }}</label>
          <ValidationProvider
              v-slot="{ errors }"
              rules="required"
              :name="$t('Leave')"
              class="form-group mt-2"
              tag="div">
            <label class="text-dark font-weight-bold" for="email">
              {{ $t("Expiration month") }} <span class="font-weight-light text-important">({{ $t('Month that the system automatically clear the leave') }})</span>
            </label>
            <select
                v-model.number="leaveMonth"
                class="form-control"
                :class="{ 'is-invalid': errors[0] }"
                @change="onChangeSelect($event)">
              <option
                  v-for="(month) in 12"
                  :key="month"
                  :value="month">
                {{ $t(month) }}
              </option>
            </select>
            <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
            <p v-if="msgSettingLeaveSuccess" class="text-success">{{ $t(msgSettingLeaveSuccess) }}</p>
          </ValidationProvider>
        </div>
        <div class="mt-5">
          <ValidationObserver
              ref="observer"
              v-slot="{}"
              tag="form">
            <label class="font-weight-bold">{{ $t('Setting email') }}</label>
            <ValidationProvider
                v-slot="{ errors }"
                rules="email|required"
                :name="$t('Email')"
                class="form-group mt-2"
                tag="div">
              <label class="text-dark font-weight-bold" for="email">
                {{ $t("Email") }} <span class="font-weight-light text-important">(- {{ $t('Send invitation requests') }}</span><br />
                <span class="font-weight-light text-important ml-5">- {{ $t('Send notice of leave, overtime') }})</span>
              </label>
              <input
                  id="email"
                  v-model.trim="email"
                  autocomplete="off"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors[0] }"
                  :disabled="!isCanEdit"
                  :placeholder="$t('Organization Email')">
              <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
            </ValidationProvider>
            <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:8|max:35"
                vid="password"
                :name="$t('Password')"
                class="form-group"
                tag="div">
              <label class="text-dark font-weight-bold" for="password">{{ $t("Password") }}</label>
              <input
                  id="password"
                  v-model.trim="password"
                  autocomplete="off"
                  :name="$t('Password')"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors[0] }"
                  :disabled="!isCanEdit"
                  :placeholder="$t('Password')">
              <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
            </ValidationProvider>
            <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:8|max:35|confirmPassword:password"
                vid="passwordConfirm"
                :name="$t('Confirm password')"
                class="form-group"
                tag="div">
              <label class="text-dark font-weight-bold" for="password-confirm">{{ $t("Confirm password") }}</label>
              <input
                  id="password-confirm"
                  v-model.trim="passwordConfirm"
                  autocomplete="off"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors[0] }"
                  :disabled="!isCanEdit"
                  :placeholder="$t('Confirm password')">
              <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
            </ValidationProvider>
            <ValidationProvider
                v-slot="{ errors }"
                rules="email|required"
                vid="emailTest"
                :name="$t('Email test')"
                class="form-group"
                tag="div">
              <label class="text-dark font-weight-bold" for="password-confirm">{{ $t("Email test") }}</label>
              <input
                  id="email-test"
                  v-model.trim="emailTest"
                  autocomplete="off"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors[0] }"
                  :disabled="!isCanEdit"
                  :placeholder="$t('Email test')">
              <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
            </ValidationProvider>
            <div class="d-flex justify-content-between bd-highlight mb-3">
              <div>
                <b-button class="btn-save-test" :disabled="!isCanEdit" @click="handleEditOrgEmail">{{ $t('Save and test') }}</b-button>
              </div>
              <div><b-button class="btn-save-next" v-if="isNextFirst" @click="nextSetting">Next</b-button></div>
            </div>
            <div class="form-group">
              <p :class="{ 'd-block': msgError!='' }" class="invalid-feedback">
                {{ $t(msgError) }}
              </p>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { organizationStore } from '~/store/index';
import { ORGANIZATIONEMAILSETTING } from '~/utils/common-const';

@Component({
})
export default class extends Vue {
  email           : string = ''
  password        : string = ''
  passwordConfirm : string = ''
  emailTest       : string = '';
  msgError        : string = ''
  msgResSuccess   : string = ''
  leaveMonth      : number = this.takeExpirationMonth
  isCanEdit       : boolean = false
  msgSettingLeaveSuccess: string = ''

  mounted() {
    if (this.isNextFirst) {
      this.isCanEdit = true;
    }
  }

  get takeEmail() {
    const orgSetting = organizationStore.takeOrganizationSetting;
    return orgSetting ? orgSetting.email : '';
  }

  get takePassword() {
    const orgSetting = organizationStore.takeOrganizationSetting;
    return orgSetting ? orgSetting.password : '';
  }

  get takeExpirationMonth() {
    const orgSetting = organizationStore.takeOrganizationSetting;
    return orgSetting && orgSetting.expiration_reset_day_off ? orgSetting.expiration_reset_day_off : 12;
  }

  get isNextFirst() {
    return this.$auth.user.setting_step > ORGANIZATIONEMAILSETTING;
  }

  async handleEditOrgEmail() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msg = (this.$t('Do you want to save this organization email?') as string);
      this.showModalConfirm(msg, this.editOrgEmail);
    }
  }

  async onChangeSelect() {
    try {
      this.isCanEdit = true;
      const res = await organizationStore.editExpirationResetDayOff(this.leaveMonth);
      this.msgSettingLeaveSuccess = res.message;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      setTimeout(() => {
        this.msgSettingLeaveSuccess = '';
      }, 3000);
    }
  }

  nextSetting() {
    if (!this.takeEmail || !this.takePassword) {
      this.msgError = this.$t('Please enter email and password') as string;
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    } else {
      this.$router.push('/settings/branch');
    }
  }

  async editOrgEmail() {
    try {
      this.$nuxt.$loading.start();
      if (this.emailTest !== '') {
        const res = await organizationStore.editOrganizationEmail({
          email: this.email,
          password: this.password,
          email_test: this.emailTest
        });
        if (res) {
          const msgResSuccess = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgResSuccess);

          await this.$auth.fetchUser();
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
    });
  }
}
</script>
<style scoped>
ul:nth-of-type(1) {
  list-style-type: disc;
}
</style>
