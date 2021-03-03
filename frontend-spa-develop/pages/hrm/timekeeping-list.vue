<template>
  <TimekeepingList />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import TimekeepingList from '~/components/TimekeepingList/index.vue';

@Component({
  components: {
    TimekeepingList
  },
  middleware: ['auth', 'finishSetting', 'ManageMemberRole', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
