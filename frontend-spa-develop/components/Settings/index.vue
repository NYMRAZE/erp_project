<template>
  <div>
    <div class="container-fluid">
      <div class="row card form-setting">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center p-0 mt-5 mb-2">
          <ValidationObserver ref="observer">
            <ul id="progressbar">
              <li class="fa fa-envelope" :class="isActiveSettingEmail && 'active'" @click="gotoSetting('email')" id="organization">
                <strong v-bind:class="isActiveSettingEmail ? 'setting-enabled' : 'setting-disabled'">{{ $t('Organization') }}</strong>
              </li>
              <li class="fas fa-building" :class="isActiveSettingBranch && 'active'" @click="gotoSetting('branch')" id="branch">
                <strong v-bind:class="isActiveSettingBranch ? 'setting-enabled' : 'setting-disabled'">{{ $t('Branch') }}</strong>
              </li>
              <li class="fas fa-user-tie" :class="isActiveSettingJob && 'active'" @click="gotoSetting('job-title')" id="job-title">
                <strong v-bind:class="isActiveSettingJob ? 'setting-enabled' : 'setting-disabled'">{{ $t('Job title') }}</strong>
              </li>
              <li class="fas fa-chalkboard-teacher" :class="isActiveSettingTechnology && 'active'" @click="gotoSetting('technology')" id="interest-tech">
                <strong v-bind:class="isActiveSettingTechnology ? 'setting-enabled' : 'setting-disabled'">{{ $t('Interest technology') }}</strong>
              </li>
              <li class="fas fa-user-clock" :class="isActiveSettingOt && 'active'" @click="gotoSetting('overtime')" id="overtime">
                <strong v-bind:class="isActiveSettingOt ? 'setting-enabled' : 'setting-disabled'">{{ $t('Overtime') }}</strong>
              </li>
              <li class="fa fa-calendar" :class="isActiveSettingHoliday && 'active'" @click="gotoSetting('holidays')" id="holiday">
                <strong v-bind:class="isActiveSettingHoliday ? 'setting-enabled' : 'setting-disabled'">{{ $t('Holidays') }}</strong>
              </li>
              <li class="fa fa-check" :class="isActiveFinishSetting && 'active'" id="finish">
                <strong v-bind:class="isActiveFinishSetting ? 'setting-enabled' : 'setting-disabled'">{{ $t('Finish') }}</strong>
              </li>
            </ul>
          </ValidationObserver>
        </div>
      </div>
    </div>
    <div v-if="progress !== '100%'" class="progress">
      <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          :style="`width:${progress}`"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100">
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { FINISHSETTING } from '~/utils/common-const';

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() param!: string
  @Prop() progress!: string
  @Prop() isActiveSettingEmail!: boolean
  @Prop() isActiveSettingBranch!: boolean
  @Prop() isActiveSettingJob!: boolean
  @Prop() isActiveSettingTechnology!: boolean
  @Prop() isActiveSettingOt!: boolean
  @Prop() isActiveSettingHoliday!: boolean
  @Prop() isActiveFinishSetting!: boolean
  isSettingComplete: boolean = false

  mounted() {
    this.isSettingComplete = this.$auth.user.setting_step === FINISHSETTING;
  }

  gotoSetting(item: string) {
    if (this.isSettingComplete) {
      switch (item) {
      case 'email':
        this.$router.push('/settings/organization-email');
        break;
      case 'branch':
        this.$router.push('/settings/branch');
        break;
      case 'job-title':
        this.$router.push('/settings/job-title');
        break;
      case 'technology':
        this.$router.push('/settings/interest-technology');
        break;
      case 'overtime':
        this.$router.push('/settings/overtime');
        break;
      case 'holidays':
        this.$router.push('/settings/holidays');
        break;
      default:
        break;
      }
    }
  }
}
</script>
<style scoped>
/* new css style */
.form-setting {
  background: none !important;
}
.card {
  z-index: 0;
  border: none;
  border-radius: 0.5rem;
  position: relative
}
</style>
