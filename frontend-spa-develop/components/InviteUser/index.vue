<template>
  <div>
    <div class="form-group">
      <label for="upload-email" class="font-weight-bold">{{ $t("Upload xlsx or csvs file to invite") }}</label>
      <b-form-file
        id="upload-email"
        v-if="isUploadReady"
        v-model="fileUpload"
        @input="importEmail"
        accept=".csv, .xls, .xlsx"
        class="input-file-upload" />
    </div>
    <div>
      <ValidationObserver ref="observer" v-slot="{}">
        <div class="form-group">
          <ValidationProvider
            ref="emailData"
            v-slot="{ errors }"
            rules="required|max:500"
            name="email">
            <label for="invite-email" class="font-weight-bold">{{ $t("Invite via email") }}</label>
            <textarea
              id="invite-email"
              v-model.trim="emailData"
              :class="{ 'is-invalid': submitted && errors[0] }"
              name="email"
              type="text"
              class="form-control"
              rows="4"
              no-resize
              placeholder="mail1@gmail.com,mail2@gmail.com">
              </textarea>
            <p v-if="submitted && errors[0]" class="invalid-feedback">{{ errors[0] }}</p>
          </ValidationProvider>
        </div>
        <div class="form-group">
          <p class="text-success">{{ $t(successMessage) }}</p>
          <p class="text-danger">{{ $t(responseMessage) }}</p>
          <p class="text-danger">{{ $t(errorMessage) }}</p>
          <div>
            <button
              id="btn-confirm-email"
              @click.prevent="handleSubmit"
              :disabled="!!errorMessage"
              type="button"
              class="btn btn-primary2 w-100px">
              {{ $t('Invite') }}
            </button>
          </div>
        </div>
      </ValidationObserver>
    </div>
    <div class="form-group">
      <label class="font-weight-bold">{{ $t("Download file template") }}</label>
      <div>
        <button
          @click.prevent="downloadTemplateFile('xlsx')"
          type="button"
          class="btn btn-secondary3 btn-download-sample text-white mr-2">
          {{ $t("Download xlsx") }}
        </button>
        <button
          @click.prevent="downloadTemplateFile('csv')"
          type="button"
          class="btn btn-secondary3 btn-download-sample text-white">
          {{ $t("Download csv") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import XLSX from 'xlsx';
import { registrationRequestStore } from '~/store/index';
import { XLSXInviteEmail } from '~/types/registration-requests';

@Component({})
export default class CreateOrganization extends Vue {
  submitted: boolean = false
  successMessage: string = ''
  responseMessage: string = ''
  emailData: string = ''
  isUploadReady: boolean = true;
  emails: string[] = [];
  fileUpload: File | null = null
  errorMessage: string = ''

  handleSubmit() {
    this.sendInvite();
  }

  async sendInvite() {
    this.submitted = true;
    let emailList: string[] = [];
    const observer: any = this.$refs.observer;
    const isValid = await observer.validate();

    if (isValid) {
      if (this.emailData) {
        emailList = this.emailData.replace('\n', '').split(',').map(item => item.trim());
      }
      this.$nuxt.$loading.start();
      try {
        const res = await registrationRequestStore.inviteUser(emailList);
        this.responseMessage = '';
        this.successMessage = res.message;
      } catch (err) {
        this.successMessage = '';
        if (typeof err.response !== 'undefined') {
          this.responseMessage = err.response.data.message;
        } else if (typeof err[0] !== 'undefined' && err[0].length > 0) {
          this.responseMessage = this.$t(err[0][0]) + ' : ' + err[0][1].join();
        }
      } finally {
        this.isUploadReady = false;
        this.$nextTick(() => {
          this.isUploadReady = true;
        });
        this.emails = [];
        setTimeout(() => {
          this.responseMessage = '';
          this.successMessage = '';
        }, 3000);
        this.$nuxt.$loading.finish();
      }
    }
  }

  importEmail() {
    this.emails = [];
    this.emailData = '';
    if (this.fileUpload) {
      const reader = new FileReader();
      const extension = this.fileUpload.type;
      if (extension === 'application/vnd.ms-excel') {
        reader.readAsText(this.fileUpload);
        reader.onload = (e) => {
          if (e.target) {
            const f: any = e.target.result;
            const rows = f.split(/\r\n|\n/);
            if (rows.length < 3) {
              this.errorMessage = 'File is empty value';
              return;
            }

            for (let i = 1; i < rows.length - 1; i++) {
              if (rows[i].includes(',')) {
                this.errorMessage = `Too many values at row ${i + 1}`;
                return;
              }
              if (!this.emails.includes(rows[i])) {
                this.emails.push(rows[i]);
              }
            }
            this.emailData = this.emails.join();
            this.errorMessage = '';
          }
        };
      } else if (extension === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        reader.readAsBinaryString(this.fileUpload);
        reader.onload = (e) => {
          if (e.target) {
            const f: any = e.target.result;
            const workbook = XLSX.read(f, { type: 'binary' });
            const $this = this;
            workbook.SheetNames.forEach(function(sheetName) {
              const rows: XLSXInviteEmail[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
              if (rows.length === 0) {
                $this.errorMessage = 'File is empty value';
                return;
              }

              rows.forEach((row, index) => {
                if (!row.Email) {
                  $this.errorMessage = `Invalid Params at row ${index + 1}`;
                  return;
                }

                if (!$this.emails.includes(row.Email)) {
                  $this.emails.push(row.Email);
                }
              });
              $this.emailData = $this.emails.join();
              $this.errorMessage = '';
            });
          }
        };
      } else {
        this.errorMessage = 'Invalid file type';
      }
    }
  }

  async downloadTemplateFile(type) {
    try {
      const response = await registrationRequestStore.downloadTemplate(type);
      const link = document.createElement('a');
      const filename = type === 'xlsx' ? 'import-email.xlsx' : 'import-email.csv';
      link.href = window.URL.createObjectURL(new Blob([response]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.responseMessage = err.response.data.message;
      } else {
        this.responseMessage = err;
      }
    }
  }

  backBtn() {
    this.$router.back();
  }
};
</script>
<style scoped>
.btn-download-sample {
  min-width: 136px;
}
</style>
