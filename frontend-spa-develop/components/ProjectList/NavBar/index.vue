<template>
  <div class="row wrap-navigate-btn w-100 p-0 m-0">
    <div class="col-md-9 col-sm-12 p-0 group-btn-left">
      <div class="form-row p-sm-x">
        <div class="col-4">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoManageProject ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleManageProject">
            {{ $t("Manage project") }}
          </button>
        </div>
        <div class="col-4">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoCreateProject ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleCreateProject">
            {{ $t("Create new project") }}
          </button>
        </div>
        <div class="col-4">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoProjectParticipate ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleProjectParticipate">
            {{ $t("Project you participate") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component({
  components: {
  }
})

export default class extends Vue {
  @Prop() page ?: string
  isGotoProjectParticipate: boolean = false
  isGotoManageProject: boolean = false
  isGotoCreateProject: boolean = false
  mounted() {
    switch (this.page) {
    case 'project-participate':
      this.isGotoManageProject = false;
      this.isGotoCreateProject = false;
      this.isGotoProjectParticipate = true;
      break;
    case 'manage-project':
      this.isGotoManageProject = true;
      this.isGotoCreateProject = false;
      this.isGotoProjectParticipate = false;
      break;
    case 'create-project':
      this.isGotoManageProject = false;
      this.isGotoCreateProject = true;
      this.isGotoProjectParticipate = false;
      break;
    }
  }
  handleProjectParticipate() {
    this.$router.push('/workflow/project-participate');
  }
  handleManageProject() {
    this.$router.push('/workflow/project-list');
  }

  handleCreateProject() {
    this.$router.push('/workflow/create-project');
  }
}
</script>
<style scoped>
.wrap-navigate-btn button {
  height: 60px;
}
@media (min-width: 1025px) {
  .wrap-navigate-btn {
    width: 80% !important;
  }
}
@media (max-width: 350px) {
  .wrap-navigate-btn button {
    height: 85px;
    width: 100%!important;
  }
}
</style>
