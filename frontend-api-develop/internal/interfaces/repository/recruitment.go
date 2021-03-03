package repository

import (
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

type RecruitmentRepository interface {
	InsertJob(
		organizationId int,
		createdBy int,
		params *param.CreateJobParam,
		notificationRepo NotificationRepository,
	) (string, string, error)
	UpdateJob(organizationId int, params *param.EditJobParam) error
	SelectJobs(organizationId int, params *param.GetJobsParam) ([]param.GetJobRecords, int, error)
	SelectJob(id int, columns ...string) (m.Recruitment, error)
	SelectCvs(recruitmentId int, columns ...string) ([]m.Cv, error)
	CountJob(id int) (int, error)
	DeleteJob(id int) error
	InsertCv(
		organizationId int,
		createdBy int,
		params *param.CreateCvParam,
		notificationRepo NotificationRepository,
	) (string, string, error)
	DeleteCv(id int) error
	UpdateCv(
		organizationId int,
		updatedBy int,
		params *param.EditCvParam,
		notificationRepo NotificationRepository,
	) (string, string, []int, error)
	CountCvById(id int) (int, error)
	InsertCvComment(
		organizationId int,
		createdBy int,
		params *param.CreateCvComment,
		notificationRepo NotificationRepository,
	) (string, string, []int, error)
	UpdateCvComment(id int, comment string) error
	SelectCvCommentById(id int, columns ...string) (m.CvComment, error)
	SelectCvCommentsByCvId(cvId int, columns ...string) ([]m.CvComment, error)
	DeleteCvCommentById(id int) error
	StatisticCvByStatus(organizationID int, id int) ([]param.NumberCvEachStatus, error)
	SelectPermissions(organizationId int, userId int) ([]param.SelectPermissionRecords, error)
}
