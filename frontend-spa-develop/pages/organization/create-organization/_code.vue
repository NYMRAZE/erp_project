<template>
  <div class="container">
    <div class="row pb-5">
      <div class="col-md-6 offset-md-3">
        <div class="card-register card mt-4">
          <div class="card-header">
            <h4 class="card-title text-dark">
              {{ $t("Create organization") }}
            </h4>
          </div>
          <div class="card-body">
            <p class="text-danger">
              {{ $t(responseMessage) }}
            </p>
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
import { getOrganizationInUrl } from '~/utils/common-const';
import { organizationStore, registrationStore } from '~/store/index';

@Component({
  auth: false
})

export default class extends Vue {
    responseMessage: string = ''

    created() {
      if (this.$auth.loggedIn) {
        const msgModalConfirm = 'This action requires logout of your current session. Agree?';
        const $this = this;
        this.showModalConfirm(msgModalConfirm, function() {
          window.addEventListener('storage', $this.logoutHandler, false);
          $this.logout().then(() => {
            $this.checkCode();
          });
        });
        return;
      }
      this.checkCode();
    }

    beforeDestroy() {
      if (!this.$auth.loggedIn) {
        window.removeEventListener('storage', this.logoutHandler);
        localStorage.removeItem('logout-event');
      }
    }

    showModalConfirm(message: string, callBack: Function) {
      const messageNodes = this.$createElement(
        'div',
        {
          domProps: { innerHTML: message }
        }
      );

      this.$bvModal.msgBoxConfirm([messageNodes], {
        title           : 'Please Confirm',
        buttonSize      : 'md',
        okVariant       : 'primary',
        okTitle         : 'YES',
        cancelTitle     : 'NO',
        hideHeaderClose : false,
        centered        : true
      }).then((value: any) => {
        if (value) {
          callBack();
        } else {
          this.$router.push('/');
        }
      });
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

    async checkCode() {
      try {
        const res = await registrationStore.checkExpired(this.$route.params.code);
        if (res.request_id === 0) {
          this.$router.push('/organization/create-organization');
          return;
        }
        this.$router.push('/user/register-user');
      } catch (err) {
        if (typeof err.response !== 'undefined') {
          this.responseMessage = err.response.data.message;
        } else {
          this.responseMessage = err;
        }
      }
    }
};
</script>
