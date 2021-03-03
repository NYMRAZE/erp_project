<template>
  <div>
    <h3
        id="page-title"
        class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Day off information") }}
    </h3>
    <NavBar :page="'manage-dayoff'" />
    <ManageDayLeaveUser :key="isUpdateLeaveBonus" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ManageDayLeaveUser from '~/components/ManageDayLeaveUser/index.vue';
import NavBar from '~/components/HistoryUserLeave/NavBar/index.vue';
import { dayleaveStore } from '~/store';

@Component({
  components: {
    NavBar,
    ManageDayLeaveUser
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  get isUpdateLeaveBonus() {
    return dayleaveStore.hasUpdateLeaveBonus;
  }
};
</script>
