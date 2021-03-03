<template>
  <b-nav-item-dropdown id="language-area" class="d-flex align-items-center text-black" text="Lang" right no-caret>
    <template v-slot:button-content>
      <span class="flag-icon" :class="takeCurrentObjLang.class_flag"></span>
    </template>
    <template v-for="(item, index) in languageList">
      <b-dropdown-item
        v-if="item.id !== language_id"
        :key="index"
        @click.prevent="toggleLocale(item.id)">
        <span class="flag-icon" :class="item.class_flag"></span>
        {{ item.name }}
      </b-dropdown-item>
    </template>
  </b-nav-item-dropdown>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import en from 'vee-validate/dist/locale/en.json';
import ja from 'vee-validate/dist/locale/ja.json';
import vi from 'vee-validate/dist/locale/vi.json';
import { localize } from 'vee-validate';
import { LanguageList } from '~/utils/common-const';
import { userStore } from '~/utils/store-accessor';
import { DisplayLanguage } from '~/types/language';

@Component({
})
export default class extends Vue {
  languageList = LanguageList;
  language_id: number = this.$auth.user.language_id;
  locale: string = this.takeCurrentObjLang.code;

  mounted() {
    this.setLanguage();
  }

  get takeCurrentObjLang(): DisplayLanguage {
    const language = this.languageList.find((item) => {
      return item.id === this.$auth.user.language_id;
    });
    return language || {
      id          : 1,
      code        : 'en',
      name        : 'English',
      class_flag  : 'flag-us'
    };
  }

  async toggleLocale(language_id: number) {
    await userStore.displayLanguageSetting({ user_id: this.$auth.user.id, language_id: language_id });
    await this.$auth.fetchUser();
    this.language_id = this.$auth.user.language_id;
    this.locale = this.takeCurrentObjLang.code;
    this.setLanguage();
  }

  setLanguage() {
    this.$i18n.locale = this.locale;
    switch (this.locale) {
    case 'ja':
      localize('ja', ja);
      break;
    case 'vi':
      localize('vi', vi);
      break;
    default:
      localize('en', en);
      break;
    }
  }
}
</script>
<style scoped>
#language-name {
  color: #252733;
}
#language-area > a {
  outline: none;
}
@media screen and (max-width: 600px) {
  #language-name {
    display: none;
  }
  #language-area {
    width: 22px;
  }
}
</style>
