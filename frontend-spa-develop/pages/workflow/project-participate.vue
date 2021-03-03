<template>
  <div>
    <NavBar :page="'project-participate'" />
    <Boards />
  </div>

</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Boards from '~/components/Board/Boards.vue';
import NavBar from '~/components/ProjectList/NavBar/index.vue';

@Component({
  components: {
    NavBar,
    Boards
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
