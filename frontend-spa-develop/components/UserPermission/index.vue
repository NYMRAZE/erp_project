<template>
  <div>
    <div class="padding-sm-x mb-4">
      <b-button
        size="lg"
        variant="primary"
        class="btn btn-primary2 btn-link-profile mr-2 button_large_disabled"
        @click.prevent="handleOrganizationEmail">{{ $t("Basic setting") }}</b-button>
      <b-button
        size="lg"
        style="margin-left: 1%;"
        class="btn btn-primary2 btn-link-profile button_large_enabled">{{ $t("Users & permissions") }}</b-button>
    </div>
    <div class="filter-area mt-4">
      <ValidationObserver ref="observer" tag="form" @submit.prevent="getUserAndPermissions()">
        <div class="form-row">
          <div class="col-xl-5 col-lg-10 col-md-10 col-sm-7">
            <div class="form-row">
              <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 form-group">
                <label class="font-weight-bold" for="input-search">{{ $t("Search") }}</label>
                <input
                  id="email-filter"
                  v-model.trim="submitForm.name"
                  class="form-control"
                  type="text">
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-lg-2 col-md-2 col-sm-5 d-flex form-group align-items-start">
            <div class="form-row">
              <div class="col form-group">
                <label class="label-hide-sm font-weight-bold">&#8205;</label>
                <div>
                  <b-button class="btn btn-primary2 w-100px" type="submit"><i class="fa fa-search"></i> {{ $t("Search") }}</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="result_table table-responsive">
      <table class="table borderless">
        <thead>
          <tr class="table_header">
            <th scope="col">{{ $t('Name') }}</th>
            <th scope="col">{{ $t('Email') }}</th>
            <th scope="col">{{ $t('Role') }}</th>
            <th scope="col">{{ $t('Permissions') }}</th>
            <th scope="col">{{ $t('Action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in userAndPermissionList" :key="i" class="table_tr">
            <td class="table-left">
              {{ `${item.last_name} ${item.first_name}` }}
            </td>
            <td class="table-left">
              {{ item.email }}
            </td>
            <td class="table-left">
              {{ `${item.has_custom ? 'Custom' : getRoleById(item.roleId)}` }}
            </td>
            <td class="table-left font-italic">
              {{ `${getPermissionById(item.roleId)} ${item.has_custom ? 'and custom setting' : ''}` }}
            </td>
            <td class="btn-action-group">
              <!-- When status is pending -->
              <div v-if="isCanChangePermission(item.id)" class="list-actions" :style="`z-index:${userAndPermissionList.length - i}; right: -35px;`">
                <span class="text-secondary"><i class="fas fa-cogs"></i></span>
                <div class="group-actions-btn">
                  <div class="px-2 pt-2">{{ $t('List Actions') }}</div>
                  <hr class="my-1">
                  <span
                    class="d-flex align-items-center"
                    @click="settingPermission(item.id)">
                    <i class="fa fa-edit mr-2"></i>{{ $t("Setting Permission") }}
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 overflow-auto totalrow">
      <b-pagination-nav
        v-model="submitForm.current_page"
        class="brown-pagination float-right"
        :link-gen="linkGen"
        use-router
        :number-of-pages="totalPages > 0 ? totalPages : 1"
        align="center"
        limit="7"
        @input="searchByPagination">
      </b-pagination-nav>
      <div class="form-inline float-right mr-4">
        <span class="mr-2 txt-to-page">To page</span>
        <input
          v-model="submitForm.current_page"
          class="form-control input-jump-page"
          type="number"
          min="1"
          :max="totalPages"
          @keyup.enter="searchByPagination" />
      </div>
      <b-modal v-model="isShowPermissionModal" title="Access level">
        <template>
          <form ref="form" @submit.stop.prevent="handleSubmitAccess">
            <div v-for="[module_id, function_list] of response_user_modules_package.entries()" :key="module_id" class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="text-uppercase">{{ MODULES_NAME_CONST[module_id] }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in function_list" :key="index">
                    <td>
                      {{ FUNCTIONS_NAME_CONST[item.function_id] }}
                    </td>
                    <td>
                      <b-form-checkbox v-model="item.status" @input="handleUpdatePermission(item)">
                      </b-form-checkbox>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { layoutAdminStore, permissionsStore } from '~/store';
import { FUNCTIONS_NAME_CONST, MODULES_NAME_CONST } from '~/utils/common-const';

@Component({
  components: {
  }
})
export default class extends Vue {
  title : string = '';
  responseMessage: string = ''
  userName: string = ''
  isShowPermissionModal: boolean = false
  userId: number = 0
  isCreated: boolean = false
  FUNCTIONS_NAME_CONST: object = FUNCTIONS_NAME_CONST
  MODULES_NAME_CONST: object = MODULES_NAME_CONST
  submitForm = {
    current_page: 1,
    row_per_page: 10,
    name: ''
  }

  mounted() {
    setTimeout(() => {
      this.getUserAndPermissions();
    }, 100);
    this.title = this.$t('Settings') as string;
    layoutAdminStore.setTitlePage(this.title);
  }

  get roleList() {
    return permissionsStore.takeRoleList;
  }

  get permissionList() {
    return permissionsStore.takePermissionList;
  }

  get userAndPermissionList() {
    return permissionsStore.takeUserAndPermissionList;
  }

  get response_user_modules_package() {
    return permissionsStore.takeModuleList;
  }

  get moduleList() {
    return permissionsStore.takeModuleList;
  }

  get takePagination() {
    return permissionsStore.takePagination;
  }

  get totalRows() {
    return this.takePagination.total_row;
  }

  get rowPerPage() {
    return this.takePagination.row_per_page;
  }

  get totalPages() {
    let totalPage;
    const totalRow = this.totalRows;
    const rowPerPage = this.rowPerPage;
    if (totalRow % rowPerPage !== 0) {
      totalPage = Math.floor(totalRow / rowPerPage) + 1;
    } else {
      totalPage = totalRow / rowPerPage;
    }

    return totalPage;
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.submitForm.current_page === 1 && !this.submitForm.name) {
      fullPath = '/settings/user-permission';
    } else {
      fullPath = `/settings/user-permission?current_page=${this.submitForm.current_page}`;

      if (this.submitForm.name !== '') {
        fullPath += `&name=${this.submitForm.name}`;
      }
    }

    if (decodeURIComponent(this.$route.fullPath) !== fullPath) {
      try {
        await this.$router.replace(fullPath);
      } catch (e) {
      }
    }

    return fullPath;
  }

  // takeAssignPermission(permission: ModuleOrg[]) {
  //   let assignPermission: ModuleOrg[] = [];
  //   if (permission) {
  //     permission.forEach((value) => {
  //       const p : ModuleOrg = Object.assign({}, value);
  //       assignPermission = [ ...assignPermission, p ];
  //     });
  //   }

  //   return assignPermission;
  // }

  searchByPagination() {
    this.submitForm.name = this.userName;
    this.linkGen();
    this.getUserAndPermissions();
  }

  async getUserAndPermissions() {
    this.$nuxt.$loading.start();
    try {
      await permissionsStore.getUserAndPermissions(this.submitForm);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async settingPermission(userId: number) {
    this.userId = userId;
    await this.getFunctionPermissions();
    this.isShowPermissionModal = true;
  }

  async getFunctionPermissions() {
    try {
      await permissionsStore.getPermissions(this.userId);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  async handleUpdatePermission(item: any) {
    try {
      const NOT_ALLOWED = 2;
      const ALLOWED = 1;

      await permissionsStore.editPermissions({
        user_id: this.userId,
        function_id: item.function_id,
        status: item.status ? ALLOWED : NOT_ALLOWED
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  // async getPermissions(userId: number) {
  //   try {
  //     await permissionsStore.getPermissions(userId);
  //     if (this.moduleList && this.moduleList.length) {
  //       this.modules = this.takeAssignPermission(this.moduleList);
  //       this.isCreated = false;
  //     } else {
  //       this.modules = [
  //         { permission_id: this.RECRUITMENT, has_permission: false },
  //         { permission_id: this.SURVEY, has_permission: false },
  //         { permission_id: this.REQUEST, has_permission: false },
  //         { permission_id: this.TODOLIST, has_permission: false }
  //       ];
  //       this.isCreated = true;
  //     }
  //   } catch (err) {
  //     if (typeof err.response !== 'undefined') {
  //       this.responseMessage = err.response.data.message;
  //     } else {
  //       this.responseMessage = err;
  //     }
  //   } finally {
  //     this.isShowPermissionModal = true;
  //   }
  // }

  handleOrganizationEmail() {
    this.$router.push('/settings/organization-email');
  }

  getRoleById(id: number) {
    return this.roleList.get(id);
  }

  getPermissionById(id: number) {
    return this.permissionList.get(id);
  }

  isCanChangePermission(userid: number) {
    return userid !== this.$auth.user.id;
  }

  handleOk(bvModalEvt) {
    // Prevent modal from closing
    bvModalEvt.preventDefault();
    // Trigger submit handler
    this.handleSubmitAccess();
  }

  handleSubmitAccess() {
    // TODO submit call API update to table user permission after user handled in form with data response_user_modules_package
    console.log('submit modal access');
    // Hide the modal manually
    this.$nextTick(() => {
      this.isShowPermissionModal = false;
    });
  }
}
</script>
<style scoped>
td.btn-action-group {
  position: relative;
  width: 100px;
}
.list-actions {
  position: absolute;
  width: 100px;
}
.list-actions > span {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-actions:hover .group-actions-btn {
  transition: all .3s;
  display: block;
}
.group-actions-btn {
  position: relative;
  top: 5px;
  right: 115px;
  width: 180px;
  text-align: left;
  border: 1px solid #80bdff;
  border-radius: 5px;
  box-shadow: 0 0 15px 0 rgba(180, 207, 238, 0.45);
  display: none;
}
.group-actions-btn > span {
  padding: 10px;
  cursor: pointer;
}
.group-actions-btn > span:hover {
  background-color: #80bdff;
}
.group-actions-btn::before {
  content: "";
  z-index: -1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
}
.table_tr {
  text-align: left;
}
</style>
