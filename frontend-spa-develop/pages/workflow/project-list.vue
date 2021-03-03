<template>
  <div>
    <h2
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Manage project") }}
    </h2>
    <NavBar :page="'manage-project'" />
    <ProjectList />
  </div>

</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ProjectList from '~/components/ProjectList/index.vue';
import NavBar from '~/components/ProjectList/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    ProjectList
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
