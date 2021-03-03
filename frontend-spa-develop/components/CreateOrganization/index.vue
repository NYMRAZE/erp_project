<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ $t("Create organization") }}
          </h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("What 's the name and tag of your organization?") }}
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required"
                :name="$t('Name organization')">
                <label for="organization" class="font-weight-bold">
                  {{ $t("Name organization") }}:
                </label>
                <input
                  id="organization"
                  v-model.trim="organizationRegister.organization_name"
                  :name="$t('Name organization')"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Name organization')">
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
                rules="required|alpha_num"
                :name="$t('Tag')">
                <label for="tag" class="font-weight-bold">
                  {{ $t("Tag") }}:
                </label>
                <input
                  id="tag"
                  v-model.trim="organizationRegister.organization_tag"
                  :name="$t('Tag')"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  :placeholder="$t('Tag')">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p class="text-danger">
                {{ $t(responseMessage) }}
              </p>
              <input id="btn-confirm-email" type="submit" :value="$t('Confirm')" class="btn btn-card-organization">
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { registrationStore } from '~/store/index';
import { OrganizationRegister } from '~/types/registration';

@Component({})
export default class CreateOrganization extends Vue {
  organizationRegister: OrganizationRegister = {
    organization_name   : '',
    organization_tag    : '',
    email               : '',
    code                : '',
    request_id          : 0,
    first_name          : '',
    last_name           : '',
    password            : ''
  }
  submitted: boolean = false
  responseMessage: string = ''

  handleSubmit() {
    this.checkOrganization();
  }

  async checkOrganization() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    if (isValid) {
      this.$nuxt.$loading.start();
      try {
        await registrationStore.checkOrganization(this.organizationRegister);
        this.$router.push('/user/register-user');
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
