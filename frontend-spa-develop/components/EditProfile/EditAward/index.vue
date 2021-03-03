<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-award class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-trophy"></i>
        <span>{{ $t("Award") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-award">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyAward()">
        <div class="container-award-body">
          <!-- block-user-award -->
          <div
            v-for="(item, index) in awardList"
            :key="index"
            class="block-user-award card-body"
            :class="{ 'border-top' : index != 0 }">
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Award name') + '(' + index + ')'">
                  <p class="text-dark font-weight-bold">{{ $t("Award name") }}</p>
                  <input
                    v-model="item.title"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && errors[0] }">
                  <span v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-lg-12 col-xl-8">
                <p class="text-dark font-weight-bold">{{ $t("Description") }}</p>
                <textarea v-model="item.description" class="form-control" rows="6"></textarea>
              </div>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-danger"
                @click="removeItemAward(index)">
                <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
              </button>
            </div>
          </div>
          <!-- End block-user-award -->
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditAward!='' }" class="invalid-feedback">{{ $t(errorEditAward) }}</p>
          <div>
            <button
              type="submit"
              class="btn btn-success">
              <i class="fa fa-save"></i> {{ $t("Save") }}
            </button>
            <button
              type="button"
              class="btn btn-warning btn-add"
              @click="addItemAward()">
              <i class="fa fa-plus"></i> {{ $t("Add") }}
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
import { Award } from '~/types/user-profile';

@Component({
  components: {
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  awardList : Award[] | [] = this.awardArr;
  submitted : boolean = false;
  errorEditAward : string = '';
  msgSuccessEditAward : string = '';

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get awardArr() {
    let newArray : Award[] | [] = [];

    if (this.userProfile && this.userProfile.award) {
      this.userProfile.award.forEach((value) => {
        const itemAward : Award = Object.assign({}, value);

        newArray = [ ...newArray, itemAward ];
      });
    }

    return newArray;
  }

  async handleModifyAward() {
    this.submitted = true;
    this.msgSuccessEditAward = '';
    this.errorEditAward = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msgModalConfirm = this.$t('Are you sure to edit award?');
      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveAward();
      });
    }
  }

  async saveAward() {
    this.$nuxt.$loading.start();

    try {
      userProfileStore.editAward(this.awardList);
      const res = await userProfileStore.updateProfile();
      this.msgSuccessEditAward = res.message;
      const msgSuccessEditAward = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditAward);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditAward = err.response.data.message;
      } else {
        this.errorEditAward = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  addItemAward() {
    const newItemAward : Award = {
      title: '',
      description: ''
    };

    this.awardList = [ ...this.awardList, newItemAward ];
  }

  removeItemAward(indexAwardItem: number) {
    if (this.awardList.length > 0) {
      this.awardList = this.awardList.filter(function(item, index) {
        return index !== indexAwardItem;
      });
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.awardList = this.userProfile ? this.awardList : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditAward = err.response.data.message;
      } else {
        this.errorEditAward = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
