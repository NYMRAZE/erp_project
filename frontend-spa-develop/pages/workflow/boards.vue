<template>
  <div>
    <Boards />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { layoutAdminStore, projectStore } from '../../store';
import Boards from '~/components/Board/Boards.vue';

@Component({
  components: {
    Boards
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  beforeCreate() {
    layoutAdminStore.addClassBgMainContent('bg-brown');
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    // reset background layout
    projectStore.setProjectTable([]);
    layoutAdminStore.addClassBgMainContent('');
    next();
  }
};
</script>
