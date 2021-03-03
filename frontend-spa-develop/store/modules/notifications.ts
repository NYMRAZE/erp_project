import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { FailResponseCode } from '~/utils/responsecode';
import { axios } from '~/utils/axios-accessor';
import { AppNotification } from '~/types/notifications';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/notifications'
})

export default class Notifications extends VuexModule {
  totalNoti: number = 0
  notifications: AppNotification[] = []
  notiStatus: Map<string, string> = new Map();
  isNavigateNoti: boolean = false
  userID: number = 0
  fmcTokens: string[] = [];
  isShowNoti: boolean = false

  get takeTotalNoti() : number {
    return this.totalNoti;
  }

  get takeIsNavigateNoti() : boolean {
    return this.isNavigateNoti;
  }

  get takeFcmTokens() : string[] {
    return this.fmcTokens || [];
  }

  get checkShowNoti(): boolean {
    return this.isShowNoti;
  }

  @Mutation
  setIsShowNoti(isShowNoti: boolean): void {
    this.isShowNoti = isShowNoti;
  }

  @Mutation
  setTotalNotificationsUnread(res: any): void {
    this.totalNoti = res;
  }

  @Mutation
  setNotifications(res: any): void {
    this.notiStatus = new Map(Object.entries(res.notification_status_map));
  }

  @Mutation
  setUserID(userID: number): void {
    this.userID = userID;
  }

  @Mutation
  setIsNavigateNoti(isNavigateNoti: boolean): void {
    this.isNavigateNoti = isNavigateNoti;
  }

  @Mutation
  setFcmTokens(res: string[]): void {
    this.fmcTokens = res;
  }

  @Action({ commit: 'setNotifications', rawError: true })
  async getNotifications(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/get-notifications', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ commit: 'setTotalNotificationsUnread', rawError: true })
  async getTotalNotificationsUnread(param: any) : Promise<any> {
    const res = await axios!.$post('/notification/get-total-notifications-unread', { client_time: param });
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async editNotificationStatusRead(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/edit-notification-status-read', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async editNotificationStatus(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/edit-notification-status', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ rawError: true })
  async removeNotification(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/remove-notification', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }

  @Action({ commit: 'setFcmTokens', rawError: true })
  async getFcmTokens(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/get-fcm-tokens', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res.data;
  }

  @Action({ rawError: true })
  async createFcmToken(params: any) : Promise<any> {
    const res = await axios!.$post('/notification/create-fcm-token', params);
    if (res.status === FailResponseCode) {
      throw new Error(res.message);
    }

    return res;
  }
}
