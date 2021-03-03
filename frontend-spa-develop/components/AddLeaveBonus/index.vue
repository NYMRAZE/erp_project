<template>
  <b-modal
    :id="`modal-${userId}`"
    v-model="isShowBonusModal"
    size="xl"
    :hide-header="true"
    :hide-footer="true"
    centered>
    <div class="px-4 py-5">
      <div class="row">
        <div class="col-lg-5 col-md-12 col-sm-12 p-2">
          <div class="card" style="min-height: 340.33px;">
            <div class="card-header bg-light py-3">
              <span class="card-title-profile card-title text-blue font-weight-bold">
                {{ $t("Member information") }}
              </span>
            </div>
            <div class="card-body p-0 d-flex">
              <div class="container-left px-4 pt-5 d-flex flex-column align-items-center">
                <img class="rounded-circle user-avatar" :src="userAvatar" />
                <span class="font-weight-bold text-center">{{ userName }}</span>
              </div>
              <div class="container-right pt-5 px-3 pb-4">
                <div class="d-flex flex-column mb-3">
                  <span class="text-gray">{{ $t("Email") }}</span>
                  <span class="font-weight-bold">{{ userEmail }}</span>
                </div>
                <div class="d-flex flex-column mb-3">
                  <span class="text-gray">{{ $t("Day off used") }}</span>
                  <span class="font-weight-bold">{{ takeDayUsed.toFixed(2) }}</span>
                </div>
                <div class="d-flex flex-column">
                  <span class="text-gray">{{ $t("Day off remaining") }}</span>
                  <span class="font-weight-bold">{{ takeDayRemaining.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7 col-md-12 col-sm-12 p-2">
          <div v-for="(item, index) in listLeaveDay" :key="index" class="block-card card mb-3">
            <div class="card-header-profile card-header bg-light" :class="item.isShow && 'd-none'">
              <div class="d-flex justify-content-between">
                <h4 class="card-title-profile card-title text-dark">
                  <i class="far fa-calendar-plus"></i>
                  <span>{{ getTitle(item.leave_bonus_type_id, item.hour) }}</span>
                </h4>
                <div class="d-flex align-items-center">
                  <span class="mr-1 font-weight-bold" @click="showEmail(index)">
                    {{ $t("More") }}
                  </span>
                  <i class="fas fa-caret-down"></i>
                </div>
              </div>
            </div>
            <div class="container-card-body" :class="!item.isShow && 'd-none'">
              <div class="card-body border-top">
                <div class="form-row w-100 mx-0">
                  <div class="form-group col-lg-12 col-xl-6">
                    <span class="text-dark font-weight-bold">{{ $t("Type leave bonus") }}</span>
                    <select
                      class="form-control mt-2"
                      disabled>
                      <option
                        v-for="[key, value] in listLeaveBonusType"
                        :key="key"
                        :value="key"
                        :selected="item.leave_bonus_type_id">
                        {{ $t(value) }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group col-lg-12 col-xl-3">
                    <div class="form-row">
                      <div class="form-group col-xl-12 mb-0">
                        <span class="text-dark font-weight-bold">
                          {{ !isEditBonus ? $t("Day bonus") : $t("Hour") }}
                        </span>
                        <input
                          v-model.number="item.hour"
                          class="form-control mt-2"
                          :class="{ 'is-invalid': errHour || errInvalid }"
                          type="text"
                          disabled>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-lg-12 col-xl-3">
                    <div class="form-row">
                      <div class="form-group col-xl-12 mb-0">
                        <span class="text-dark font-weight-bold">{{ $t("Year") }}</span>
                        <input
                          v-model.number="item.year_belong"
                          class="form-control mt-2"
                          type="text"
                          disabled>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-lg-12 col-xl-12">
                    <span class="text-dark font-weight-bold">{{ $t("Reason") }}</span>
                    <textarea v-model="item.reason" class="form-control mt-2" rows="6" readonly></textarea>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="button" class="btn btn-danger" @click="removeLeaveDay(index)">
                    <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
                  </button>
                </div>
              </div>
            </div>
            <div class="card-footer bg-light" :class="!item.isShow && 'd-none'">
              <div class="d-flex justify-content-end">
                <div class="d-flex align-items-center">
                  <span class="mr-1 font-weight-bold" @click="showEmail(index)">
                    {{ $t("Less") }}
                  </span>
                  <i class="fas fa-caret-up"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="px-lg-3 pt-3">
            <div class="form-row w-100 mx-0">
              <div class="form-group col-lg-12 col-xl-6">
                <span class="text-dark font-weight-bold required">{{ $t("Type leave bonus") }}</span>
                <select
                  v-model.number="type_day"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': errTypeBonus }"
                  @change="onChangeSelect($event)">
                  <option :value="null"></option>
                  <option
                    v-for="[key, value] in listLeaveBonusType"
                    :key="key"
                    :value="key">
                    {{ $t(value) }}
                  </option>
                </select>
                <p v-if="errTypeBonus" class="invalid-feedback d-block">{{ $t(errTypeBonus) }}</p>
              </div>
              <div class="form-group col-lg-12 col-xl-3">
                <div class="form-row">
                  <div class="form-group col-xl-12 mb-0">
                    <span class="text-dark font-weight-bold required">
                      {{ !isEditBonus ? $t("Day bonus") : $t("Hour") }}
                    </span>
                    <input
                      v-model.number="num_day"
                      class="form-control mt-2"
                      :class="{ 'is-invalid': errHour || errInvalid }"
                      type="text"
                      :disabled="isDisableInput"
                      @input="onChangeInput($event)">
                  </div>
                  <p v-if="errHour" class="invalid-feedback d-block mb-0">{{ $t(errHour) }}</p>
                </div>
              </div>
              <div class="form-group col-lg-12 col-xl-3">
                <div class="form-row">
                  <div class="form-group col-xl-12 mb-0">
                    <span class="text-dark font-weight-bold required">{{ $t("Year") }}</span>
                    <input
                      v-model.number="year"
                      class="form-control mt-2"
                      :class="{ 'is-invalid': errHour || errInvalid }"
                      type="text"
                      :disabled="isDisableInput">
                  </div>
                  <p v-if="errHour" class="invalid-feedback d-block mb-0">{{ $t(errHour) }}</p>
                </div>
              </div>
            </div>
            <div class="form-row px-1">
              <div class="form-group col-lg-12 col-xl-12">
                <span class="text-dark font-weight-bold required">{{ $t("Reason") }}</span>
                <textarea
                  v-model="reason"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': errReason }"
                  rows="6"
                  :disabled="isDisableInput"
                  @input="onChangeReason($event)"></textarea>
                <p v-if="errReason" class="invalid-feedback d-block">{{ $t(errReason) }}</p>
              </div>
            </div>
            <div class="form-row">
              <div class="col-lg-12 col-xl-12">
                <div v-if="!isEditBonus" class="group-btn-action pl-1">
                  <button type="button" class="btn btn-warning text-white" @click="addLeaveDayBonus()">
                    {{ $t("Add +") }}
                  </button>
                  <button
                    v-if="listLeaveDay && listLeaveDay.length"
                    type="submit"
                    class="btn btn-primary2"
                    @click.prevent="handleSubmit">
                    {{ $t("Add bonus leave") }}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-secondary2"
                    @click.prevent="cancelBtn"> {{ $t("Cancel") }}
                  </button>
                </div>
                <div>
                  <span class="text-danger"> {{ $t(msgError) }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import { LeaveBonus } from '~/types/dayleave';
import { dayleaveStore } from '~/store/';

@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop() isEditBonus !: boolean
  @Prop() isShowModal !: boolean
  @Prop() userId !: number

  defaultAvatar    : string = require('~/assets/images/default_avatar.jpg');
  currentYear: number = new Date().getFullYear()
  num_day: number | null = null
  reason: string = ''
  type_day: number | null = null
  listLeaveDay : LeaveBonus[] = []
  msgError: string = ''
  year: number = new Date().getFullYear()
  errTypeBonus: string = ''
  errHour: string = ''
  errReason: string = ''
  errInvalid: string = ''
  isDisableDay: boolean = false
  clearLeaveType: number = 7
  successMsg: string = ''
  responseMessage: string = ''
  isShowBonusModal: boolean = false

  beforeMount() {
    this.$nextTick(async () => {
      if (this.userId) {
        await this.getInfo(this.userId);
      }
    });
  }

  mounted() {
    this.isShowBonusModal = this.isShowModal;
    this.type_day = this.leaveBonusDetail && this.leaveBonusDetail.leave_bonus_type_id;
    this.num_day = this.leaveBonusDetail && this.leaveBonusDetail.hour;
    this.reason = this.leaveBonusDetail ? this.leaveBonusDetail.reason : '';
    this.year = this.leaveBonusDetail ? this.leaveBonusDetail.year_belong : this.currentYear;
    dayleaveStore.setHasUpdateLeaveBonus(false);
  }

  beforeUpdate() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      try {
        if (modalId === `modal-${this.userId}`) {
          dayleaveStore.setShowBonusLeaveModal(false);
        }
      } catch (e) {}
    });
  }

  async getInfo(userID: number) {
    this.$nuxt.$loading.start();
    const defaultError = 'System have problem. Please try again';

    try {
      await dayleaveStore.getLeaveInfo({ user_id: userID, year: this.currentYear });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message ? err.response.data.message : defaultError;
      } else {
        this.responseMessage = err.message ? err.message : defaultError;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  get listLeaveBonusType() {
    let leaveBonusTypes;
    if (this.isEditBonus) {
      leaveBonusTypes = new Map([
        ['1', 'Annual leave'],
        ['2', 'Seniority leave'],
        ['3', 'Sick leave'],
        ['4', 'Marry leave'],
        ['5', 'Maternity leave'],
        ['6', 'Bereavement leave'],
        ['8', 'Overtime leave']
      ]);
    } else if (this.takeListLeaveBonusType) {
      leaveBonusTypes = this.takeListLeaveBonusType;
    }

    return leaveBonusTypes;
  }

  get leaveBonusDetail() {
    return dayleaveStore.takeLeaveBonus;
  }

  get takeDayUsed() {
    return dayleaveStore.takeDayUsed;
  }

  get takeDayRemaining() {
    return dayleaveStore.takeDayRemaining;
  }

  get takeListLeaveBonusType() {
    return dayleaveStore.listLeaveBonusType;
  }

  get takeNewDayOff() {
    return parseFloat((this.takeDayRemaining + this.handleDayBonus()).toFixed(2));
  }

  get userName() {
    return dayleaveStore.userName;
  }

  get userEmail() {
    return dayleaveStore.userEmail;
  }

  get userAvatar() {
    return dayleaveStore.userAvatar
      ? 'data:image/png;base64,' + dayleaveStore.userAvatar
      : this.defaultAvatar;
  }

  async handleSubmit() {
    this.$nuxt.$loading.start();
    const $this = this;
    try {
      if (this.listLeaveDay.length && !this.isEditBonus) {
        const leaveDays: LeaveBonus[] = [];
        this.listLeaveDay.forEach((item) => {
          leaveDays.push({
            ...item,
            hour: this.calculateDayBonus(item.hour, item.leave_bonus_type_id)
          });
        });
        const res = await dayleaveStore.addLeaveBonus(leaveDays);
        dayleaveStore.setDayRemaining(this.takeNewDayOff);
        this.listLeaveDay = [];
        this.showMsgBoxOk(this.$t('Confirmation') as string, this.$t(res.message) as string, function() {
          dayleaveStore.setShowBonusLeaveModal(true);
          dayleaveStore.setHasUpdateLeaveBonus(true);
          $this.$router.push('/hrm/manage-day-leave');
        });
      } else {
        const res = await dayleaveStore.editLeaveBonuses({
          id: parseInt(this.$route.params.id),
          leave_bonus_type_id: this.type_day,
          year_belong: this.year,
          hour: this.num_day,
          reason: this.reason
        });
        await dayleaveStore.getLeaveInfo({
          user_id: parseInt(this.$route.query.user_id.toString()),
          year: this.year
        });
        const successMsg = res.message;
        const $context = this;
        this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
      }
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
        this.successMsg = '';
      }, 3000);
    }
  }

  cancelBtn() {
    dayleaveStore.setShowBonusLeaveModal(false);
  }

  addLeaveDayBonus() {
    this.handleValidateForm();
    if (!this.errTypeBonus && !this.errHour && !this.errReason) {
      this.listLeaveDay.push(
        {
          user_id: this.userId,
          leave_bonus_type_id: this.type_day && this.type_day,
          hour: this.num_day ? this.num_day : 0,
          reason: this.reason,
          year_belong: this.year,
          isShow: false
        });
      this.type_day = null;
      this.resetFormInput();
    }
  }

  handleValidateForm() {
    this.errTypeBonus = this.type_day ? '' : this.$t('This field is required') as string;
    this.errReason = this.reason ? '' : this.$t('This field is required') as string;
    const numDay = this.num_day && this.num_day.toString();
    const reg = /^[-+]?[0-9]+\.[0-9]{1,2}$/;
    const regNum = /^[0-9]*$/;

    if (!this.num_day) {
      this.errHour = this.$t('This field is required') as string;
    } else if (this.num_day) {
      if (!this.isReallyNumber(this.num_day)) {
        this.errHour = this.$t('The field must be numeric') as string;
      } else if (numDay && !reg.test(numDay) && !regNum.test(numDay)) {
        this.errHour = this.$t('The field can have a maximum of 2 decimal places.') as string;
      } else {
        this.errHour = '';
      }
    }
  }

  isReallyNumber(data) {
    return typeof data === 'number' && !isNaN(data);
  }

  removeLeaveDay(id: number) {
    const $this = this;
    const msgModalConfirm = this.$t('Do you want to <b>remove</b> this leave request?') as string;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.listLeaveDay.splice(id, 1);
      $this.handleDayBonus();
    });
  }

  showEmail(id: number) {
    this.listLeaveDay[id].isShow = !this.listLeaveDay[id].isShow;
  }

  getTitle(bonusType: number | null, num_day: number) {
    let str = '';
    if (this.listLeaveBonusType) {
      str = (bonusType && this.listLeaveBonusType.get(bonusType.toString())) || '';
      str = this.$t(str) + ' (' + num_day + ' ' + this.$t('days') + ')';
    }
    return str;
  }

  onChangeSelect(event) {
    if (event.target.value) {
      this.errTypeBonus = '';
      this.errInvalid = '';
      this.errHour = '';
      this.errReason = '';
    }
    this.resetFormInput();
    this.isDisableDay = !!(this.type_day && this.type_day === this.clearLeaveType);
  }

  onChangeInput(event) {
    if (event.target.value) {
      this.errHour = '';
    }
  }

  onChangeReason(event) {
    if (event.target.value) {
      this.errReason = '';
    }
  }

  handleDayBonus() {
    let totalBonusDay = 0;
    this.listLeaveDay.forEach((leaveDay) => {
      totalBonusDay += leaveDay.hour;
    });
    return totalBonusDay / 8;
  }

  calculateDayBonus(num_day: number, type_day: number | null) {
    let dayBonus = 0;
    if (num_day && type_day) {
      if (type_day < this.clearLeaveType || (type_day === this.clearLeaveType && this.takeDayRemaining < 0)) {
        dayBonus = Math.abs(num_day) * 8;
      }
      if (type_day === this.clearLeaveType && this.takeDayRemaining > 0) {
        dayBonus = Math.abs(num_day) * -8;
      }
    }

    return dayBonus;
  }

  resetFormInput() {
    this.num_day = null;
    this.reason = '';
  }

  get isDisableInput() {
    return !this.type_day;
  }

  showMsgBoxOk(title: string, message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxOk([messageNodes], {
      title           : title,
      buttonSize      : 'md',
      okVariant       : 'primary',
      okTitle         : 'OK',
      hideHeaderClose : true,
      centered        : true
    }).then((value: any) => {
      if (value) {
        callBack();
      }
    });
  }

  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Delete') as string,
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
  table tr td {
    border: none;
  }
  .required:after {
    content: " *";
    color:red;
  }
  .container-left {
    width: 40%;
    border-right: 1px solid #EAEAEA;
  }
  .container-right {
    width: 60%;
    display: flex;
    flex-direction: column;
  }
  span.card-title {
    font-size: 19px;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    .user-avatar {
      width: 70px;
    }
    .group-btn-action {
      display: flex;
      flex-direction: column;
    }
    .group-btn-action > button {
      width: 100%;
    }
    .group-btn-action > button:nth-child(1) {
      margin-bottom: 8px;
    }
    .group-btn-action > button:nth-child(2) {
      margin-bottom: 8px;
    }
  }
  @media (min-width: 481px) {
    .user-avatar {
      width: 105px;
    }
    .group-btn-action {
      display: flex;
    }
    .group-btn-action > button:nth-child(1), button:nth-child(3) {
      width: 115px;
    }
    .group-btn-action > button:nth-child(1) {
      margin-right: 8px;
    }
    .group-btn-action > button:nth-child(2) {
      margin-right: 8px;
    }
  }
</style>
