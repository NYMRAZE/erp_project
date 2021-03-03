<template>
  <div class="form-row">
    <div class="col-xl-7 col-lg-10 col-sm-10 col-sm-12">
      <div>
        <label class="font-weight-bold mt-3">{{ $t('Step') + ' 5 - 7' }}</label>
      </div>
      <div>
        <label class="font-weight-bold mt-4">{{ $t("Overtime weight") }} <span class="text-important">({{ $t('Set weights for overtime on weekdays, weekends, holidays') }})</span></label>
      </div>
      <div class="mt-4">
        <ValidationObserver ref="observer">
          <ValidationProvider v-slot="{ errors }" class="form-group" tag="div" rules="eval_required|floatNum">
            <label class="text-dark font-weight-bold required" for="normal-day">
              {{ $t("Normal days") }}:
            </label>
            <input
                id="normal-day"
                v-model.number="weekdayWeight"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors[0] }"
                :placeholder="`${$t('Normal days weights')}...`">
            <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" class="form-group mt-2" tag="div" rules="eval_required|floatNum">
            <label class="text-dark font-weight-bold required" for="weekend-weight">
              {{ $t("Weekends") }}:
            </label>
            <input
                id="weekend-weight"
                v-model.number="weekendWeight"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors[0] }"
                :placeholder="`${$t('Weekend weights')}...`">
            <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" class="form-group mt-2" tag="div" rules="eval_required|floatNum">
            <label class="text-dark font-weight-bold required" for="holiday-weight">
              {{ $t("Holidays") }}:
            </label>
            <input
                id="holiday-weight"
                v-model.number="holidayWeight"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors[0] }"
                :placeholder="`${$t('Holiday weights')}...`">
            <p v-if="errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
          <p class="text-danger mt-2">{{ $t(errorMessage) }}</p>
        </ValidationObserver>
      </div>
      <div class="d-flex">
        <div class="mr-auto">
          <b-button
              class="btn-save-test w-100px"
              @click.prevent="handleOvertimeWeight">{{ $t('Save') }}
          </b-button>
        </div>
        <div>
          <b-button class="btn-save-previous" @click="previousSetting">Previous</b-button>
        </div>
        <div>
          <b-button class="btn-save-next ml-3" @click="nextSetting">Next</b-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { overtimeStore } from '../../../store';

@Component({
  components: {}
})

export default class extends Vue {
  weekdayWeight: number | null = null
  weekendWeight: number | null = null
  holidayWeight: number | null = null
  recordID     : number = 0
  errorMessage : string = ''
  successMsg : string = ''
  isCreated  : boolean = false

  mounted() {
    const $this = this;
    setTimeout(function () {
      $this.getOTWeight();
    }, 100);
  }

  async getOTWeight() {
    try {
      this.$nuxt.$loading.start();
      await overtimeStore.getOvertimeWeight().then((res) => {
        if (res) {
          this.weekdayWeight = res.normal_day_weight;
          this.weekendWeight = res.weekend_weight;
          this.holidayWeight = res.holiday_weight;
          this.recordID = res.id;
          this.isCreated = true;
        } else {
          this.isCreated = false;
        }
      });
    } catch (err) {} finally {
      this.$nuxt.$loading.finish();
      this.errorMessage && setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  }

  get takeOTWeight() {
    return overtimeStore.takeOTWeight;
  }

  async handleOvertimeWeight() {
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    try {
      this.$nuxt.$loading.start();
      if (isValid) {
        if (!this.isCreated) {
          const res = await overtimeStore.createOvertimeWeight({
            normal_day_weight: this.weekdayWeight,
            weekend_weight: this.weekendWeight,
            holiday_weight: this.holidayWeight
          });
          if (res) {
            this.successMsg = res.message;
            await Promise.all([this.$auth.fetchUser(), this.getOTWeight()]);
          }
        } else {
          const res = await overtimeStore.editOvertimeWeight({
            id : this.recordID,
            normal_day_weight: this.weekdayWeight,
            weekend_weight: this.weekendWeight,
            holiday_weight: this.holidayWeight
          });
          const successMsg = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', successMsg);
        }
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  nextSetting() {
    if (!this.takeOTWeight) {
      this.errorMessage = this.$t('Please enter overtime weight') as string;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    } else {
      this.$router.push('/settings/holidays');
    }
  }

  previousSetting() {
    this.$router.push('/settings/job-title');
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
.required:after {
  content: " *";
  color:red;
}
</style>
