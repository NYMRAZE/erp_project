<template>
  <div>
    <div class="wrap-topnav-body">
      <TopNav />
      <nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import TopNav from '~/layouts/components/TopNav';
import Footer from '~/layouts/components/Footer';

export default {
  components: {
    TopNav,
    Footer
  }
};
</script>
