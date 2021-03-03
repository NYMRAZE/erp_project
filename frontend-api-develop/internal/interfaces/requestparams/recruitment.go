package requestparams

import (
	"time"
)

type CreateJobParam struct {
	JobName     string `json:"job_name" valid:"required"`
	Description string `json:"description" valid:"required"`
	StartDate   string `json:"start_date" valid:"required"`
	ExpiryDate  string `json:"expiry_date" valid:"required"`
	BranchIds   []int  `json:"branch_ids" valid:"required"`
	Assignees   []int  `json:"assignees" valid:"required"`
}

type CreateCvParam struct {
	RecruitmentId int       `json:"recruitment_id"`
	CvFields      []CvField `json:"cv_fields"`
	Assignees	  []int 	`json:"assignees"`
}

type CvField struct {
	MediaId  int    `json:"media_id"`
	FileName string `json:"file_name"`
	Content  string `json:"content"`
	Status   int    `json:"status"`
}

type EditJobParam struct {
	Id          int    `json:"id" valid:"required"`
	JobName     string `json:"job_name"`
	Description string `json:"description"`
	StartDate   string `json:"start_date"`
	ExpiryDate  string `json:"expiry_date"`
	BranchIds   []int  `json:"branch_ids"`
	Assignees   []int  `json:"assignees"`
}

type GetJobsParam struct {
	JobName     string `json:"job_name"`
	StartDate   string `json:"start_date"`
	ExpiryDate  string `json:"expiry_date"`
	BranchId    int    `json:"branch_id"`
	CurrentPage int    `json:"current_page" valid:"required"`
	RowPerPage  int    `json:"row_per_page" valid:"required"`
}

type GetJobParam struct {
	Id int `json:"id" valid:"required"`
}

type GetJobRecords struct {
	Id         int       `json:"id"`
	JobName    string    `json:"job_name"`
	StartDate  time.Time `json:"start_date"`
	ExpiryDate time.Time `json:"expiry_date"`
	BranchIds  []int     `json:"branch_ids" pg:",array"`
	Assignees  []int     `json:"assignees" pg:",array"`
}

type RemoveJobParam struct {
	Id int `json:"id" valid:"required"`
}

type GetCvsParam struct {
	RecruitmentId int `json:"recruitment_id" valid:"required"`
}

type RemoveCvParam struct {
	Id int `json:"id" valid:"required"`
}

type EditCvParam struct {
	Id            int `json:"id" valid:"required"`
	RecruitmentId int `json:"recruitment_id" valid:"required"`
	Status        int `json:"status"`
}

type CreateCvComment struct {
	RecruitmentId int    `json:"recruitment_id" valid:"required"`
	CvId          int    `json:"cv_id" valid:"required"`
	Comment       string `json:"comment" valid:"required"`
}

type EditCvComment struct {
	Id      int    `json:"id" valid:"required"`
	Comment string `json:"comment" valid:"required"`
}

type GetCvCommentsParam struct {
	RecruitmentId int `json:"recruitment_id" valid:"required"`
	CvId          int `json:"cv_id" valid:"required"`
}

type RemoveCvCommentParam struct {
	RecruitmentId int `json:"recruitment_id" valid:"required"`
	Id            int `json:"id" valid:"required"`
}

type NumberCvEachStatus struct {
	CvStatus int `json:"cv_status"`
	Amount 	 int `json:"amount"`
}