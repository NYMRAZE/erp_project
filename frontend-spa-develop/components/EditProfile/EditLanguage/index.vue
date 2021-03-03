<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-language class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-language"></i>
        <span>{{ $t("Language") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-language">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyLanguage()">
        <div class="container-card-body">
          <!-- List language -->
          <div
            v-for="(item, index) in languageList"
            :key="index"
            class="block-user-languge card-body border-top"
            :class="{ 'border-top' : index !== 0 }">
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Language') + '(' + (index + 1) + ')'">
                  <p class="text-dark font-weight-bold">{{ $t("Language") }}</p>
                  <select
                    v-model.number="item.language_id"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                    <option
                      v-for="(languageItem, languageIndex) in languageItemList"
                      :key="languageIndex"
                      :value="languageIndex">
                      {{ $t(languageItem) }}
                    </option>
                  </select>
                  <span v-show="errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="form-group col">
                <p class="text-dark font-weight-bold">{{ $t("Proficiency") }}</p>
                <div>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    :name="$t('Proficiency') + '(' + (index + 1) + ')'">
                    <b-form-radio-group
                      v-model.number="item.level_id"
                      :name="'proficiency' + index"
                      :state="checkStateRadio(errors[0])">
                      <div
                        v-for="(levelItem, levelIndex) in levelLanguageItemList"
                        :key="levelIndex"
                        class="form-check form-check-inline">
                        <b-form-radio
                          :value="levelIndex">
                          {{ $t(levelItem) }}
                        </b-form-radio>
                      </div>
                    </b-form-radio-group>
                    <span v-if="submitted && errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6" :class="item.language_id === 2 ? 'col-xl-4' : ''">
                <p class="text-dark font-weight-bold">{{ $t("Certificate") }}</p>
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="`Certificate ${index + 1}`">
                  <textarea
                    v-if="item.language_id !== 2"
                    v-model.trim="languageList[index].certificate"
                    class="form-control"
                    rows="6" />
                  <select
                    v-else
                    v-model.trim="languageList[index].certificate"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                    <option
                      v-for="language in JpLanguageProfiles"
                      :key="language.id"
                      :value="language.name">
                      {{ language.name }}
                    </option>
                  </select>
                  <span v-show="errors[0]" class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div>
              <button type="button" class="btn btn-danger" @click="removeItemLanguage(index)">
                <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
              </button>
            </div>
          </div>
          <!-- End List language -->
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditLanguage !== '' }" class="invalid-feedback">{{ $t(errorEditLanguage) }}</p>
          <div>
            <button
              type="button"
              class="btn btn-warning btn-add"
              @click="addItemLanguage()">
              <i class="fa fa-plus"></i> {{ $t("Add") }}
            </button>
            <button
              type="submit"
              class="btn btn-success">
              <i class="fa fa-save"></i> {{ $t("Save") }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { userProfileStore } from '~/store/index';
import { Language } from '~/types/user-profile';
import { LanguageProfileInterface } from '~/types/language';
import { JpLanguageProfiles } from '~/utils/common-const';

@Component({
  components: {
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  languageList : Language[] | [] = this.languageArr;
  submitted : boolean = false;
  errorEditLanguage : string = '';
  msgSuccessEditLanguage : string = '';
  JpLanguageProfiles: LanguageProfileInterface[] = JpLanguageProfiles;

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get languageArr() {
    let newArray : Language[] | [] = [];

    if (this.userProfile && this.userProfile.language) {
      this.userProfile.language.forEach((value) => {
        const itemLanguage : Language = Object.assign({}, value);

        newArray = [ ...newArray, itemLanguage ];
      });
    }

    return newArray;
  }

  get languageItemList() {
    return userProfileStore.takeLanguageList;
  }

  get levelLanguageItemList() {
    return userProfileStore.takeLevelLanguageList;
  }

  async handleModifyLanguage() {
    this.submitted = true;
    this.msgSuccessEditLanguage = '';
    this.errorEditLanguage = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msgModalConfirm = this.$t('Are you sure to edit language?');

      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveLanguage();
      });
    }
  }

  async saveLanguage() {
    this.$nuxt.$loading.start();

    try {
      userProfileStore.editLanguage(this.languageList);
      const res = await userProfileStore.updateProfile();
      const msgSuccessEditLanguage = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditLanguage);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditLanguage = err.response.data.message;
      } else {
        this.errorEditLanguage = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  addItemLanguage() {
    const newItemLanguage : Language = {
      language_id: null,
      level_id: null,
      certificate: ''
    };

    this.languageList = [ ...this.languageList, newItemLanguage ];
  }

  removeItemLanguage(indexLanguageItem: number) {
    if (this.languageList.length > 0) {
      this.languageList = this.languageList.filter(function(item, index) {
        return index !== indexLanguageItem;
      });
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.languageList = this.userProfile ? this.languageArr : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditLanguage = err.response.data.message;
      } else {
        this.errorEditLanguage = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  checkStateRadio(errorStr: string) {
    return errorStr ? false : null;
  }
}
</script>
