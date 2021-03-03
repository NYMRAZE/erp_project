<template>
  <div>
    <h3 id="page-title" class="padding-sm-x d-none d-block d-lg-none font-weight-bold">
      {{ $t("Manage CV") }}
    </h3>
    <div class="padding-sm-x">
      <nuxt-link to="/recruitment/manage-recruitment" class="text-decoration-none d-inline-block">
        <h4 class="sub-page-title font-weight-bold">
          <div class="container-icon-circle">
            <span class="fas fa-play fa-rotate-180"></span>
          </div>
          {{ $t('Back to manage recruitment') }}
        </h4>
      </nuxt-link>
    </div>
    <div class="filter-area mt-3">
      <ValidationObserver ref="observer" v-slot="{ errors }" tag="form" :name="$t('Media')" rules="required">
        <div class="form-row">
          <div class="col-xl-6 col-lg-7 col-md-8 col-sm-12">
            <div class="form-row">
              <div class="col-lg-6 col-md-6 form-group">
                <label class="font-weight-bold" for="input-search">{{ $t("Search") }}</label>
                <input
                    v-model="fileName"
                    id="input-search"
                    ref="nameInput"
                    type="text"
                    class="form-control"
                    placeholder="...">
              </div>
              <div class="col-lg-6 col-md-6 form-group">
                <label class="font-weight-bold">{{ $t("Media") }}</label>
                <select
                    v-model.number="mediaSelected"
                    class="form-control"
                    :class="{ 'is-invalid': errors[0] }">
                  <option :value="null"></option>
                  <option v-for="[key, value] in mediaList" :key="key" :value="key">
                    {{ value }}
                  </option>
                </select>
                <span v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-5 col-md-4 col-sm-12 form-group d-flex align-items-start">
            <div class="form-row">
              <div class="col form-group">
                <label class="label-hide-sm font-weight-bold">&#8205;</label>
                <div>
                  <button
                      @click="handleFilterByMedia()"
                      type="button"
                      class="btn btn-primary2 w-100px mr-2">
                      <i class="fa fa-search"></i>
                    {{ $t("Search") }}
                  </button>
                  <button
                      @click="showAddSidebar"
                      type="button"
                      class="btn-more-less btn btn-secondary2 w-100px">
                    {{ $t("Add CV") }} <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="tbl-container text-nowrap mt-4">
      <table class="tbl-info">
        <thead>
        <tr>
          <th>{{ $t("Media") }}</th>
          <th>{{ $t("CV") }}</th>
          <th>{{ $t("Status") }}</th>
          <th>{{ $t("Created at") }}</th>
          <th>{{ $t("Updated at") }}</th>
          <th>{{ $t("Action") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in cvFields"
            :key="index"
            :class="(item.id === cvID && commentID === undefined && takeIsNavigateNoti) && 'noti-cv'">
          <td>
            {{ getMediaByID(item.media_id) }}
          </td>
          <td>
            <b-badge id="cv-info" variant="secondary" @click="viewDetailCV(item.content)">{{ item.file_name }}</b-badge>
          </td>
          <td>
            <b-badge pill :style="`background: ${getColorByStatus(item.status)}`">
              {{ getStatusByID(item.status) }}
            </b-badge>
          </td>
          <td>{{ item.created_at }}</td>
          <td>{{ item.updated_at }}</td>
          <td class="btn-group-action">
            <div class="btn-group-action">
              <i class="far fa-comment-alt mr-1" @click="gotoCVComments(item.id)"></i>
              <i class="fas fa-edit mr-1 text-primary" @click="editCvByMedia(index, item.id)"></i>
              <i class="fas fa-trash-alt text-danger" @click="removeCv(item.id)"></i>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div class="sidebar-background" :class="isShowAddSidebar && 'd-none'"></div>
      <ValidationObserver ref="observer" v-slot="{}" tag="div">
        <div class="add-cv-sidebar" :class="isShowAddSidebar && 'd-none'">
          <div class="d-flex justify-content-between align-items-center border-bottom px-4 py-2">
            <h4 class="m-0 text-uppercase">{{ isAddItem ? $t('Add New CV') : $t('Edit CV') }}</h4>
            <button
                type="button"
                class="add-cv-btn"
                @click="closeAddSidebar">
              &times;
            </button>
          </div>
          <div class="p-4">
            <div v-if="isAddItem" class="form-group">
              <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  :name="$t('Media')">
                <label class="text-dark m-0">
                  {{ $t("Media") }}:
                </label>
                <select
                    v-model.number="mediaID"
                    class="form-control"
                    :class="{ 'is-invalid': errors[0] }">
                  <option :value="null"></option>
                  <option v-for="[key, value] in mediaList" :key="key" :value="key">
                    {{ value }}
                  </option>
                </select>
                <span v-if="errors[0]" class="invalid-feedback d-block">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div v-if="!isAddItem" class="form-group">
              <label class="text-dark m-0">
                {{ $t("Status") }}:
              </label>
              <select
                  v-model.number="cvStatus"
                  class="form-control">
                <option value="0"></option>
                <option v-for="[key, value] in cvStatuses" :key="key" :value="key">
                  {{ value }}
                </option>
              </select>
            </div>
            <div v-if="isAddItem" class="form-group">
              <label class="text-dark m-0">
                {{ $t("Cv") }}:
              </label>
              <div class="file-chooser">
                <div
                    v-for="(cv, key) in cvList"
                    :key="key">
                  <div
                      class="tags-input-tag">
                    <span>{{ cv.file_name }}</span>
                    <button
                        type="button"
                        class="tags-input-remove"
                        @click="removeCVFile(key)">
                      &times;
                    </button>
                  </div><br>
                </div>
                <ValidationProvider
                    ref="cvs"
                    v-slot="{ errors }"
                    rules="ext:pdf|required"
                    :name="$t('Cv')"
                    tag="div"
                    class="input-group">
                  <b-form-file
                      ref="fileInput"
                      v-model="filesUpload"
                      accept=".pdf"
                      :class="{'is-invalid': errors[0] && !cvList.length}"
                      :multiple="isAddItem"
                      @input="importCV">
                  </b-form-file>
                  <span v-if="errors[0] && !cvList.length" class="invalid-feedback" :class="{ 'd-block': errors[0] }">
                    {{ errors[0] }}
                  </span>
                </ValidationProvider>
              </div>
            </div>
            <div class="d-flex mt-4">
              <b-button squared variant="outline-primary" class="mr-1" @click.prevent="handleCvByMedia">
                {{ isAddItem ? $t('Add') : $t('Save') }}
              </b-button>
              <b-button squared variant="outline-secondary" @click="closeAddSidebar">{{ $t('Cancel') }}</b-button>
            </div>
            <p class="text-danger">{{ $t( errResponse) }}</p>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <CVComments v-if="checkShowCVComments" :key="checkShowCVComments" :cv-id="cvID" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { CV } from '~/types/recruitment';
import { recruitmentStore, notificationStore } from '~/store';
import CVComments from '~/components/ManageCV/CVComments/index.vue';

@Component({
  components: {
    CVComments
  }
})
export default class extends Vue {
  recruitmentID: number = 0
  isShowAddSidebar: boolean = true
  isAddItem: boolean = false
  cvList: CV[] = []
  cvAdded: CV[] = []
  filesUpload: File[] | null= null
  cvFields: CV[] = []
  mediaSelected: number = 0
  fileName: string = ''
  cvID: number = 0
  commentID: number | undefined = 0
  mediaID: number | null = null
  cvStatus: number = 0
  errResponse: string = ''
  msgSuccess: string = ''

  beforeMount() {
    const query = this.$route.query;
    this.recruitmentID = parseInt(query.recruitment_id.toString());
    if (query.cv_id) {
      this.cvID = parseInt(query.cv_id.toString());
    }
    this.commentID = query.comment_id ? parseInt(query.comment_id.toString()) : undefined;
  }

  mounted() {
    const $this = this;
    setTimeout(() => {
      $this.getCVs();
    }, 100);

    if (this.commentID !== undefined && this.cvID) {
      this.$nextTick(async () => {
        await this.getCVComments();
        await recruitmentStore.setShowCVComments(true);
      });
    }
  }

  async getCVs() {
    try {
      this.$nuxt.$loading.start();
      await recruitmentStore.getCvs(this.recruitmentID);
      this.cvFields = [ ...this.takeCVList ];
      this.cvAdded = [ ...this.takeCVList ];
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    } finally {
      this.$nuxt.$loading.finish();
    }
  }

  get takeCVList() {
    return recruitmentStore.takeCVList;
  }

  get mediaList() {
    return recruitmentStore.takeMedias;
  }

  get takeStatusColors() {
    return recruitmentStore.takeStatusColors;
  }

  get takeAssignees() {
    return recruitmentStore.takeAssignees;
  }

  get cvStatuses() {
    return recruitmentStore.takeCVStatus;
  }

  get checkShowCVComments() {
    return recruitmentStore.checkShowCVComments;
  }

  get takeIsNavigateNoti() {
    return notificationStore.takeIsNavigateNoti;
  }

  async getCVComments () {
    try {
      await recruitmentStore.getCvComments({
        recruitment_id: this.recruitmentID,
        cv_id: this.cvID
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  closeAddSidebar() {
    this.isShowAddSidebar = true;
  }

  getMediaByID(key: number) {
    return this.mediaList.get(key);
  }

  getStatusByID(key: number) {
    return this.cvStatuses.get(key);
  }

  getColorByStatus(status: number) {
    return this.takeStatusColors.get(status);
  }

  showAddSidebar() {
    const observer: any = this.$refs.observer;
    observer.reset();
    this.isAddItem = true;
    this.isShowAddSidebar = false;
    this.cvList = [];
    this.cvStatus = 0;
    this.mediaID = null;
    this.filesUpload = [] as File[];
  }

  handleFilterByMedia() {
    const mediasFilter = this.cvAdded.filter((cv) => {
      if (cv.media_id && cv.file_name && this.mediaSelected && this.fileName) {
        return this.mediaSelected === cv.media_id && cv.file_name.includes(this.fileName);
      } else if (cv.file_name && !this.mediaSelected && this.fileName) {
        return cv.file_name.includes(this.fileName);
      } else if (cv.media_id && this.mediaSelected && !this.fileName) {
        return this.mediaSelected === cv.media_id;
      } else {
        return true;
      }
    });

    this.cvFields = [ ...mediasFilter ];
  }

  editCvByMedia(index: number, id: number) {
    this.cvID = id;
    this.cvList = [];
    this.isAddItem = false;
    this.cvStatus = this.cvFields[index].status as number;
    this.isShowAddSidebar = false;
    notificationStore.setIsNavigateNoti(false);
  }

  async gotoCVComments(id: number) {
    try {
      await this.$router.replace(`/recruitment/manage-cv?recruitment_id=${this.recruitmentID}&cv_id=${id}&comment_id=${0}`);
    } catch (e) {}
  }

  async handleCvByMedia() {
    try {
      const observer: any = this.$refs.observer;
      await observer.validate();

      if ((this.mediaID && this.cvList.length) || this.cvStatus) {
        if (this.isAddItem && this.mediaID) {
          const newCVListAdded = [] as CV[];
          this.cvList.forEach((cv) => {
            newCVListAdded.push({
              file_name: cv.file_name,
              content: cv.content,
              media_id: this.mediaID,
              status: 1
            });
          });

          const res = await recruitmentStore.uploadCV({
            recruitment_id: this.recruitmentID,
            cv_fields: newCVListAdded,
            assignees: this.takeAssignees
          });
          const msgSuccess = res.message;
          const $context = this;
          this.$common.makeToast($context, 'success', 'b-toaster-bottom-right', 'Notification', msgSuccess);
        } else {
          const res = await recruitmentStore.editCv({
            id: this.cvID,
            recruitment_id: this.recruitmentID,
            status: this.cvStatus
          });
          this.msgSuccess = res.message;
        }
        this.isShowAddSidebar = true;
        await this.getCVs();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    } finally {
    }
  }

  importCV() {
    const fileInput: any = this.$refs.fileInput;

    if (this.isAddItem) {
      const filesUpload: File[] = this.filesUpload as File[];
      if (filesUpload && filesUpload.length) {
        filesUpload.forEach(async (file) => {
          const newFileBase64 = await this.convertPdfToBase64(file);
          const contentFile = (newFileBase64 as string).split(',')[1];
          this.cvList.push({
            file_name: file.name,
            content: contentFile
          });
        });
        (fileInput as any).reset();
      }
    }
  }

  convertPdfToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  viewDetailCV(pdfFile: string) {
    if (pdfFile) {
      const win = window.open() as Window;
      win.document.write(`<embed width="100%" height="100%" name="test" src="data:application/pdf;base64,${pdfFile}">`);
    }
  }

  removeCVFile(index: number) {
    this.cvList.splice(index, 1);
  }

  removeCv(id: number) {
    const msgModalConfirm = this.$t('Do you want to <b>delete</b> this CV?') as string;

    const $this = this;
    this.showModalConfirm(msgModalConfirm, function() {
      $this.handleRemoveCV(id);
    });
  }

  async handleRemoveCV(id: number) {
    try {
      const res = await recruitmentStore.removeCV(id);

      if (res) {
        await recruitmentStore.setRecruitment(null);
        await this.getCVs();
      }
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  backBtn() {
    this.$router.push('/recruitment/manage-recruitment');
  }

  showModalConfirm(message: string, callBack: Function) {
    const messageNodes = this.$createElement(
      'div',
      {
        domProps: { innerHTML: message }
      }
    );

    this.$bvModal.msgBoxConfirm([messageNodes], {
      title           : this.$t('Confirm') as string,
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
};
</script>

<style scoped>
.wrap-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.text-decoration {
  text-decoration: underline;
}
.table > thead > tr > th {
  vertical-align: middle;
  text-align: center;
}
div.card {
  border: none;
}
.container-board {
  border: 1px solid #c7d8e2;
}
ul > li {
  list-style-type: none;
}
.board-left{
  flex: 0 0 20%;
  padding: 1.3rem;
  padding-bottom: 0;
  border-right: 1px solid #c7d8e2;
}
.board-right {
  flex: 0 0 80%;
  padding: 0;
}
span.text-lg, span > i {
  cursor: pointer;
  color: #626262;
}
span > i.fa-info {
  width: 16px;
}
span.hr-line {
  display: inline-block;
  margin-left: 2px;
  margin-right: 2px;
  width: 100%;
  border-bottom: 1px solid #c7d8e2;
}
.add-cv-sidebar {
  z-index: 6;
  width: 400px;
  max-width: 85vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  background: #fff;
  transition: all 1s ease-in-out;
  box-shadow: 0 0 15px 0 rgba(0,0,0,.05);
}
button.add-cv-btn , button.add-cv-btn:focus {
  border: none;
  font-size: 2rem;
  outline: none;
  background-color: inherit;
}
.sidebar-background {
  background: rgba(0,0,0,.2);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: all 1.1s ease-in-out;
}
.tags-input-tag {
  display: inline-flex;
  line-height: 1;
  align-items: center;
  font-size: .875rem;
  background-color: #6c757d;
  color: #fff;
  border-radius: .25rem;
  user-select: none;
  padding: .25rem;
  margin-right: .5rem;
  margin-bottom: .25rem;
}
.tags-input-tag:last-of-type {
  margin-right: 0;
}
.tags-input-tag > span {
  cursor: pointer;
}
.tags-input-tag > button {
  color: #fff;
  background-color: inherit;
  border: none;
}
.tags-input-remove {
  line-height: 1;
}
.tags-input-remove:first-child {
  margin-right: .25rem;
}
.tags-input-remove:last-child {
  margin-left: .25rem;
}
.tags-input-remove:focus {
  outline: 0;
}
table tbody #cv-info {
  cursor: pointer;
}
.comment-cv {
  border: none;
  overflow: hidden !important;
  outline: none;
  background-color: inherit;
  box-shadow: none;
}
.noti-cv {
  background-color: #5bd7ea;
}
.btn-group-action {
  width: 100px;
}

@media (max-width: 768px) {
  .wrap-header {
    display: flex;
    flex-direction: column;
  }
  .board-left {
    flex: 0 0 100%;
  }
  .board-right {
    flex: 0 0 100%;
  }
}

@media (min-width: 768px) {
  .wrap-header {
    align-items: center;
  }
}
</style>
