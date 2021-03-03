<template>
  <div id="container-change-email" class="filter-area_no_bg mt-4">
    <ValidationObserver
      ref="observer"
      v-slot="{}"
      tag="form"
      @submit.prevent="handleChangeEmail()">
      <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 small-recruitment">
        <h5 class="text-dark font-weight-bold">{{ $t("Change email") }}</h5>
        <div class="mt-4">
          <ValidationProvider
            v-slot="{ errors }"
            rules="email|required"
            :name="$t('Email')"
            class="form-group"
            tag="div">
            <label class="text-dark font-weight-bold" for="email-change">
              {{ $t("Email") }}
            </label>
            <input
              id="email-change"
              v-model.trim="emailChange"
              class="form-control"
              :class="{ 'is-invalid': submitted && errors[0] }"
              type="text">
            <p v-if="submitted && errors[0]" class="invalid-feedback mb-0">{{ errors[0] }}</p>
            <p :class="{ 'd-block': changeEmailError!='' }" class="invalid-feedback mb-0">
              {{ $t(changeEmailError) }}
            </p>
          </ValidationProvider>
          <button
            type="submit"
            class="btn btn-primary2"
            style="width:180px;">
            <i class="fa fa-envelope"></i>
            {{ $t("Change email") }}
          </button>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import { layoutAdminStore, userStore } from '~/store/';

@Component({
})
export default class extends Vue {
  @Prop() page ?: string
  title : string = '';
  topIcon : string = '';
  emailChange: string = '';
  submitted: boolean = false;
  changeEmailError: string = '';
  msgSuccessChangeMail: string = '';
  mounted() {
    this.title = this.$t('Edit account') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-user-cog';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }
  async handleChangeEmail() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();
    const $this = this;

    if (isValid) {
      const msgModalConfirm = (this.$t('Do you want to change email to <b>{0}</b>?', { 0: this.emailChange })) as string;

      this.showModalConfirm(msgModalConfirm, function() {
        $this.changeEmail();
      });
    }
  }

  async changeEmail() {
    this.$nuxt.$loading.start();

    try {
      const res = await userStore.requestChangeEmail(this.emailChange);
      this.changeEmailError = '';
      const msgSuccessChangeMail = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessChangeMail);
    } catch (err) {
      this.msgSuccessChangeMail = '';
      if (typeof err.response !== 'undefined') {
        this.changeEmailError = err.response.data.message;
      } else {
        this.changeEmailError = err.message;
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
      title           : 'Please Confirm',
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'YES',
      cancelTitle     : 'NO',
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
