<template>
  <div class="form-row">
    <div class="col-xl-7 col-lg-10 col-sm-10 col-sm-12">
      <div>
        <label class="font-weight-bold mt-3">{{ $t('Step') + ' 3 - 7' }}</label>
      </div>
      <div>
        <label class="font-weight-bold mt-4">{{ $t("Job title") }} <span class="text-important">({{ $t(`Manage your company's job title`) }})</span></label>
      </div>
      <div>
        <table class="table table-bordered text-center mt-4">
          <draggable v-model="jobTitles" handle=".handle" tag="tbody" draggable=".item" @change="handleDrag">
            <div class="ml-3 mr-3 mb-4">
              <label class="font-weight-bold mt-4 label_input">{{ $t('Input job title here') }}</label>
              <input
                  v-model="nameJobTitle"
                  type="text"
                  class="form-control"
                  @keyup.enter="addJobTitle" />
            </div>
            <tr v-show="jobTitles.length" v-for="(item, index) in jobTitles" :key="index" class="item handle drag-drop-item">
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
                          @blur.prevent="changeJobTitleName(index, item)"
                          @keyup.enter="changeJobTitleName(index, item)"
                          @input="handleInputJobTitle($event)">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                      <p v-if="posiError === index" class="invalid-feedback d-block text-left">{{ $t(errJobTitleExisted) }}</p>
                    </ValidationProvider>
                    <p v-if="errRequired" class="invalid-feedback d-block">{{ $t(errRequired) }}</p>
                    <p v-if="errJobTitleExisted && isShowExistCreateErr" class="invalid-feedback d-block">{{ $t(errJobTitleExisted) }}</p>
                  </div>
                  <i class="fas fa-trash-alt text-danger" :class="isItemMoved && 'd-none'" @click.prevent="removeJobTitle(index, item.id)"></i>
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
import { JobTitle } from '~/types/setting';

@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  nameJobTitle         : string = ''
  responseMessage      : string = ''
  errMessage           : string = ''
  errRequired          : string = ''
  errJobTitleExisted   : string = ''
  isShowExistCreateErr : boolean = true;
  posiError            : number = -1
  jobTitles            : JobTitle[] = []
  assignJobTitle       : JobTitle[] = []
  isItemMoved          : boolean = false
  originalJobtitles     : JobTitle[] = []

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.getJobTitle();
    }, 100);
  }

  async getJobTitle() {
    try {
      this.$nuxt.$loading.start();
      const res = await settingStore.getJobTitle();
      this.jobTitles = res.data || [];
      this.assignJobTitle = this.takeAssignJobTitle(res.data);
      this.originalJobtitles = res.data;
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

  takeAssignJobTitle(jobTitle: JobTitle[]) {
    let assignJobTitle: JobTitle[] = [];
    if (jobTitle) {
      jobTitle.forEach((value) => {
        const jobTitle : JobTitle = Object.assign({}, value);
        assignJobTitle = [ ...assignJobTitle, jobTitle ];
      });
    }

    return assignJobTitle;
  }

  async addJobTitle() {
    try {
      if (!this.nameJobTitle) {
        this.errRequired = 'This field is required';
      } else {
        this.errMessage = '';
        if (this.checkJobTitleExisted(this.jobTitles, this.nameJobTitle)) {
          this.isShowExistCreateErr = true;
          this.errJobTitleExisted = 'This job title is already exist.';
        } else {
          const res = await settingStore.createJobTitle({
            name: this.nameJobTitle,
            priority: this.jobTitles.length + 1
          });
          if (res) {
            this.responseMessage = res.message;
            this.nameJobTitle = '';
            await Promise.all([this.$auth.fetchUser(), this.getJobTitle()]);
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
        this.errJobTitleExisted = '';
      }, 3000);
    }
  }

  removeJobTitle(index: number, id: number) {
    try {
      const $this = this;
      const msgModalConfirm = this.$tc(
        'Do you want to <span style="color: red; "><strong>DELETE</strong></span> this job title?'
      );
      this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, async function() {
        await settingStore.removeJobTitle(id).then((res) => {
          $this.jobTitles.splice(index, 1);
          $this.responseMessage = res.message;
        });
        await $this.getJobTitle();
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

  async changeJobTitleName(index: number, item: JobTitle) {
    try {
      const observer: any = this.$refs.observer;
      const isValid = await observer.validate();
      if (isValid && this.assignJobTitle[index].name !== item.name && item.name) {
        if (this.checkJobTitleExisted(this.assignJobTitle, item.name)) {
          this.isShowExistCreateErr = false;
          this.errJobTitleExisted = 'This job title is already exist.';
          this.posiError = index;
        } else {
          this.errJobTitleExisted = '';
          this.posiError = -1;
          await settingStore.editJobTitle(item).then((res) => {
            this.jobTitles[index].name = item.name;
            this.responseMessage = res.message;
          });
          await this.getJobTitle();
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
        this.errJobTitleExisted = '';
        this.responseMessage = '';
      }, 3000);
    }
  }

  handleInputJobTitle(event) {
    const jobTitleName = event.value;
    if (!this.checkJobTitleExisted(this.assignJobTitle, jobTitleName)) {
      this.errJobTitleExisted = '';
      this.posiError = -1;
    }
  }

  checkJobTitleExisted(jobTitles: JobTitle[], jobTitleName: string) {
    if (Array.isArray(jobTitles)) {
      if (!jobTitles.length) {
        return false;
      }
      return jobTitles.some(jobTitle => jobTitle.name === jobTitleName);
    }

    return true;
  }

  handleDrag() {
    this.isItemMoved = JSON.stringify(this.originalJobtitles) !== JSON.stringify(this.jobTitles);
    this.assignJobTitle = this.takeAssignJobTitle(this.jobTitles);
  }

  async handleEditPriority() {
    try {
      const priorityList: any = [];
      if (this.isItemMoved) {
        this.jobTitles.forEach((item, index) => {
          priorityList.push({ id: item.id, priority: index + 1 });
        });

        const res = await settingStore.sortPrioritizationJobTitle({
          organization_id: this.$auth.user.organization_id,
          priorities: priorityList });
        this.responseMessage = res.message;
        this.isItemMoved = false;
        await this.getJobTitle();
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

  previousSetting() {
    this.$router.push('/settings/branch');
  }

  nextSetting() {
    if (this.jobTitles && !this.jobTitles.length) {
      this.errMessage = this.$t('Please enter job title') as string;
      setTimeout(() => {
        this.errMessage = '';
      }, 3000);
    } else {
      this.$router.push('/settings/interest-technology');
    }
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
.btn-width {
  width: 70px;
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
