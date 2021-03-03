<template>
  <div class="d-flex" @click="handleShowNoti($event)">
    <SideBar />
    <main
      id="main-content"
      :class="classBgMainContent">
      <TopNav />
      <div id="container-body" class="container-fluid mt-4">
        <nuxt />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import TopNav from '~/layouts/components/TopNav/index.vue';
import Footer from '~/layouts/components/Footer/index.vue';
import SideBar from '~/layouts/components/SideBar/index.vue';
import { layoutAdminStore, notificationStore } from '~/store/index';

@Component({
  components: {
    TopNav,
    Footer,
    SideBar
  }
})
export default class extends Vue {
  get classBgMainContent() {
    return layoutAdminStore.takeClassBgMainContent;
  }

  setStatusSidebar() {
    const statusSidebar = layoutAdminStore.statusSidebar;
    layoutAdminStore.setStatusSideBar(!statusSidebar);
  }

  handleShowNoti(event) {
    const listNoti = this.$children[1].$children[2].$children[0] as any;
    const bellNoti = this.$children[1].$children[2] as any;

    if (listNoti && !listNoti.$el.contains(event.target) && listNoti.isShowNoti &&
    bellNoti && !bellNoti.$el.contains(event.target)) {
      notificationStore.setIsShowNoti(false);
    }
  }
};
</script>

<style scoped>
#main-content {
  min-width: 100%;
  width: 100vw;
  min-height: 100vh;
  background: #F5F6F8;
}
@media (min-width: 992px) {
  #main-content {
    min-width: 0;
  }
  #container-body {
    padding-left: 30px;
    padding-right: 30px;
  }
}
/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  #container-body {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
