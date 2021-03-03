<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ $t('Register') }}
          </h4>
          <p class="card-text">
            {{ $t('Send to admin request to join organization') }}
          </p>
        </div>
        <div class="card-body">
          <ValidationObserver ref="observer" v-slot="{  }" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|email"
                :name="$t('Email')">
                <label for="email" class="font-weight-bold">{{ $t('Email') }}</label>
                <input
                  id="email"
                  v-model.trim="userRequest.email"
                  name="email"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Email')">
                <p
                  v-if="submitted && errors[0]"
                  class="invalid-feedback">
                  {{ errors[0] }}
                </p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|max:300"
                :name="$t('Message')">
                <label for="message" class="font-weight-bold">{{ $t('Message') }}</label>
                <textarea
                  id="message"
                  v-model.trim="userRequest.message"
                  name="message"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  rows="6"
                  no-resize
                  :placeholder="$t('Message')">
                  </textarea>
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p class="text-success">{{ $t(successMessage) }}</p>
              <p class="text-danger">{{ $t(responseMessage) }}</p>
              <input
                id="btn-confirm-email"
                type="submit"
                :value="$t('Send request')"
                class="btn btn-card-organization">
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
import { UserRequest } from '~/types/registration';

@Component({})
export default class CreateOrganization extends Vue {
  userRequest: UserRequest = {
    email: '',
    organizationID: organizationStore.idOrganization,
    message: ''
  }
  submitted: boolean = false
  successMessage: string = ''
  responseMessage: string = ''

  handleSubmit() {
    this.sendRequest();
  }

  async sendRequest() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        const res = await registrationStore.sendRequest(this.userRequest);
        this.responseMessage = '';
        this.successMessage = res.message;
        setTimeout(() => this.$router.push('/'), 3000);
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
