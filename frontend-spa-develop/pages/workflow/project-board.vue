<template>
  <Tasks :key="takeID" />
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { layoutAdminStore } from '../../store';
import Tasks from '~/components/Board/Tasks.vue';

@Component({
  components: {
    Tasks
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  id: string | null = null

  beforeMoute() {
    const query = this.$route.query;
    if (query.task_id) {
      this.id = query.task_id.toString();
    }
  }

  beforeRouteUpdate (to: any, from: any, next: any) {
    const fullPath = this.$nuxt.$route.fullPath;
    if (fullPath !== to.fullPath && to.query.task_id) {
      this.id = to.query.task_id;
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
