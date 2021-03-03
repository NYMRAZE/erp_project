<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-experience class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-building"></i>
        <span>{{ $t("Experience") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-experience">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyExperience()">
        <div class="container-experience-body">
          <div
            v-for="(item, index) in experienceList"
            :key="index"
            class="block-user-experience card-body"
            :class="{ 'border-top' : index !== 0 }">
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-12 col-xl-8 mb-0">
                  <ValidationProvider v-slot="{ errors }" rules="required" :name="'company(' + index + ')'">
                    <p class="text-left font-weight-bold">{{ $t("Company") }}</p>
                    <div class="row">
                      <div class="col-xl-6 pr-1">
                        <input
                          v-model="item.company"
                          type="text"
                          class="form-control mr-2"
                          :class="{ 'is-invalid': submitted && errors[0] }">
                      </div>
                      <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                      <div class="col-xl-6 pl-2">
                        <div class="d-flex group-action-btn">
                          <button
                            type="button"
                            class="btn btn-warning text-white mr-2"
                            @click="addNewProject(index)">
                            <i class="fa fa-plus"></i> {{ $t("Add Project") }}
                          </button>
                          <button
                            type="button"
                            class="btn btn-danger"
                            @click="removeItemExperience(index)">
                            <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div v-for="(project, i) in item.projects" :key="i">
                <div class="form-row mt-2">
                  <div class="form-group col-md-12 col-lg-6 col-xl-4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      :name="$t('Project') + '(' + (i + 1) + ')'">
                      <p class="text-dark font-weight-bold">{{ $t("Project") }}</p>
                      <input
                        v-model="project.project"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && errors[0] }">
                      <span v-if="submitted && errors[0]" class="invalid-feedback">{{ removeSubString(errors[0]) }}</span>
                    </ValidationProvider>
                  </div>
                  <div class="form-group col-md-12 col-lg-6 col-xl-4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      :name="$t('Position') + '(' + (i + 1) + ')'">
                      <p class="text-dark font-weight-bold">{{ $t("Position") }}</p>
                      <input
                        v-model="project.position"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && errors[0] }">
                      <span v-if="submitted && errors[0]" class="invalid-feedback">{{ removeSubString(errors[0]) }}</span>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-12 col-lg-6 col-xl-4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      :rules="'required|dateBeforeToday|dateBeforeOrEqual:dateto' + i"
                      :vid="'datefrom' + i"
                      :name="$t('From date') + '(' + (i + 1) + ')'">
                      <p class="text-dark font-weight-bold">{{ $t("From date") }}</p>
                      <datepicker
                        v-model="project.start_date"
                        :format="datePickerFormat"
                        :typeable="false"
                        :bootstrap-styling="true"
                        :calendar-button="true"
                        :input-class="{ 'is-invalid': errors[0] }"
                        calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                        :language="datePickerLang"
                        placeholder="YYYY/MM/dd">
                      </datepicker>
                      <span v-if="errors[0]" class="d-block invalid-feedback">{{ $t(removeSubString(errors[0])) }}</span>
                    </ValidationProvider>
                  </div>
                  <div class="form-group col-md-12 col-lg-6 col-xl-4">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required|dateBeforeToday"
                      :name="$t('To date') + '(' + (i + 1) + ')'"
                      :vid="'dateto' + i">
                      <p class="text-dark font-weight-bold">{{ $t("To date") }}</p>
                      <datepicker
                        v-model="project.end_date"
                        :format="datePickerFormat"
                        :typeable="false"
                        :bootstrap-styling="true"
                        :calendar-button="true"
                        :input-class="{ 'is-invalid': errors[0] }"
                        calendar-button-icon="fa fa-calendar-alt datepicker_icon"
                        :language="datePickerLang"
                        placeholder="YYYY/MM/dd">
                      </datepicker>
                      <span v-if="errors[0]" class="d-block invalid-feedback">{{ $t(removeSubString(errors[0])) }}</span>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-12 col-lg-8 col-xl-8">
                    <p class="text-dark font-weight-bold">{{ $t("Description") }}</p>
                    <textarea v-model="project.technology" class="form-control" rows="6"></textarea>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="removeProjectJoined(index, i)">
                  <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditExperience !== '' }" class="invalid-feedback">
            {{ $t(errorEditExperience) }}
          </p>
          <div>
            <button
              type="button"
              class="btn btn-warning btn-add"
              @click="addNewExperience()">
              <i class="fa fa-plus"></i> {{ $t("Add Experience") }}
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
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { userProfileStore } from '~/store/index';
import { Experience, Project } from '~/types/user-profile';

@Component({
  components: {
    Datepicker
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  experienceList : Experience[] | [] = this.experienceArr;
  datePickerFormat : string = 'yyyy/MM/dd';
  dateFormatDatabase : string = 'YYYY-MM-DD';
  submitted : boolean = false;
  errorEditExperience : string = '';
  msgSuccessEditExperience : string = '';
  langDatepicker    : any    = LangDatepicker

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
  }

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get experienceArr() {
    let newArray : Experience[] | [] = [];

    if (this.userProfile && this.userProfile.experience) {
      this.userProfile.experience.forEach((value) => {
        let newProject : Project[] | [] = [];
        if (Array.isArray(value.projects) && value.projects.length) {
          value.projects.forEach((project) => {
            const itemProject : Project = Object.assign({}, project);
            newProject = [ ...newProject, itemProject ];
          });
          const itemExperience : Experience = Object.assign({}, { company: value.company, projects: newProject });
          newArray = [ ...newArray, itemExperience ];
        }
      });
    }

    return newArray;
  }

  async handleModifyExperience() {
    this.submitted = true;
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      this.submitted = false;

      const msgModalConfirm = this.$t('Are you sure to edit experience?');

      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveExperience();
      });
    }
  }

  async saveExperience() {
    this.$nuxt.$loading.start();
    this.errorEditExperience  = '';
    this.msgSuccessEditExperience = '';

    try {
      this.experienceList.forEach((item) => {
        item.projects.forEach((project) => {
          project.start_date = moment(project.start_date!).format(this.dateFormatDatabase);
          project.end_date = moment(project.end_date!).format(this.dateFormatDatabase);
        });
      });
      userProfileStore.editExperience(this.experienceList);
      const res = await userProfileStore.updateProfile();
      this.msgSuccessEditExperience = res.message;
      const successMsg = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditExperience = err.response.data.message;
      } else {
        this.errorEditExperience = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  addNewExperience() {
    const newItemExperience : Experience = {
      company: '',
      projects: [{
        start_date: '',
        end_date: '',
        position: '',
        project: '',
        technology: ''
      }]
    };

    this.experienceList = [ ...this.experienceList, newItemExperience ];
  }

  addNewProject(index: number) {
    const newProject : Project = {
      start_date: '',
      end_date: '',
      position: '',
      project: '',
      technology: ''
    };

    const company: Experience = this.experienceList[index];
    company.projects = [ ...company.projects, newProject ];
  }

  findCompanyByName(companyName: string): Experience {
    const company = this.experienceList.find(element => element.company === companyName);
    return company || {
      company: '',
      projects: []
    };
  }

  removeItemExperience(indexExperienceItem: number) {
    if (this.experienceList.length > 0) {
      this.experienceList = this.experienceList.filter(function(item, index) {
        return index !== indexExperienceItem;
      });
    }
  }

  removeProjectJoined(index: number, posi: number) {
    const company = this.experienceList[index];
    company.projects.splice(posi, 1);
  }

  removeSubString(errString: string) {
    return errString.replace(errString.substring(
      errString.indexOf('('), errString.indexOf(')') + 1), '');
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.experienceList = this.userProfile ? this.experienceArr : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditExperience = err.response.data.message;
      } else {
        this.errorEditExperience = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>

<style scoped>
.company {
  display: flex;
  flex-direction: row;
}
@media (max-width: 767px) {
  .company {
    display: flex;
    flex-direction: column;
  }
  .group-action-btn {
    margin-top: 10px;
    margin-left: 8px;
  }
}
</style>
