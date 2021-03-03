<template>
  <div class="container pb-5">
    <UserRequest />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import UserRequest from '~/components/UserRequest/index.vue';

@Component({
  components: { UserRequest },
  auth: 'guest',
  middleware: ['FoundOrganization']
})
export default class extends Vue {
};
</script>
