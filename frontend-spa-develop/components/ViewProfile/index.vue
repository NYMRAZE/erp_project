<template>
  <div>
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-edit-profile class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-user-edit"></i>
          <span>{{ $t("Profile") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>

      <b-collapse id="collapse-edit-profile" visible>
        <div class="card-body">
          <div class="form-row">
            <div class="col-md-4 col-lg-3 col-xl-2">
              <div id="container-avatar">
                <div id="container-avatar-img">
                  <img
                    :src="avatarSrc"
                    class="img-fluid"
                    alt="avatar">
                </div>
              </div>
            </div>
            <div class="col-md-8 col-lg-9 col-xl-10">
              <div class="form-row">
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("First name") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.first_name }}</div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Last name") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.last_name }}</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Email") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.email }}</div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Phone number") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.phone_number }}</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Birthday") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.birthday }}</div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Role") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.role_name }}</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Job title") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.job_title_name }}</div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Rank") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.rank_name }}</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Entering company") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">
                      {{ userInfo.company_joined_date }}
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Branch") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.branch_name }}</div>
                  </div>
                </div>
                <div class="form-group col-md-12 col-lg-8 col-xl-6">
                  <div class="form-row">
                    <div class="text-dark font-weight-bold col-md-auto col-lg-4 col-xl-4">
                      {{ $t("Employee id") }}
                    </div>
                    <div class="col-md-auto col-lg-auto col-xl-auto">{{ userInfo.employee_id }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer-profile card-footer">
          <button
            :disabled="!isGeneralManager && !isManager && !isOwnProfile"
            type="button"
            class="btn btn-success"
            @click="routeEditProfile()">
            <i class="fas fa-user-edit"></i>{{ $t("Edit Profile") }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="exportPDF()">{{ $t('Export Pdf') }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="backBtn">{{ $t("Back") }}
          </button>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-education -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-education class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-user-graduate"></i>
          <span>{{ $t("Education") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-education" visible>
        <div class="container-education-body">
          <div class="block-user-education card-body border-top">
            <div v-for="(item, index) in userInfo.education" :key="index" class="row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <p class="text-dark font-weight-bold">{{ item.title }}</p>
                <p>・ {{ $t("School") }} : {{ item.university }}</p>
                <p style="white-space: pre-line">・ {{ $t("Achievements") }} : {{ item.achievement }} </p>
                <p>・ {{ $t("Duration") }} : {{ convertDisplayDate(item.start_date) }} - {{ convertDisplayDate(item.end_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-skill -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-skill class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-star"></i>
          <span>{{ $t("Skill") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-skill" visible>
        <div class="card-body">
          <div class="form-row">
            <div class="col-md-12 col-lg-6 col-xl-12">
              <div v-for="(item, index) in userInfo.skill" :key="index" class="tag-skill mr-3">
                <p class="text-dark font-weight-bold">{{ item.title }}</p>
                <p>・ {{ $t("Level") }} : {{ levelSkillList.get(item.level.toString()) }}</p>
                <p>・ {{ $t("Years of experience") }} : {{ item.years_of_experience }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-experience -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-experience class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-building"></i>
          <span>{{ $t("Experience") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-experience" visible>
        <div class="container-experience-body">
          <div class="block-user-experience card-body border-top">
            <table
              v-for="(item, index) in userInfo.experience"
              :key="index"
              class="table table-striped-cell table-responsive-sm table-bordered">
              <thead>
                <tr>
                  <th colspan="4">{{ `${$t("Company")}: ${item.company}` }}</th>
                </tr>
              </thead>
              <tbody class="align-middle">
                <tr>
                  <th class="text-center" style="width: 15%">{{ $t("Time") }}</th>
                  <th class="text-center" style="width: 35%">{{ $t("Project") }}</th>
                  <th class="text-center" style="width: 15%">{{ $t("Position") }}</th>
                  <th class="text-center" style="width: 35%">{{ $t("Description") }}</th>
                </tr>
                <tr v-for="(project, i) in item.projects" :key="i">
                  <td class="table-left">
                    {{ formatDate(project.start_date) + ' - ' + formatDate(project.end_date) }}
                  </td>
                  <td class="table-left">
                    {{ project.project }}
                  </td>
                  <td class="table-left">
                    {{ project.position }}
                  </td>
                  <td class="table-left">
                    <p style="white-space: pre-line;">{{ project.technology }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-languge -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-language class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-language"></i>
          <span>{{ $t("Language") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-language" visible>
        <div class="container-card-body">
          <div class="block-user-languge card-body border-top">
            <div v-for="(item, index) in userInfo.language" :key="index" class="row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <p class="text-dark font-weight-bold">{{ listLanguageName[item.language_id] }}</p>
                <p>・ {{ $t("Proficiency") }} : {{ $t(listLevelLanguageName[item.level_id]) }}</p>
                <p style="white-space: pre-line">・ {{ $t("Certificate") }} :  {{ $t(item.certificate) }} </p>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-interest-technology -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-interest-technology class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fas fa-quidditch"></i>
          <span>{{ $t("Interested technology") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-interest-technology" visible>
        <div class="container-card-body">
          <div class="card-body border-top">
            <div class="form-group col-md-12 col-lg-6 col-xl-4">
              <div v-for="(item, index) in interestTechnology" :key="index" class="tag-skill">
                <span class="tag-skill-text">
                  {{ item.technology_name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-certificate -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-certificate class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-certificate"></i>
          <span>{{ $t("Certificate") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-certificate" visible>
        <div class="container-certificate-body">
          <div class="block-user-certificate card-body border-top">
            <div v-for="(item, index) in userInfo.certificate" :key="index" class="row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <p class="text-dark font-weight-bold">{{ item.title }}</p>
                <p style="white-space: pre-line">・ {{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-award -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-award class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-trophy"></i>
          <span>{{ $t("Award") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-award" visible>
        <div class="container-award-body">
          <div class="block-user-award card-body border-top">
            <div v-for="(item, index) in userInfo.award" :key="index" class="row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <p class="text-dark font-weight-bold">{{ item.title }}</p>
                <p style="white-space: pre-line">・ {{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>

    <!-- block-user-introduce -->
    <div class="block-card card mt-4">
      <div v-b-toggle.collapse-user-introduce class="card-header-profile card-header">
        <h5 class="card-title-profile card-title text-dark">
          <i class="fa fa-id-badge"></i>
          <span>{{ $t("Introduce myself") }}</span>
          <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
          <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
        </h5>
      </div>
      <b-collapse id="collapse-user-introduce" visible>
        <div class="card-body">
          <div class="row">
            <div class="form-group col-lg-12 col-xl-8">
              <p class="text-dark font-weight-bold">{{ $t("Description") }}</p>
              <div style="white-space: pre-line"> {{ userInfo.introduce }} </div>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import moment from 'moment';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { InterestTechnology, Project } from '~/types/user-profile';
import { userProfileStore } from '~/store/index';
import { GeneralManagerRoleID, ManagerRoleID } from '~/utils/responsecode';

@Component({
})
export default class extends Vue {
  userId : number = this.userInfo ? this.userInfo.user_id : 0;
  displayDateFormat : string = 'YYYY/MM/DD';
  databaseDateFormat : string = 'YYYY-MM-DD';
  submitted     : boolean = false;
  isGeneralManager: boolean = this.$auth.user.role_id === GeneralManagerRoleID;
  isManager: boolean = this.$auth.user.role_id === ManagerRoleID;
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  interestTechnology : InterestTechnology[] | [] = [];

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.reloadData();
    }, 100);
  }

  get userInfo() {
    return userProfileStore.userProfileInfo ?  userProfileStore.userProfileInfo : null;
  }

  get avatarSrc() {
    let linkAvatar : string = this.defaultAvatar;

    if (this.userInfo && this.userInfo.avatar) {
      linkAvatar = 'data:image/png;base64,' + this.userInfo.avatar;
    }

    return linkAvatar;
  }

  get listLanguageName() {
    return userProfileStore.takeLanguageList;
  }

  get listLevelLanguageName() {
    return userProfileStore.takeLevelLanguageList;
  }

  get levelSkillList() {
    return userProfileStore.takeLevelSkillList;
  }

  get isOwnProfile() {
    return !!(this.userInfo && this.$auth.user.id === this.userInfo.user_id);
  }

  async reloadData() {
    try {
      this.interestTechnology = await userProfileStore.getTechnologiesOfUser(this.userId);
    } catch (err) {
    }
  }

  convertDisplayDate(databaseDate: string) {
    return moment(databaseDate, this.databaseDateFormat).format(this.displayDateFormat);
  }

  backBtn() {
    this.$router.back();
  }

  routeEditProfile() {
    if (this.isOwnProfile) {
      return this.$router.push('/hrm/edit-profile/');
    } else if (this.isGeneralManager || this.isManager) {
      const editUserId = this.userInfo && this.userInfo.user_id;
      return this.$router.push('/hrm/edit-profile/' + editUserId);
    }
  }

  formatDate(date: string) {
    return moment(new Date(date)).format('L');
  }

  get basicInfoPdf(): object {
    let basicInfo: object = {};
    if (this.userInfo) {
      basicInfo = {
        columns: [
          {
            width: '50%',
            stack: [
              this.avatarSrc !== this.defaultAvatar ? {
                image: this.avatarSrc,
                width: 100,
                height: 100,
                style: 'textCenter'
              } : {},
              {
                text: `${this.userInfo.first_name} ${this.userInfo.last_name}`,
                margin: [0, 20, 0, 10],
                style: ['header', 'textCenter']
              }
            ]
          },
          {
            width: '50%',
            stack: [
              {
                columns: [
                  { text: 'Birthday', margin: [0, 5, 0, 5], bold: true, width: '30%' },
                  { text: this.userInfo && this.userInfo.birthday ? this.userInfo.birthday : '', margin: [0, 5, 0, 5] }
                ]
              },
              {
                columns: [
                  { text: 'Phone', margin: [0, 5, 0, 5], bold: true, width: '30%' },
                  {
                    text: this.userInfo && this.userInfo.phone_number ? this.userInfo.phone_number : '',
                    margin: [0, 5, 0, 5]
                  }
                ]
              },
              {
                columns: [
                  { text: 'Email', margin: [0, 5, 0, 5], bold: true, width: '30%' },
                  { text: this.userInfo && this.userInfo.email ? this.userInfo.email : '', margin: [0, 5, 0, 5] }
                ]
              }
            ]
          }
        ]
      };
    }

    return basicInfo;
  }

  get introducePdf(): object {
    let introduce: object = {};
    if (this.userInfo && this.userInfo.introduce) {
      introduce = {
        table: {
          widths: ['100%'],
          body: [
            [
              {
                alignment: 'justify',
                text: `${this.userInfo.introduce}`
              }
            ]
          ]
        },
        layout: {
          paddingLeft: function() { return 20; },
          paddingRight: function() { return 20; },
          paddingTop: function() { return 20; },
          paddingBottom: function() { return 20; }
        }
      };
    }

    return introduce;
  }

  get educationPdf(): object {
    let education: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.education) && this.userInfo.education.length) {
      education = {
        table: {
          widths: ['30%', '70%'],
          body: this.educationArray
        }
      };
    }

    return education;
  }

  get educationArray(): object[] {
    const content: object[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.education) && this.userInfo.education.length) {
      content.push([
        { text: 'From - To', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
        { text: 'School Name', bold: true, style: 'textCenter', fillColor: '#ffcc7c' }
      ]);
      for (const education of this.userInfo.education) {
        const data: any[] = [];
        data.push(`${education.start_date
          ? this.convertDisplayDate(education.start_date)
          : ''} - ${education.end_date
          ? this.convertDisplayDate(education.end_date)
          : ''}`
        );
        data.push({
          stack: [
            { text: education.university, bold: true, margin: [0, 0, 0, 10] },
            { text: education.title, bold: true, margin: [0, 0, 0, 10] },
            education.achievement
          ]
        });

        content.push(data);
      }
    }

    return content;
  }

  get skillPdf(): object {
    let skill: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.skill) && this.userInfo.skill.length) {
      skill = {
        table: {
          widths: ['30%', '70%'],
          body: this.skillArray
        }
      };
    }

    return skill;
  }

  get skillArray(): object[] {
    const content: object[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.skill) && this.userInfo.skill.length) {
      for (const skill of this.userInfo.skill) {
        const data: any[] = [];
        data.push({ text: skill.title, bold: true, style: 'textCenter', margin: [0, 15, 0, 0] });
        data.push({
          stack: [
            {
              columns: [
                { text: 'Level', bold: true, width: '40%', margin: [0, 0, 0, 10] },
                { text: `: ${skill.level ? this.levelSkillList.get(skill.level.toString()) : ''}` }
              ]
            },
            {
              columns: [
                { text: 'Years of experience', bold: true, width: '40%', margin: [0, 0, 0, 10] },
                { text: `: ${skill.years_of_experience}` }
              ]
            }
          ]
        });

        content.push(data);
      }
    }

    return content;
  }

  get experiencePdf(): object {
    const experiences: any[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.experience) && this.userInfo.experience.length) {
      for (const experience of this.userInfo.experience) {
        experiences.push({
          margin: [0, 0, 0, 15],
          table: {
            widths: ['15%', '35%', '35%', '15%'],
            body: this.experienceArray(experience.company, experience.projects)
          }
        });
      }
    }

    return experiences;
  }

  experienceArray(company: string, projects: Project[]) {
    const content: object[] = [];
    content.push([
      { text: `Company: ${company}`, colSpan: 4, bold: true, fillColor: '#81b27f', style: 'heading2' },
      {}, {}, {}
    ]);
    content.push([
      { text: 'Time', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
      { text: 'Project', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
      { text: 'Description', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
      { text: 'Position', bold: true, style: 'textCenter', fillColor: '#ffcc7c' }
    ]);

    for (const project of projects) {
      content.push([
        `${project.start_date
          ? this.convertDisplayDate(project.start_date)
          : ''} - ${project.end_date
          ? this.convertDisplayDate(project.end_date)
          : ''}`, project.project, project.technology, project.position
      ]);
    }

    return content;
  }

  get languagePdf(): object {
    let language: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.language) && this.userInfo.language.length) {
      language = {
        table: {
          widths: ['30%', '30%', '40%'],
          body: this.languageArray
        }
      };
    }

    return language;
  }

  get languageArray(): object[] {
    const content: object[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.language) && this.userInfo.language.length) {
      content.push([
        { text: 'Language', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
        { text: 'Proficiency', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
        { text: 'Certificate', bold: true, style: 'textCenter', fillColor: '#ffcc7c' }
      ]);
      for (const language of this.userInfo.language) {
        content.push([
          this.listLanguageName && language.language_id ? this.listLanguageName[language.language_id.toString()] : '',
          this.listLevelLanguageName && language.level_id ? this.listLevelLanguageName[language.level_id] : '',
          language.certificate
        ]);
      }
    }

    return content;
  }

  get technologyPdf(): object {
    let certificate: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.interest_technology) && this.userInfo.interest_technology.length) {
      const technologyLength = this.userInfo.interest_technology.length;
      const content: string[] = [];
      this.userInfo.interest_technology.forEach((technology, index) => {
        index === technologyLength - 1
          ? content.push(`${technology.technology_name}, `)
          : content.push(`${technology.technology_name}`);
      });
      certificate = { text: content };
    }

    return certificate;
  }

  get certificatePdf(): object {
    let certificate: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.certificate) && this.userInfo.certificate.length) {
      certificate = {
        table: {
          widths: ['40%', '60%'],
          body: this.certificateArray
        }
      };
    }

    return certificate;
  }

  get certificateArray(): object[] {
    const content: object[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.certificate) && this.userInfo.certificate.length) {
      content.push([
        { text: 'Certificate Name', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
        { text: 'Description', bold: true, style: 'textCenter', fillColor: '#ffcc7c' }
      ]);
      for (const certificate of this.userInfo.certificate) {
        content.push([certificate.title, certificate.description]);
      }
    }

    return content;
  }

  get awardPdf(): object {
    let award: object = {};
    if (this.userInfo && Array.isArray(this.userInfo.award) && this.userInfo.award.length) {
      award = {
        table: {
          widths: ['40%', '60%'],
          body: this.awardArray
        }
      };
    }

    return award;
  }

  get awardArray(): object[] {
    const content: object[] = [];
    if (this.userInfo && Array.isArray(this.userInfo.award) && this.userInfo.award.length) {
      content.push([
        { text: 'Award Name', bold: true, style: 'textCenter', fillColor: '#ffcc7c' },
        { text: 'Description', bold: true, style: 'textCenter', fillColor: '#ffcc7c' }
      ]);
      for (const award of this.userInfo.award) {
        content.push([award.title, award.description]);
      }
    }

    return content;
  }

  exportPDF() {
    if (this.userInfo) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const docDefinition = {
        content: [
          this.basicInfoPdf,
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },
          this.userInfo.introduce ? {
            text: 'INTRODUCE',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.introducePdf,
          Array.isArray(this.userInfo.education) && this.userInfo.education.length ? {
            text: 'EDUCATION',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.educationPdf,
          Array.isArray(this.userInfo.skill) && this.userInfo.skill.length ? {
            text: 'SKILL',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.skillPdf,
          Array.isArray(this.userInfo.experience) && this.userInfo.experience.length ? {
            text: 'EXPERIENCE',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.experiencePdf,
          Array.isArray(this.userInfo.language) && this.userInfo.language.length ? {
            text: 'LANGUAGE',
            margin: [0, 15, 0, 30],
            style: 'heading1'
          } : {},
          this.languagePdf,
          Array.isArray(this.userInfo.interest_technology) && this.userInfo.interest_technology.length ? {
            text: 'INTERESTED TECHNOLOGY',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.technologyPdf,
          Array.isArray(this.userInfo.certificate) && this.userInfo.certificate.length ? {
            text: 'CERTIFICATE',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.certificatePdf,
          Array.isArray(this.userInfo.award) && this.userInfo.award.length ? {
            text: 'AWARD',
            margin: [0, 30, 0, 30],
            style: 'heading1'
          } : {},
          this.awardPdf
        ],
        styles: {
          header: {
            fontSize: 28,
            bold: true
          },
          heading1: {
            fontSize: 18,
            bold: true
          },
          heading2: {
            fontSize: 16,
            bold: true
          },
          textCenter: {
            alignment: 'center'
          }
        }
      };

      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      pdfMake.createPdf(docDefinition).download(`${this.userInfo.first_name}_${this.userInfo.last_name}_profile.pdf`);
    }
  }
}
</script>

<style>
.container-avatar {
  display: inline-block;
  border: 1px solid #DFDFDF;
}
#container-avatar-img {
  text-align: center;
}
#avatar-img {
  border: 1px solid #eeeeee;
}
#container-btn-avatar {
  margin-top: 10px;
  text-align: center;
}
#container-btn-avatar .btn {
  margin-top: 5px;
  margin-bottom: 5px;
}
.btn-responsive {
  padding: 6px 6px;
  font-size: 90%;
}
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
.card-title-profile {
  margin-bottom: 0;
  vertical-align: middle;
}
.card-header-profile {
  cursor: pointer;
  background-color: #ffffff;
}
div.card-header-profile.collapsed .when-opened,
div.card-header-profile:not(.collapsed) .when-closed {
  display: none;
}
#title-page {
  margin-bottom: 0;
}
</style>
