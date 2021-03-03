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
      <div class="col-12 padding-sm-x">
        <Settings v-if="!isSettingComplete" :progress="'14.28%'" :is-active-setting-email="true" />
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
        <OrgEmail v-if="organizationSetting" />
        <p v-if="msgError" class="invalid-feedback d-block">{{ $t(msgError) }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import OrgEmail from '~/components/Settings/OrgEmail/index.vue';
import Settings from '~/components/Settings/index.vue';
import { organizationStore, layoutAdminStore } from '~/store/index';
import { FINISHSETTING } from '~/utils/common-const';

@Component({
  components: {
    OrgEmail,
    Settings
  },
  middleware: ['auth', 'GeneralManager'],
  layout: 'Admin'
})
export default class extends Vue {
  title : string = '';
  topIcon : string = '';
  msgError: string = ''
  isSettingComplete: boolean = false

  mounted() {
    const $this = this;
    this.isSettingComplete = this.$auth.user.setting_step === FINISHSETTING;

    setTimeout(async () => {
      await $this.getOrganizationEmail();
      if (this.organizationSetting && !this.organizationSetting.expiration_reset_day_off) {
        await organizationStore.editExpirationResetDayOff(12);
      }
    }, 100);
    this.title = this.$t('Settings') as string;
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fas fa-project-diagram';
    layoutAdminStore.setIconTopPage(this.topIcon);
  }

  handleUserPermission() {
    this.$router.push('/settings/user-permission');
  }

  async getOrganizationEmail() {
    try {
      await organizationStore.getOrganizationSetting();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    }
  }

  get organizationSetting() {
    return organizationStore.takeOrganizationSetting;
  }
};
</script>
