<template>
  <div>
    <div class="card mt-3">
      <div id="container-header" class="card-header">
        <h3 id="title-page" class="card-title text-dark">
          {{ $t("User profile") }}
        </h3>
      </div>
    </div>
    <ViewProfile v-if="userProfile" />
    <b-alert class="mt-4" :show="showResponseMessage" variant="danger">{{ responseMessage }}</b-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { layoutAdminStore, userProfileStore } from '~/store';
import ViewProfile from '~/components/ViewProfile/index.vue';

@Component({
  components: {
    ViewProfile
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})

export default class extends Vue {
  responseMessage: string = ''
  defaultProfileError : string = '';
  user_id : number = 0

  async beforeCreate() {
    layoutAdminStore.addClassBgMainContent('bg-brown');

    // get item rank, branch, language, level language
    await userProfileStore.getListItemProfile();
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    // reset background layout
    layoutAdminStore.addClassBgMainContent('');
    userProfileStore.resetUserProfile();
    next();
  }

  mounted() {
    this.defaultProfileError = this.$t('System have problem. Please try again') as string;
    if (this.$route.params.id) {
      this.user_id = parseInt(this.$route.params.id);
    } else {
      this.user_id = parseInt(this.$auth.user.id);
    }

    this.$nextTick(() => {
      this.getProfile();
    });
  }

  get userProfile() {
    return userProfileStore.userProfileInfo;
  }

  get showResponseMessage() {
    if (this.responseMessage) {
      return true;
    }

    return false;
  }

  async getProfile() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.user_id);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message ? err.response.data.message : this.defaultProfileError;
      } else {
        this.responseMessage = err.message ? err.message : this.defaultProfileError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
};
</script>
