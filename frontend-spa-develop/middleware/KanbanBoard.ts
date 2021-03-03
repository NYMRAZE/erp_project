import { Middleware } from '@nuxt/types';
import { projectStore } from '~/store/';
import { GeneralManagerRoleID } from '~/utils/responsecode';

const KanbanBoard: Middleware = (context: any) : any => {
  if (context.$auth.user.role_id !== GeneralManagerRoleID &&
      !projectStore.takeUsersIdJoinProject.includes(context.$auth.user.id)
  ) {
    return context.redirect('/project-list');
  }
};

export default KanbanBoard;
