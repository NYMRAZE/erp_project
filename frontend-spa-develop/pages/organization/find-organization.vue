<template>
  <div class="container pb-5">
    <FindOrganization />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import FindOrganization from '~/components/FindOrganization/index.vue';
import { organizationStore } from '~/store/';

@Component({
  components: { FindOrganization },
  auth: 'guest'
})
export default class extends Vue {
  created() {
    // when redirect to page FindOrganization remove Organization (Vuex)
    organizationStore.resetOrganization();
  }
};
</script>
