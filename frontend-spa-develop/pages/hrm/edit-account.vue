<template>
  <div>
    <h2 class="padding-sm-x d-none d-block d-lg-none font-weight-bold">{{ $t("Edit account") }}</h2>
    <ChangeEmail />
    <ChangePassword />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import ChangeEmail from '~/components/EditAccount/ChangeEmail.vue';
import ChangePassword from '~/components/EditAccount/ChangePassword.vue';

@Component({
  components: {
    ChangeEmail,
    ChangePassword
  },
  middleware: ['auth', 'finishSetting', 'ModuleRole'],
  layout: 'Admin'
})
export default class extends Vue {
};
</script>
