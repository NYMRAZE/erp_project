package recruitment

import (
	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/utils/calendar"
	"strconv"
)

type PgRecruitmentRepository struct {
	cm.AppRepository
}

func NewPgRecruitmentRepository(logger echo.Logger) (repo *PgRecruitmentRepository) {
	repo = &PgRecruitmentRepository{}
	repo.Init(logger)
	return
}

func (repo *PgRecruitmentRepository) InsertJob(
	organizationId int,
	createdBy int,
	params *param.CreateJobParam,
	notificationRepo rp.NotificationRepository,
) (string, string, error) {
	var body string
	var link string
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		job := m.Recruitment{
			OrganizationId: organizationId,
			JobName:        params.JobName,
			Description:    params.Description,
			StartDate:      calendar.ParseTime(cf.FormatDateDatabase, params.StartDate),
			ExpiryDate:     calendar.ParseTime(cf.FormatDateDatabase, params.ExpiryDate),
			BranchIds:      params.BranchIds,
			Assignees:      params.Assignees,
		}

		transErr = tx.Insert(&job)
		if transErr != nil {
			return transErr
		}

		if len(params.Assignees) > 0 {
			notificationParams := new(param.InsertNotificationParam)
			notificationParams.Content = "has added you to a recruiting job"
			notificationParams.RedirectUrl = "view-recruitment?recruitment_id=" + strconv.Itoa(job.ID)

			for _, userId := range params.Assignees {
				if userId == createdBy {
					continue
				}
				notificationParams.Receiver = userId
				transErr = notificationRepo.InsertNotificationWithTx(tx, organizationId, createdBy, notificationParams)
				if transErr != nil {
					return transErr
				}
			}

			body = notificationParams.Content
			link = notificationParams.RedirectUrl
		}

		return transErr
	})

	if err != nil {
		repo.Logger.Error(err)
	}

	return body, link, err
}

func (repo *PgRecruitmentRepository) UpdateJob(organizationId int, params *param.EditJobParam) error {
	job := m.Recruitment{
		OrganizationId: organizationId,
		JobName:        params.JobName,
		Description:    params.Description,
		StartDate:      calendar.ParseTime(cf.FormatDateDatabase, params.StartDate),
		ExpiryDate:     calendar.ParseTime(cf.FormatDateDatabase, params.ExpiryDate),
		BranchIds:      params.BranchIds,
		Assignees:      params.Assignees,
	}

	_, err := repo.DB.Model(&job).
		Where("id = ?", params.Id).
		UpdateNotZero()

	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgRecruitmentRepository) CountJob(id int) (int, error) {
	count, err := repo.DB.Model(&m.Recruitment{}).
		Where("id = ?", id).
		Count()

	if err != nil {
		repo.Logger.Error(err)
	}

	return count, err
}

func (repo *PgRecruitmentRepository) SelectJobs(organizationId int, params *param.GetJobsParam) ([]param.GetJobRecords, int, error) {
	var records []param.GetJobRecords
	q := repo.DB.Model(&m.Recruitment{}).
		Column("id", "job_name", "start_date", "expiry_date", "branch_ids", "assignees").
		Where("organization_id = ?", organizationId)

	if params.JobName != "" {
		q.Where("vietnamese_unaccent(LOWER(job_name)) LIKE vietnamese_unaccent(LOWER(?))", "%"+params.JobName+"%")
	}

	if params.StartDate != "" {
		q.Where("DATE(start_date) >= to_date(?,'YYYY-MM-DD')", params.StartDate)
	}

	if params.ExpiryDate != "" {
		q.Where("DATE(expiry_date) <= to_date(?,'YYYY-MM-DD')", params.ExpiryDate)
	}

	if params.BranchId != 0 {
		q.Where("? = ANY (branch_ids)", params.BranchId)
	}

	totalRow, err := q.Offset((params.CurrentPage - 1) * params.RowPerPage).
		Limit(params.RowPerPage).
		Order("created_at DESC").
		SelectAndCount(&records)

	if err != nil {
		repo.Logger.Error(err)
	}

	return records, totalRow, err
}

func (repo *PgRecruitmentRepository) SelectJob(id int, columns ...string) (m.Recruitment, error) {
	var recruitment m.Recruitment
	err := repo.DB.Model(&recruitment).
		Column(columns...).
		Where("id = ?", id).
		Select()

	if err != nil {
		repo.Logger.Error(err)
	}

	return recruitment, err
}

func (repo *PgRecruitmentRepository) DeleteJob(id int) error {
	_, err := repo.DB.Model(&m.Recruitment{}).
		Where("id = ?", id).
		Delete()

	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgRecruitmentRepository) InsertCv(
	organizationId int,
	createdBy int,
	params *param.CreateCvParam,
	notificationRepo rp.NotificationRepository,
	) (string, string, error) {
	var body string
	var link string
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var errTx error
		for _, cvField := range params.CvFields {
			cv := m.Cv{
				RecruitmentId: params.RecruitmentId,
				MediaId:       cvField.MediaId,
				FileName:      cvField.FileName,
				Status:        cvField.Status,
			}

			errTx := tx.Insert(&cv)
			if errTx != nil {
				repo.Logger.Error(errTx)
				return errTx
			}
		}
		
		if len(params.Assignees) > 0 {
			notificationParams := new(param.InsertNotificationParam)
			notificationParams.Content = "has added new cv"
			notificationParams.RedirectUrl = "manage-cv?recruitment_id=" + strconv.Itoa(params.RecruitmentId)

			for _, userId := range params.Assignees {
				if userId == createdBy {
					continue
				}
				notificationParams.Receiver = userId
				errTx = notificationRepo.InsertNotificationWithTx(tx, organizationId, createdBy, notificationParams)
				if errTx != nil {
					return errTx
				}
			}

			body = notificationParams.Content
			link = notificationParams.RedirectUrl
		}

		return errTx
	})

	if err != nil {
		repo.Logger.Error(err)
	}

	return body, link, err
}

func (repo *PgRecruitmentRepository) SelectCvs(recruitmentId int, columns ...string) ([]m.Cv, error) {
	var cvs []m.Cv
	err := repo.DB.Model(&cvs).
		Column(columns...).
		Where("recruitment_id = ?", recruitmentId).
		Select()

	if err != nil {
		repo.Logger.Error(err)
	}

	return cvs, err
}

func (repo *PgRecruitmentRepository) DeleteCv(id int) error {
	_, err := repo.DB.Model(&m.Cv{}).
		Where("id = ?", id).
		Delete()

	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgRecruitmentRepository) CountCvById(id int) (int, error) {
	count, err := repo.DB.Model(&m.Cv{}).
		Where("id = ?", id).
		Count()

	if err != nil {
		repo.Logger.Error(err)
	}

	return count, err
}

func (repo *PgRecruitmentRepository) UpdateCv(
	organizationId int,
	updatedBy int,
	params *param.EditCvParam,
	notificationRepo rp.NotificationRepository,
) (string, string, []int, error) {
	var body, link string
	var assignees []int
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		cv := m.Cv{Status: params.Status}
		_, transErr = tx.Model(&cv).
			Where("id = ?", params.Id).
			UpdateNotZero()

		if transErr != nil {
			return transErr
		}

		rcColumns := []string{"assignees"}
		recruitment, transErr := repo.SelectJob(params.RecruitmentId, rcColumns...)
		if transErr != nil {
			return transErr
		}

		if len(recruitment.Assignees) > 0 {
			assignees = recruitment.Assignees
			notificationParams := new(param.InsertNotificationParam)
			notificationParams.Content = "has updated CV status"
			notificationParams.RedirectUrl = "manage-cv?recruitment_id=" + strconv.Itoa(params.RecruitmentId) + "&cv_id=" + strconv.Itoa(params.Id)

			for _, userId := range recruitment.Assignees {
				if userId == updatedBy {
					continue
				}
				notificationParams.Receiver = userId
				transErr = notificationRepo.InsertNotificationWithTx(tx, organizationId, updatedBy, notificationParams)
				if transErr != nil {
					return transErr
				}
			}

			body = notificationParams.Content
			link = notificationParams.RedirectUrl
		}

		return transErr
	})

	if err != nil {
		repo.Logger.Error(err)
	}

	return body, link, assignees, err
}

func (repo *PgRecruitmentRepository) InsertCvComment(
	organizationId int,
	createdBy int,
	params *param.CreateCvComment,
	notificationRepo rp.NotificationRepository,
) (string, string, []int, error) {
	var body, link string
	var assignees []int
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		cvComment := m.CvComment{
			CvId:      params.CvId,
			CreatedBy: createdBy,
			Comment:   params.Comment,
		}
		if transErr = tx.Insert(&cvComment); transErr != nil {
			return transErr
		}

		rcColumns := []string{"assignees"}
		recruitment, transErr := repo.SelectJob(params.RecruitmentId, rcColumns...)
		if transErr != nil {
			return transErr
		}

		if len(recruitment.Assignees) > 0 {
			assignees = recruitment.Assignees
			notificationParams := new(param.InsertNotificationParam)
			notificationParams.Content = "added a comment"
			notificationParams.RedirectUrl = "manage-cv?recruitment_id=" + strconv.Itoa(params.RecruitmentId) +
				"&cv_id=" + strconv.Itoa(cvComment.CvId) + "&comment_id=" + strconv.Itoa(cvComment.ID)

			for _, userId := range recruitment.Assignees {
				if userId == createdBy {
					continue
				}
				notificationParams.Receiver = userId
				transErr = notificationRepo.InsertNotificationWithTx(tx, organizationId, createdBy, notificationParams)
				if transErr != nil {
					return transErr
				}
			}

			body = notificationParams.Content
			link = notificationParams.RedirectUrl
		}

		return transErr
	})

	if err != nil {
		repo.Logger.Error(err)
	}

	return body, link, assignees, err
}

func (repo *PgRecruitmentRepository) UpdateCvComment(id int, comment string) error {
	cvComment := m.CvComment{Comment: comment}
	_, err := repo.DB.Model(&cvComment).Where("id = ?", id).UpdateNotZero()
	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgRecruitmentRepository) SelectCvCommentById(id int, columns ...string) (m.CvComment, error) {
	var cvComment m.CvComment
	err := repo.DB.Model(&cvComment).
		Column(columns...).
		Where("id = ?", id).
		Select()

	if err != nil {
		repo.Logger.Error(err)
	}

	return cvComment, err
}

func (repo *PgRecruitmentRepository) SelectCvCommentsByCvId(cvId int, columns ...string) ([]m.CvComment, error) {
	var cvComments []m.CvComment
	err := repo.DB.Model(&cvComments).
		Column(columns...).
		Where("cv_id = ?", cvId).
		Order("created_at ASC").
		Select()

	if err != nil {
		repo.Logger.Error(err)
	}

	return cvComments, err
}

func (repo *PgRecruitmentRepository) DeleteCvCommentById(id int) error {
	_, err := repo.DB.Model(&m.CvComment{}).
		Where("id = ?", id).
		Delete()

	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgRecruitmentRepository) StatisticCvByStatus(organizationID int, recruitmentId int) ([]param.NumberCvEachStatus, error) {
	var records []param.NumberCvEachStatus
	err := repo.DB.Model(&m.Recruitment{}).
		ColumnExpr("c.status AS cv_status").
		ColumnExpr("COUNT(c.status) AS amount").
		Join("JOIN cvs AS c ON c.recruitment_id = recruitment.id").
		Where("c.deleted_at IS NULL").
		Where("recruitment.id = ?", recruitmentId).
		Where("recruitment.organization_id = ?", organizationID).
		Group("c.status").
		Order("c.status ASC").
		Select(&records)

	if err != nil {
		repo.Logger.Error(err)
	}

	return records, err
}

func (repo *PgRecruitmentRepository) SelectPermissions(organizationId int, userId int) ([]param.SelectPermissionRecords, error) {
	var records []param.SelectPermissionRecords
	err := repo.DB.Model(&m.UserPermission{}).
		Column("id", "user_id", "modules").
		Where("up.organization_id = ? AND up.user_id = ?", organizationId, userId).
		Select(&records)

	if err != nil {
		repo.Logger.Error(err)
	}

	return records, err
}