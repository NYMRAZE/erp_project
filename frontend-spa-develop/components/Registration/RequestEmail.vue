<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ $t("Confirmation email") }}
          </h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("To create a new organization. Please input your email") }}:
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" rules="required|email" name="email">
                <label for="email" class="font-weight-bold">
                  {{ $t("Email") }}
                </label>
                <input
                  id="email"
                  v-model.trim="registrationSubmit.email"
                  name="email"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="name@example.com">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p class="text-danger">{{ sendMailError }}</p>
              <button
                type="submit"
                class="btn btn-success btn-block text-uppercase">
                {{ $t("Confirm") }}
              </button>
            </div>
          </ValidationObserver>
          <hr class="my-4">
          <div class="form-group">
            <a class="text-decoration-none" :href="domainAPI">
              <button
                type="button"
                class="btn btn-google btn-block text-uppercase">
                <i class="fab fa-google mr-2"></i> {{ $t("Create organization with Google") }}
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- modal show error register with social (google) -->
    <b-modal
      v-model="handleLoginSocialError"
      title="Alert"
      ok-only
      header-bg-variant="danger"
      header-text-variant="light"
      @ok="handleOkModalError">
      {{ msgSocialError }}
    </b-modal>
    <!-- End modal show error register with social (google) -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { registrationStore } from '~/store/index';
import { RegistrationSubmit } from '~/types/registration';

@Component({
})
export default class RequestEmail extends Vue {
  registrationSubmit: RegistrationSubmit = {
    email: '',
    status: '',
    message: ''
  }
  submitted: boolean = false
  sendMailError: string = ''
  msgSocialError : string = '';

  mounted() {
    const typeLogin = this.$route.query.type;
    if (typeLogin === 'social') {
      const regCode = this.$route.query.reg_code;
      if (regCode && regCode !== '') {
        this.$router.push('/organization/create-organization/' + regCode);
      } else {
        this.msgSocialError = this.$route.query.error_message as string;
      }
    }
  }

  get domainAPI() {
    return this.$axios.defaults.baseURL + '/registration/register-org-google';
  }

  // show modal error
  get handleLoginSocialError() {
    if (this.msgSocialError === '') {
      return false;
    }

    return true;
  }

  handleSubmit() {
    this.sendEmail();
  }

  async sendEmail() {
    this.submitted = true;

    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        await registrationStore.sendMail(this.registrationSubmit.email);
        this.$router.push('/organization/registration');
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.sendMailError = err.response.data.message;
        } else {
          this.sendMailError = err;
        }
      } finally {
        this.$nuxt.$loading.finish();
      }
    }
  }

  // action button OK in modal error
  handleOkModalError() {
    this.msgSocialError = '';
  }
};
</script>
