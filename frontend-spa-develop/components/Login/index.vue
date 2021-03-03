<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ titleLogin }}
          </h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Please input your information") }}.
          </p>
          <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|email"
                :name="$t('Email')">
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
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                :name="$t('Password')">
                <label for="password" class="font-weight-bold">{{ $t('Password') }}:</label>
                <input
                  id="password"
                  ref="password"
                  v-model.trim="form.password"
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :laceholder="$t('Password')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p :class="{ 'd-block': loginError!='' }" class="invalid-feedback">{{ $t(loginError) }}</p>
            </div>
            <div class="form-group">
              <button
                class="btn btn-primary btn-block text-uppercase"
                type="submit"
                :disabled="invalid">
                {{ $t('Sign in') }}
              </button>
            </div>
            <hr class="my-4">
            <div class="form-group">
              <a class="text-decoration-none" :href="domainAPI">
                <button type="button" class="btn btn-google btn-block text-uppercase">
                  <i class="fab fa-google mr-2"></i> {{ $t('Login with Google') }}
                </button>
              </a>
            </div>
            <hr class="my-4">
            <div class="form-group">
              <button
                type="button"
                class="btn btn-card-register btn-block text-uppercase"
                @click="$router.push('/user/user-request')">
                {{ $t('Register to this organization') }}
              </button>
            </div>
            <div class="form-group">
              <button
                type="button"
                class="btn btn-forgot-password btn-block text-uppercase"
                @click="$router.push('/user/forgot-password')">
                {{ $t('Forgot password') }}
              </button>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
    <!-- modal show error login with social (google) -->
    <b-modal
      v-model="handleLoginSocialError"
      title="Alert"
      ok-only
      header-bg-variant="danger"
      header-text-variant="light"
      @ok="handleOkModalError">
      {{ msgSocialError }}
    </b-modal>
    <!-- End modal show error login with social (google) -->
  </div>
</template>

<script lang='ts'>
import * as querystring from 'querystring';
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { LoginForm } from '~/types/user';
import { organizationStore, layoutAdminStore } from '~/store/';

@Component({
})
export default class Login extends Vue {
  form: LoginForm = {
    // organization_id already check in middleware FindOrganization
    organization_id   : organizationStore.idOrganization,
    email             : '',
    password          : '',
    organization_name : organizationStore.organizationName
  }

  loginError: string = ''
  @Prop() page ?: string
  title : string = '';
  topIcon : string = '';
  submitted: boolean = false
  msgSocialError : string = '';
  async mounted() {
    this.title = this.$t('') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = '';
    layoutAdminStore.setIconTopPage(this.topIcon);
    const typeLogin = this.$route.query.type;
    if (typeLogin === 'social') {
      const token = this.$route.query.token;
      if (token && token !== '') {
        this.$auth.setToken('local', 'Bearer ' + token);
        this.$auth.setRefreshToken('local', token);
        this.$axios.setHeader('Authorization', 'Bearer ' + token);
        this.$auth.ctx.app.$axios.setHeader('Authorization', 'Bearer ' + token);

        try {
          await this.$axios.get('/api/user/getuser').then((resp) => {
            this.$auth.setUser(resp.data.data);
            location.href = '/home-admin';
          });
        } catch (err) {
          if (typeof err.response !== 'undefined') {
            this.msgSocialError = err.response.data.message;
          } else {
            this.msgSocialError = err;
          }
        } finally {
          this.$nuxt.$loading.finish();
        }
      } else {
        this.msgSocialError = this.$route.query.error_message as string;
      }
    }
  }

  get titleLogin() {
    return this.$t('Login to {0}', { 0: this.form.organization_name });
  }

  // show modal error
  get handleLoginSocialError() {
    return this.msgSocialError !== '';
  }

  get domainAPI() {
    return this.$axios.defaults.baseURL + '/auth/login-google?organization_id=' + this.form.organization_id;
  }

  async handleSubmit() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.login();
    }
  }

  async login() {
    this.$nuxt.$loading.start();

    try {
      await this.$auth.loginWith('local', ({
        data: querystring.stringify(this.form)
      }));

      return this.$router.push('/home-admin');
    } catch (e) {
      if (typeof e.response !== 'undefined') {
        this.loginError = e.response.data.message;
      } else {
        this.loginError = e;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  // action button OK in modal error
  handleOkModalError() {
    this.msgSocialError = '';
  }
}
</script>
