<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">{{ $t("Forgot password") }}</h4>
        </div>
        <div v-if="!checkForgotPassSuccess" id="forgot-password-body" class="card-body">
          <p class="card-text">
            {{ $t("Please input your email") }}
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|email"
                :name="$t('email')">
                <label for="email" class="font-weight-bold">{{ $t("Email") }}:</label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  name="email"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="name@example.com">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p class="text-danger">{{ $t(forgotPasswordError) }}</p>
              <input
                id="btn-confirm-email"
                type="submit"
                :value="$t('Confirm')"
                class="btn btn-card-organization">
            </div>
          </ValidationObserver>
        </div>
        <div v-if="checkForgotPassSuccess" id="message-body" class="card-body">
          <h4 class="card-title text-dark">
            {{ $t("Check your email") }}
          </h4>
          <p class="card-text">
            {{ $t("Recover password email was sent. Please check your email or spam") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { userStore, organizationStore } from '~/store/';
import { ForgotPasswordParam } from '~/types/user';

@Component({
})
export default class extends Vue {
  form: ForgotPasswordParam = {
    // organization_id already check in middleware FindOrganization
    organization_id : organizationStore.idOrganization,
    email           : ''
  }
  submitted: boolean = false
  forgotPasswordError: string = ''
  checkForgotPassSuccess: boolean = false

  async handleSubmit() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.forgotPassword();
    }
  }

  async forgotPassword() {
    this.$nuxt.$loading.start();

    try {
      await userStore.forgotPassword(this.form);
      this.checkForgotPassSuccess =  true;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.forgotPasswordError = err.response.data.message;
      } else {
        this.forgotPasswordError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
