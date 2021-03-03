<template>
  <div v-if="loading" class="loading-page text-center">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component({
})
export default class extends Vue {
  loading: boolean = false

  start () {
    this.loading = true;
  }

  finish () {
    this.loading = false;
  }
};
</script>
