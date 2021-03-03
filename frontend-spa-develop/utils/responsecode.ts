// Constant status from golang
const FailResponseCode = 0;
const SuccessResponseCode = 1;
const WarningResponseCode = 2;

// Table Registration_Request status code
const RequestPendingStatus = 1;
const RequestDenyStatus = 2;
const RequestAcceptStatus = 3;
const RequestRegisteredStatus = 4;

// Table Registration_Request type code
const RequestMemberType = 1;
const RequestInviteType = 2;

// Role code user
const AdminRoleID          = 1;
const ManagerRoleID        = 2;
const UserRoleID           = 3;
const GeneralManagerRoleID = 4;

export {
  FailResponseCode,
  SuccessResponseCode,
  WarningResponseCode,
  RequestPendingStatus,
  RequestDenyStatus,
  RequestAcceptStatus,
  RequestRegisteredStatus,
  RequestMemberType,
  RequestInviteType,
  AdminRoleID,
  ManagerRoleID,
  GeneralManagerRoleID,
  UserRoleID
};
