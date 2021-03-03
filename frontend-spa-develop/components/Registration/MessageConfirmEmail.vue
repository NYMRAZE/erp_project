<template>
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="card-register card mt-4">
        <div class="card-header">
          <h4 class="card-title text-dark">
            {{ $t("Check your email") }}!
          </h4>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Please check your email to get link verify") }}
          </p>
          <p class="card-text">
            *{{ $t("Remember check your spam folder") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
};
</script>
