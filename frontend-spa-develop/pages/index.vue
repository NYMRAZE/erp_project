<template>
  <div class="container pb-5">
    <GetStarted v-if="orgTag === ''" />
    <LoginTag v-if="orgTag !== ''" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { getOrganizationInUrl } from '~/utils/common-const.ts';
import LoginTag from '~/components/Home/LoginTag.vue';
import GetStarted from '~/components/Home/GetStarted.vue';

@Component({
  components: {
    GetStarted,
    LoginTag
  },
  auth: 'guest'
})
export default class extends Vue {
  orgTag: string = getOrganizationInUrl();
};
</script>
