<template>
  <div class="container pb-5">
    <CreateOrganization />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import CreateOrganization from '~/components/CreateOrganization/index.vue';

@Component({
  components: { CreateOrganization },
  auth: 'guest',
  middleware: ['FoundCode']
})
export default class extends Vue {
};
</script>
