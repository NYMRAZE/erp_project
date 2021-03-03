<template>
  <div class="container pb-5">
    <ChangeEmail v-show="changeEmailParams.user_id !== 0"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ChangeEmail from '~/components/ChangeEmail/index.vue';
import { userStore } from '~/store/index';

@Component({
  components: { ChangeEmail },
  auth: 'guest'
})
export default class extends Vue {
  get changeEmailParams() {
    return userStore.changeEmailObj;
  }
};
</script>
