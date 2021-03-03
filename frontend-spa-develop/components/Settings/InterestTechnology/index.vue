<template>
  <div class="form-row">
    <div class="col-xl-7 col-lg-10 col-sm-10 col-sm-12">
      <div>
        <label class="font-weight-bold mt-3">{{ $t('Step') + ' 4 - 7' }}</label>
      </div>
      <div>
        <label class="font-weight-bold mt-4">{{ $t("Interest technology") }} <span class="text-important">({{ $t(`Manage your company's interest technology`) }})</span></label>
      </div>
      <div>
        <table class="table table-bordered text-center mt-4">
          <draggable v-model="technologies" handle=".handle" tag="tbody" draggable=".item" @change="handleDrag">
            <div class="ml-3 mr-3 mb-4">
              <label class="font-weight-bold mt-4 label_input">{{ $t('Input interest technology here') }}</label>
              <input
                  v-model="nameTechnology"
                  type="text"
                  class="form-control"
                  @keyup.enter="addTechnology">
              <p v-if="errInvalidInput" class="invalid-feedback d-block">{{ $t(errInvalidInput) }}</p>
              <p v-if="errTechExisted && isShowExistCreateErr" class="invalid-feedback d-block">{{ $t(errTechExisted) }}</p>
            </div>
            <tr v-show="technologies.length"  v-for="(item, index) in technologies" :key="index" class="item handle drag-drop-item">
              <td class="pt-3-half">
                <div class="d-flex align-items-center">
                  <div class="w-100">
                    <ValidationProvider ref="tech_name" v-slot="{ errors }" rules="eval_required">
                      <input
                          v-model="item.name"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': errors[0] || posiError === index }"
                          :disabled="isItemMoved"
                          @blur.prevent="changeTechnologyName(index, item)"
                          @keyup.enter="changeTechnologyName(index, item)"
                          @input="handleInputTech($event)">
                      <p v-if="errors[0]" class="invalid-feedback text-left">{{ errors[0] }}</p>
                      <p v-if="posiError === index" class="invalid-feedback d-block text-left">{{ $t(errTechExisted) }}</p>
                    </ValidationProvider>
                  </div>
                  <i class="fas fa-trash-alt text-danger" :class="isItemMoved && 'd-none'" @click.prevent="removeTechnology(index, item.id)"></i>
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
import { InterestTechnology } from '~/types/setting';

@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  nameTechnology       : string = ''
  responseMessage      : string = ''
  errMessage           : string = ''
  errInvalidInput      : string = ''
  errTechExisted       : string = ''
  isShowExistCreateErr : boolean = true;
  technologies         : InterestTechnology[] = []
  assignTechnology     : InterestTechnology[] = []
  posiError            : number = -1
  isItemMoved          : boolean = false
  originalTechnologies : InterestTechnology[] = []

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.getTechnology();
    }, 100);
  }

  async getTechnology() {
    this.$nuxt.$loading.start();
    try {
      const res = await settingStore.getTechnologies();
      this.technologies = res.data || [];
      this.assignTechnology = this.takeAssignTechnology(res.data);
      this.originalTechnologies = res.data;
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

  takeAssignTechnology(Technology: InterestTechnology[]) {
    let assignTechnology: InterestTechnology[] = [];
    if (Technology) {
      Technology.forEach((value) => {
        const Technology : InterestTechnology = Object.assign({}, value);
        assignTechnology = [ ...assignTechnology, Technology ];
      });
    }

    return assignTechnology;
  }

  async addTechnology() {
    try {
      if (!this.nameTechnology) {
        this.errInvalidInput = 'This field is required';
      } else {
        this.errMessage = '';
        if (this.checkTechnologyExisted(this.technologies, this.nameTechnology)) {
          this.isShowExistCreateErr = true;
          this.errTechExisted = 'This technology is already exist.';
        } else {
          const res = await settingStore.createTechnologies({
            name: this.nameTechnology,
            priority: this.technologies.length + 1
          });
          if (res) {
            this.responseMessage = res.message;
            this.nameTechnology = '';
            await Promise.all([this.$auth.fetchUser(), this.getTechnology()]);
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
        this.errInvalidInput = '';
        this.responseMessage = '';
        this.errMessage = '';
        this.errTechExisted = '';
      }, 3000);
    }
  }

  removeTechnology(index: number, id: number) {
    try {
      const $this = this;
      const msgModalConfirm = this.$tc(
        'Do you want to <span style="color: red; "><strong>DELETE</strong></span> this interest technology?'
      );
      this.showModalConfirm(this.$tc('Confirm delete'), msgModalConfirm, async function() {
        await settingStore.removeTechnologies(id).then((res) => {
          $this.technologies.splice(index, 1);
          $this.responseMessage = res.message;
        });
        await $this.getTechnology();
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

  async changeTechnologyName(index: number, item: InterestTechnology) {
    try {
      const observer: any = this.$refs.observer;
      const isValid = await observer.validate();
      if (isValid && this.assignTechnology[index].name !== item.name && item.name) {
        if (this.checkTechnologyExisted(this.assignTechnology, item.name)) {
          this.isShowExistCreateErr = false;
          this.errTechExisted = 'This technology is already exist.';
          this.posiError = index;
        } else {
          this.errTechExisted = '';
          this.posiError = -1;
          await settingStore.editTechnologies(item).then((res) => {
            this.technologies[index].name = item.name;
            this.responseMessage = res.message;
          });
          await this.getTechnology();
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
        this.errTechExisted = '';
        this.responseMessage = '';
      }, 3000);
    }
  }

  handleInputTech(event) {
    const techName = event.value;
    if (!this.checkTechnologyExisted(this.assignTechnology, techName)) {
      this.errTechExisted = '';
      this.posiError = -1;
    }
  }

  checkTechnologyExisted(technologies: InterestTechnology[], nameTechnology: string) {
    if (Array.isArray(technologies)) {
      if (!technologies.length) {
        return false;
      }
      return technologies.some(tech => tech.name === nameTechnology);
    }

    return true;
  }

  handleDrag() {
    this.isItemMoved = JSON.stringify(this.originalTechnologies) !== JSON.stringify(this.technologies);
    this.assignTechnology = this.takeAssignTechnology(this.technologies);
  }

  async handleEditPriority() {
    try {
      const priorityList: any = [];
      if (this.isItemMoved) {
        this.technologies.forEach((item, index) => {
          priorityList.push({ id: item.id, priority: index + 1 });
        });

        const res = await settingStore.sortPrioritizationTechnologies({
          organization_id: this.$auth.user.organization_id,
          priorities: priorityList });
        this.responseMessage = res.message;
        this.isItemMoved = false;
        await this.getTechnology();
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
    this.$router.push('/settings/job-title');
  }

  nextSetting() {
    if (this.technologies && !this.technologies.length) {
      this.errMessage = this.$t('Please enter interest technology') as string;
      setTimeout(() => {
        this.errMessage = '';
      }, 3000);
    } else {
      this.$router.push('/settings/overtime');
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
