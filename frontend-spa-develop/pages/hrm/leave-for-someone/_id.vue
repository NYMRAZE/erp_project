<template>
  <div>
    <CreateLeaveRequest v-if="listLeaveRequestType && userProfileInfo" />
    <b-alert class="mt-4" :show="showResponseMessage" variant="danger">{{ responseMessage }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { dayleaveStore, userProfileStore } from '../../../store';
import CreateLeaveRequest from '~/components/CreateLeaveRequest/index.vue';

@Component({
  components: {
    CreateLeaveRequest
  },
  middleware: ['auth', 'finishSetting', 'ManageMemberRole', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  currentYear: number = new Date().getFullYear()
  userID: number | null = null
  responseMessage: string = ''
  defaultError : string = '';

  mounted() {
    this.defaultError = this.$t('System have problem. Please try again') as string;
    if (this.$route.params.id) {
      this.userID = parseInt(this.$route.params.id);
    }

    this.$nextTick(() => {
      if (this.userID) {
        this.getInfo(this.userID);
      }
    });
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
    if (this.responseMessage) {
      return true;
    }

    return false;
  }

  get listLeaveRequestType() {
    return dayleaveStore.listLeaveRequestType;
  }

  get userProfileInfo() {
    return userProfileStore.userProfileInfo;
  }
};
</script>
