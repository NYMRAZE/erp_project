<template>
  <div>
    <div class="form-row">
      <label class="font-weight-bold mt-3">{{ $t('Step') + ' 7 - 7' }}</label>
    </div>
    <div class="form-row">
      <div class="row mt-4 justify-content-center">
        <div class="col-9 px-0 row">
          <h2 class="w-100 purple-text text-center"><strong>{{ $t('Success') }} !</strong></h2> <br>
          <div class="row justify-content-center">
            <div class="col-3"> <img v-bind:src="sucessIcon" class="fit-image"> </div>
          </div> <br><br>
          <div class="w-100 mt-5">
            <div class="text-center">
              <b-button
                  size="lg"
                  variant="primary"
                  class="btn btn-primary2 btn-link-profile mr-2 button_large_enabled"
                  @click.prevent="goHome">{{ $t('Go home page') }}</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'nuxt-property-decorator';
import { layoutAdminStore } from '../../../store';

@Component({
})
export default class extends Vue {
  sucessIcon: string = require('~/assets/images/check-mark.png');
  goHome() {
    layoutAdminStore.setNeedSetting(false);
    this.$router.push('/home-admin');
  }
}
</script>
<style scoped>
h2 > strong {
  text-transform: uppercase;
}
.purple-text {
  color: #2BC27A;
  font-weight: normal
}
.fit-image {
  width: 100%;
  object-fit: cover
}
</style>
