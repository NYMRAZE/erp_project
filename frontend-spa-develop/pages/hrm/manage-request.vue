<template>
  <ManageRequest />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageRequest from '~/components/ManageRequest/index.vue';

@Component({
  components: {
    ManageRequest
  },
  middleware: ['auth', 'finishSetting', 'ManageMemberRole', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
