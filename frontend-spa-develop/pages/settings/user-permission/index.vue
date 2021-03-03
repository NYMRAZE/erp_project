<template>
  <UserPermission />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import UserPermission from '~/components/UserPermission/index.vue';
import { layoutAdminStore } from '~/store';

@Component({
  components: {
    UserPermission
  },
  middleware: ['auth', 'finishSetting', 'GeneralManager'],
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
