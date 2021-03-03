<template>
  <CreateOT v-if="emailsGMAndPM" />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { overtimeStore, projectStore } from '../../store';
import CreateOT from '~/components/CreateOT/index.vue';

@Component({
  components: {
    CreateOT
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  responseMessage: string = ''

  mounted() {
    this.$nextTick(async () => {
      overtimeStore.setOTForm(null);
      await this.loadData();
    });
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    overtimeStore.setOTForm(null);
    next();
  }

  async loadData() {
    try {
      await Promise.all([projectStore.getProjectUserJoin(this.$auth.user.id), overtimeStore.getEmailsGMAndPM()]);
      this.responseMessage = '';
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  get emailsGMAndPM() {
    return overtimeStore.takeEmailsGMAndPM;
  }
};
</script>
