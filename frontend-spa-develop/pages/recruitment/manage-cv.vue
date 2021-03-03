<template>
  <ManageCV :key="takeID" />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageCV from '~/components/ManageCV/index.vue';
import { layoutAdminStore } from '~/store';

@Component({
  components: {
    ManageCV
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  id: number | null = null

  beforeRouteUpdate (to: any, from: any, next: any) {
    const fullPath = this.$nuxt.$route.fullPath;
    if (fullPath !== to.fullPath && (to.query.comment_id || to.query.cv_id)) {
      this.id = to.query.comment_id ? to.query.comment_id : to.query.cv_id;
    } else {
      this.id = null;
    }
    next();
  }

  get takeID() {
    return this.id;
  }

  beforeCreate() {
    layoutAdminStore.addClassBgMainContent('bg-brown');
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    // reset background layout
    layoutAdminStore.addClassBgMainContent('');
    next();
  }
};
</script>
