<template>
  <div>
    <RecruitmentDetail v-if="recruitmentDetail" :title="'Recruitment'" :is-edit="true" />
    <b-alert :show="showError" class="mt-3" variant="danger">{{ responseError }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { recruitmentStore } from '~/store/';
import RecruitmentDetail from '~/components/CreateRecruitment/index.vue';
@Component({
  components: {
    RecruitmentDetail
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  recruitmentID : number | null = null;
  responseError : string = '';
  defaultError : string = '';

  mounted () {
    this.defaultError = this.$t('System have problem. Please try again') as string;
    if (this.$route.params.id) {
      this.recruitmentID = parseInt(this.$route.params.id);
    }

    this.$nextTick(() => {
      if (this.recruitmentID) {
        this.loadRecruitmentDetail(this.recruitmentID);
      } else {
        this.$router.push('/recruitment/manage-recruitment');
      }
    });
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    recruitmentStore.setRecruitment(null);
    next();
  }

  get showError() {
    return !!this.responseError;
  }

  get recruitmentDetail() {
    return recruitmentStore.takeRecruitment;
  }

  async loadRecruitmentDetail(recruitmentID: number) {
    this.$nuxt.$loading.start();

    try {
      await recruitmentStore.getJob(recruitmentID);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseError = err.response.data.message ? err.response.data.message : this.defaultError;
      } else {
        this.responseError = err.message ? err.message : this.defaultError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
};
</script>
