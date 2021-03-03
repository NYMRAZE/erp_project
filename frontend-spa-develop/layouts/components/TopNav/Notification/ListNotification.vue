<template>
  <div v-show="isShowNoti" ref="notifications" class="notification_dd">
    <div class="pl-2 pt-2">
      <h4 class="mb-0">{{ $t('Notifications') }}</h4>
    </div>
    <span class="hr-line"></span>
    <ul class="mt-2">
      <li
        v-for="(noti, index) in notifications"
        :key="index"
        class="notification_li">
        <div class="notify_icon" @click="handleRedirectUrl(noti.redirect_url, noti.id, index)">
          <img width="40" height="40" class="rounded-circle" :src="linkAvatar(noti.avatar_sender)" />
        </div>
        <div
          class="notify_data"
          :class="isNotiRead(noti.status) && 'font-weight-bold'"
          @click="handleRedirectUrl(noti.redirect_url, noti.id, index)">
          <div>
            {{ noti.sender }}
          </div>
          <div class="sub_title">
            {{ $t(noti.content) }}
          </div>
          <div class="date-time">
            {{ timeSince(noti.created_at) }}
          </div>
        </div>
        <div class="btn-remove-noti">
          <button
            type="button"
            @click="removeNoti(noti.id, index)">
            &times;
          </button>
        </div>
        <div class="checked-seen">
          <input
            type="checkbox"
            :checked="checkNotiRead(noti.status)"
            :title="takeTitle(noti.status)"
            @input="editNotificationStatus(noti.id, index)">
        </div>
      </li>
    </ul>
    <infinite-loading
      spinner="spiral"
      @infinite="loadMore">
    </infinite-loading>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import moment from 'moment';
import { notificationStore } from '~/store';
import { AppNotification, Pagination } from '~/types/notifications';
import {
  NotificationStatusRead,
  NotificationStatusSeen,
  NotificationStatusUnread,
  RECRUITMENT, REQUEST, SURVEY, TODOLIST } from '~/utils/common-const';

@Component({
  components: {
    InfiniteLoading
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
  notiStatusSeen: number = NotificationStatusSeen
  notiStatusRead: number = NotificationStatusRead
  notiStatusUnRead: number = NotificationStatusUnread
  notifications: AppNotification[] = []
  smallestDay: string = ''
  notificationsRes: AppNotification[] = []
  isCheckSeen: boolean = false
  interval: any = null;
  notificationIcon: string = require('~/assets/images/vnlab.jpg');
  RECRUITMENT: number = RECRUITMENT
  SURVEY: number = SURVEY
  REQUEST: number = REQUEST
  TODOLIST: number = TODOLIST

  mounted() {
    this.pagination.current_page = 1;
    if (this.isShowNoti) {
      this.$nextTick(async () => {
        await this.editNotificationStatusRead();
      });
    } else {
      this.notifications = [];
    }
  }

  get isShowNoti() {
    return notificationStore.checkShowNoti;
  }

  async getNotifications() {
    try {
      const res = await notificationStore.getNotifications({
        current_page: this.pagination.current_page,
        receiver: this.userID,
        row_per_page: this.pagination.row_per_page
      });
      if (res) {
        this.smallestDay = res.smallest_day;
        this.notificationsRes = res.notifications;
        if (Array.isArray(this.notificationsRes) && this.notificationsRes.length) {
          this.notifications.push(...this.notificationsRes);
        }
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async loadMore($state) {
    await this.getNotifications();

    if (Array.isArray(this.notificationsRes) && this.notificationsRes.length && this.checkInFirstWeek) {
      this.pagination.current_page += 1;
      $state.loaded();
    } else {
      $state.complete();
    }
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

  checkNotiRead(status: number) {
    return status === this.notiStatusRead || status === this.notiStatusUnRead;
  }

  isNotiRead(status: number) {
    return status === this.notiStatusRead || status === this.notiStatusUnRead;
  }

  get checkInFirstWeek(): boolean {
    const dateFrom = this.smallestDay ? new Date(this.smallestDay) : new Date();
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(new Date().getTime() - dateFrom.getTime());
    return Math.round(differenceMs / ONE_DAY) <= 31;
  }

  // get moduleList() {
  //   return <any>permissionsStore.takeModuleList  && <any>permissionsStore.takeModuleList.length ? permissionsStore.takeModuleList : [
  //     { permission_id: RECRUITMENT, has_permission: false },
  //     { permission_id: SURVEY, has_permission: false },
  //     { permission_id: REQUEST, has_permission: false },
  //     { permission_id: TODOLIST, has_permission: false }
  //   ];
  // }

  linkAvatar(avatar: string) {
    return avatar
      ? 'data:image/png;base64,' + avatar
      : this.userAvatar;
  }

  async editNotificationStatusRead() {
    try {
      await notificationStore.editNotificationStatusRead({
        receiver: this.userID
      });
      if (this.totalNoti) {
        await this.countTotalNotificationUnread();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async editNotificationStatus(id: number, index: number) {
    try {
      if (this.notifications[index].status !== this.notiStatusSeen) {
        await notificationStore.editNotificationStatus({
          receiver: this.userID,
          status: this.notiStatusSeen,
          id
        }).then(() => {
          this.notifications[index].status = this.notiStatusSeen;
          this.isCheckSeen = false;
        });
      } else if (this.notifications[index].status === this.notiStatusSeen) {
        await notificationStore.editNotificationStatus({
          receiver: this.userID,
          status: this.notiStatusRead,
          id
        }).then(() => {
          this.notifications[index].status = this.notiStatusRead;
          this.isCheckSeen = true;
        });
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async removeNoti(id: number, index: number) {
    try {
      const res = await notificationStore.removeNotification({
        id,
        receiver: this.userID
      });
      if (res) {
        this.notifications.splice(index, 1);
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async handleRedirectUrl(url: string, id: number, index: number) {
    if (this.notifications[index].status !== this.notiStatusSeen) {
      await this.editNotificationStatus(id, index);
    }
    this.notifications = [];
    notificationStore.setIsShowNoti(false);
    notificationStore.setIsNavigateNoti(true);
    this.$router.replace(url);
  }

  takeTitle(status: number) {
    return status === this.notiStatusSeen ? this.$t('Mark as unread') as string : this.$t('Mark as read') as string;
  }

  timeSince(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} ${this.$t('months ago')}`;
    }
    interval = Math.floor(seconds / 604800);
    if (interval >= 1) {
      return `${interval} ${this.$t('weeks ago')}`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} ${this.$t('days ago')}`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} ${this.$t('hours ago')}`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} ${this.$t('minutes ago')}`;
    }

    return 'Just now';
  }

  showMsgBoxOk(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );
    this.$bvModal.msgBoxOk([messageNodes], {
      title           : title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }
}
</script>
<style scoped>
.notification_dd{
  z-index: 3;
  position: absolute;
  top: 35px;
  right: -5px;
  background: #fff;
  border: 1px solid #c7d8e2;
  width: 360px;
  max-height: 540px;
  overflow-y: scroll;
  border-radius: 3px;
  box-shadow: 10px 10px 35px rgba(0,0,0,0.125),
    -10px -10px 35px rgba(0,0,0,0.125);
  color: #252733;
}
.notification_dd:before{
  content: "";
  position: absolute;
  top: -20px;
  right: 15px;
  border: 10px solid;
  border-color: transparent #fff;
}
.notification_dd ul {
  position: relative;
}
.notification_dd li {
  position: relative;
  border-bottom: 1px solid #f1f2f4;
  padding: 10px 20px;
  display: flex;
  cursor: pointer;
  align-items: center;
}
.notification_dd li:hover {
  background-color: rgb(226, 223, 216);
}
.btn-remove-noti {
  line-height: 1;
}
.notification_dd li:hover > .btn-remove-noti {
  display: block;
}
.notification_dd li .notify_icon{
  display: flex;
}
.notification_dd li .notify_data{
  margin: 0 15px;
  width: 185px;
}
.notification_dd li .notify_data .title{
  color: #000;
}
.notification_dd li .notify_data .sub_title{
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
}
.notification_dd li .notify_data .date-time {
  font-size: 11px;
}
.btn-remove-noti {
  display: none;
}
.btn-remove-noti > button {
  border: none;
  background-color: inherit;
  position: absolute;
  top: 8px;
  right: 31px;
  font-size: 23px;
}
.btn-remove-noti > button:focus {
  outline: none;
}
.btn-remove-noti > button:hover {
  font-weight: 600;
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
.checked-seen {
  position: absolute;
  top: 12px;
  right: 12px;
}
[type="checkbox"]:checked,
[type="checkbox"]:not(:checked)
{
  position: relative;
  padding-left: 28px;
  cursor: pointer;
  line-height: 20px;
  display: inline-block;
  color: #666;
}
[type="checkbox"]:checked:before,
[type="checkbox"]:not(:checked):before {
  content: '';
  position: absolute;
  left: -3px;
  top: -3px;
  width: 18px;
  height: 18px;
  border: 1px solid #ddd;
  border-radius: 100%;
  background: #fff;
}
[type="checkbox"]:checked:after,
[type="checkbox"]:not(:checked):after {
  content: '';
  width: 12px;
  height: 12px;
  background: rgb(0, 67, 166);;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
[type="checkbox"]:not(:checked):after {
  opacity: 0;
  -webkit-transform: scale(0);
  transform: scale(0);
}
[type="checkbox"]:checked:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
}
span.hr-line {
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
  width: 100%;
  border-bottom: 1px solid #7A7A7A;
}
@media (max-width: 768px) {
  .notification_dd {
    width: 290px;
  }
}
</style>
