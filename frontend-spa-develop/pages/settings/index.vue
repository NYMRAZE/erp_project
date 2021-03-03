<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['auth', 'GeneralManager'],
  layout: 'Admin'
})
export default class extends Vue {
  beforeCreate() {
    this.$router.push('/settings/organization-email');
  }
};
</script>
