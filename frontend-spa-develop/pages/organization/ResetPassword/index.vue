<template>
  <div class="container pb-5">
    <ResetPasswordForm v-show="resetPasswordObj.user_id !== 0" />
    <ResetSuccessful v-show="resetPasswordObj.user_id === 0" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ResetPasswordForm from '~/components/ResetPassword/ResetPasswordForm.vue';
import ResetSuccessful from '~/components/ResetPassword/ResetSuccessful.vue';
import { userStore } from '~/store/index';

@Component({
  components: { ResetPasswordForm, ResetSuccessful },
  auth: 'guest'
  // middleware : ['FoundResetPasswordCode']
})
export default class extends Vue {
  get resetPasswordObj() {
    return userStore.resetPasswordParamsObj;
  }
};
</script>
