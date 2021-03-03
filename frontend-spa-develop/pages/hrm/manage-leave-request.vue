<template>
  <ManageLeaveRequest />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageLeaveRequest from '~/components/ManageLeaveRequest/index.vue';

@Component({
  components: {
    ManageLeaveRequest
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
