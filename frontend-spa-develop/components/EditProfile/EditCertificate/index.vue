<template>
  <div class="block-card card mt-4">
    <div v-b-toggle.collapse-user-certificate class="card-header-profile card-header">
      <h5 class="card-title-profile card-title text-dark">
        <i class="fa fa-certificate"></i>
        <span>{{ $t("Certificate") }}</span>
        <i class="when-opened fa fa-chevron-up fa-pull-right"></i>
        <i class="when-closed fa fa-chevron-down fa-pull-right"></i>
      </h5>
    </div>
    <b-collapse id="collapse-user-certificate">
      <ValidationObserver ref="observer" v-slot="{}" tag="form" @submit.prevent="handleModifyCertificate()">
        <div class="container-certificate-body">
          <!-- block-user-certificate -->
          <div
            v-for="(item, index) in certificateList"
            :key="index"
            class="block-user-certificate card-body"
            :class="{ 'border-top' : index != 0 }">
            <div class="form-row">
              <div class="form-group col-md-12 col-lg-6 col-xl-4">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Certificate name') + '(' + index + ')'">
                  <p class="text-dark font-weight-bold">{{ $t("Certificate name") }}</p>
                  <input
                    v-model="item.title"
                    class="form-control"
                    type="text"
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
                @click="removeItemCertificate(index)">
                <i class="fa fa-trash-alt"></i> {{ $t("Remove") }}
              </button>
            </div>
          </div>
          <!-- End block-user-certificate -->
        </div>
        <div class="card-footer-profile card-footer">
          <p :class="{ 'd-block': errorEditCertificate!='' }" class="invalid-feedback">
            {{ $t(errorEditCertificate) }}
          </p>
          <div>
            <button
              type="submit"
              class="btn btn-success">
              <i class="fa fa-save"></i> {{ $t("Save") }}
            </button>
            <button
              type="button"
              class="btn btn-warning btn-add"
              @click="addItemCertificate()">
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
import { Certificate } from '~/types/user-profile';

@Component({
  components: {
  }
})
export default class extends Vue {
  userId : number = this.userProfile ? this.userProfile.user_id : 0;
  certificateList : Certificate[] | [] = this.certificateArr;
  submitted : boolean = false;
  errorEditCertificate : string = '';
  msgSuccessEditCertificate : string = '';

  get userProfile() {
    return userProfileStore.userProfileInfo ? userProfileStore.userProfileInfo : null;
  }

  get certificateArr() {
    let newArray : Certificate[] | [] = [];

    if (this.userProfile && this.userProfile.certificate) {
      this.userProfile.certificate.forEach((value) => {
        const itemCertificate : Certificate = Object.assign({}, value);

        newArray = [ ...newArray, itemCertificate ];
      });
    }

    return newArray;
  }

  async handleModifyCertificate() {
    this.submitted = true;
    this.msgSuccessEditCertificate = '';
    this.errorEditCertificate = '';
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      const msgModalConfirm = this.$t('Are you sure to edit certificate?');
      const $this = this;
      this.$emit('callModalConfirm', msgModalConfirm, function() {
        $this.saveCertificate();
      });
    }
  }

  async saveCertificate() {
    this.$nuxt.$loading.start();

    try {
      userProfileStore.editCertificate(this.certificateList);
      const res = await userProfileStore.updateProfile();
      const msgSuccessEditCertificate = res.message;
      const $context = this;
      this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccessEditCertificate);
      await this.reloadData();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditCertificate = err.response.data.message;
      } else {
        this.errorEditCertificate = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  addItemCertificate() {
    const newItemCertificate : Certificate = {
      title: '',
      description: ''
    };

    this.certificateList = [ ...this.certificateList, newItemCertificate ];
  }

  removeItemCertificate(indexCertificateItem: number) {
    if (this.certificateList.length > 0) {
      this.certificateList = this.certificateList.filter(function(item, index) {
        return index !== indexCertificateItem;
      });
    }
  }

  async reloadData() {
    this.$nuxt.$loading.start();

    try {
      await userProfileStore.getUserProfileInfo(this.userId);
      this.certificateList = this.userProfile ? this.certificateList : [];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errorEditCertificate = err.response.data.message;
      } else {
        this.errorEditCertificate = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }
}
</script>
