<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">{{ $t('Find organization') }}</h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t('Please input the tag of organization') }}.
          </p>
          <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleSubmit()">
            <div class="form-group">
              <ValidationProvider v-slot="{ errors }" rules="required|alpha_num" :name="$t('Tag')">
                <label for="tag" class="font-weight-bold">{{ $t('Tag') }}:</label>
                <input
                  id="tag"
                  v-model.trim="tag"
                  name="tag"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  placeholder="Tag">
                <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
              </ValidationProvider>
            </div>
            <div class="form-group">
              <p :class="{ 'd-block': loginError!='' }" class="invalid-feedback">{{ $t(loginError) }}</p>
            </div>
            <div class="form-group">
              <input id="btn-confirm-email" type="submit" :value="$t('Confirm')" class="btn btn-card-organization">
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { organizationStore, layoutAdminStore } from '~/store/';

@Component({})
export default class CreateOrganization extends Vue {
  @Prop() page ?: string
  title : string = '';
  topIcon : string = '';
  tag         : string =''
  submitted   : boolean = false
  loginError  : string = ''
  mounted() {
    this.title = this.$t('') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = '';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  async handleSubmit() {
    this.submitted = true;
    const isValid = await (this.$refs.observer as any).validate();

    if (isValid) {
      this.confirmOrganization();
    }
  }

  async confirmOrganization() {
    this.$nuxt.$loading.start();

    try {
      await organizationStore.findOrganization(this.tag);
      return this.$router.push('/user/login');
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.loginError = err.response.data.message;
      } else {
        this.loginError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
