<template>
  <ProfileList />
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ProfileList from '~/components/ProfileList/index.vue';

@Component({
  components: {
    ProfileList
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
