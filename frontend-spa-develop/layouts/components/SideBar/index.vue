<template>
  <aside id="sidebar" :class="{ 'toggled': !toggleSidebar }">
    <nuxt-link id="logo" to="/">
      <img :src="logo" width="140px" height="40px" />
    </nuxt-link>
    <div
      v-if="!toggleSidebar"
      @click="changeToggleSidebar()"
      type="button"
      class="btn-hide-sidebar d-block d-lg-none">
      <i class="icon-hide-sidebar fas fa-caret-left"></i>
    </div>
    <ul id="list-sidebar">
      <li>
        <nuxt-link to="/home-admin">
          <i class="fas fa-home"></i>
          <span class="nav-label">{{ $t('Dashboard') }}</span>
        </nuxt-link>
      </li>
      <li v-if="response_user_modules_package.has(MODULES_CONST.HRM.toString())">
        <a v-b-toggle.hrm-slidebar href="javascript:void(0)">
          <i class="fa fa-users"></i>
          <span class="nav-label">HRM</span>
          <span class="when-opened fas fa-caret-up fa-pull-right"></span>
          <span class="when-closed fas fa-caret-down fa-pull-right"></span>
        </a>
        <b-collapse id="hrm-slidebar" class="mt-2">
          <ul v-for="(item, index) in response_user_modules_package.get(MODULES_CONST.HRM.toString())" :key="index" class="sub-menu">
            <li v-if="item.function_id === FUNCTIONS_CONST['HRM_PROFILE_LIST'] && PERMISSION_STATUS[item.status]">
              <nuxt-link class="nav-link" to="/hrm/profile-list">
                <span class="sub-nav-label">{{ $t("Manage members") }}</span>
              </nuxt-link>
            </li>
            <li v-if="item.function_id === FUNCTIONS_CONST['HRM_HISTORY_USER_LEAVE'] && PERMISSION_STATUS[item.status]">
              <nuxt-link class="nav-link" to="/hrm/history-user-leave">
                <span class="sub-nav-label">{{ $t("Leave") }}</span>
              </nuxt-link>
            </li>
            <li v-if="item.function_id === FUNCTIONS_CONST['HRM_TIMEKEEPING_LIST'] && PERMISSION_STATUS[item.status]">
              <nuxt-link class="nav-link" to="/hrm/timekeeping-list">
                <span class="sub-nav-label">{{ $t("Timekeeping") }}</span>
              </nuxt-link>
            </li>
          </ul>
        </b-collapse>
      </li>
      <li v-if="response_user_modules_package.has(MODULES_CONST.EVALUATION.toString())" v-for="(item, index) in response_user_modules_package.get(MODULES_CONST.EVALUATION.toString())" :key="index">
        <nuxt-link to="/evaluation/create-eval-user" v-if="item.function_id === FUNCTIONS_CONST['EVALUATION_CREATE_EVAL_USER'] && PERMISSION_STATUS[item.status]">
          <i class="fa fa-tasks"></i>
          <span class="nav-label">{{ $t('Evaluation') }}</span>
        </nuxt-link>
      </li>
      <li v-if="response_user_modules_package.has(MODULES_CONST.WORKFLOW.toString())">
        <a v-b-toggle.projects-slidebar href="javascript:void(0)">
          <i class="fas fa-project-diagram"></i>
          <span class="nav-label">Workflow</span>
          <span class="when-opened fas fa-caret-up fa-pull-right"></span>
          <span class="when-closed fas fa-caret-down fa-pull-right"></span>
        </a>
        <b-collapse id="projects-slidebar" class="mt-2">
          <ul
            v-for="(item, index) in response_user_modules_package.get(MODULES_CONST.WORKFLOW.toString())"
            :key="index"
            class="sub-menu">
            <li v-if="item.function_id === FUNCTIONS_CONST['WORKFLOW_PROJECT_LIST'] && PERMISSION_STATUS[item.status]">
              <nuxt-link to="/workflow/project-list">
                <span class="sub-nav-label">{{ $t("Project list") }}</span>
              </nuxt-link>
            </li>
          </ul>
        </b-collapse>
      </li>
      <li v-if="response_user_modules_package.has(MODULES_CONST.RECRUITMENT.toString())">
        <a v-b-toggle.recruitment-slidebar href="javascript:void(0)">
          <i class="fas fa-user-plus"></i>
          <span class="nav-label">{{ $t("Recruitment") }}</span>
          <span class="when-opened fas fa-caret-up fa-pull-right"></span>
          <span class="when-closed fas fa-caret-down fa-pull-right"></span>
        </a>
        <b-collapse id="recruitment-slidebar" class="mt-2">
          <ul
            v-for="(item, index) in response_user_modules_package.get(MODULES_CONST.RECRUITMENT.toString())"
            :key="index"
            class="sub-menu">
            <li v-if="item.function_id === FUNCTIONS_CONST['RECRUITMENT_MANAGE_RECRUITMENT'] && PERMISSION_STATUS[item.status]">
              <nuxt-link to="/recruitment/manage-recruitment">
                <span class="sub-nav-label">{{ $t("Manage recruitment") }}</span>
              </nuxt-link>
            </li>
          </ul>
        </b-collapse>
      </li>
      <li v-if="response_user_modules_package.has(MODULES_CONST.REQUEST.toString())">
        <a v-b-toggle.timekeeping-slidebar href="javascript:void(0)">
          <i class="fas fa-user-clock"></i>
          <span class="nav-label">Request</span>
          <span class="when-opened fas fa-caret-up fa-pull-right"></span>
          <span class="when-closed fas fa-caret-down fa-pull-right"></span>
        </a>
        <b-collapse id="timekeeping-slidebar" class="mt-2">
          <ul
            v-for="(item, index) in response_user_modules_package.get(MODULES_CONST.REQUEST.toString())"
            :key="index"
            class="sub-menu">
            <li v-if="item.function_id === FUNCTIONS_CONST['REQUEST_MANAGE_OVERTIME'] && PERMISSION_STATUS[item.status]">
              <nuxt-link to="/request/manage-overtime">
                <span class="sub-nav-label">{{ $t("Manage overtime") }}</span>
              </nuxt-link>
            </li>
          </ul>
        </b-collapse>
      </li>
      <li v-if="isGeneralManager">
        <a v-b-toggle.settings-slidebar href="javascript:void(0)">
          <nuxt-link to="/settings/organization-email">
            <i class="fas fa-project-diagram"></i>
            <span class="nav-label">{{ $t('Settings') }}</span>
          </nuxt-link>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { GeneralManagerRoleID, UserRoleID, ManagerRoleID, AdminRoleID } from '~/utils/responsecode';
import { layoutAdminStore } from '~/store/index';
import { FINISHSETTING, MODULES_CONST, FUNCTIONS_CONST, PERMISSION_STATUS } from '~/utils/common-const';
import { FunctionPermission } from '~/types/permissions';

@Component({})
export default class extends Vue {
  logo : string = require('~/assets/images/logo_erp.png');
  roleUserID: number = this.$auth.user.role_id
  isMember: boolean = this.roleUserID === UserRoleID
  isGeneralManager: boolean =  this.$auth.user.role_id === GeneralManagerRoleID
  isManager: boolean = this.$auth.user.role_id === ManagerRoleID
  isAdmin: boolean = this.$auth.user.role_id === AdminRoleID
  responseMessage: string = ''
  MODULES_CONST: object = MODULES_CONST
  FUNCTIONS_CONST: object = FUNCTIONS_CONST
  PERMISSION_STATUS: object = PERMISSION_STATUS
  response_user_modules_package: Map<string, FunctionPermission[]> = new Map()

  beforeMount() {
    this.response_user_modules_package = new Map(Object.entries(this.$auth.user.func_permission));
    console.log('111 - Test');
    console.log(this.response_user_modules_package);
    console.log(this.response_user_modules_package.has(MODULES_CONST.EVALUATION.toString()));
    console.log(this.response_user_modules_package.get(MODULES_CONST.EVALUATION.toString()));
  }

  mounted() {
    const isNeedSetting = this.$auth.user.setting_step !== FINISHSETTING;
    layoutAdminStore.setNeedSetting(isNeedSetting);
  }

  get toggleSidebar() {
    return layoutAdminStore.takeToggleSidebar;
  }

  get isNeedSetting() {
    return layoutAdminStore.checkNeedSetting;
  }

  get statusSidebar() {
    return layoutAdminStore.statusSidebar;
  }

  changeToggleSidebar() {
    layoutAdminStore.changeToggleSidebar();
  }
};
</script>
<style scoped>
#logo {
  margin-top: 25px;
  display: block;
  text-align: center;
}
#sidebar {
  width: 256px;
  margin-left: -256px;
  background: linear-gradient(177.47deg, #5B86E5 8.99%, #2CA7F2 99.61%);
  position: relative;
}
#sidebar.toggled  {
  margin-left: 0;
}
#list-sidebar {
  list-style:none;
  width: 256px;
  margin-top: 62px;
}
#list-sidebar > li > a {
  padding: 16px 25px 16px 25px;
}
#list-sidebar li a {
  color: white;
  text-decoration:none;
  display: block;
}
#list-sidebar li a:hover {
  background-color: #6492E8;
  border-left: 3px solid #FFF;
  color:#FFF;
}
.nav-label {
  margin-left: 25px;
}
#list-sidebar > li > a.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
ul.sub-menu > li > a {
  padding: 16px 25px 16px 74px;
}
.btn-hide-sidebar {
  width: 47px;
  height: 47px;
  border: 3px solid #F5F6F8;
  position: absolute;
  right: -25px;
  top: 27px;
  color: #ffffff;
  z-index: 100;
  border-radius: 50%;
  background-color: #363740;
  text-align: center;
  font-size: 36px;
}
.icon-hide-sidebar {
  position: absolute;
  top: 3px;
  left: 11px;
}
@media (min-width: 992px) {
  #sidebar {
    margin-left: 0 !important;
  }
}
</style>
