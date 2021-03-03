import { Middleware } from '@nuxt/types';
import { organizationStore } from '~/store/';
import { Organization } from '~/types/organization';

const FoundOrganization: Middleware = (context) : any => {
  const organizationIDStr = (context as any).from.query.organization_id;
  if (organizationIDStr && organizationIDStr !== '') {
    const organizationID = parseInt(organizationIDStr);
    const organizationObj : Organization = {
      id    : organizationID,
      tag   : '',
      name  : ''
    };

    organizationStore.setOrganization(organizationObj);
  }

  if (organizationStore.objOrganization === null || organizationStore.idOrganization === 0) {
    return context.redirect('/organization/find-organization');
  }
};

export default FoundOrganization;
