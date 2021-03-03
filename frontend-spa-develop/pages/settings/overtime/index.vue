<template>
  <div>
    <div class="padding-sm-x mb-4">
      <b-button
          size="lg"
          variant="primary"
          class="btn btn-primary2 btn-link-profile mr-2 button_large_enabled">{{ $t("Basic setting") }}</b-button>
      <b-button
          @click.prevent="handleUserPermission"
          size="lg"
          class="btn btn-primary2 btn-link-profile button_large_disabled" style="margin-left: 1%;">{{ $t("Users & permissions") }}</b-button>
    </div>
    <div class="row justify-content-center padding-sm-x">
      <div class="col-12">
        <Settings
          v-if="!isSettingComplete"
          :param="'overtime'"
          :progress="'71.42%'"
          :is-active-setting-email="true"
          :is-active-setting-job="true"
          :is-active-setting-ot="true"
          :is-active-setting-technology="true"
          :is-active-setting-branch="true" />
        <Settings
          v-else
          :progress="'100%'"
          :is-active-setting-email="true"
          :is-active-setting-job="true"
          :is-active-setting-ot="true"
          :is-active-setting-holiday="true"
          :is-active-setting-technology="true"
          :is-active-setting-branch="true"
          :is-active-finish-setting="true" />
        <Overtime />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Overtime from '~/components/Settings/Overtime/index.vue';
import Settings from '~/components/Settings/index.vue';
import { layoutAdminStore } from '~/store/index';
import { FINISHSETTING } from '~/utils/common-const';

@Component({
  components: {
    Overtime,
    Settings
  },
  middleware: ['auth', 'overtimeSetting', 'GeneralManager'],
  layout: 'Admin'
})
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
  isSettingComplete: boolean = false

  mounted() {
    this.title = this.$t('Settings') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fas fa-project-diagram';
    layoutAdminStore.setIconTopPage(this.topIcon);
    this.isSettingComplete = this.$auth.user.setting_step === FINISHSETTING;
  }

  handleUserPermission() {
    this.$router.push('/settings/user-permission');
  }
};
</script>
