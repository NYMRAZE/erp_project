<template>
  <div>
    <p :class="{ 'd-block': findOrnError!='' }" class="invalid-feedback">{{ findOrnError }}</p>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { organizationStore } from '~/store/';
import { getOrganizationInUrl } from '~/utils/common-const.ts';

@Component({})
export default class LoginTag extends Vue {
  findOrnError  : string = ''

  mounted() {
    const orgTag = getOrganizationInUrl();
    this.confirmOrganization(orgTag);
  }

  async confirmOrganization(orgTag) {
    try {
      await organizationStore.findOrganization(orgTag);
      return this.$router.push('/user/login');
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.findOrnError = err.response.data.message;
      } else {
        this.findOrnError = err.message;
      }
    } finally {
    }
  }
}
</script>
