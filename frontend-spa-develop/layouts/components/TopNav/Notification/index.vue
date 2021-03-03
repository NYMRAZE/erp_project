<template>
  <div size="md" class="d-flex align-items-center position-relative">
    <div class="notifications">
      <button @click="onClick" type="button" class="btn btn-noti-bell">
        <i class="far fa-bell"></i>
      </button>
      <div :class="totalNoti ? 'amount-noti' : 'd-none'">
        <span>{{ totalNoti }}</span>
      </div>
    </div>
    <ListNotification v-if="isShowNoti" ref="notifications" :key="isShowNoti" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import moment from 'moment';
import { notificationStore } from '~/store';
import { AppNotification, Pagination } from '~/types/notifications';
import { NotificationStatusRead } from '~/utils/common-const';
import ListNotification from '~/layouts/components/TopNav/Notification/ListNotification.vue';

@Component({
  components: {
    InfiniteLoading,
    ListNotification
  }
})
export default class extends Vue {
  userAvatar    : string = require('~/assets/images/default_avatar.jpg');
  userID: number = this.$auth.user.id
  pagination: Pagination = {
    current_page: 1,
    total_row: 0,
    row_per_page: 12
  }
  responseMessage: string = ''
  notiStatusRead: number = NotificationStatusRead
  notifications: AppNotification[] = []
  smallestDay: string = ''
  notificationsRes: AppNotification[] = []
  isCheckSeen: boolean = false
  interval: any = null;
  notificationIcon: string = require('~/assets/images/vnlab.jpg');

  mounted() {
    setTimeout(() => {
      this.countTotalNotificationUnread();
    }, 100);
    this.startListeners();
    this.requestPermission();

    if (this.$auth.loggedIn) {
      this.interval = setInterval(() => {
        this.countTotalNotificationUnread();
      }, 60000);
    }
  }

  beforeDestroy() {
    clearInterval(this.interval);
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.createIdToken();
      }
    } catch (e) {}
  }

  async createIdToken() {
    let currentToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let tokens;
    try {
      [currentToken, tokens] = await Promise.all([
        this.$fireMess.getToken(),
        notificationStore.getFcmTokens({ user_id: this.$auth.user.id })
      ]);
    } catch (e) {}
    if (currentToken && this.takeFcmTokens && !this.takeFcmTokens.includes(currentToken)) {
      await notificationStore.createFcmToken({
        user_id: this.$auth.user.id,
        token: currentToken
      });
    }
  }

  startListeners() {
    this.startOnMessageListener();
    this.startTokenRefreshListener();
  }

  startOnMessageListener() {
    this.$fireMess.onMessage((payload) => {
      this.countTotalNotificationUnread();
      const notification = new Notification(
        payload.notification.title,
        { body: payload.notification.body, icon: this.notificationIcon }
      );
      const vm = this;
      notification.onclick = function (event) {
        event.preventDefault();
        notificationStore.setIsNavigateNoti(true);
        vm.$router.replace(payload.data.link);
      };
    });
  }

  startTokenRefreshListener() {
    this.$fireMess.onTokenRefresh(async () => {
      try {
        let refreshedToken;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let tokens;
        try {
          [refreshedToken, tokens] = await Promise.all([
            this.$fireMess.getToken(),
            notificationStore.getFcmTokens({ user_id: this.$auth.user.id })
          ]);
        } catch (e) {}
        if (refreshedToken && !this.takeFcmTokens.includes(refreshedToken)) {
          await notificationStore.createFcmToken({
            user_id: this.$auth.user.id,
            token: refreshedToken
          });
        }
      } catch (e) {}
    });
  }

  async countTotalNotificationUnread() {
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    await notificationStore.getTotalNotificationsUnread(now);
  }

  get totalNoti() {
    return notificationStore.takeTotalNoti;
  }

  get takeFcmTokens() {
    return notificationStore.takeFcmTokens;
  }

  get isShowNoti() {
    return notificationStore.checkShowNoti;
  }

  onClick() {
    notificationStore.setIsShowNoti(!this.isShowNoti);
  }
}
</script>
<style scoped>
.btn-noti-bell {
  position: relative;
  border: none;
  background-color: inherit;
  outline: none;
  box-shadow: none;
  color: #C5C7CD;
}
.btn-noti-bell:hover {
  opacity: 0.7;
}
.notifications{
  position: relative;
}
.amount-noti > span {
  position: absolute;
  top: -3px;
  right: 3px;
  width: 18px;
  font-size: 11px;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  background-color: red;
  height: 17px;
}
@media screen and (max-width: 768px) {
  .notifications .btn-noti-bell {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
}
</style>
