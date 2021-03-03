<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-interest-technology class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fas fa-quidditch"></i>
        <span>{{ $t("Interested technology") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-interest-technology">
      <div class="card-body">
        <div class="form-row">
          <div class="col-md-12 col-lg-6 col-xl-4">
            <!-- list interest technology -->
            <div v-for="(item, index) in interestTechnology" :key="index" class="tag-skill">
              <span class="tag-skill-text">
                {{ item.technology_name }}
              </span>
              <button type="button" class="close tag-skill-close" @click="removeTag(index, item.id)">
                <span>&times;</span>
              </button>
            </div>
            <!-- End list interest technology -->
          </div>
        </div>
      </div>
      <div class="card-body border-top">
        <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleAddTechnology()">
          <div class="form-row">
            <div class="form-group col-md-12 col-lg-6 col-xl-3">
              <label for="create-year-target">
                <b>{{ $t("Technology") }}</b>
              </label>
              <ValidationProvider
                ref="select_technology"
                v-slot="{ errors }"
                rules="required"
                name="technology">
                <select
                  id="create-year-target"
                  v-model.number="technologyForm.id"
                  class="form-control"
                  :class="{'is-invalid': submitted && errors[0]}">
                  <option :value="null"></option>
                  <option v-for="(item, index) in technologyList" :key="index" :value="index">{{ item }}</option>
                </select>
                <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-warning btn-add">
            <i class="fa fa-plus"></i> {{ $t("Add") }}
          </button>
        </ValidationObserver>
      </div>
      <div class="card-footer-profile card-footer">
        <p
          :class="{ 'd-block': errorEditInterestTechnology !== '' }"
          class="invalid-feedback">
          {{ $t(errorEditInterestTechnology) }}
        </p>
        <button
          type="button"
          class="btn btn-success"
          @click="confirmSaveTechnology()">
          <i class="fa fa-save"></i> {{ $t("Save") }}
        </button>
      </div>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { InterestTechnology, UserTechnology, RemoveTechnologyParams } from '~/types/user-profile';
import { userProfileStore } from '~/store/index';

@Component({
  components: {
  }
})

export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  interestTechnology : InterestTechnology[] | [] = [];
  technologyForm : InterestTechnology = {
    technology_name: '',
    id: null
  };
  submitted: boolean = false;
  errorEditInterestTechnology : string = '';
  msgSuccessEditInterestTechnology : string = '';
  userTechnology: UserTechnology[] = []
  assignTechnology: InterestTechnology[] = []
  removeTechnologyList: RemoveTechnologyParams[] = []

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.reloadData();
    }, 100);
  }

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get technologyList() {
    return userProfileStore.takeTechnologyList;
  }

  takeAssignTechnology(technology: InterestTechnology[]) {
    let assignTechnology: InterestTechnology[] = [];
    if (technology) {
      technology.forEach((value) => {
        const technologyObj : InterestTechnology = Object.assign({}, value);
        assignTechnology = [ ...assignTechnology, technologyObj ];
      });
    }

    return assignTechnology;
  }

  async handleAddTechnology() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.technologyForm.technology_name = this.technologyList && this.technologyForm.id
        ? this.technologyList[this.technologyForm.id]
        : '';

      if (!this.checkTechnologyUnique(this.technologyForm.technology_name)) {
        const errorDoubleSkill = this.$t('This technology is already exist.') as string;

        (this.$refs.select_technology as any).applyResult({
          errors: [errorDoubleSkill],
          valid: false,
          failedRules: {}
        });

        return false;
      }
      const technology : InterestTechnology =  Object.assign({}, this.technologyForm);

      this.interestTechnology = [ ...this.interestTechnology, technology ];
      this.userTechnology.push({
        user_id: this.userId,
        technology_id: this.technologyForm.id
      });
      this.technologyForm.id = null;
      this.technologyForm.technology_name = '';

      this.submitted = false;
    }
  }

  checkTechnologyUnique(technologyName: string) {
    if (!(Array.isArray(this.interestTechnology) && this.interestTechnology.length)) {
      return true;
    }
    const exist = this.interestTechnology.find(
      item => item.technology_name === technologyName
    );

    return !exist;
  }

  confirmSaveTechnology() {
    const msgModalConfirm = this.$t('Are you sure you want to edit interest technology?') as string;

    const $this = this;
    this.$emit('callModalConfirm', msgModalConfirm, function() {
      $this.saveInterestTechnology();
    });
  }

  async saveInterestTechnology() {
    this.msgSuccessEditInterestTechnology = '';
    this.errorEditInterestTechnology = '';
    this.$nuxt.$loading.start();

    try {
      if (this.interestTechnology.length > this.assignTechnology.length) {
        await userProfileStore.createUserTechnologies(this.userTechnology).then((res) => {
          const msgSuccessEditInterestTechnology = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditInterestTechnology);
        });
        this.userTechnology = [];
      } else if (this.removeTechnologyList.length !== 0) {
        await userProfileStore.removeTechnologiesOfUser(this.removeTechnologyList).then((res) => {
          this.msgSuccessEditInterestTechnology = res.message;
        });
        this.removeTechnologyList = [];
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditInterestTechnology = err.response.data.message;
      } else {
        this.errorEditInterestTechnology = err.message;
      }
    } finally {
      this.assignTechnology = [];
      await this.reloadData();
      this.$nuxt.$loading.finish();
    }
  }

  async reloadData() {
    try {
      const res = await userProfileStore.getTechnologiesOfUser(this.userId);
      this.interestTechnology = res;
      this.assignTechnology = this.takeAssignTechnology(res);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditInterestTechnology = err.response.data.message;
      }
    }
  }

  removeTag(indexTag: number, id: number) {
    if (this.interestTechnology.length > 0) {
      let isTechExist = false;
      for (const item of this.assignTechnology) {
        if (item.id === id) {
          isTechExist = true;
          break;
        }
      }

      this.interestTechnology = this.interestTechnology.filter(function(item, index) {
        return index !== indexTag;
      });
      this.userTechnology = this.userTechnology.filter(function(item) {
        return item.technology_id !== id;
      });
      if (isTechExist) {
        this.removeTechnologyList.push({
          id: id,
          user_id: this.userId
        });
      }
    }
  }
}
</script>
<style scoped>
  .tag-skill {
    display: inline-block;
    padding: 0.3em 0.4em 0.3em;
    background-color: #F0F2F5;
    color: #596780;
    border: 1px solid #6C757D;
    border-radius: 5px;
    margin-bottom: 5px;
    margin-right: 3px;
  }
  .tag-skill-text {
    font-weight: bold;
  }
  .tag-skill-close {
    margin-left: 0.5em;
  }
  .tag-skill-close span {
    line-height: 0.9;
    display: block;
  }
</style>
