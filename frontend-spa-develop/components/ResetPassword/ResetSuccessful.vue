<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">Password Reset Successful</h4>
        </div>
        <div class="card-body">
          <p class="card-text">Please return to login page</p>
          <div class="container-find-organization">
            <nuxt-link class="nav-link" to="/user/login">
              <button id="btn-find-organization" class="btn btn-card-organization">
                Go to Login
              </button>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
};
</script>
