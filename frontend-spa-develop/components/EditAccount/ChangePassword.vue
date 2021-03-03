<template>
  <div id="container-change-password" class="filter-area_no_bg mt-4">
    <ValidationObserver
      ref="observer"
      v-slot="{}"
      tag="form"
      @submit.prevent="handleChangePassword()">
      <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 small-recruitment">
        <h5 class="text-dark font-weight-bold">
          {{ $t("Change password") }}
        </h5>
        <div class="mt-4">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|min:8|max:35"
            :name="$t('Current password')"
            class="form-group"
            tag="div">
            <label class="text-dark font-weight-bold" for="current-password">
              {{ $t("Current password") }}
            </label>
            <input
              id="current-password"
              v-model.trim="changePasswordParams.current_password"
              autocomplete="false"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors[0] }">
            <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|min:8|max:35"
            name="new-password"
            class="form-group"
            tag="div"
            vid="new-password">
            <label class="text-dark font-weight-bold" for="new-password">{{ $t("New password") }}</label>
            <input
              id="new-password"
              ref="new-password"
              v-model.trim="changePasswordParams.new_password"
              :name="$t('New password')"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors[0] }">
            <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors }"
            rules="required|confirmed:new-password"
            name="repeat new password"
            class="form-group"
            tag="div">
            <label class="text-dark font-weight-bold" for="repeat-new-password">
              {{ $t("Repeat new password") }}
            </label>
            <input
              id="repeat-new-password"
              v-model.trim="changePasswordParams.repeat_new_password"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors[0] }">
            <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <div class="form-group">
            <p :class="{ 'd-block': changePassError!='' }" class="invalid-feedback">
              {{ $t(changePassError) }}
            </p>
          </div>
          <div class="form-group">
            <button
              type="submit"
              class="btn btn-primary2"
              style="width:180px;">
              <i class="fa fa-unlock"></i>
              {{ $t("Change password") }}
            </button>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { userStore } from '~/store/';
import { ChangePasswordParams } from '~/types/user';

@Component({
})
export default class extends Vue {
  changePasswordParams: ChangePasswordParams = {
    current_password: '',
    new_password: '',
    repeat_new_password: ''
  }

  submitted: boolean = false;
  changePassError: string = '';
  msgSuccessChangePass: string = '';

  async handleChangePassword() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    const $this = this;

    if (isValid) {
      const msgModalConfirm = this.$t('Do you want to change password?');

      this.showModalConfirm((msgModalConfirm as string), function() {
        $this.changePassword();
      });
    }
  }

  async changePassword() {
    this.$nuxt.$loading.start();

    try {
      const res = await userStore.changePassword(this.changePasswordParams);
      const msgSuccessChangePass = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessChangePass);
      this.submitted = false;
      this.changePasswordParams.current_password = '';
      this.changePasswordParams.new_password = '';
      this.changePasswordParams.repeat_new_password = '';
      this.changePassError = '';
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.changePassError = err.response.data.message;
      } else {
        this.changePassError = err.message;
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
