<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">{{ $t("Reset password") }}</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Please input your password") }}
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:8|max:35"
                name="password"
                vid="password">
                <label for="password" class="font-weight-bold">{{ $t("New password") }}:</label>
                <input
                  id="password"
                  ref="password"
                  v-model.trim="resetPasswordForm.password"
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="password">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|confirmed:password"
                :name="$t('Repeat password')">
                <label for="repeat-password" class="font-weight-bold">{{ $t("Repeat password") }}:</label>
                <input
                  id="repeat-password"
                  v-model.trim="repeat_password"
                  name="repeat-password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="Repeat password">
                <p v-if="submitted && errors[0]" class="invalid-feedback">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p
                v-if="registerStatus"
                class="text-success">
                Organization register successfull.
              </p>
              <p
                v-else
                class="text-danger">
                {{ $t(registerResult) }}
              </p>
              <input id="btn-confirm-email" type="submit" value="Confirm" class="btn btn-card-organization">
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { userStore, organizationStore } from '~/store/index';
import { ResetPasswordParams } from '~/types/user';
import { Organization } from '~/types/organization';

@Component({})
export default class ResetPassword extends Vue {
  registerResult : string = ''
  registerStatus : string = ''
  repeat_password : string = ''
  resetPasswordForm: ResetPasswordParams = {
    user_id: userStore.resetPasswordParamsObj.user_id,
    organization_id: userStore.resetPasswordParamsObj.organization_id,
    email: userStore.resetPasswordParamsObj.email,
    reset_password_code: userStore.resetPasswordParamsObj.reset_password_code,
    password: ''
  }
  submitted: boolean = false
  responseMessage: string = ''

  handleSubmit() {
    this.resetPassword();
  }

  async resetPassword() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        const res = await userStore.resetPassword(this.resetPasswordForm);
        if (res.user_id !== 0) {
          const organizationObj : Organization = {
            id:   res.organization_id,
            name: res.organization_name,
            tag:  res.organization_tag
          };
          organizationStore.saveOrganization(organizationObj);
          userStore.clearResetPasswordParams();
          this.$router.push('/organization/ResetPassword');
        }
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
  }
};
</script>
