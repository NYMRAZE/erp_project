<template>
  <div>
    <overtimeForm v-if="takeProjectUserJoin && emailsGMAndPM && takeOTFromDetail" :isview="true" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { projectStore, overtimeStore } from '~/store/';
import overtimeForm from '~/components/CreateOT/index.vue';

@Component({
  components: {
    overtimeForm
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  requestID : number | null = null;

  mounted () {
    if (this.$route.params.id) {
      this.requestID = parseInt(this.$route.params.id);
    }
    this.$nextTick(() => {
      if (this.requestID) {
        this.loadOTRequest(this.requestID);
      }
    });
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    overtimeStore.setOTForm(null);
    projectStore.setProjectUserJoin(null);
    next();
  }

  async loadOTRequest(requestID: number) {
    this.$nuxt.$loading.start();
    try {
      const res = await overtimeStore.getOvertimeRequestById(requestID);
      await Promise.all([projectStore.getProjectUserJoin(res.user_id), overtimeStore.getEmailsGMAndPM()]);
    } catch (err) {} finally {
      this.$nuxt.$loading.finish();
    }
  }

  get takeProjectUserJoin() {
    return projectStore.takeProjectUserJoin ? projectStore.takeProjectUserJoin.length > 0 : false;
  }

  get takeOTFromDetail() {
    return overtimeStore.takeOTFromDetail;
  }

  get emailsGMAndPM() {
    return overtimeStore.takeEmailsGMAndPM;
  }
};
</script>
