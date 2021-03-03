<template>
  <b-nav card-header tabs>
    <b-nav-item
      :to="`/${isAllManager ? 'edit': 'view'}-project/${projectId}`"
      :active="param === 'edit-project' || isActive">
      {{ $t(`${isAllManager ? 'Edit': 'View'} project`) }}
    </b-nav-item>
    <b-nav-item
      :to="`/manage-user-project/${projectId}`"
      :active="param === 'manage-member' || isActive">
      {{ $t('Managing member') }}
    </b-nav-item>
  </b-nav>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { GeneralManagerRoleID, ManagerRoleID } from '~/utils/responsecode';

@Component({
  components: {}
})
export default class extends Vue {
  @Prop() param!: string
  @Prop() projectId!: number
  @Prop() isActive!: boolean

  isAllManager: boolean = this.$auth.user.role_id === GeneralManagerRoleID || this.$auth.user.role_id === ManagerRoleID
}
</script>
