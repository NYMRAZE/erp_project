<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card-register card mt-4">
          <div class="card-header">
            <h4 class="card-title text-dark">
              Micro erp
            </h4>
          </div>
          <div class="card-body">
            <p class="card-text">
              {{ $t("Start with {0}", { 0: 'micro erp' }) }}
            </p>
            <div class="container-create-organization">
              <nuxt-link class="nav-link" to="/organization/registration">
                <button
                  id="btn-create-organization"
                  class="btn btn-card-organization">
                  {{ $t("Create organization") }}
                </button>
              </nuxt-link>
            </div>
            <div class="container-find-organization">
              <nuxt-link class="nav-link" to="/organization/find-organization">
                <button id="btn-find-organization" class="btn btn-card-organization">
                  {{ $t("Find Organization") }}
                </button>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
export default {
};
</script>
