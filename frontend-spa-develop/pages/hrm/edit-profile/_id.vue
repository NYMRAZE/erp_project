<template>
  <div>
    <div class="card mt-3">
      <div id="container-header" class="card-header">
        <h3 id="title-page" class="card-title text-dark">
          {{ $t("Edit profile") }}
        </h3>
      </div>
    </div>
    <div v-if="userProfile">
      <EditBasicInfo
        v-if="rankList && branchList && jobTitleList"
        @callModalConfirm="callModalConfirm" />
      <EditEducation @callModalConfirm="callModalConfirm" />
      <EditSkill v-if="levelSkillList" @callModalConfirm="callModalConfirm" />
      <EditExperience @callModalConfirm="callModalConfirm" />
      <EditLanguage
        v-if="languageList && levelLanguageList"
        @callModalConfirm="callModalConfirm" />
      <EditInterestTechnology v-if="technologyList" @callModalConfirm="callModalConfirm" />
      <EditCertificate @callModalConfirm="callModalConfirm" />
      <EditAward @callModalConfirm="callModalConfirm" />
      <EditIntroduce @callModalConfirm="callModalConfirm" />
    </div>
    <b-alert class="mt-4" :show="showEditProfileError" variant="danger">{{ editProfileError }}</b-alert>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { layoutAdminStore, userProfileStore } from '~/store/index';
import EditBasicInfo from '~/components/EditProfile/EditBasicInfo/index.vue';
import EditSkill from '~/components/EditProfile/EditSkill/index.vue';
import EditLanguage from '~/components/EditProfile/EditLanguage/index.vue';
import EditEducation from '~/components/EditProfile/EditEducation/index.vue';
import EditCertificate from '~/components/EditProfile/EditCertificate/index.vue';
import EditAward from '~/components/EditProfile/EditAward/index.vue';
import EditExperience from '~/components/EditProfile/EditExperience/index.vue';
import EditIntroduce from '~/components/EditProfile/EditIntroduce/index.vue';
import EditInterestTechnology from '~/components/EditProfile/EditInterestTechnology/index.vue';

@Component({
  components: {
    EditBasicInfo,
    EditSkill,
    EditLanguage,
    EditEducation,
    EditCertificate,
    EditAward,
    EditExperience,
    EditIntroduce,
    EditInterestTechnology
  },
  middleware: ['auth', 'finishSetting', 'EditProfile', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
  userId : number = this.$auth.user.id;
  defaultProfileError : string = '';
  defaultError : string = '';
  editProfileError : string = '';

  async beforeCreate() {
    // set class background layout
    layoutAdminStore.addClassBgMainContent('bg-brown');

    // get item rank, branch, language, level language
    await userProfileStore.getListItemProfile();
  }

  beforeRouteLeave (to: any, from: any, next: any) {
    // reset background layout
    layoutAdminStore.addClassBgMainContent('');
    userProfileStore.resetUserProfile();
    next();
  }

  mounted () {
    this.defaultProfileError = this.$t('System have problem. Please try again') as string;

    if (this.$route.params.id) {
      this.userId = parseInt(this.$route.params.id);
    }

    this.$nextTick(() => {
      this.loadEditUserInfo();
    });
  }

  get userProfile() {
    return userProfileStore.userProfileInfo;
  }

  get rankList() {
    return userProfileStore.takeRankList;
  }

  get branchList()  {
    return userProfileStore.takeBranchList;
  }

  get jobTitleList()  {
    return userProfileStore.takeJobTitleList;
  }

  get levelSkillList()  {
    return userProfileStore.takeLevelSkillList;
  }

  get languageList() {
    return userProfileStore.takeLanguageList;
  }

  get technologyList() {
    return userProfileStore.takeTechnologyList;
  }

  get levelLanguageList() {
    return userProfileStore.takeLevelLanguageList;
  }

  get showEditProfileError() {
    return !!this.editProfileError;
  }

  // send form submit to store
  async loadEditUserInfo() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.editProfileError = err.response.data.message ? err.response.data.message : this.defaultProfileError;
      } else {
        this.editProfileError = err.message ? err.message : this.defaultProfileError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  // modal confirm
  callModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Please confirm'),
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : this.$t('Yes'),
      cancelTitle     : this.$t('No'),
      hideHeaderClose : false,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    }).catch((err: any) => {
      this.editProfileError = err;
    });
  }
};
</script>
<style>
#container-header {
  padding: 0.75rem 0.75rem;
  background-color: #ffffff;
}
#title-page {
  margin-bottom: 0;
}
.card-header-profile {
  cursor: pointer;
  background-color: #ffffff;
}
.card-title-profile {
  margin-bottom: 0;
  vertical-align: middle;
}
div.card-header-profile.collapsed .when-opened,
div.card-header-profile:not(.collapsed) .when-closed {
  display: none;
}
.card-footer-profile {
  background-color: #ffffff;
}
.btn-add {
  color: #fff;
}
.text-error-date {
  font-size: 80%;
}
</style>
