<template>
  <div>
    <NavBar :page="'bonus-leave'" />
    <BonusLeaveHistory />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { layoutAdminStore } from '../../store';
import BonusLeaveHistory from '~/components/BonusLeaveHistory/index.vue';
import NavBar from '~/components/HistoryUserLeave/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    BonusLeaveHistory
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
    layoutAdminStore.addClassBgMainContent('');
    next();
  }
};
</script>
