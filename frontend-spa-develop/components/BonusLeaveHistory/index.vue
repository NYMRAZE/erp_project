<template>
  <div @click="unfocusList($event)">
    <div class="filter-area mt-4">
      <div class="form-row">
        <div class="col-xl-8 col-lg-10 col-md-10 col-sm-12">
          <div class="form-row">
            <div class="col-lg-4 col-md-4 form-group">
              <label class="text-dark font-weight-bold" for="quarter-filter">
                {{ $t("User") }}
              </label>
              <div ref="dropdown_list" class="dropdown">
                <input
                    ref="nameInput"
                    v-model="memberNameInput"
                    type="text"
                    :placeholder="`${$t('Search')}...`"
                    class="form-control"
                    @click.prevent="showDropdown"
                    @input="handleChangeInput"
                    @keydown.enter.prevent="selectMemberPressKey($event)">
                <div id="myDropdown" :class="isShow ? 'dropdown-content d-block' : 'dropdown-content'">
                  <ul ref="userList" class="list-user" @mouseover="focusList">
                    <li
                        v-for="(key, index) in userListSearching"
                        ref="item"
                        :key="index"
                        :class="index + 1 === focusIndex && !isMouseOver && 'focus-item' || 'item'"
                        @click.prevent="selectMember(key)">
                      {{ getUserNameByKey(key) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 form-group">
              <label class="text-dark font-weight-bold" for="leave-bonus">
                {{ $t("Type leave bonus") }}
              </label>
              <select
                  id="leave-bonus"
                  v-model.number="searchParams.leave_bonus_type_id"
                  class="form-control">
                <option :key="0" :value="0">{{ $t('All') }}</option>
                <option v-for="[key, value] in typeLeaveBonus" :key="key" :value="key">
                  {{ $t(value) }}
                </option>
              </select>
            </div>
            <div class="col-lg-4 col-md-4 form-group">
              <label class="text-dark font-weight-bold" for="year">{{ $t('Year') }}</label>
              <select id="year" v-model.number="searchParams.year" class="form-control">
                <option :key="0" :value="0">{{ $t("All") }}</option>
                <option
                    v-for="year in getYears"
                    :key="year"
                    :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-lg-2 col-md-2 col-sm-12 form-group d-flex align-items-start">
          <div class="form-row">
            <div class="col form-group">
              <label class="label-hide-sm font-weight-bold">&#8205;</label>
              <div>
                <b-button
                    class="btn btn-primary2 w-100px"
                    @click.prevent="handleFilterRequest">
                    <i class="fa fa-search"></i>
                  {{ $t("Search") }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tbl-container text-nowrap mt-5">
      <table class="tbl-info">
        <thead>
        <tr>
          <th scope="col">{{ $t("Name") }}</th>
          <th scope="col">{{ $t("Leave bonus type") }}</th>
          <th scope="col">{{ $t("Hour") }}</th>
          <th scope="col">{{ $t("Year") }}</th>
          <th scope="col">{{ $t("Reason") }}</th>
          <th scope="col">{{ $t("Created at") }}</th>
          <th scope="col">{{ $t("Created by") }}</th>
          <th scope="col">{{ $t("Action") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in dataTable" :key="index">
          <td>
            <img :src="avatarSrc(item.avatar)" class="tbl-info-avatar rounded-circle" />
            <span class="txt-with-img">{{ getUserNameByKey(item.user_id.toString()) }}</span>
          </td>
          <td>
            {{ item.leave_bonus_type }}
          </td>
          <td>
            {{ item.hour }}
          </td>
          <td>
            {{ item.year }}
          </td>
          <td>
            {{ item.reason }}
          </td>
          <td>
            {{ item.created_at }}
          </td>
          <td>
            {{ item.created_by }}
          </td>
          <td class="btn-action-group">
            <button
                v-if="searchParams.is_deleted"
                type="button"
                class="btn btn-success btn-sm"
                @click="handleRemoveLeaveBonus(item.id, false)">
              <i class="fas fa-sync"></i>
            </button>
            <div v-else class="btn-action-group">
              <button
                  v-if="item.leave_bonus_type !== 'Clear leave'"
                  type="button"
                  class="btn"
                  @click="handleEditLeaveBonus(item.user_id)">
                <i class="fas fa-edit"></i>
              </button>
              <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="handleRemoveLeaveBonus(item.id, true)">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 overflow-auto totalrow">
      <b-pagination-nav
          v-model="searchParams.current_page"
          :link-gen="linkGen"
          use-router
          :number-of-pages="totalPages > 0 ? totalPages : 1"
          align="center"
          limit="7"
          @input="searchRequest"
          class="brown-pagination float-right">
      </b-pagination-nav>
      <div class="form-inline float-right mr-4">
        <span class="mr-2 txt-to-page">To page</span>
        <input
            type="number"
            min="1"
            :max="totalPages"
            @keyup.enter="searchRequest"
            v-model="searchParams.current_page"
            class="form-control input-jump-page" />
      </div>
    </div>
    <AddLeaveBonus :key="isShowBonusLeaveModal" :is-show-modal="isShowBonusLeaveModal" :user-id="userId" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import Datepicker from 'vuejs-datepicker';
import * as LangDatepicker from 'vuejs-datepicker/src/locale';
import { dayleaveStore } from '../../store';
import slugify from '../../utils/unaccent';
import { LeaveBonusParam } from '~/types/dayleave';
import AddLeaveBonus from '~/components/AddLeaveBonus/index.vue';

@Component({
  components: {
    Datepicker,
    AddLeaveBonus,
    InfiniteLoading
  }
})
export default class extends Vue {
  langDatepicker : any = LangDatepicker
  currentYear: number = new Date().getFullYear()
  searchParams: LeaveBonusParam = {
    full_name: '',
    leave_bonus_type_id: 0,
    current_page: 1,
    row_per_page: 20,
    year: 0,
    is_deleted: false
  }
  errResponse: string = ''

  isShow: boolean = false
  isSearchAll: boolean = true
  memberNameInput: string = ''
  focusIndex: number = 0
  isMouseOver: boolean = false
  userListSearching: string[] = []
  isAdvSearch: boolean = false
  defaultAvatar : string = require('~/assets/images/default_avatar.jpg');
  userId: number = 0

  beforeMount() {
    dayleaveStore.setShowBonusLeaveModal(false);
  }
  mounted() {
    const $this = this;

    setTimeout(async function () {
      await $this.searchRequest();
    }, 100);
  }

  async searchRequest() {
    try {
      this.$nuxt.$loading.start();
      await dayleaveStore.getLeaveBonuses(this.searchParams);
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
  get isShowBonusLeaveModal() {
    return dayleaveStore.checkShowBonusLeaveModal;
  }
  get memberList() {
    return dayleaveStore.takeUserList;
  }

  get typeLeaveBonus() {
    return dayleaveStore.listLeaveBonusType;
  }

  get dataTable() {
    return dayleaveStore.takeLeaveBonuses;
  }

  get totalRow() {
    return dayleaveStore.takeTotalRow;
  }

  get getYears() {
    const years: number[] = [];
    for (let index = this.currentYear + 1; index >= this.currentYear - 6; index--) {
      years.push(index);
    }
    return years;
  }

  get totalPages() {
    let totalPage;
    const totalRow = this.totalRow;
    const rowPerPage = this.searchParams.row_per_page;
    if (totalRow % rowPerPage !== 0) {
      totalPage = Math.floor(totalRow / rowPerPage) + 1;
    } else {
      totalPage = totalRow / rowPerPage;
    }

    return totalPage;
  }

  linkGen() {
    this.replaceFullPath();
  }

  async replaceFullPath() {
    let fullPath: string;

    if (this.searchParams.current_page === 1 && !this.searchParams.full_name && this.searchParams.leave_bonus_type_id === 0 &&
        this.searchParams.year === 0) {
      fullPath = '/hrm/bonus-leave-history';
    } else {
      fullPath = `/hrm/bonus-leave-history?current_page=${this.searchParams.current_page}`;

      if (this.searchParams.full_name !== '') {
        fullPath += `&full_name=${this.searchParams.full_name}`;
      }

      if (this.searchParams.leave_bonus_type_id !== 0) {
        fullPath += `&leave_bonus_type_id=${this.searchParams.leave_bonus_type_id}`;
      }

      if (this.searchParams.year !== 0) {
        fullPath += `&year=${this.searchParams.year}`;
      }
    }

    if (decodeURIComponent(this.$route.fullPath) !== fullPath) {
      try {
        await this.$router.replace(fullPath);
      } catch (e) {
      }
    }

    return fullPath;
  }

  advSearch() {
    this.isAdvSearch = !this.isAdvSearch;
  }

  handleFilterRequest() {
    this.searchParams.current_page = 1;
    this.searchParams.full_name = this.memberNameInput;
    this.searchRequest();
  }

  handleSearchRequest(type: string) {
    switch (type) {
    case 'all':
      this.isSearchAll = true;
      this.resetFilter();
      break;
    case 'trashed':
      this.isSearchAll = false;
      this.searchParams.is_deleted = true;
      break;
    }
    this.searchRequest();
  }

  handleEditLeaveBonus(userId: number) {
    dayleaveStore.setShowBonusLeaveModal(true);
    this.userId = userId;
  }
  handleRemoveLeaveBonus(id: number, is_deleted: boolean) {
    try {
      const msgModalConfirm = is_deleted
        ? this.$tc('Do you want to <span style="color: red; "><strong>DELETE</strong></span> this bonus leave request?')
        : this.$tc('Do you want to <span style="color: green; "><strong>RESTORE</strong></span> this bonus leave request?');
      const $this = this;
      this.showModalConfirm(msgModalConfirm, async function() {
        await dayleaveStore.removeLeaveBonus({
          id,
          is_deleted
        });
        await $this.searchRequest();
      });
    } catch (err) {
      if (typeof err.response !== 'undefined') {
        this.errResponse = err.response.data.message;
      } else {
        this.errResponse = err.message;
      }
    }
  }

  resetFilter() {
    this.memberNameInput = '';
    this.searchParams.full_name = '';
    this.searchParams.leave_bonus_type_id = 0;
    this.searchParams.current_page = 1;
    this.searchParams.year = 0;
    this.searchParams.is_deleted = false;
  }

  checkContain(value: string) {
    return !this.memberNameInput || slugify(value).includes(slugify(this.memberNameInput));
  }

  getUserListSearching() {
    this.userListSearching = [];
    Array.from(this.memberList.entries(), ([key, value]) => {
      if (this.checkContain(value)) {
        this.userListSearching.push(key);
      }
    });
  }

  handleChangeInput() {
    this.focusIndex = 0;
    this.getUserListSearching();
  }

  showDropdown() {
    this.getUserListSearching();
    this.isShow = !this.isShow;
    this.focusIndex = 0;
    this.isMouseOver = false;

    this.$nextTick(() => {
      const nameInput = this.$refs.nameInput as any;
      nameInput.focus();
    });
  }

  getUserNameByKey(key: string) {
    return this.memberList && this.memberList.get(key);
  }

  selectMember(key: any) {
    this.isShow = false;
    this.memberNameInput = this.memberList.get(key.toString()) || '';
  }

  focusList() {
    this.isMouseOver = true;
    this.focusIndex = 0;
  }

  unfocusList(event) {
    const specifiedElement = this.$refs.dropdown_list as SVGStyleElement;

    if (specifiedElement) {
      const isClickInside = specifiedElement.contains(event.target);
      if (!isClickInside) {
        this.isShow = false;
      }
    }
  }

  selectMemberPressKey(event) {
    this.isMouseOver = false;
    const wrapperUserList = this.$refs.userList as SVGStyleElement;
    switch (event.keyCode) {
    case 38:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex > 0) {
        this.focusIndex--;
        if ((this.userListSearching.length - this.focusIndex) % 7 === 0) {
          wrapperUserList.scrollTop -= 180;
        }
      }
      break;
    case 40:
      if (this.focusIndex === null) {
        this.focusIndex = 0;
      } else if (this.focusIndex < this.userListSearching.length) {
        this.focusIndex++;
        if (this.focusIndex % 8 === 0) {
          wrapperUserList.scrollTop += 180;
        }
      }
      break;
    case 13:
      const userID = parseInt(this.userListSearching[this.focusIndex - 1]);
      this.isShow = false;
      if (userID) {
        this.memberNameInput = this.memberList.get(userID.toString()) || '';
      }
      break;
    }
  }

  get codeCurrentLang() {
    return this.$i18n.locale;
  }

  get datePickerLang() {
    const currentLang = this.codeCurrentLang;

    return this.langDatepicker[currentLang];
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

  avatarSrc(imgStr) {
    let linkAvatar : string = this.defaultAvatar;

    if (imgStr) {
      linkAvatar = 'data:image/png;base64,' + imgStr;
    }

    return linkAvatar;
  }
};
</script>

<style scoped>
.text-decoration {
  text-decoration: underline;
}
.table > thead > tr > th {
  vertical-align: middle;
  text-align: center;
}
.cell-sticky {
  background-color: #f2f2f2;
  position: sticky;
  left: 0;
}
div.card {
  border: none;
}
.container-board {
  border: 1px solid #c7d8e2;
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
.btn-action-group {
  width: 70px;
}
@media (max-width: 768px) {
  .board-left {
    flex: 0 0 100%;
  }
  .board-right {
    flex: 0 0 100%;
  }
}
</style>
