<template>
  <div>
    <h3 id="page-title" class="d-none padding-sm-x d-block d-lg-none font-weight-bold">{{ $t(title) }}</h3>
    <Welcome v-if="isGeneralManager" />
    <div v-if="!isMember" class="padding-sm-x pb-3 btn-group-nav d-flex">
      <button
        class="btn font-weight-bold bg-white mr-2"
        :class="isYourInfoPage ? 'btn-primary-no-bg' : 'btn-secondary-no-bg'"
        @click="handleSwitchPage('your-info')">
        {{ $t('Your Info') }}
      </button>
      <button
        class="btn font-weight-bold bg-white mr-2"
        :class="isCompanyInfoPage ? 'btn-primary-no-bg' : 'btn-secondary-no-bg'"
        @click="handleSwitchPage('company-info')">
        {{ $t('Company Info') }}
      </button>
      <button
        class="btn font-weight-bold bg-white"
        :class="isProjectInfoPage ? 'btn-primary-no-bg' : 'btn-secondary-no-bg'"
        @click="handleSwitchPage('project-info')">
        {{ $t('Project Info') }}
      </button>
    </div>

    <div v-if="isYourInfoPage" class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t('Contact information') }}</h5>
          <div class="d-flex wrap-contact-info">
            <div class="info-left d-flex flex-column align-items-center py-5 px-2">
              <img class="rounded-circle user-avatar" :src="userAvatar" />
              <span class="text-info-md my-2 font-weight-bold text-center">{{ fullName }}</span>
              <span class="text-info-md text-center text-gray">{{ $t(roleList.get($auth.user.role_id)) }}</span>
            </div>
            <div class="info-right d-flex flex-column p-xl-5 p-2">
              <div class="d-flex flex-column mb-4 pt-3">
                <span class="text-info-md mb-2 text-gray">{{ $t('Email Address') }}</span>
                <span class="text-info-md font-weight-bold" style="word-break: break-word;">{{ $auth.user.email }}</span>
              </div>
              <div class="d-flex flex-column mb-4">
                <span class="text-info-md mb-2 text-gray">{{ $t('Phone number') }}</span>
                <span class="text-info-md font-weight-bold">{{ $auth.user.phone_number }}</span>
              </div>
              <div class="d-flex flex-column">
                <span class="text-info-md mb-2 text-gray">{{ $t('Branch') }}</span>
                <span class="text-info-md font-weight-bold">{{ userBranch }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!isAdmin" class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t('day_off_information') }}</h5>
          <div class="card-body py-3 d-flex justify-content-center">
            <DoughnutChart :key="keyDayOff" :chart-data="dayOffData" :options="dayOffOption" :styles="chartStyles" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isYourInfoPage" class="row padding-sm-x">
      <div class="col-xl-7 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 font-weight-bold text-blue">{{ $t('rank_growth') }}</h5>
          <div class="card-body">
            <LineChart :chart-data="rankData" :options="rankOption" :styles="chartStyles" />
          </div>
        </div>
      </div>
      <div class="col-xl-5 col-sm-12">
        <div class="card mb-3 bg-white" style="height: 430px">
          <h5 class="card-header bg-white  p-md-4 text-blue font-weight-bold">{{ $t('Projects you participate in') }}</h5>
          <div class="wrap-project-joined" style="overflow: auto;">
            <div class="px-4">
              <table id="table-manage-request" class="table participate_project">
                <tbody>
                  <tr v-for="(item, index) in dataTable" :key="index">
                    <td>
                      <span class="font-weight-bold mb-0">{{ item.project_name }}</span>
                    </td>
                    <td>
                      <span class="text-right text-info-sm pr-5 text-gray">{{ formatDueDate(item.joined_at, 'LL') }}</span>
                    </td>
                    <td style="width: 85px">
                      <button type="button" class="btn-status">
                        {{ $t("Active") }}
                      </button>
                    </td>
                    <td>
                      <i class="fas fa-ellipsis-v text-gray"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isCompanyInfoPage" class="row padding-sm-x">
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t('total_member_each_branch') }}</h5>
          <div class="card-body py-0 wrap-table-member">
            <table class="table table-hover member_each_project">
              <tbody>
                <tr
                  v-for="(item, index) in numberPeopleBranch"
                  :key="index"
                  @click="statisticBranch(item.branch)">
                  <td class="font-weight-bold">{{ item.branch }}</td>
                  <td class="text-center font-weight-bold">{{ item.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <b-modal ref="modal-branch" size="lg" centered hide-footer>
        <template v-slot:modal-header="{ close }">
          <div class="d-flex flex-column">
            <h5 class="modal-title">{{ $t("Member list") }}</h5>
          </div>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </template>
        <template>
          <div id="tbl-project" class="table-responsive">
            <table id="table-manage-project" class="table table-hover text-center">
              <thead>
                <tr>
                  <th class="cell-sticky">{{ $t("Name") }}</th>
                  <th>{{ $t("Job title") }}</th>
                  <th>{{ $t("Birthday") }}</th>
                  <th>{{ $t("Date joined") }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in takeBranchStatisticDetail">
                  <tr :key="index" @click.prevent="onClickProfileDetail(item.user_id)">
                    <td class="text-center cell-sticky">
                      {{ item.full_name }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.job_title }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.birthday }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.company_joined_date }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mt-4 overflow-auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="takeTotalRowBranchStatistic"
              :per-page="takeRowPerPageBranchStatistic"
              align="center"
              :limit="7"
              @input="getBranchStatisticDetail">
            </b-pagination>
          </div>
        </template>
      </b-modal>
      <div class="col-xl-6 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white  p-md-4 text-blue font-weight-bold">{{ $t('total_member_each_job_title') }}</h5>
          <div class="card-body">
            <HorizontalBar :chart-data="jobTitleData" :options="jobTitleOption" :styles="chartStyles" />
          </div>
        </div>
      </div>
      <b-modal ref="modal-jobtitle" size="lg" centered hide-footer>
        <template v-slot:modal-header="{ close }">
          <div class="d-flex flex-column">
            <h5 class="modal-title">{{ $t("Member list") }}</h5>
          </div>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </template>
        <template>
          <div id="tbl-project" class="table-responsive">
            <table id="table-manage-project" class="table table-hover text-center">
              <thead>
                <tr>
                  <th class="cell-sticky">{{ $t("Name") }}</th>
                  <th>{{ $t("Branch") }}</th>
                  <th>{{ $t("Birthday") }}</th>
                  <th>{{ $t("Date joined") }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in takeJobTitleStatisticDetail">
                  <tr :key="index" @click.prevent="onClickProfileDetail(item.user_id)">
                    <td class="text-center cell-sticky">
                      {{ item.full_name }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.branch }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.birthday }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.company_joined_date }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mt-4 overflow-auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="takeTotalRowJobTitleStatistic"
              :per-page="takeRowPerPageJobTitleStatistic"
              align="center"
              :limit="7"
              @input="getJobTitleStatisticDetail">
            </b-pagination>
          </div>
        </template>
      </b-modal>
    </div>

    <div v-if="isCompanyInfoPage" class="row padding-sm-x">
      <div class="col-xl-7 col-sm-12">
        <div class="card mb-3 bg-white">
          <div class="card-header bg-white p-md-4 text-blue" style="position: relative;">
            <h5 class="mb-0 font-weight-bold" style="word-break: break-word; width: 90%;">{{ $t('evaluation_rank_four_quarters') }}</h5>
            <a href="#" class="comment-detail inline-block text-decoration" @click.prevent="handleStatisticComment">
              <h6 class="mb-0 mr-3">
                {{ $t("Detail") }}
              </h6>
            </a>
          </div>
          <div class="card-body">
            <HorizontalBar :chart-data="evaluationRankData" :options="evaluationRankOption" :styles="chartStyles" />
          </div>
          <b-modal ref="modal-statistic-comment" size="xl" :scrollable="true" centered hide-footer>
            <template v-slot:modal-header="{ close }">
              <div class="d-flex flex-column">
                <h5 class="modal-title">{{ $t("Member list") }}</h5>
              </div>
              <button type="button" class="close" @click="close()">
                <span aria-hidden="true">&times;</span>
              </button>
            </template>
            <template>
              <div class="d-flex comment-statistic mb-2">
                <button
                  type="button"
                  @click="handlePrevNext(false)">
                  <i class="fas fa-angle-left"></i>
                </button>
                <span class="font-weight-bold mx-2">
                  {{ `Q${yearQuarter.last_quarter}/${yearQuarter.last_year} - Q${yearQuarter.quarter}/${yearQuarter.year}` }}
                </span>
                <button
                  v-if="isShowNextBtn"
                  type="button"
                  @click="handlePrevNext(true)">
                  <i class="fas fa-angle-right"></i>
                </button>
              </div>
              <div id="tbl-project" class="table-responsive">
                <table id="table-manage-project" class="table table-striped-cell table-hover">
                  <thead>
                    <tr>
                      <th />
                      <th class="cell-sticky">{{ $t("Member") }}</th>
                      <th class="text-center">{{ `Q${yearQuarter.last_quarter}/${yearQuarter.last_year}` }}</th>
                      <th class="text-center">{{ `Q${yearQuarter.quarter}/${yearQuarter.year}` }}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in commentStatisticList">
                      <tr :key="index">
                        <td class="text-center" @click.prevent="onClickProfileDetail(item.user_id)">
                          <img width="50" height="50" class="rounded-circle" :src="linkAvatar(item.avatar)" />
                        </td>
                        <td class="text-center" @click.prevent="onClickProfileDetail(item.user_id)">
                          {{ item.full_name }}
                        </td>
                        <td style="padding: 5px;" @click.prevent="onClickProfileDetail(item.user_id)">
                          <div class="text-center">{{ takeScoreAndRank(item, false) }}</div>
                          <div class="comment-statistic">
                            <textarea
                              v-model="item.last_comment"
                              class="form-control"
                              :class="item.isShow ? '' : 'd-none'"
                              rows="15"
                              readonly>
                            </textarea>
                          </div>
                        </td>
                        <td style="padding: 5px;" @click.prevent="onClickProfileDetail(item.user_id)">
                          <div class="text-center">{{ takeScoreAndRank(item, true) }}</div>
                          <div class="comment-statistic">
                            <textarea
                              v-model="item.comment"
                              class="form-control"
                              :class="item.isShow ? '' : 'd-none'"
                              rows="15"
                              readonly>
                            </textarea>
                          </div>
                        </td>
                        <td style="position: relative;">
                          <a href="#" @click="showComment(index)">
                            {{ item.isShow ? $t('Hide') + '...' : $t('Show') + '...' }}
                          </a>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </template>
          </b-modal>
        </div>
      </div>
      <div class="col-xl-5 col-sm-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t('japanese_level') }}</h5>
          <div class="card-body">
            <BarChart :chart-data="jpCertificateData" :options="jpCertificateOption" :styles="chartStyles" />
          </div>
        </div>
      </div>
      <b-modal ref="modal-jp-certificate" size="lg" centered hide-footer>
        <template v-slot:modal-header="{ close }">
          <div class="d-flex flex-column">
            <h5 class="modal-title">{{ $t("Member list") }}</h5>
          </div>
          <button type="button" class="close" @click="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </template>
        <template>
          <div id="tbl-project" class="table-responsive">
            <table id="table-manage-project" class="table table-hover text-center">
              <thead>
                <tr>
                  <th class="cell-sticky">{{ $t("Name") }}</th>
                  <th>{{ $t("Job title") }}</th>
                  <th>{{ $t("Branch") }}</th>
                  <th>{{ $t("Birthday") }}</th>
                  <th>{{ $t("Date joined") }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in takeJpLevelStatisticDetail">
                  <tr :key="index" @click.prevent="onClickProfileDetail(item.user_id)">
                    <td class="text-center cell-sticky">
                      {{ item.full_name }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.job_title }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.branch }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.birthday }}
                    </td>
                    <td class="text-center cell-sticky">
                      {{ item.company_joined_date }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <div class="mt-4 overflow-auto">
            <b-pagination
              v-model="currentPage"
              :total-rows="takeTotalRowJpLevelStatistic"
              :per-page="takeRowPerPageJpLevelStatistic"
              align="center"
              :limit="7"
              @input="getJpCertificateStatisticDetail">
            </b-pagination>
          </div>
        </template>
      </b-modal>
      <div class="col-12">
        <div class="card mb-3 bg-white">
          <h5 class="card-header bg-white p-md-4 text-blue font-weight-bold">{{ $t('total_member_interest_technologies') }}</h5>
          <div class="card-body">
            <BarChart :chart-data="interestTechnologyData" :options="interestTechnologyOption" :styles="chartStyles" />
          </div>
        </div>
        <b-modal ref="modal-interest-tech" size="lg" centered hide-footer>
          <template v-slot:modal-header="{ close }">
            <div class="d-flex flex-column">
              <h5 class="modal-title">{{ $t("Member list") }}</h5>
            </div>
            <button type="button" class="close" @click="close()">
              <span aria-hidden="true">&times;</span>
            </button>
          </template>
          <template>
            <div id="tbl-project" class="table-responsive">
              <table id="table-manage-project" class="table table-hover text-center">
                <thead>
                  <tr>
                    <th class="cell-sticky">{{ $t("Name") }}</th>
                    <th>{{ $t("Job title") }}</th>
                    <th>{{ $t("Branch") }}</th>
                    <th>{{ $t("Birthday") }}</th>
                    <th>{{ $t("Date joined") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in takeTechnologyStatisticDetail">
                    <tr :key="index" @click.prevent="onClickProfileDetail(item.user_id)">
                      <td class="text-center cell-sticky">
                        {{ item.full_name }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ item.job_title }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ item.branch }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ item.birthday }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ item.company_joined_date }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="mt-4 overflow-auto">
              <b-pagination
                v-model="currentPage"
                :total-rows="takeTotalRowTechStatistic"
                :per-page="takeRowPerPageTechStatistic"
                align="center"
                :limit="7"
                @input="getTechStatisticDetail">
              </b-pagination>
            </div>
          </template>
        </b-modal>
      </div>
    </div>

    <div v-if="isProjectInfoPage && (isGeneralManager || isManager)" class="row padding-sm-x">
      <div class="col-xl-6">
        <div class="card mb-3 bg-white" style="height: calc(300px + 10%) !important;">
          <h5 class="card-header bg-white  p-md-4 text-blue font-weight-bold">{{ $t('total_member_each_project') }}</h5>
          <div class="card-body pt-0" style="overflow: auto;">
            <table class="table table-hover member_each_project">
              <tbody>
                <tr
                  v-for="item in numberPeopleProject"
                  :key="item.project_name"
                  @click="statisticPeopleProject(item.project_id, item.managed_by)">
                  <td class="font-weight-bold">{{ item.project_name }}</td>
                  <td class="text-center font-weight-bold">{{ item.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <b-modal ref="modal-people-project" size="lg" centered hide-footer>
          <template v-slot:modal-header="{ close }">
            <div class="d-flex flex-column">
              <h5 class="modal-title">{{ $t("Member list") }}</h5>
              <h6 class="ml-2 mt-1 mb-0">{{ `${$t("Managed by:")} ${managerName}` }}</h6>
            </div>
            <div>
              <nuxt-link :to="'/workflow/view-project/' + projectId" class="d-inline-block mt-1">
                <span>{{ $t('Project Details') }}</span>
              </nuxt-link>
              <button type="button" class="close" @click="close()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </template>
          <template>
            <div id="tbl-project" class="table-responsive">
              <table id="table-manage-project" class="table table-hover text-center">
                <thead>
                  <tr>
                    <th class="cell-sticky">{{ $t("Name") }}</th>
                    <th>{{ $t("Branch") }}</th>
                    <th>{{ $t("Date joined") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in takeUserProject">
                    <tr :key="index" @click.prevent="onClickProfileDetail(item.user_id)">
                      <td class="text-center cell-sticky">
                        {{ userListBox.get(item.user_id.toString()) }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ branchListBox.get(item.branch.toString()) }}
                      </td>
                      <td class="text-center cell-sticky">
                        {{ item.date_joined }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </template>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import moment from 'moment';
import { ManagerRoleID, GeneralManagerRoleID, AdminRoleID, UserRoleID } from '~/utils/responsecode';
import { ProjectSubmit, UserBranch } from '~/types/project';
import { StatisticPagination, CommentStatisticDetail, CommentStatisticParams } from '~/types/statistic';
import { RowPerStatisticPage } from '~/utils/common-const';
import LineChart from '~/components/Charts/line-chart.vue';
import DoughnutChart from '~/components/Charts/doughnut-chart.vue';
import PolarAreaChart from '~/components/Charts/polar-area-chart.vue';
import BarChart from '~/components/Charts/bar-chart.vue';
import HorizontalBar from '~/components/Charts/horizontal-bar.vue';
import Welcome from '~/layouts/components/Welcome/index.vue';
import { statisticStore, projectStore, userStore, userProfileStore } from '~/utils/store-accessor';
import { layoutAdminStore } from '~/store/';

@Component({
  middleware: ['auth'],
  layout: 'Admin',
  components: {
    BarChart,
    HorizontalBar,
    PolarAreaChart,
    DoughnutChart,
    LineChart,
    Welcome
  }
})
export default class extends Vue {
  title : string = '';
  topIcon: string = '';
  isManager: boolean = this.$auth.user.role_id === ManagerRoleID
  isMember: boolean = this.$auth.user.role_id === UserRoleID
  isGeneralManager: boolean = this.$auth.user.role_id === GeneralManagerRoleID
  isAdmin: boolean = this.$auth.user.role_id === AdminRoleID
  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  fullName: string = this.$auth.user.first_name + ' ' + this.$auth.user.last_name
  msgError: string = '';

  rankData: object = {};
  projectStatisticPagination: StatisticPagination = {
    current_page: 1,
    row_per_page: 6,
    total_row   : 0
  }
  currentPageStatisticProject: number = 1
  userListBox: Map<string, string> = new Map();
  branchListBox: Map<string, string> = new Map();
  userBranchList: UserBranch[] = []
  projectId: number = 0
  managerName: string = ''
  labelTech: string = ''
  labelJobTitle: string = ''
  labelJpLevel: string = ''
  currentPage: number = 1
  startFullQuarter   : Date = new Date();
  yearQuarter: CommentStatisticParams | null = {
    year: 0,
    quarter: 0,
    last_year: 0,
    last_quarter: 0
  }
  commentStatisticList: CommentStatisticDetail[] = []
  isShowNextBtn: boolean = true
  isNextFirst: boolean = false
  isYourInfoPage: boolean = true
  isCompanyInfoPage: boolean = false
  isProjectInfoPage: boolean = false
  keyDayOff: number = 0
  amountDay: string = ''
  submitForm: ProjectSubmit = {
    keyword      : '',
    current_page : 1,
    row_per_page : 8
  }

  get roleList() {
    return userStore.takeRoleList;
  }

  get dataTable() {
    return projectStore.arrProjectTable;
  }

  get rankOption(): object {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('date')
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('rank')
          },
          ticks: {
            callback: function(value) {
              const text = value.toString();
              return `${text.slice(0, 1)}-${text.slice(1)}`;
            },
            suggestedMin: 10,
            suggestedMax: 70
          }
        }]
      },
      animation: {
        duration: 2000
      }
    };
  }

  branchData: object = {};
  get branchOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      onClick: this.statisticBranch,
      cutoutPercentage: 80,
      legend: {
        align: 'center',
        position: 'right'
      }
    };
  };

  jobTitleData: object = {};
  get jobTitleOption(): object {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('level')
          }
        }],
        yAxes: [{
          gridLines: {
            display:false,
            color: '#fff',
            zeroLineColor: '#fff',
            zeroLineWidth: 0
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('total_members')
          },
          ticks: {
            suggestedMin: 0,
            beginAtZero: true,
            stepSize: 1
          }
        }]
      },
      legend: {
        display: false
      },
      onClick: this.statisticJobTitle
    };
  }

  dayOffData: object = {};
  get dayOffOption() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 90,
      legend: {
        align: 'center',
        position: 'bottom'
      },
      elements: {
        center: {
          text: `${this.amountDay} days`
        }
      },
      onClick: this.onHoverDayoff
    };
  };

  jpCertificateData: object = {};
  jpCertificateOption: object = {
    responsive: true,
    maintainAspectRatio: false,
    hover: {
      animationDuration:0
    },
    scales: {
      xAxes: [{
        gridLines: {
          display:false,
          color: '#fff',
          zeroLineColor: '#fff',
          zeroLineWidth: 0
        },
        ticks: {
          beginAtZero:true,
          fontSize:14
        },
        scaleLabel:{
          display:false
        }
      }],
      yAxes: [{
        ticks: {
          fontSize:14,
          stepSize: 1
        },
        stacked: true
      }]
    },
    legend: {
      display: false
    },
    onClick: this.statisticJpCertificate
  };

  evaluationRankData: object = {};
  get evaluationRankOption(): object {
    return {
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        animationDuration:0
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero:true,
            fontSize:14
          },
          scaleLabel:{
            display:false
          }
        }],
        yAxes: [{
          gridLines: {
            display:false,
            color: '#fff',
            zeroLineColor: '#fff',
            zeroLineWidth: 0
          },
          ticks: {
            fontSize:14
          },
          stacked: true
        }]
      },
      legend: {
        align: 'center',
        position: 'bottom'
      }
    };
  }

  interestTechnologyData: object = {};
  get interestTechnologyOption(): object {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            display:false,
            color: '#fff',
            zeroLineColor: '#fff',
            zeroLineWidth: 0
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('technologies')
          },
          barThickness: 55
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: this.$t('total_members')
          },
          ticks: {
            suggestedMin: 0,
            beginAtZero: true,
            stepSize: 3
          },
          barThickness: 55
        }]
      },
      legend: {
        display: false
      },
      onClick: this.statisticInterestTech
    };
  }

  chartStyles = {
    height: '313px',
    width: '100%'
  };

  async mounted() {
    this.title = 'Overview';
    layoutAdminStore.setTitlePage(this.title);
    this.topIcon = 'fas fa-home';
    layoutAdminStore.setIconTopPage(this.topIcon);

    try {
      await statisticStore.getStatistic();
      await projectStore.searchProjectsOfUser(this.submitForm);
      if (this.isGeneralManager || this.isManager) {
        this.handleProjectPagination();
      }
      this.rankData = {
        labels: this.userRankLogs.map(log => log.created_at),
        datasets: [
          {
            label: 'Rank',
            fill: false,
            borderColor: '#00875A',
            data: this.userRankLogs.map(log => log.rank)
          }
        ]
      };

      this.branchData = {
        labels: this.numberPeopleBranch.map(people => people.branch),
        datasets: [
          {
            backgroundColor: this.getColors(),
            data: this.numberPeopleBranch.map(people => people.amount)
          }
        ]
      };

      this.jobTitleData = {
        labels: this.numberPeopleJobTitle.map(people => people.job_title),
        datasets: [
          {
            backgroundColor: ['#dcdedf'],
            data: this.numberPeopleJobTitle.map(people => people.amount)
          }
        ]
      };

      const bgColorTech: string[] = [];
      this.interestTechnologyData = {
        labels: this.numberPeopleInterestTechnology.map((people) => {
          bgColorTech.push('#1BD4D4');
          return people.technology;
        }),
        datasets: [
          {
            backgroundColor: bgColorTech,
            data: this.numberPeopleInterestTechnology.map(people => people.amount)
          }
        ]
      };

      this.dayOffData = {
        labels: [...this.dayOffInfo.keys()],
        datasets: [
          {
            backgroundColor: ['#2ED47A', '#F7685B'],
            data: Array.from(this.dayOffInfo.values(), x => parseFloat(x).toFixed(2))
          }
        ]
      };
      this.amountDay = parseFloat((this.dayOffInfo.get('day_remaining') as string)).toFixed(2);

      const bgColorJpLevel: string[] = [];
      this.jpCertificateData = {
        labels: this.numberPeopleJapaneseLevel.map((people) => {
          bgColorJpLevel.push('#1BD4D4');
          return people.certificate;
        }),
        datasets: [
          {
            backgroundColor: bgColorJpLevel,
            data: this.numberPeopleJapaneseLevel.map(people => people.amount)
          }
        ]
      };

      this.evaluationRankData = {
        labels: this.evaluationRank.datetime,
        datasets: this.getEvaluationRankDataset()
      };
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  get userRankLogs() {
    return statisticStore.takeUserRankLogs;
  }

  get numberPeopleBranch() {
    return statisticStore.takeNumberPeopleBranch;
  }

  get numberPeopleProject() {
    return statisticStore.takeNumberPeopleProject;
  }

  get numberPeopleJobTitle() {
    return statisticStore.takeNumberPeopleJobTitle;
  }

  get dayOffInfo() {
    return statisticStore.takeDayOffInfo;
  }

  get total() {
    return statisticStore.takeTotal;
  }

  get numberPeopleJapaneseLevel() {
    return statisticStore.takeNumberPeopleJapaneseLevel;
  }

  get evaluationRank() {
    return statisticStore.takeEvaluationRank;
  }

  get numberPeopleInterestTechnology() {
    return statisticStore.takeNumberPeopleInterestTechnology;
  }

  get takeUserProject() {
    return projectStore.takeUserProject;
  }

  get totalRows() {
    return projectStore.takePaginationUserProject.total_row;
  }

  get rowPerPage() {
    return projectStore.takePaginationUserProject.row_per_page;
  }

  takeScoreAndRank(content: CommentStatisticDetail, isNext: boolean) {
    if (isNext) {
      return content.score !== 0 && content.rank !== ''
        ? `${this.$t('Grades')}: ${content.score} | ${this.$t('Rank')}: ${content.rank}`
        : '';
    } else {
      return content.last_score !== 0 && content.last_rank !== ''
        ? `${this.$t('Grades')}: ${content.last_score} | ${this.$t('Rank')}: ${content.last_rank}`
        : '';
    }
  }

  async handleProjectPagination() {
    try {
      const res = await statisticStore.getProjectStatistic(this.projectStatisticPagination);
      this.projectStatisticPagination = res.pagination;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    }
  }

  statisticInterestTech(point, event) {
    const item = event[0];
    this.labelTech = item._model.label;
    const modal = this.$refs['modal-interest-tech'] as any;
    this.currentPage = 1;
    this.getTechStatisticDetail();

    if (!this.msgError) {
      modal.show();
    }
  }

  async getTechStatisticDetail() {
    try {
      this.$nuxt.$loading.start();
      await statisticStore.getTechStatisticDetail({
        technology: this.labelTech,
        current_page: this.currentPage,
        row_per_page: RowPerStatisticPage
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  get takeTechnologyStatisticDetail() {
    return statisticStore.takeTechnologyStatisticDetail;
  }

  get takeTotalRowTechStatistic() {
    return statisticStore.takeTotalRowTechStatistic;
  }

  get takeRowPerPageTechStatistic() {
    return statisticStore.takeRowPerPageTechStatistic;
  }

  statisticJobTitle(point, event) {
    const item = event[0];
    this.labelJobTitle = item._model.label;
    const modal = this.$refs['modal-jobtitle'] as any;
    this.currentPage = 1;
    this.getJobTitleStatisticDetail();

    if (!this.msgError) {
      modal.show();
    }
  }

  async getJobTitleStatisticDetail() {
    try {
      this.$nuxt.$loading.start();
      await statisticStore.getJobTitleStatisticDetail({
        job_title: this.labelJobTitle,
        current_page: this.currentPage,
        row_per_page: RowPerStatisticPage
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  get takeJobTitleStatisticDetail() {
    return statisticStore.takeJobTitleStatisticDetail;
  }

  get takeTotalRowJobTitleStatistic() {
    return statisticStore.takeTotalRowJobTitleStatistic;
  }

  get takeRowPerPageJobTitleStatistic() {
    return statisticStore.takeRowPerPageJobTitleStatistic;
  }

  statisticBranch(labelBranch: string) {
    const modal = this.$refs['modal-branch'] as any;
    this.currentPage = 1;
    this.getBranchStatisticDetail(labelBranch);

    if (!this.msgError) {
      modal.show();
    }
  }

  async getBranchStatisticDetail(labelBranch: string) {
    try {
      this.$nuxt.$loading.start();
      await statisticStore.getBranchStatisticDetail({
        branch: labelBranch,
        current_page: this.currentPage,
        row_per_page: RowPerStatisticPage
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  get takeBranchStatisticDetail() {
    return statisticStore.takeBranchStatisticDetail;
  }

  get takeTotalRowBranchStatistic() {
    return statisticStore.takeTotalRowBranchStatistic;
  }

  get takeRowPerPageBranchStatistic() {
    return statisticStore.takeRowPerPageBranchStatistic;
  }

  getColors(): string[] {
    return ['#176BA0', '#1AC9E6', '#1DE4BD', '#C7F9EE', '#DCDEDF', '#c5a864', '#ffcc00', '#00ff00'];
  }

  getOneColor(idx: number): string {
    const colors = this.getColors();
    return colors[idx];
  }

  linkAvatar(avatar: string) {
    return avatar
      ? 'data:image/png;base64,' + avatar
      : this.defaultAvatar;
  }

  get userAvatar() {
    return userProfileStore.imgbase64Avatar
      ? 'data:image/png;base64,' + userProfileStore.imgbase64Avatar
      : this.defaultAvatar;
  }

  get userBranch() {
    const branchList = this.$auth.user.branch_list_box && new Map(Object.entries(this.$auth.user.branch_list_box));
    return branchList.get(this.$auth.user.branch.toString()) || '';
  }

  async statisticPeopleProject(projectID: number, managedBy: number) {
    const modal = this.$refs['modal-people-project'] as any;
    this.projectId = projectID;
    await this.getUserProject();
    this.managerName = this.userListBox.get(managedBy.toString()) || '';

    if (!this.msgError) {
      modal.show();
    }
  }

  async getUserProject() {
    try {
      this.$nuxt.$loading.start();
      const res = await projectStore.getUserProject({
        project_id: this.projectId
      });
      this.userListBox = new Map(Object.entries(res.user_box));
      this.branchListBox = new Map(Object.entries(res.branch_box));
      this.userBranchList = res.user_branch_list;
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  statisticJpCertificate(point, event) {
    const item = event[0];
    this.labelJpLevel = item._model.label;
    const modal = this.$refs['modal-jp-certificate'] as any;
    this.currentPage = 1;
    this.getJpCertificateStatisticDetail();

    if (!this.msgError) {
      modal.show();
    }
  }

  async getJpCertificateStatisticDetail() {
    try {
      this.$nuxt.$loading.start();
      await statisticStore.getJpLevelStatisticDetail({
        certificate: this.labelJpLevel,
        current_page: this.currentPage,
        row_per_page: RowPerStatisticPage
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  get takeJpLevelStatisticDetail() {
    return statisticStore.takeJpLevelStatisticDetail;
  }

  get takeTotalRowJpLevelStatistic() {
    return statisticStore.takeTotalRowJpLevelStatistic;
  }

  get takeRowPerPageJpLevelStatistic() {
    return statisticStore.takeRowPerPageJpLevelStatistic;
  }

  get takeCommentStatistic() {
    return statisticStore.takeCommentStatistic;
  }

  handleSwitchPage(type: string) {
    switch (type) {
    case 'your-info':
      this.isYourInfoPage = true;
      this.isCompanyInfoPage = false;
      this.isProjectInfoPage = false;
      break;
    case 'company-info':
      this.isYourInfoPage = false;
      this.isCompanyInfoPage = true;
      this.isProjectInfoPage = false;
      break;
    case 'project-info':
      this.isYourInfoPage = false;
      this.isCompanyInfoPage = false;
      this.isProjectInfoPage = true;
      break;
    }
  }

  getEvaluationRankDataset() {
    const datasets: object[] = [];
    for (let i = 0; i < this.evaluationRank.datasets.length; i++) {
      const data = {
        label: this.evaluationRank.datasets[i].rank,
        backgroundColor: this.getOneColor(i),
        data: this.evaluationRank.datasets[i].data
      };
      datasets.push(data);
    }

    return datasets;
  }

  onClickProfileDetail(id: number) {
    const route = this.$router.resolve({ path: `/hrm/view-profile/${id}` });
    window.open(route.href, '_blank');
  }

  handleStatisticComment() {
    const modal = this.$refs['modal-statistic-comment'] as any;
    this.isNextFirst = false;
    this.startFullQuarter = new Date();
    this.yearQuarter = this.handlePrev(this.startFullQuarter, 1);
    this.isShowNextBtn = false;
    this.getCommentTwoConsecutiveQuarter(this.yearQuarter);
    modal.show();
  }

  handlePrevNext(isNext: boolean) {
    let yearQuarter;
    if (isNext) {
      if (!this.isNextFirst) {
        yearQuarter = this.handleNext(
          new Date(
            moment(this.startFullQuarter)
              .add(1, 'quarter')
              .startOf('quarter')
              .toString()), 1);

        this.isNextFirst = true;
      } else {
        yearQuarter = this.handleNext(this.startFullQuarter, 1);
      }

      if (yearQuarter) {
        this.yearQuarter = yearQuarter;
      }
    } else {
      this.yearQuarter = this.handlePrev(this.startFullQuarter, 1);
    }
    this.getCommentTwoConsecutiveQuarter(this.yearQuarter);
  }

  handlePrev(date?: Date, subtractNum?: number) {
    this.isShowNextBtn = true;
    const startFullQuarter = this.isNextFirst
      ? new Date(moment(date).subtract(subtractNum, 'quarter').startOf('quarter').toString())
      : new Date(moment(date).startOf('quarter').toString());
    const endFullQuarter = new Date(moment(startFullQuarter).subtract(subtractNum, 'quarter').startOf('quarter').toString());
    this.isNextFirst = false;

    const year = startFullQuarter.getFullYear();
    const quarter = Math.floor((startFullQuarter.getMonth() + 3) / 3);
    const last_year = endFullQuarter.getFullYear();
    const last_quarter = Math.floor((endFullQuarter.getMonth() + 3) / 3);
    this.startFullQuarter = endFullQuarter;

    return {
      year,
      quarter,
      last_year,
      last_quarter
    };
  }

  handleNext(date: Date, addNum?: number) {
    const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
    const currentYear = new Date().getFullYear();
    const last_year = date.getFullYear();
    const last_quarter = Math.floor((date.getMonth() + 3) / 3);

    const startFullQuarter = new Date(moment(date).add(addNum, 'quarter').startOf('quarter').toString());
    const year = startFullQuarter.getFullYear();
    const quarter = Math.floor((startFullQuarter.getMonth() + 3) / 3);

    this.startFullQuarter = startFullQuarter;
    this.isShowNextBtn = !((year === currentYear && quarter === currentQuarter) || year > currentYear);

    return {
      year,
      quarter,
      last_year,
      last_quarter
    };
  }

  async getCommentTwoConsecutiveQuarter(yearQuarter) {
    try {
      this.$nuxt.$loading.start();
      const res = await statisticStore.getCommentTwoConsecutiveQuarter(yearQuarter);
      this.commentStatisticList = this.takeAssignCommentStatistic(res);
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.msgError = err.response.data.message;
      } else {
        this.msgError = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
      setTimeout(() => {
        this.msgError = '';
      }, 3000);
    }
  }

  showComment(id: number) {
    this.commentStatisticList[id].isShow = !this.commentStatisticList[id].isShow;
  }

  formatDueDate(date: string, formatType: string) {
    return date ? moment(new Date(date)).format(formatType) : '';
  }

  takeAssignCommentStatistic(commentStatistic: CommentStatisticDetail[]) {
    let assignCommentStatistic: CommentStatisticDetail[] = [];
    if (commentStatistic) {
      commentStatistic.forEach((value) => {
        const commentStatistic: CommentStatisticDetail = Object.assign(
          {},
          { ...value, isShow: false });
        assignCommentStatistic = [ ...assignCommentStatistic, commentStatistic ];
      });
    }

    return assignCommentStatistic;
  }

  onHoverDayoff(point, event) {
    const item = event[0];
    const label = item._model.label;
    this.keyDayOff += 1;
    this.amountDay = parseFloat((this.dayOffInfo.get(label) as string)).toFixed(2);
  }
};
</script>
<style scoped>
  table.participate_project > tbody > tr > td:nth-child(1), td:nth-child(2), td:nth-child(3) {
    vertical-align: middle;
    padding-left: 0;
    padding-right: 0;
    border-top: none;
    border-bottom: 1px solid #dee2e6;
  }
  table.participate_project > tbody > tr > td:nth-child(4) {
    border-top: 0;
    width: 3px;
    vertical-align: middle;
  }
  table.member_each_project > tbody > tr > td {
    border-bottom: 1px solid #dee2e6;
    border-top: none;
  }
  .sub-menu {
    height: 117px;
    border-radius: 8px;
    background: #FFFFFF;
    border: 1px solid #DFE0EB;
    box-sizing: border-box;
    padding-top: 15px;
    color: #9FA2B4;
    cursor: pointer;
  }
  .sub-menu > span {
    font-style: normal;
    font-weight: bold;
    font-size: 19px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.4px;
  }
  .active {
    border: 1px solid#109CF1;
    color: #109CF1;
  }
  .card {
    border-radius: 8px;
  }
  .card-header {
    border-radius: 8px 8px 0px 0px;
  }
  .info-left {
    border-right: 1px solid #EAEAEA;
    width: 16rem;
  }
  .table-striped-cell thead tr th {
    background-color:#f2f2f2;
    text-align: center;
  }
  .table-striped-cell tbody tr td {
    cursor: pointer;
  }
  ul {
    margin-bottom: 0 !important;
  }
  .comment-statistic > button {
    outline: none;
    border: none;
    background-color: inherit;
  }
  .comment-statistic > textarea {
    resize: none;
    border: none;
    background-color: inherit;
  }
  .comment-detail {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
  }
  .user-avatar {
    width: 150px;
    height: 150px;
  }
  .text-info-sm {
    font-size: 12px;
    line-height: 15px;
  }
  @media (max-width: 576px) {
    .sub-menu > span {
      font-size: 16px;
      letter-spacing: 0;
    }
    .info-left{
      width: 11rem;
    }
    .sub-menu {
      height: 72px;
    }
    .user-avatar {
      width: 70px;
      height: 70px;
    }
    .text-info-md {
      font-size: 12px;
      line-height: 15px;
    }
    .wrap-contact-info
    .wrap-project-joined
    .wrap-table-member {
      height: 100%;
    }
  }
  @media (max-width: 992px) and (min-width: 576px) {
    .sub-menu {
      height: 95px;
    }
    .info-left{
      width: 13rem;
    }
    .user-avatar {
      width: 105px;
      height: 105px;
    }
    .text-info-md {
      font-size: 16px;
      line-height: 24px;
    }
    button.btn-status {
      width: 85px;
      height: 27px;
    }
    .wrap-contact-info
    .wrap-project-joined
    .wrap-table-member {
      height: 100%;
    }
  }
  @media (min-width: 1200px) {
    .user-avatar {
      width: 150px;
      height: 150px;
    }
    .text-info-md {
      font-size: 19px;
      line-height: 22px;
    }
    .info-left{
      width: 16rem;
    }
    .wrap-contact-info {
      height: 345px !important;
    }
    .wrap-project-joined {
      height: 315px;
    }
    .wrap-table-member {
      height: 352px;
    }
  }
</style>
