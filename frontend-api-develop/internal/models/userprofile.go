package models

import (
	"time"

	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
)

// UserProfile : user profile info
type UserProfile struct {
	cm.BaseModel

	UserID            int
	Avatar            string
	FirstName         string
	LastName          string
	Birthday          time.Time
	Rank              int
	JobTitle          int
	PhoneNumber       string
	CompanyJoinedDate time.Time
	Introduce         string
	Branch            int
	EmployeeId        string
}

// UserProfileExpand : struct for db table users
type UserProfileExpand struct {
	TableName struct{} `sql:"users,alias:usr"`
	cm.BaseModel
	OrganizationID    int
	OrganizationName  string
	Email             string
	RoleID            int
	RoleName          string
	Avatar            string
	FirstName         string
	LastName          string
	Birthday          time.Time
	Rank              int
	JobTitle          int
	PhoneNumber       string
	CompanyJoinedDate time.Time
	Skill             []Skill
	Language          []Language
	Education         []Education
	Certificate       []Certificate
	Award             []Award
	Experience        []Experience
	Introduce         string
	Branch            int
	EmployeeId        string
}

// Skill jsonb
type Skill struct {
	Title             string  `json:"title"`
	Level             int     `json:"level"`
	YearsOfExperience float64 `json:"years_of_experience"`
}

// Language jsonb
type Language struct {
	LanguageID  int    `json:"language_id"`
	LevelID     int    `json:"level_id"`
	Certificate string `json:"certificate"`
}

// Education jsonb
type Education struct {
	Title       string `json:"title"`
	University  string `json:"university"`
	Achievement string `json:"achievement"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

// Certificate jsonb
type Certificate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Award jsonb
type Award struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Experience jsonb
type Experience struct {
	Company  string          `json:"company"`
	Projects []JoinedProject `json:"projects"`
}

// JoinedProject jsonb
type JoinedProject struct {
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	Project    string `json:"project"`
	Position   string `json:"position"`
	Technology string `json:"technology"`
}

// UserProfileList : user profile struct for list profile page
type UserProfileList struct {
	tableName struct{} `pg:",discard_unknown_columns"`

	ID                int       `json:"id"`
	UserID            int       `json:"user_id"`
	FirstName         string    `json:"first_name"`
	LastName          string    `json:"last_name"`
	Rank              int       `json:"rank"`
	JobTitle          int       `json:"job_title"`
	PhoneNumber       string    `json:"phone_number"`
	Email             string    `json:"email"`
	CompanyJoinedDate time.Time `json:"company_join_date"`
	Branch            int       `json:"branch"`
}

type UserProfileExt struct {
	cm.BaseModel
	tableName struct{} `sql:"user_profiles,alias:user_profile" pg:",discard_unknown_columns"`

	UserProfile
	UserBranch Branch `pg:",fk:branch"`
}

// UserExt
type UserExt struct {
	tableName struct{} `sql:"users,alias:usr" pg:",discard_unknown_columns"`
	User
	UserProfile UserProfileExt `pg:",fk:user_id"`
}
