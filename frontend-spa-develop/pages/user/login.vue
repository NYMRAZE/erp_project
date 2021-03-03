<template>
  <div class="container pb-5">
    <Login />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import Login from '~/components/Login/index.vue';

@Component({
  components: {
    Login
  },
  auth: 'guest',
  middleware: ['FoundOrganization']
})
export default class extends Vue {
}
</script>
