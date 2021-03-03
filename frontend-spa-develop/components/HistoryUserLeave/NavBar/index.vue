<template>
  <div class="row wrap-navigate-btn w-100 p-0 m-0">
    <div class="col-md-6 col-sm-12 p-0 group-btn-left">
      <div class="form-row p-sm-x">
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoManageLeave ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleManageLeave">
            {{ $t("Manage leave") }}
          </button>
        </div>
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoCreateLeave ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleCreateLeave">
            {{ $t("Request leave") }}
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12 p-0 group-btn-right">
      <div class="form-row p-sm-x">
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoManageDayoff ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="handleManageDayoff">
            {{ $t("Day off information") }}
          </button>
        </div>
        <div class="col-6">
          <button
            type="button"
            class="btn w-100 h-100 font-weight-bold"
            :class="isGotoBonusLeave ? 'btn-primary2 text-white' : 'btn-secondary2'"
            @click.prevent="gotoBonusLeaveHistory">
            {{ $t("Bonus leave history") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component({
  components: {
  }
})

export default class HistoryUserLeave extends Vue {
  @Prop() page ?: string
  isGotoCreateLeave: boolean = false
  isGotoManageLeave: boolean = false
  isGotoManageDayoff: boolean = false
  isGotoBonusLeave: boolean = false

  mounted() {
    switch (this.page) {
    case 'create-leave':
      this.isGotoCreateLeave = true;
      this.isGotoManageLeave = false;
      this.isGotoManageDayoff = false;
      this.isGotoBonusLeave = false;
      break;
    case 'history-leave':
      this.isGotoCreateLeave = false;
      this.isGotoManageLeave = true;
      this.isGotoManageDayoff = false;
      this.isGotoBonusLeave = false;
      break;
    case 'manage-dayoff':
      this.isGotoCreateLeave = false;
      this.isGotoManageLeave = false;
      this.isGotoManageDayoff = true;
      this.isGotoBonusLeave = false;
      break;
    case 'bonus-leave':
      this.isGotoCreateLeave = false;
      this.isGotoManageLeave = false;
      this.isGotoManageDayoff = false;
      this.isGotoBonusLeave = true;
      break;
    }
  }

  handleManageLeave() {
    this.$router.push('/hrm/history-user-leave');
  }

  handleCreateLeave() {
    this.$router.push('/hrm/create-leave-request');
  }

  handleManageDayoff() {
    this.$router.push('/hrm/manage-day-leave');
  }

  gotoBonusLeaveHistory() {
    this.$router.push('/hrm/bonus-leave-history');
  }
}
</script>
<style scoped>
@media (min-width: 320px) and (max-width: 480px) {
  .p-sm-x {
    padding: 0 1rem;
  }
  .group-btn-left {
    margin-right: 0px;
  }
  .group-btn-right {
    margin-top: 8px;
    margin-left: 0px;
  }
  button.btn-primary2,
  button.btn-secondary2 {
    padding: 7px;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .group-btn-left > .form-row {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .group-btn-right > .form-row {
    padding-right: 1rem;
    padding-left: 1rem;
    margin-top: 8px;
  }
}
@media (min-width: 768px) {
  .wrap-navigate-btn {
    height: 55px;
  }
  .group-btn-left > .form-row {
    height: 100%;
    padding-right: 5px;
  }
  .group-btn-right > .form-row {
    height: 100%;
    padding-left: 5px;
  }
}
@media (min-width: 1025px) {
  .wrap-navigate-btn {
    width: 80% !important;
  }
}
</style>
