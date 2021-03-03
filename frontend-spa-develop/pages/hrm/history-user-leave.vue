<template>
  <div>
    <h3
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ title }}
    </h3>
    <NavBar :page="'history-leave'" />
    <HistoryUserLeave :key="takeID" class="mt-4" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { layoutAdminStore, notificationStore } from '~/store/index';
import HistoryUserLeave from '~/components/HistoryUserLeave/index.vue';
import NavBar from '~/components/HistoryUserLeave/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    HistoryUserLeave
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  id: number | null = null;
  title : string = '';
  topIcon : string = '';

  beforeRouteUpdate (to: any, from: any, next: any) {
    const fullPath = this.$nuxt.$route.fullPath;
    if (fullPath !== to.fullPath && notificationStore.takeIsNavigateNoti) {
      this.id = to.query.id;
    } else if (!this.$nuxt.$route.query.id) {
      this.id = null;
    }
    next();
  }

  mounted() {
    this.title = this.$t('Manage member leave') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fa fa-users';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  get takeID() {
    return this.id;
  }
};
</script>
