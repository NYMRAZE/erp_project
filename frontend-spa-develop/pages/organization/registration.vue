<template>
  <div class="container pb-5">
    <RequestEmail v-show="emailConfirm === ''" />
    <MessageConfirmEmail v-show="emailConfirm !== ''" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import RequestEmail from '~/components/Registration/RequestEmail.vue';
import MessageConfirmEmail from '~/components/Registration/MessageConfirmEmail.vue';
import { registrationStore } from '~/store/index';

@Component({
  components: {
    RequestEmail,
    MessageConfirmEmail
  },
  auth: 'guest'
})

export default class extends Vue {
  get emailConfirm() {
    return registrationStore.emailConfirm;
  }
  email: string = ''

  beforeRouteLeave (to: any, from: any, next: any) {
    registrationStore.saveEmail('');
    next();
  }
}
</script>
