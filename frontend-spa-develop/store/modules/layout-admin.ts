import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
  stateFactory: true,
  namespaced: true,
  name: 'modules/layout-admin'
})
export default class LayoutAdminModule extends VuexModule {
  // #main-content
  classBgMainContent : string = '';
  activeSidebar : boolean = false;
  isNeedSetting : boolean = false;
  isToggleSidebar : boolean = true;
  titlePage : string = '';
  iconTopPage : string = '';

  get takeClassBgMainContent() : string {
    return this.classBgMainContent;
  }

  get statusSidebar() : boolean {
    return this.activeSidebar;
  }

  get checkNeedSetting() : boolean {
    return this.isNeedSetting;
  }

  get takeToggleSidebar() : boolean {
    return this.isToggleSidebar;
  }

  get takeTitlePage() : string {
    return this.titlePage;
  }

  get takeIconTopPage() : string {
    return this.iconTopPage;
  }

  @Mutation
  setClassBgMainContent(classBgMainContent: string) : void {
    this.classBgMainContent = classBgMainContent;
  }

  @Mutation
  setNeedSetting(isNeedSetting: boolean) : void {
    this.isNeedSetting = isNeedSetting;
  }

  @Mutation
  setStatusSideBar(statusSidebar: boolean) : void {
    this.activeSidebar = statusSidebar;
  }

  @Action({ commit: 'setClassBgMainContent' })
  addClassBgMainContent(classBgMainContent: string) : string {
    return classBgMainContent;
  }

  @Mutation
  changeToggleSidebar() : void {
    this.isToggleSidebar = !this.isToggleSidebar;
  }

  @Mutation
  setTitlePage(titlePage : string) : void {
    this.titlePage = titlePage;
  }

  @Mutation
  setIconTopPage(iconTopPage: string): void {
    this.iconTopPage = iconTopPage;
  }
}
