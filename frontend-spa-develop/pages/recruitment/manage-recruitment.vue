<template>
  <ManageRecruitment />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageRecruitment from '~/components/ManageRecruitment/index.vue';

@Component({
  components: {
    ManageRecruitment
  },
  middleware: ['auth', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
