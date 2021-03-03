<template>
  <div>
    <h2
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Create new project") }}
    </h2>
    <NavBar :page="'create-project'" />
    <CreateProject />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import CreateProject from '~/components/CreateProject/index.vue';
import NavBar from '~/components/ProjectList/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    CreateProject
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
