package requestparams

import (
	"time"

	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

// ForgotPassParams struct for receive param from  Forgot password page
type ForgotPassParams struct {
	OrganizationID int    `json:"organization_id"`
	Email          string `json:"email"`
}

// SetForgotPassParams struct for receive param from  Forgot password page
type SetForgotPassParams struct {
	UserID            int
	ResetPasswordCode string
	CodeExpiredAt     time.Time
}

// CheckResetCodeParams struct for receive param from frontend
type CheckResetCodeParams struct {
	ResetPasswordCode string `json:"reset_password_code" form:"reset_password_code" validate:"required"`
}

// ResetPasswordParams struct for receive param from frontend
type ResetPasswordParams struct {
	CheckResetCodeParams

	UserID         int    `json:"user_id" form:"user_id" validate:"required,numberic"`
	OrganizationID int    `json:"organization_id" form:"organization_id" validate:"required,,numberic"`
	Password       string `json:"password" form:"password" validate:"required"`
}

// ChangePasswordParams struct for receive param from Edit Account page
type ChangePasswordParams struct {
	UserID            int
	CurrentPassword   string `json:"current_password" valid:"required,length(8|35)~Current passwords must be at least 8 and maximum 35 character"`
	NewPassword       string `json:"new_password" valid:"required,length(8|35)~New passwords must be at least 8 and maximum 35 character"`
	RepeatNewPassword string `json:"repeat_new_password" valid:"required,length(8|35)~Repeat new passwords must be at least 8 and maximum 35 character"`
}

// UpdateEmailParams struct for receive param from frontend
type UpdateEmailParams struct {
	EmailForUpdate string `json:"email" valid:"required,email"`
}

// SetUpdateEmailParams struct for receive param from  Forgot password page
type SetUpdateEmailParams struct {
	EmailForUpdate               string
	UpdateEmailCode              string
	UpdateEmailCodeCodeExpiredAt time.Time
}

// CheckChangeEmailCodeParams struct for receive param from frontend
type CheckChangeEmailCodeParams struct {
	ChangeEmailCode string `json:"change_email_code" valid:"required"`
}

// UserProfileListParams struct filter, pagination request data in page manage rquest
type UserProfileListParams struct {
	Name        string    `json:"name"`
	Email       string    `json:"email" valid:"length(3|1000)~Email at least 3 character"`
	PhoneNumber string    `json:"phone_number"`
	DateFrom    time.Time `json:"date_from"`
	DateTo      time.Time `json:"date_to"`
	Rank        int       `json:"rank"`
	Branch      int       `json:"branch"`
	CurrentPage int       `json:"current_page" valid:"-"`
	RowPerPage  int       `json:"row_per_page"`
}

// UserInfoParams struct for receive param from frontend
type UserInfoParams struct {
	UserID int `json:"user_id"`
}

// EditProfileParams struct for receive param from edit profile page
type EditProfileParams struct {
	EditorRoleID         int
	UserID               int               `json:"user_id" valid:"required"`
	Avatar               string            `json:"avatar"`
	FirstName            string            `json:"first_name"`
	LastName             string            `json:"last_name"`
	PhoneNumber          string            `json:"phone_number"`
	Birthday             string            `json:"birthday"`
	RoleID               int               `json:"role_id"`
	JobTitle             int               `json:"job_title"`
	Rank                 int               `json:"rank"`
	CompanyJoinedDate    string            `json:"company_joined_date"`
	Skill                []EditSkill       `json:"skill"`
	Language             []EditLanguage    `json:"language"`
	Education            []EditEducation   `json:"education"`
	Certificate          []EditCertificate `json:"certificate"`
	Award                []EditAward       `json:"award"`
	Experience           []m.Experience    `json:"experience"`
	Introduce            string            `json:"introduce"`
	Branch               int               `json:"branch"`
	EmployeeId           string            `json:"employee_id"`
	FlagEditAvatar       bool              `json:"flag_edit_avatar"`
	FlagEditBasicProfile bool              `json:"flag_edit_basic_profile"`
	FlagEditSkill        bool              `json:"flag_edit_skill"`
	FlagEditLanguage     bool              `json:"flag_edit_language"`
	FlagEditEducation    bool              `json:"flag_edit_education"`
	FlagEditCertificate  bool              `json:"flag_edit_certificate"`
	FlagEditAward        bool              `json:"flag_edit_award"`
	FlagEditExperience   bool              `json:"flag_edit_experience"`
	FlagEditIntroduce    bool              `json:"flag_edit_introduce"`
}

// EditProfileParams struct for receive param from edit profile page
type EditSkill struct {
	Title             string  `json:"title"`
	Level             int     `json:"level"`
	YearsOfExperience float64 `json:"years_of_experience"`
}

// EditLanguage struct for receive param from edit profile page
type EditLanguage struct {
	LanguageID  int    `json:"language_id"`
	LevelID     int    `json:"level_id"`
	Certificate string `json:"certificate"`
}

// EditEducation struct for receive param from edit profile page
type EditEducation struct {
	Title       string `json:"title"`
	University  string `json:"university"`
	Achievement string `json:"achievement"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

type EditCertificate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type EditAward struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

//type EditExperience struct {
//	Title       string `json:"title"`
//	Company     string `json:"company"`
//	Position    string `json:"position"`
//	Description string `json:"description"`
//	StartDate   string `json:"start_date"`
//	EndDate     string `json:"end_date"`
//}
//
//type EditProject struct {
//	Title       string `json:"title"`
//	Position    string `json:"position"`
//	Client      string `json:"client"`
//	Description string `json:"description"`
//}

// AllUserName : struct for full name of user
type AllUserName struct {
	UserID   int    `json:"user_id"`
	Branch   int    `json:"branch"`
	FullName string `json:"full_name"`
	Avatar   string `json:"avatar"`
	Email    string `json:"email"`
}

// AllUserNameAndCountParams : struct for all user and count
type AllUserNameAndCountParams struct {
	OrgID       int    `json:"organization_id" valid:"required"`
	UserName    string `json:"user_name"`
	Branch      int    `json:"branch"`
	CurrentPage int    `json:"current_page"`
	RowPerPage  int    `json:"row_per_page"`
}

// NumberPeopleEachBranch : struct for all user each branch
type NumberPeopleEachBranch struct {
	Branch string `json:"branch"`
	Amount int    `json:"amount"`
}

// NumberPeopleJobTitle : struct for all people job title
type NumberPeopleJobTitle struct {
	JobTitle string `json:"job_title"`
	Amount   int    `json:"amount"`
}

// NumberPeopleJpLanguageCert : struct for all people Jp language certificate
type NumberPeopleJpLanguageCert struct {
	Certificate string `json:"certificate"`
	Amount      int    `json:"amount"`
}

type UpdateProfileParams struct {
	EmployeeId        string    `json:"employee_id"`
	Birthday          time.Time `json:"birthday"`
	Rank              int       `json:"rank"`
	JobTitle          int       `json:"job_title"`
	PhoneNumber       string    `json:"phone_number"`
	CompanyJoinedDate time.Time `json:"company_joined_date"`
	Branch            int       `json:"branch"`
}

type LanguageSettingParams struct {
	UserId     int `json:"user_id" valid:"required"`
	LanguageId int `json:"language_id" valid:"required"`
}

type EmployeeIdAndFullName struct {
	UserId     int    `json:"user_id"`
	EmployeeId string `json:"employee_id"`
	FullName   string `json:"full_name"`
}

type EmailOfGMAndPMRecords struct {
	UserId   int    `json:"user_id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
}

type JpLevelStatisticDetailParams struct {
	Certificate string `json:"certificate" valid:"required"`
	CurrentPage int    `json:"current_page" valid:"required"`
	RowPerPage  int    `json:"row_per_page" valid:"required"`
}

type UserIdAndAvatarRecord struct {
	UserId int    `json:"user_id"`
	Avatar string `json:"avatar"`
}
