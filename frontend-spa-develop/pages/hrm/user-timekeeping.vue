<template>
  <div>
    <UserTimekeeping v-if="userTimekeeping" />
    <b-alert class="mt-4" :show="showTimekeepingError" variant="danger">{{ timekeepingError }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import UserTimekeeping from '~/components/UserTimekeeping/index.vue';
import { timekeepingStore } from '~/store/';

@Component({
  components: {
    UserTimekeeping
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  timekeepingError : string = '';
  defaultTimekeepingError : string = '';

  mounted () {
    this.defaultTimekeepingError = this.$t('System have problem. Please try again') as string;
    this.$nextTick(() => {
      this.loadCurrentTimekeeping();
    });
  }

  get userTimekeeping() {
    return timekeepingStore.takeTimekeeping;
  }

  async loadCurrentTimekeeping() {
    this.$nuxt.$loading.start();

    try {
      await timekeepingStore.getTodayTimekeeping();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.timekeepingError = err.response.data.message;
      } else {
        this.timekeepingError = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  get showTimekeepingError() {
    if (this.timekeepingError) {
      return true;
    }

    return false;
  }
};
</script>
