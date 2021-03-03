<template>
  <div class="row">
    <div class="container pb-5">
      <div class="col-md-6 offset-md-3">
        <div class="card-register card mt-4">
          <div class="card-header">
            <h4 class="card-title text-dark"> Change Email</h4>
          </div>
          <div class="card-body">
            <p class="text-danger">{{ $t(responseMessage) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ja from 'vee-validate/dist/locale/ja.json';
import vi from 'vee-validate/dist/locale/vi.json';
import { organizationStore, userStore } from '~/store/index';
import { ChangeEmailParams } from '~/types/user';
import { getOrganizationInUrl } from '~/utils/common-const';

@Component({
  auth: false
})

export default class extends Vue {
  responseMessage: string = ''

  async created() {
    try {
      await this.logout();
      if (this.$auth.loggedIn) {
        window.addEventListener('storage', this.logoutHandler, false);
      }
    } catch (e) {}
    this.checkCode();
  }

  beforeDestroy() {
    if (!this.$auth.loggedIn) {
      window.removeEventListener('storage', this.logoutHandler);
      localStorage.removeItem('logout-event');
    }
  }

  async logout(): Promise<void> {
    await this.$auth.logout().then((): boolean => {
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

  async checkCode() {
    try {
      const res = await userStore.changeEmail(this.$route.params.code);
      if (res.user_id !== 0) {
        const changeEmailParams : ChangeEmailParams = {
          user_id             : res.user_id,
          organization_id     : res.organization_id,
          email               : res.email,
          change_email_code   : res.change_email_code
        };

        userStore.saveChangeEmailParams(changeEmailParams);
        this.$router.push('/organization/ChangeEmail');
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
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
              await vm.$auth.logout();
            }
          );
        }
      };
    }
    return focus;
  }
};
</script>
