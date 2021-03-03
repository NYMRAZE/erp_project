<template>
  <div class="container pb-5">
    <ForgotPassword />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import ForgotPassword from '~/components/ForgotPassword/index.vue';

@Component({
  components: {
    ForgotPassword
  },
  auth: 'guest',
  middleware: ['FoundOrganization']
})
export default class extends Vue {
}
</script>
