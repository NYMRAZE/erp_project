<template>
  <div class="container pb-5">
    <RegisterUser />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import RegisterUser from '~/components/RegisterUser/index.vue';

@Component({
  components: {
    RegisterUser
  },
  auth: 'guest'
})
export default class extends Vue {
};
</script>
