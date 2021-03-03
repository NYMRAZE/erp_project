<template>
  <div v-show="isNeedSetting" class="overlay">
    <div class="popup text-center">
      <img src="~/assets/images/decore-left.png" class="decore-left" />
      <img src="~/assets/images/decore-right.png" class="decore-right" />
      <h2>{{ `${$t('Welcome to')} ${orgName}!` }} </h2>
      <div class="px-4">
        <h4 class="d-inline">{{ $t('To continue using you need to setting the system.') }}</h4>
        <h4><a href="#" class="d-inline" @click.prevent="goToSetting">{{ $t('Click here') }}!</a></h4>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { FINISHSETTING } from '~/utils/common-const';

@Component({})
export default class extends Vue {
  userName: string = this.$auth.user.last_name + ' ' + this.$auth.user.first_name;
  orgName: string = ''
  isNeedSetting: boolean = true
  settingPosition: string = ''

  mounted() {
    this.orgName = this.$auth.user.organization_name;
    this.isNeedSetting = this.$auth.user.setting_step !== FINISHSETTING;
  }

  goToSetting() {
    if (this.isNeedSetting) {
      switch (this.settingPosition) {
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
      default:
        this.$router.push('/settings/organization-email');
        break;
      }
    }
  }
}
</script>
<style scoped>
  .overlay {
    z-index: 3;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: opacity 500ms;
  }
  .overlay:target {
    visibility: visible;
    opacity: 1;
  }

  .popup {
    border-radius: 10px;
    background-color: #7d72f1;
    height: 260px;
    margin: 70px auto;
    padding: 20px;
    color: #fff;
    border-radius: 5px;
    width: 40%;
    position: relative;
    transition: all 5s ease-in-out;
    font-family: Tahoma, Arial, sans-serif;
  }

  .popup h2 {
    margin-top: 5rem;
  }
  .popup span {
    font-size: 16px;
  }
  .popup a {
    text-decoration: underline;
    font-weight: 600;
    color: #fff;
  }
  .popup .decore-left {
    position: absolute;
    left: 0;
    top: 0;
  }
  .popup .decore-right {
    position: absolute;
    right: 0;
    top: 0;
  }

  @media screen and (max-width: 700px){
    .popup{
      width: 70%;
    }
  }
</style>>
