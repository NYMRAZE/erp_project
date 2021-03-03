<template>
  <ManageOT :key="takeID" />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageOT from '~/components/ManageOT/index.vue';

@Component({
  components: {
    ManageOT
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  id: number | null = null

  beforeRouteUpdate (to: any, from: any, next: any) {
    const fullPath = this.$nuxt.$route.fullPath;
    if (fullPath !== to.fullPath) {
      this.id = to.query.id;
    }
    next();
  }

  get takeID() {
    return this.id;
  }
};
</script>
