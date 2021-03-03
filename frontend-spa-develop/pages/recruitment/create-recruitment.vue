<template>
  <CreateRecruitment v-if="!takeRecruitment" :title="`Create recruitment`" />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { recruitmentStore } from '../../store';
import CreateRecruitment from '~/components/CreateRecruitment/index.vue';

@Component({
  components: {
    CreateRecruitment
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  mounted() {
    recruitmentStore.setRecruitment(null);
  }

  get takeRecruitment() {
    return recruitmentStore.takeRecruitment;
  }
};
</script>
