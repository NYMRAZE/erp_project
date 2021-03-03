import { Store } from 'vuex';
import { getModule } from 'vuex-module-decorators';
import LayoutAdmin from '~/store/modules/layout-admin';
import Registration from '~/store/modules/registration';
import Organization from '~/store/modules/organization';
import Target from '~/store/modules/target';
import RegistrationRequests from '~/store/modules/registration-requests';
import User from '~/store/modules/user';
import Project from '~/store/modules/project';
import Evaluation from '~/store/modules/evaluation';
import UserProfile from '~/store/modules/user-profile';
import TimeKeeping from '~/store/modules/timekeeping';
import DayLeave from '~/store/modules/dayleave';
import Setting from '~/store/modules/setting';
import Overtime from '~/store/modules/overtime';
import Statistic from '~/store/modules/statistic';
import Notification from '~/store/modules/notifications';
import Holidays from '~/store/modules/holidays';
import Recruitment from '~/store/modules/recruitment';
import TaskProject from '~/store/modules/task-project';
import Permissions from '~/store/modules/permissions';

let layoutAdminStore: LayoutAdmin;
let registrationStore: Registration;
let organizationStore: Organization;
let targetStore: Target;
let registrationRequestStore: RegistrationRequests;
let userStore: User;
let projectStore: Project;
let evaluationStore: Evaluation;
let userProfileStore: UserProfile;
let timekeepingStore: TimeKeeping;
let dayleaveStore: DayLeave;
let settingStore: Setting;
let overtimeStore: Overtime;
let statisticStore: Statistic;
let notificationStore: Notification;
let holidaysStore: Holidays;
let recruitmentStore: Recruitment;
let taskStore: TaskProject;
let permissionsStore: Permissions;

function initialiseStores(store: Store<any>): void {
  layoutAdminStore = getModule(LayoutAdmin, store);
  registrationStore = getModule(Registration, store);
  organizationStore = getModule(Organization, store);
  targetStore = getModule(Target, store);
  registrationRequestStore = getModule(RegistrationRequests, store);
  userStore = getModule(User, store);
  projectStore = getModule(Project, store);
  evaluationStore = getModule(Evaluation, store);
  evaluationStore = getModule(Evaluation, store);
  userProfileStore = getModule(UserProfile, store);
  timekeepingStore = getModule(TimeKeeping, store);
  dayleaveStore = getModule(DayLeave, store);
  settingStore = getModule(Setting, store);
  overtimeStore = getModule(Overtime, store);
  settingStore = getModule(Setting, store);
  statisticStore = getModule(Statistic, store);
  notificationStore = getModule(Notification, store);
  holidaysStore = getModule(Holidays, store);
  recruitmentStore = getModule(Recruitment, store);
  taskStore = getModule(TaskProject, store);
  permissionsStore = getModule(Permissions, store);
}

export {
  initialiseStores,
  layoutAdminStore,
  registrationStore,
  organizationStore,
  targetStore,
  registrationRequestStore,
  userStore,
  projectStore,
  evaluationStore,
  userProfileStore,
  timekeepingStore,
  dayleaveStore,
  settingStore,
  overtimeStore,
  statisticStore,
  notificationStore,
  holidaysStore,
  recruitmentStore,
  taskStore,
  permissionsStore
};
