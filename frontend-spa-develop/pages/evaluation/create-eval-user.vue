<template>
  <div>
    <CreateTarget
        v-if="!targetDetail || (isDuplicateEval && takeProjectUserJoin)"
        :iscreate="true"
        @setIsEditedEval="setIsEditedEval" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import CreateTarget from '~/components/TargetEvaluationForm/index.vue';
import { layoutAdminStore, projectStore } from '~/store/index';
import { targetStore } from '~/store/';

@Component({
  components: {
    CreateTarget
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})

export default class extends Vue {
  isEditedEval : boolean = false;

  mounted() {
    this.$nextTick(async () => {
      if (!targetStore.duplicateEval) {
        targetStore.setTarget(null);
        await projectStore.getProjectUserJoin(this.$auth.user.id);
      }

      if (targetStore.evalFormID) {
        await this.loadEvalDetail(targetStore.evalFormID);
      }
    });
  }

  beforeCreate() {
    // set class background layout
    layoutAdminStore.addClassBgMainContent('bg-brown');
  }

  async loadEvalDetail(evalFormId: number) {
    this.$nuxt.$loading.start();
    try {
      const response = await targetStore.getTarget(evalFormId);
      await projectStore.getProjectUserJoin(response.user_id);
    } catch (err) {} finally {
      this.$nuxt.$loading.finish();
    }
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    if (this.isEditedEval) {
      const noti = this.$t('Do you really want to leave? You have unsaved changes!') as string;
      const isLeaving = window.confirm(noti);
      if (isLeaving) {
        layoutAdminStore.addClassBgMainContent('');
        targetStore.setDuplicateEval(false);
        targetStore.setEvalExisted(false);
        targetStore.setTarget(null);
        targetStore.setEvalID(null);
        projectStore.setProjectUserJoin(null);
        next();
      } else {
        next(false);
      }
      return;
    }

    targetStore.setDuplicateEval(false);
    targetStore.setEvalExisted(false);
    targetStore.setTarget(null);
    targetStore.setEvalID(null);
    projectStore.setProjectUserJoin(null);
    layoutAdminStore.addClassBgMainContent('');
    next();
  }

  get targetDetail() {
    return targetStore.takeTarget;
  }

  get isDuplicateEval() {
    return targetStore.duplicateEval;
  }

  get takeProjectUserJoin() {
    return projectStore.takeProjectUserJoin ? projectStore.takeProjectUserJoin.length > 0 : false;
  }

  setIsEditedEval(value: boolean) {
    this.isEditedEval = value;
  }
};
</script>
