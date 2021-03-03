<template>
  <nav id="top-header" class="navbar navbar-expand-lg navbar-dark border-bottom">
    <div class="mr-auto">
      <div class="d-flex mt-3">
        <i :class="iconTopPage" class="icon-top-page"></i>
        <h5 class="nav-header-title d-none d-lg-block font-weight-bold ml-3">{{ $t(pageTitle) }}</h5>
      </div>
      <div
        type="button"
        class="btn-control-sidebar d-block d-lg-none"
        @click="changeToggleSidebar()">
        <i class="fas fa-bars"></i>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <b-navbar-nav id="top-nav" class="ml-auto d-flex flex-row">
        <!-- language -->
        <NavLanguage v-if="isLoggedIn" />
        <!-- End language -->
        <!-- Other -->
        <b-nav-item-dropdown
          v-if="isLoggedIn"
          class="box-setting d-flex align-items-center"
          right
          no-caret>
          <template v-slot:button-content>
            <span class="btn-account d-flex align-items-center">
              <i class="fas fa-cog"></i>
            </span>
          </template>
          <b-dropdown-item to="/hrm/edit-account">
            <i class="fa fa-user-cog"></i>
            {{ $t("Edit account") }}
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout">
            <i class="fa fa-power-off"></i>
            {{ $t("Logout") }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- Notification -->
        <b-nav-text class="d-flex align-items-center">
          <NavNotification v-if="isLoggedIn" ref="notifications" />
        </b-nav-text>
        <!-- End notification -->
        <!-- user-box -->
        <b-nav-text>
          <div v-if="isLoggedIn" class="d-flex align-items-center">
            <div class="stick-nav"></div>
            <nuxt-link to="/hrm/view-profile" class="d-flex align-items-center user-info">
              <span
                id="user-box-label"
                class="mr-2">
                {{ fullUserName }}
              </span>
              <span class="img-user-container rounded-circle">
                <img :src="linkAvatar" width="40" height="40" class="rounded-circle" />
              </span>
            </nuxt-link>
          </div>
        </b-nav-text>
        <!-- End user-box -->
      </b-navbar-nav>
    </div>
  </nav>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ja from 'vee-validate/dist/locale/ja.json';
import vi from 'vee-validate/dist/locale/vi.json';
import { organizationStore, userProfileStore, layoutAdminStore } from '~/store/';
import { FINISHSETTING, getOrganizationInUrl } from '~/utils/common-const.ts';
import NavLanguage from '~/layouts/components/TopNav/Nav-Language/index.vue';
import NavNotification from '~/layouts/components/TopNav/Notification/index.vue';

@Component({
  components: {
    NavLanguage,
    NavNotification
  }
})
export default class TopNav extends Vue {
  userAvatar    : string = require('~/assets/images/default_avatar.jpg');
  isLoggedIn: boolean = this.$auth.loggedIn;

  async mounted() {
    try {
      if (this.isLoggedIn) {
        window.addEventListener('storage', this.logoutHandler, false);
        const avatar = await userProfileStore.downloadImgAvatar();
        userProfileStore.setBase64Avatar(avatar);
      }
    } catch (e) {
      userProfileStore.setBase64Avatar(null);
    }
  }

  beforeDestroy() {
    if (!this.isLoggedIn) {
      window.removeEventListener('storage', this.logoutHandler);
      localStorage.removeItem('logout-event');
    }
  }

  get toggleSidebar() {
    return layoutAdminStore.takeToggleSidebar;
  }

  get linkHome() {
    return this.isLoggedIn ? '/home-admin' : '/';
  }

  get linkAvatar() {
    return userProfileStore.imgbase64Avatar
      ? 'data:image/png;base64,' + userProfileStore.imgbase64Avatar
      : this.userAvatar;
  }

  get fullUserName() {
    let fullName = '';

    if (this.isLoggedIn) {
      fullName = this.$auth.user.first_name + ' ' + this.$auth.user.last_name;
    }

    return fullName;
  }

  get pageTitle() {
    return layoutAdminStore.takeTitlePage;
  }

  get iconTopPage() {
    return layoutAdminStore.takeIconTopPage;
  }

  async logout() {
    await this.$auth.logout().then(() => {
      this.$i18n.locale = navigator.language;
      // set language for vee validate
      switch (navigator.language) {
      case 'ja':
        localize('ja', ja);
        break;
      case 'vi':
        localize('vi', vi);
        break;
      case 'en':
        localize('en', en);
        break;
      }
      localStorage.setItem('logout-event', 'logout' + Math.random());
      return true;
    });
  }

  callModalLogout(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxOk(messageNodes)
      .then((value: any) => {
        if (value) {
          callBack();
        }
      });
  }

  goToHome() {
    if (this.$auth.user.setting_step === FINISHSETTING && layoutAdminStore.checkNeedSetting) {
      layoutAdminStore.setNeedSetting(false);
    }

    this.$router.push('/home-admin');
  }

  logoutHandler(event: any): EventListener {
    let isOnce = true;
    const vm = this;
    let focus;
    if (event.key === 'logout-event') {
      focus = window.onfocus = function () {
        if (isOnce) {
          isOnce = false;
          vm.callModalLogout(
            'Your session has expired, please login again!',
            async function() {
              const organizationTag = getOrganizationInUrl();
              if (organizationTag !== '') {
                await organizationStore.findOrganization(organizationTag);
              }
              vm.$i18n.locale = navigator.language;
              switch (navigator.language) {
              case 'ja':
                localize('ja', ja);
                break;
              case 'vi':
                localize('vi', vi);
                break;
              case 'en':
                localize('en', en);
                break;
              }
              await vm.$auth.logout();
            }
          );
        }
      };
    }
    return focus;
  }

  changeToggleSidebar() {
    layoutAdminStore.changeToggleSidebar();
  }
};
</script>
<style scoped>
.navbar-brand {
  cursor: pointer;
}
.img-user-container {
  border: 2px solid #DFE0EB;
  padding: 3px;
}
#user-box-label {
  color: #252733;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  vertical-align: middle;
  display: inline-block;
  /*font-weight: 600;*/
}
#nav-collapse {
  margin-bottom: 0;
}
.user-info {
  color: #000;
  text-decoration: none;
}
.user-info:hover {
  color: rgba(211, 208, 203, 0.75);
  text-decoration: none;
}
.btn-account {
  color: #C5C7CD;
}
.btn-account:hover {
  opacity: 0.8;
}
.stick-nav {
  border-left: 1px solid #DFE0EB;
  height: 32px;
}
.nav-header-title {
  color: #2CA7F2;
}
.btn-control-sidebar {
  width: 68px;
  height: 58px;
  background-color: #363740;
  color: #fff;
  position: absolute;
  top:0;
  left: 0;
  text-align: center;
  border-radius: 0 0 40px 0;
  font-size: 18px;
  line-height: 50px;
  cursor: pointer;
}
#top-header {
  height: 70px;
}
ul#top-nav > li {
  margin-left: 10px;
}
.stick-nav {
  margin-right: 15px;
}
ul#top-nav i {
  font-size: 16px;
}

@media screen and (max-width: 768px) {
  #user-box-label {
    display: none;
  }
  .stick-nav {
    margin-right: 10px;
  }
  #top-header {
    padding-top: 0;
  }
}
@media (min-width: 992px) {
  #top-header {
    padding-left: 30px;
    padding-right: 30px;
  }
}
.icon-top-page {
  font-size: 20px;
  color: #2CA7F2;
}
</style>
