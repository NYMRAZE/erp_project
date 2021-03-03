<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-introduce class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-id-badge"></i>
        <span>{{ $t("Introduce myself") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-introduce">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyIntroduce()">
        <div class="card-body">
          <div class="form-row">
            <div class="form-group col-lg-12 col-xl-8">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:10"
                name="Description myself">
                <p class="text-dark font-weight-bold">{{ $t("Description") }}</p>
                <textarea
                  v-model="introduceText"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && errors[0] }"
                  rows="6">
                </textarea>
                <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditIntroduce!='' }" class="invalid-feedback">
            {{ $t(errorEditIntroduce) }}
          </p>
          <div>
            <button
              type="submit"
              class="btn btn-success">
              <i class="fa fa-save"></i> {{ $t("Save") }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { userProfileStore } from '~/store/index';

@Component({
  components: {
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  introduceText : string = this.userProfile ? this.userProfile.introduce : '';
  submitted : boolean = false;
  errorEditIntroduce : string = '';
  msgSuccessEditIntroduce : string = '';

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  async handleModifyIntroduce() {
    this.submitted = true;
    this.msgSuccessEditIntroduce = '';
    this.errorEditIntroduce = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msgModalConfirm = this.$t('Are you sure to edit introduce?');
      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveIntroduce();
      });
    }
  }

  async saveIntroduce() {
    this.$nuxt.$loading.start();

    try {
      userProfileStore.editIntroduce(this.introduceText);
      const res = await userProfileStore.updateProfile();
      const msgSuccessEditIntroduce = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditIntroduce);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditIntroduce = err.response.data.message;
      } else {
        this.errorEditIntroduce = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.introduceText = this.userProfile ? this.userProfile.introduce : '';
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditIntroduce = err.response.data.message;
      } else {
        this.errorEditIntroduce = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
