<template>
  <EvaluationList />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import EvaluationList from '~/components/EvaluationList/index.vue';

@Component({
  components: {
    EvaluationList
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
