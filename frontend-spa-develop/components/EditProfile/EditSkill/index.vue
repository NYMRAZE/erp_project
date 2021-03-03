<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-skill class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-star"></i>
        <span>{{ $t("Skill") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-skill">
      <div class="card-body border-top">
        <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="confirmSaveSkill()">
          <div
            v-for="(item, index) in skillList"
            :key="index"
            class="block-user-languge card-body border-top"
            :class="{ 'border-top' : index !== 0 }">
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-3">
                <ValidationProvider
                  ref="input_skill_title"
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Skill')">
                  <p class="text-dark font-weight-bold">{{ $t("Skill") }}</p>
                  <input
                    v-model.trim="item.title"
                    class="form-control"
                    type="text"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                  <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group col-md-12 col-lg-6 col-xl-2">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required|floatNum"
                  :name="$t('Years of experience')">
                  <p class="text-dark font-weight-bold">{{ $t('Years of experience') }}</p>
                  <input
                    v-model.number="item.years_of_experience"
                    class="form-control"
                    type="text"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                  <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group col-md-12 col-xl-7">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Level') + '(' + (index + 1) + ')'">
                  <p class="text-dark font-weight-bold">{{ $t("Level") }}</p>
                  <b-form-radio-group
                    v-model.number="item.level"
                    :name="'Level' + index"
                    :state="checkStateRadio(errors[0])">
                    <div
                      v-for="[key, value] in levelSkillList"
                      :key="key"
                      class="form-check form-check-inline">
                      <b-form-radio
                        :value="key">
                        {{ value }}
                      </b-form-radio>
                    </div>
                  </b-form-radio-group>
                  <span v-if="submitted && errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div>
              <button type="button" class="btn btn-danger" @click="removeTag(index)">
                <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
              </button>
            </div>
          </div>
        </ValidationObserver>
      </div>
      <div class="card-footer-profile card-footer">
        <p :class="{ 'd-block': errorEditSkill !== '' }" class="invalid-feedback">{{ $t(errorEditSkill) }}</p>
        <div>
          <button
            type="button"
            class="btn btn-warning btn-add"
            @click="addSkill()">
            <i class="fa fa-plus"></i> {{ $t("Add") }}
          </button>
          <button
            type="button"
            class="btn btn-success"
            @click="confirmSaveSkill()">
            <i class="fa fa-save"></i> {{ $t("Save") }}
          </button>
        </div>
      </div>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { Skill } from '~/types/user-profile';
import { userProfileStore } from '~/store/index';

@Component({
  components: {
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  skillList : Skill[] | [] = this.skillArr;
  submitted: boolean = false;
  errorEditSkill : string = '';
  msgSuccessEditSkill : string = '';

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get levelSkillList() {
    return userProfileStore.takeLevelSkillList;
  }

  get skillArr() {
    let newArray : Skill[] | [] = [];

    if (this.userProfile && this.userProfile.skill) {
      this.userProfile.skill.forEach((value) => {
        const item: Skill = Object.assign({}, value);
        newArray = [ ...newArray, item ];
      });
    }

    return newArray;
  }

  addSkill() {
    const newSkill : Skill = {
      title: '',
      level: null,
      years_of_experience: null
    };

    this.skillList = [ ...this.skillList, newSkill ];
  }

  async confirmSaveSkill() {
    this.submitted = true;
    this.msgSuccessEditSkill = '';
    this.errorEditSkill = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msgModalConfirm = this.$t('Are you sure to edit skill?');

      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function () {
        $this.saveSkill();
      });
    }
  }

  async saveSkill() {
    this.msgSuccessEditSkill = '';
    this.errorEditSkill = '';
    this.$nuxt.$loading.start();

    try {
      userProfileStore.editSkill(this.skillList);
      const res = await userProfileStore.updateProfile();
      const msgSuccessEditSkill = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditSkill);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditSkill = err.response.data.message;
      } else {
        this.errorEditSkill = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.skillList = this.userProfile ? this.skillArr : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditSkill = err.response.data.message;
      } else {
        this.errorEditSkill = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  removeTag(indexTag: number) {
    if (this.skillList.length > 0) {
      this.skillList = this.skillList.filter(function(item, index) {
        return index !== indexTag;
      });
    }
  }

  checkStateRadio(errorStr: string) {
    return errorStr ? false : null;
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
#rank-skill {
  width: 50px;
}
</style>
