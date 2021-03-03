<template>
  <div>
    <h3
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ title }}
    </h3>
    <NavBar :page="'create-leave'" />
    <CreateLeaveRequest v-if="listLeaveRequestType && userProfileInfo" :is-create="true" />
    <b-alert class="mt-4" :show="showResponseMessage" variant="danger">{{ responseMessage }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { dayleaveStore, layoutAdminStore, userProfileStore } from '../../store';
import CreateLeaveRequest from '~/components/CreateLeaveRequest/index.vue';
import NavBar from '~/components/HistoryUserLeave/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    CreateLeaveRequest
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  currentYear: number = new Date().getFullYear()
  userID: number | null = null
  responseMessage: string = ''
  defaultError : string = '';
  title : string = '';

  mounted() {
    this.userID = this.$auth.user.id && this.$auth.user.id;
    this.defaultError = this.$t('System have problem. Please try again') as string;
    this.$nextTick(() => {
      if (this.userID) {
        this.getInfo(this.userID);
      }
    });
    this.title = this.$t('Manage member leave') as string;
    layoutAdminStore.setTitlePage(this.title);
  }

  async getInfo(userID: number) {
    this.$nuxt.$loading.start();
    try {
      await userProfileStore.getUserProfileInfo(userID);
      await dayleaveStore.getLeaveInfo({ user_id: userID, year: this.currentYear });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message ? err.response.data.message : this.defaultError;
      } else {
        this.responseMessage = err.message ? err.message : this.defaultError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  get showResponseMessage() {
    return !!this.responseMessage;
  }

  get listLeaveRequestType() {
    return dayleaveStore.listLeaveRequestType;
  }

  get userProfileInfo() {
    return userProfileStore.userProfileInfo;
  }
};
</script>
