<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ $t("User registration") }}:
          </h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Please input your information") }}.
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" rules="required|email" :name="$t('Email')">
                <label for="email" class="font-weight-bold">
                  {{ $t("Email") }}:
                </label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  name="email"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="name@example.com"
                  readonly>
                <p v-if="submitted && errors[0]" class="invalid-feedback">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('First name')">
                <label for="first-name" class="font-weight-bold">
                  {{ $t("First name") }}:
                </label>
                <input
                  id="first-name"
                  v-model.trim="form.first_name"
                  name="first_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('First name')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" rules="required" :name="$t('Last name')">
                <label for="last-name" class="font-weight-bold">
                  {{ $t("Last name") }}:
                </label>
                <input
                  id="last-name"
                  v-model.trim="form.last_name"
                  name="last_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Last name')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:8|max:35"
                name="password"
                vid="password">
                <label for="password" class="font-weight-bold">
                  {{ $t("Password") }}:
                </label>
                <input
                  id="password"
                  ref="password"
                  v-model.trim="form.password"
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Password')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|confirmed:password"
                :name="$t('Repeat password')">
                <label for="repeat-password" class="font-weight-bold">
                  {{ $t("Repeat password") }}:
                </label>
                <input
                  id="repeat-password"
                  v-model.trim="form.repeat_password"
                  name="repeat_password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Repeat password')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p
                v-if="registerStatus"
                class="text-success">
                {{ $t("Your registration was successful.") }}
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
import { registrationStore, organizationStore } from '~/store/index';
import { OrganizationRegister } from '~/types/registration';
import { Organization } from '~/types/organization';

@Component({
})
export default class RegisterUser extends Vue {
  form: any = {
    email: registrationStore.emailRegister,
    first_name: '',
    last_name: '',
    password: '',
    repeat_password:''
  };
  registerStatus: boolean = false
  registerResult: string = ''
  submitted: boolean = false

  handleSubmit() {
    this.registerOrganization();
  }

  async registerOrganization() {
    this.submitted = true;
    const objOrg = registrationStore.organizationObj;

    const organizationRegister : OrganizationRegister = {
      organization_name  : objOrg.organization_name,
      organization_tag   : objOrg.organization_tag,
      email              : objOrg.email,
      code               : objOrg.code,
      request_id         : objOrg.request_id,
      first_name         : '',
      last_name          : '',
      password           : ''
    };

    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        organizationRegister.first_name = this.form.first_name;
        organizationRegister.last_name = this.form.last_name;
        organizationRegister.password = this.form.password;
        const res = await registrationStore.registerOrganization(organizationRegister);
        this.registerStatus = true;
        const organizationObj : Organization = {
          id:   res.id,
          name: res.name,
          tag:  res.tag
        };

        organizationStore.saveOrganization(organizationObj);
        setTimeout(() => this.$router.push('/user/login'), 2000);
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.registerResult = err.response.data.message;
        } else {
          this.registerResult = err;
        }
      } finally {
        this.$nuxt.$loading.finish();
      }
    }
  }
};
</script>
