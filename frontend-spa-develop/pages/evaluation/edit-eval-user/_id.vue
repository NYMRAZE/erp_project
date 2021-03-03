<template>
  <div>
    <CreateTarget v-if="isAvailableTarget" @setIsEditedEval="setIsEditedEval" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { projectStore, targetStore } from '~/store/';
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
  isEditedEval : boolean = false;
  isAvailableTarget : boolean = false;

  mounted () {
    if (this.$route.params.id) {
      this.evalFormId = parseInt(this.$route.params.id);
    }

    targetStore.setEvalExisted(true);
    this.$nextTick(() => {
      if (this.evalFormId) {
        targetStore.setNotAllowToEdit(false);
        this.loadEvalDetail(this.evalFormId);
      }
    });
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

  beforeRouteLeave (to: any, from: any, next: any) {
    if (this.isEditedEval) {
      const noti = this.$t('Do you really want to leave? You have unsaved changes!') as string;
      const isLeaving = window.confirm(noti);
      if (isLeaving) {
        targetStore.setTarget(null);
        projectStore.setProjectUserJoin(null);
        next();
      } else {
        next(false);
      }
      return;
    }
    targetStore.setTarget(null);
    projectStore.setProjectUserJoin(null);
    targetStore.setEvalExisted(false);
    next();
  }

  setIsEditedEval(value: boolean) {
    this.isEditedEval = value;
  }
};
</script>
