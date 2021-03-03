<template>
  <div>
    <EditProject v-if="projectDetail" :title="$t('Manage project')" />
    <b-alert class="mt-3" :show="showEditProjectError" variant="danger">{{ editProjectError }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { projectStore } from '~/store/';
import EditProject from '~/components/EditProject/index.vue';
@Component({
  components: {
    EditProject
  },
  middleware: ['auth', 'finishSetting', 'ManageMemberRole', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  projectId : number | null = null;
  editProjectError : string = '';
  defaultEditProjectError : string = '';

  mounted () {
    this.defaultEditProjectError = this.$t('System have problem. Please try again') as string;
    if (this.$route.params.id) {
      this.projectId = parseInt(this.$route.params.id);
    }

    this.$nextTick(() => {
      if (this.projectId) {
        this.loadProjectDetail(this.projectId);
      } else {
        this.$router.push('/project-list');
      }
    });
  }

  get showEditProjectError() {
    return !!this.editProjectError;
  }

  get projectDetail() {
    return projectStore.takeProject;
  }

  async loadProjectDetail(projectId: number) {
    this.$nuxt.$loading.start();

    try {
      await projectStore.getProject(projectId);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.editProjectError = err.response.data.message ? err.response.data.message : this.defaultEditProjectError;
      } else {
        this.editProjectError = err.message ? err.message : this.defaultEditProjectError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    projectStore.setProject(null);
    next();
  }
};
</script>
