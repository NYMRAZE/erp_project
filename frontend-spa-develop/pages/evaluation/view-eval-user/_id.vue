<template>
  <div>
    <CreateTarget v-if="isAvailableTarget" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { targetStore, projectStore } from '~/store/';
import { Target } from '~/types/target';
import CreateTarget from '~/components/TargetEvaluationForm/index.vue';

@Component({
  components: {
    CreateTarget
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  evalFormId : number | null = null;
  target: Target | null = null;
  isAvailableTarget: boolean = false

  mounted () {
    targetStore.setTarget(null);
    if (this.$route.params.id) {
      this.evalFormId = parseInt(this.$route.params.id);
    }
    targetStore.setEvalExisted(false);
    this.$nextTick(() => {
      if (this.evalFormId) {
        targetStore.setNotAllowToEdit(true);
        this.loadEvalDetail(this.evalFormId);
      }
    });
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    projectStore.setProjectUserJoin(null);
    next();
  }

  async loadEvalDetail(evalFormId: number) {
    this.$nuxt.$loading.start();
    try {
      const response = await targetStore.getTarget(evalFormId);
      if (response) {
        await projectStore.getProjectUserJoin(response.user_id);
        this.isAvailableTarget = !!response;
      }
    } catch (err) {} finally {
      this.$nuxt.$loading.finish();
    }
  }
};
</script>
