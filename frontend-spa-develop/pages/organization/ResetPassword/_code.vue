<template>
  <div class="row">
    <div class="container pb-5">
      <div class="col-md-6 offset-md-3">
        <div class="card-register card mt-4">
          <div class="card-header">
            <h4 class="card-title text-dark">{{ $t("Reset password") }}</h4>
          </div>
          <div class="card-body">
            <p class="text-danger">{{ $t(responseMessage) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { userStore } from '~/store/index';
import { ResetPasswordParams } from '~/types/user';

@Component({
  auth: 'guest'
})

export default class extends Vue {
    responseMessage: string = ''

    created() {
      if (this.$route.params.code === '') {
        this.$router.push('/');
        return;
      }
      this.checkCode();
    }

    async checkCode() {
      try {
        const res = await userStore.checkResetCode(this.$route.params.code);
        if (res.user_id !== 0) {
          const resetPasswordParams : ResetPasswordParams = {
            user_id             : res.user_id,
            organization_id     : res.organization_id,
            email               : res.email,
            reset_password_code : res.reset_password_code,
            password            : ''
          };
          userStore.saveResetPasswordParams(resetPasswordParams);
          this.$router.push('/organization/ResetPassword');
          return;
        }
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.responseMessage = err.response.data.message;
        } else {
          this.responseMessage = err;
        }
      }
    }
};
</script>
