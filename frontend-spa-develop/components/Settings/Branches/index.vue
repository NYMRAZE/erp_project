<template>
  <div class="form-row">
    <div class="col-xl-7 col-lg-10 col-sm-10 col-sm-12">
      <div>
        <label class="font-weight-bold mt-3">{{ $t('Step') + ' 2 - 7' }}</label>
      </div>
      <div>
        <label class="font-weight-bold mt-4">{{ $t("Branch") }} <span class="text-important">({{ $t(`Manage your company's branches`) }})</span></label>
      </div>
      <div>
        <table class="table table-bordered text-center mt-4">
          <draggable v-model="branches" handle=".handle" tag="tbody" draggable=".item" @change="handleDrag">
            <div class="ml-3 mr-3 mb-4">
              <label class="font-weight-bold mt-4 label_input">{{ $t('Input your branch here') }}</label>
              <input
                  v-model="nameBranch"
                  type="text"
                  class="form-control"
                  @keyup.enter="addBranch" />
            </div>
            <tr v-show="branches.length"  v-for="(item, index) in branches" :key="index" class="item handle drag-drop-item">
              <td class="pt-3-half">
                <div class="d-flex align-items-center">
                  <div class="w-100">
                    <ValidationProvider v-slot="{ errors }" rules="eval_required">
                      <input
                          v-model="item.name"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': errors[0] || posiError === index }"
                          :disabled="isItemMoved"
                          @blur.prevent="changeBranchName(index, item)"
                          @keyup.enter="changeBranchName(index, item)"
                          @input="handleInputBranch($event)">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                      <p v-if="posiError === index" class="invalid-feedback d-block text-left">{{ $t(errBranchExisted) }}</p>
                    </ValidationProvider>
                  </div>
                  <i
                      class="fas fa-trash-alt text-danger"
                      :class="isItemMoved && 'd-none'"
                      @click.prevent="removeBranch(index, item.id)" />
                </div>
              </td>
            </tr>
          </draggable>
        </table>
        <p class="text-success">{{ $t(responseMessage) }}</p>
        <p class="text-danger">{{ $t(errMessage) }}</p>
      </div>
      <div class="d-flex justify-content-end bd-highlight mb-3">
        <div>
          <b-button class="btn-save-previous" @click="previousSetting">Previous</b-button>
        </div>
        <div><b-button class="btn-save-next ml-3" @click="nextSetting">Next</b-button></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import draggable from 'vuedraggable';
import { settingStore } from '~/store';
import { Branches } from '~/types/setting';

@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  nameBranch           : string = ''
  responseMessage      : string = ''
  errMessage           : string = ''
  errRequired          : string = ''
  errBranchExisted     : string = ''
  isShowExistCreateErr : boolean = true;
  branches             : Branches[] = []
  assignBranches       : Branches[] = []
  posiError            : number = -1
  isItemMoved          : boolean = false
  originalBranches : Branches[] = []

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.getBranches();
    }, 100);
  }

  async getBranches() {
    try {
      this.$nuxt.$loading.start();
      const res = await settingStore.getBranches();
      this.branches = res.data || [];
      this.assignBranches = this.takeAssignBranches(res.data);
      this.originalBranches = res.data;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  takeAssignBranches(branches: Branches[]) {
    let assignBranches: Branches[] = [];
    if (branches) {
      branches.forEach((value) => {
        const branch : Branches = Object.assign({}, value);
        assignBranches = [ ...assignBranches, branch ];
      });
    }

    return assignBranches;
  }

  async addBranch() {
    try {
      if (!this.nameBranch) {
        this.errRequired = 'This field is required';
      } else {
        this.errMessage = '';
        if (this.checkBranchExisted(this.branches, this.nameBranch)) {
          this.isShowExistCreateErr = true;
          this.errBranchExisted = 'This branch is already exist.';
        } else {
          const res = await settingStore.createBranch({ name: this.nameBranch, priority: this.branches.length + 1 });
          if (res) {
            this.responseMessage = res.message;
            this.nameBranch = '';
            await Promise.all([this.$auth.fetchUser(), this.getBranches()]);
          }
        }
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.errRequired = '';
        this.responseMessage = '';
        this.errMessage = '';
        this.errBranchExisted = '';
      }, 3000);
    }
  }

  removeBranch(index: number, id: number) {
    try {
      const $this = this;
      const msgModalConfirm = this.$tc('Do you want to DELETE this branch?');
      this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, async function() {
        await settingStore.removeBranch(id).then((res) => {
          $this.branches.splice(index, 1);
          $this.responseMessage = res.message;
        });
        await $this.getBranches();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.responseMessage = '';
        this.errMessage = '';
      }, 3000);
    }
  }

  async changeBranchName(index: number, item: Branches) {
    try {
      const observer: any = this.$refs.observer;
      const isValid = await observer.validate();
      if (isValid && this.assignBranches[index].name !== item.name && item.name) {
        if (this.checkBranchExisted(this.assignBranches, item.name)) {
          this.isShowExistCreateErr = false;
          this.errBranchExisted = 'This branch is already exist.';
          this.posiError = index;
        } else {
          this.errBranchExisted = '';
          this.posiError = -1;
          await settingStore.editBranch(item).then((res) => {
            this.branches[index].name = item.name;
            this.responseMessage = res.message;
          });
          await this.getBranches();
        }
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.errBranchExisted = '';
        this.responseMessage = '';
      }, 3000);
    }
  }

  checkBranchExisted(branches: Branches[], nameBranch: string) {
    if (Array.isArray(branches)) {
      if (!branches.length) {
        return false;
      }
      return branches.some(branch => branch.name === nameBranch);
    }

    return true;
  }

  handleInputBranch(event) {
    const branchName = event.value;
    if (!this.checkBranchExisted(this.assignBranches, branchName)) {
      this.errBranchExisted = '';
      this.posiError = -1;
    }
  }

  handleDrag() {
    this.isItemMoved = JSON.stringify(this.originalBranches) !== JSON.stringify(this.branches);
    this.assignBranches = this.takeAssignBranches(this.branches);
  }

  async handleEditPriority() {
    try {
      const priorityList: any = [];
      if (this.isItemMoved) {
        this.branches.forEach((item, index) => {
          priorityList.push({ id: item.id, priority: index + 1 });
        });

        const res = await settingStore.sortPrioritizationBranches({
          organization_id: this.$auth.user.organization_id,
          priorities: priorityList });
        this.responseMessage = res.message;
        this.isItemMoved = false;
        await this.getBranches();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errMessage = err.response.data.message;
      } else {
        this.errMessage = err.message;
      }
    } finally {
      setTimeout(() => {
        this.responseMessage = '';
        this.errMessage = '';
      }, 3000);
    }
  }

  nextSetting() {
    if (this.branches && !this.branches.length) {
      this.errMessage = this.$t('Please enter your branches') as string;
      setTimeout(() => {
        this.errMessage = '';
      }, 3000);
    } else {
      this.$router.push('/settings/job-title');
    }
  }

  previousSetting() {
    this.$router.push('/settings/organization-email');
  }

  showModalConfirm(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true,
      cancelTitle     : this.$t('Cancel') as string
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }
}
</script>
<style scoped>
#container-header {
  padding: 0.75rem 0.75rem;
  background-color: #ffffff;
}
table {
  background-color: #ffffff;
}
#title-page {
  margin-bottom: 0;
}
.wrap {
  width: 50%;
  margin: auto;
}
table > thead > tr > th:nth-child(2) {
  width: 75%;
}
table > tbody > tr > td:nth-child(1) {
  vertical-align: middle;
}
table > tbody > tr > td input {
  border: none;
  background-color: inherit;
}
.card-title-setting {
  margin-bottom: 0;
  vertical-align: middle;
}
.card-header-setting {
  cursor: pointer;
  background-color: #ffffff;
}
div.card-header-setting.collapsed .when-opened,
div.card-header-setting:not(.collapsed) .when-closed {
  display: none;
}
.drag-drop-item {
  cursor: move;
  cursor: -webkit-grab;
  cursor: -moz-grab;
}
.drag-drop-item:active {
  cursor: move;
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
}
.label_input {
  float: left;
}
</style>
