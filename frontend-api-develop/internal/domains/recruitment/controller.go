package recruitment

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	valid "github.com/asaskevich/govalidator"
	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cf "gitlab.****************.vn/micro_erp/frontend-api/configs"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	rp "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/repository"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
	afb "gitlab.****************.vn/micro_erp/frontend-api/internal/platform/appfirebase"
	gc "gitlab.****************.vn/micro_erp/frontend-api/internal/platform/cloud"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/email"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/utils"
	"gitlab.****************.vn/micro_erp/frontend-api/internal/platform/utils/calendar"
)

type Controller struct {
	cm.BaseController
	email.SMTPGoMail
	afb.FirebaseCloudMessage

	Cloud            gc.StorageUtility
	RecruitmentRepo  rp.RecruitmentRepository
	ProjectRepo      rp.ProjectRepository
	BranchRepo       rp.BranchRepository
	UserRepo         rp.UserRepository
	NotificationRepo rp.NotificationRepository
	FcmTokenRepo     rp.FcmTokenRepository
}

func NewRecruitmentController(
	logger echo.Logger,
	cloud gc.StorageUtility,
	recruitmentRepo rp.RecruitmentRepository,
	projectRepo rp.ProjectRepository,
	branchRepo rp.BranchRepository,
	userRepo rp.UserRepository,
	notificationRepo rp.NotificationRepository,
	fcmTokenRepo rp.FcmTokenRepository,
) (ctr *Controller) {
	ctr = &Controller{cm.BaseController{}, email.SMTPGoMail{}, afb.FirebaseCloudMessage{}, cloud,
		recruitmentRepo, projectRepo, branchRepo, userRepo, notificationRepo, fcmTokenRepo}
	ctr.Init(logger)
	ctr.InitFcm()
	return
}

func (ctr *Controller) CreateJob(c echo.Context) error {
	params := new(param.CreateJobParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	startDate := calendar.ParseTime(cf.FormatDateDatabase, params.StartDate)
	expiryDate := calendar.ParseTime(cf.FormatDateDatabase, params.ExpiryDate)
	if startDate.Sub(expiryDate) > 0 {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Expiry date must be greater start date",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	body, link, err := ctr.RecruitmentRepo.InsertJob(userProfile.OrganizationID, userProfile.UserProfile.UserID, params, ctr.NotificationRepo)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	registrationTokens, err := ctr.FcmTokenRepo.SelectMultiFcmTokens(params.Assignees, userProfile.UserProfile.UserID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	body = userProfile.UserProfile.FirstName + " " + userProfile.UserProfile.LastName + " " + body
	if len(registrationTokens) > 0 {
		for _, token := range registrationTokens {
			err := ctr.SendMessageToSpecificUser(token, "Micro Erp New Notification", body, link)
			if err != nil && err.Error() == "http error status: 400; reason: request contains an invalid argument; "+
				"code: invalid-argument; details: The registration token is not a valid FCM registration token" {
				_ = ctr.FcmTokenRepo.DeleteFcmToken(token)
			}
		}
	}

	if userProfile.Organization.Email != "" && userProfile.Organization.EmailPassword != "" {
		ctr.InitSmtp(userProfile.Organization.Email, userProfile.Organization.EmailPassword)
		emails, _ := ctr.UserRepo.SelectEmailByUserIds(params.Assignees)
		sampleData := new(param.SampleData)
		sampleData.SendTo = emails
		sampleData.Content = "Hi there, you have been assigned to a recruiting job. Please click the button below for more information"
		sampleData.URL = os.Getenv("BASE_SPA_URL") + "/" + link
		if err := ctr.SendMail(
			"【Notification】【Micro erp】Assigned recruitment",
			sampleData,
			cf.Recruitment,
		); err != nil {
			ctr.Logger.Error(err)
		}
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Create job successful",
	})
}

func (ctr *Controller) EditJob(c echo.Context) error {
	params := new(param.EditJobParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	if params.StartDate != "" && params.ExpiryDate != "" {
		startDate := calendar.ParseTime(cf.FormatDateDatabase, params.StartDate)
		expiryDate := calendar.ParseTime(cf.FormatDateDatabase, params.ExpiryDate)
		if startDate.Sub(expiryDate) > 0 {
			return c.JSON(http.StatusBadRequest, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Expiry date must be greater start date",
			})
		}
	}

	count, err := ctr.RecruitmentRepo.CountJob(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Job does not exist",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if err := ctr.RecruitmentRepo.UpdateJob(userProfile.OrganizationID, params); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
			Data:    err,
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Update job successful",
	})
}

func (ctr *Controller) GetJobs(c echo.Context) error {
	params := new(param.GetJobsParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	if params.StartDate != "" && params.ExpiryDate != "" {
		startDate := calendar.ParseTime(cf.FormatDateDatabase, params.StartDate)
		expiryDate := calendar.ParseTime(cf.FormatDateDatabase, params.ExpiryDate)
		if startDate.Sub(expiryDate) > 0 {
			return c.JSON(http.StatusBadRequest, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Expiry date must be greater start date",
			})
		}
	}

	userProfile := c.Get("user_profile").(m.User)
	records, totalRow, err := ctr.RecruitmentRepo.SelectJobs(userProfile.OrganizationID, params)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	pagination := map[string]interface{}{
		"current_page": params.CurrentPage,
		"total_row":    totalRow,
		"row_per_page": params.RowPerPage,
	}

	branchRecords, err := ctr.BranchRepo.SelectBranches(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	branches := make(map[int]string)
	if len(branchRecords) > 0 {
		for _, record := range branchRecords {
			branches[record.Id] = record.Name
		}
	}

	if params.BranchId != 0 {
		if _, ok := branches[params.BranchId]; !ok {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Branch does not exist",
			})
		}
	}

	userRecords, err := ctr.UserRepo.GetAllUserNameByOrgID(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	var usersId []int
	users := make(map[int]string)
	if len(userRecords) > 0 {
		for _, user := range userRecords {
			usersId = append(usersId, user.UserID)
			users[user.UserID] = user.FullName
		}
	}

	var recruitments []map[string]interface{}
	location, _ := time.LoadLocation("Asia/Ho_Chi_Minh")
	for _, record := range records {
		data := map[string]interface{}{
			"id":          record.Id,
			"job_name":    record.JobName,
			"start_date":  record.StartDate.In(location).Format(cf.FormatDateDatabase),
			"expiry_date": record.ExpiryDate.In(location).Format(cf.FormatDateDatabase),
			"branch_ids":  record.BranchIds,
			"assignees":   record.Assignees,
		}

		recruitments = append(recruitments, data)
	}

	dataResponse := map[string]interface{}{
		"recruitments": recruitments,
		"branches":     branches,
		"pagination":   pagination,
		"users":        users,
		"avatars":      ctr.SelectAssigneeAndAvatars(usersId),
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get jobs successful",
		Data:    dataResponse,
	})
}

func (ctr *Controller) GetJob(c echo.Context) error {
	params := new(param.GetJobParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	columns := []string{"job_name", "description", "start_date", "expiry_date", "branch_ids", "assignees"}
	rcRecord, err := ctr.RecruitmentRepo.SelectJob(params.Id, columns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Job does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if userProfile.RoleID != cf.GeneralManagerRoleID &&
		userProfile.RoleID != cf.ManagerRoleID &&
		!utils.FindIntInSlice(rcRecord.Assignees, userProfile.UserProfile.UserID) {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to view job",
		})
	}

	branchRecords, err := ctr.BranchRepo.SelectBranches(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	branches := make(map[int]string)
	if len(branchRecords) > 0 {
		for _, record := range branchRecords {
			branches[record.Id] = record.Name
		}
	}

	userRecords, err := ctr.UserRepo.GetAllUserNameByOrgID(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	var usersId []int
	users := make(map[int]string)
	if len(userRecords) > 0 {
		for _, user := range userRecords {
			usersId = append(usersId, user.UserID)
			users[user.UserID] = user.FullName
		}
	}

	if err != nil {
		ctr.Logger.Error(err)
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	cvRecords, err := ctr.RecruitmentRepo.StatisticCvByStatus(userProfile.OrganizationID, params.Id)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	recruitment := map[string]interface{}{
		"job_name":    rcRecord.JobName,
		"description": rcRecord.Description,
		"start_date":  rcRecord.StartDate.Format(cf.FormatDateDatabase),
		"expiry_date": rcRecord.ExpiryDate.Format(cf.FormatDateDatabase),
		"branch_ids":  rcRecord.BranchIds,
		"assignees":   rcRecord.Assignees,
	}

	dataResponse := map[string]interface{}{
		"recruitment": recruitment,
		"branches":    branches,
		"users":       users,
		"cv_statistic":   cvRecords,
		"avatars":     ctr.SelectAssigneeAndAvatars(usersId),
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get job successful",
		Data:    dataResponse,
	})
}

func (ctr *Controller) RemoveJob(c echo.Context) error {
	params := new(param.RemoveJobParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	count, err := ctr.RecruitmentRepo.CountJob(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Job does not exist",
		})
	}

	if err := ctr.RecruitmentRepo.DeleteJob(params.Id); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Remove job successful",
	})
}

func (ctr *Controller) UploadCv(c echo.Context) error {
	params := new(param.CreateCvParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	columns := []string{"job_name"}
	recruitment, err := ctr.RecruitmentRepo.SelectJob(params.RecruitmentId, columns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Recruitment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if len(params.CvFields) > 0 {
		for _, cv := range params.CvFields {
			err := ctr.Cloud.UploadFileToCloud(
				cv.Content,
				cv.FileName,
				cf.CVFOLDERGCS+strconv.Itoa(userProfile.OrganizationID)+"/"+
					strings.Replace(recruitment.JobName, " ", "_", -1),
			)
			if err != nil {
				return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
					Status:  cf.FailResponseCode,
					Message: "System Error",
					Data:    err,
				})
			}
		}
	}

	body, link, err := ctr.RecruitmentRepo.InsertCv(userProfile.OrganizationID, userProfile.UserProfile.UserID, params, ctr.NotificationRepo)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	registrationTokens, err := ctr.FcmTokenRepo.SelectMultiFcmTokens(params.Assignees, userProfile.UserProfile.UserID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	body = userProfile.UserProfile.FirstName + " " + userProfile.UserProfile.LastName + " " + body
	if len(registrationTokens) > 0 {
		for _, token := range registrationTokens {
			err := ctr.SendMessageToSpecificUser(token, "Micro Erp New Notification", body, link)
			if err != nil && err.Error() == "http error status: 400; reason: request contains an invalid argument; "+
				"code: invalid-argument; details: The registration token is not a valid FCM registration token" {
				_ = ctr.FcmTokenRepo.DeleteFcmToken(token)
			}
		}
	}

	if userProfile.Organization.Email != "" && userProfile.Organization.EmailPassword != "" {
		ctr.InitSmtp(userProfile.Organization.Email, userProfile.Organization.EmailPassword)
		emails, _ := ctr.UserRepo.SelectEmailByUserIds(params.Assignees)
		sampleData := new(param.SampleData)
		sampleData.SendTo = emails
		sampleData.Content = "Hi there, " + body + ". Please click the button below for more information"
		sampleData.URL = os.Getenv("BASE_SPA_URL") + "/" + link
		if err := ctr.SendMail(
			"【Notification】【Micro erp】Update cv status",
			sampleData,
			cf.Recruitment,
		); err != nil {
			ctr.Logger.Error(err)
		}
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Upload cv successful",
	})
}

func (ctr *Controller) GetCvs(c echo.Context) error {
	params := new(param.GetCvsParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	rcColumns := []string{"assignees", "job_name"}
	recruitment, err := ctr.RecruitmentRepo.SelectJob(params.RecruitmentId, rcColumns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Recruitment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if userProfile.RoleID != cf.GeneralManagerRoleID &&
		userProfile.RoleID != cf.ManagerRoleID &&
		!utils.FindIntInSlice(recruitment.Assignees, userProfile.UserProfile.UserID) {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to get cvs",
		})
	}

	cvColumns := []string{"id", "file_name", "status", "media_id", "created_at", "updated_at"}
	cvsRecord, err := ctr.RecruitmentRepo.SelectCvs(params.RecruitmentId, cvColumns...)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	var cvs []map[string]interface{}
	location, _ := time.LoadLocation("Asia/Ho_Chi_Minh")
	for _, cv := range cvsRecord {
		if cv.FileName != "" {
			cvFile := map[string]interface{}{
				"id":         cv.ID,
				"file_name":  cv.FileName,
				"media_id":   cv.MediaId,
				"status":     cv.Status,
				"created_at": cv.CreatedAt.In(location).Format(cf.FormatTimeDisplay),
				"updated_at": cv.UpdatedAt.In(location).Format(cf.FormatTimeDisplay),
			}

			pdfFile, err := ctr.Cloud.GetFileByFileName(
				cv.FileName,
				cf.CVFOLDERGCS+strconv.Itoa(userProfile.OrganizationID)+"/"+
					strings.Replace(recruitment.JobName, " ", "_", -1),
			)
			if err != nil {
				ctr.Logger.Error(err)
			}
			cvFile["content"] = pdfFile
			cvs = append(cvs, cvFile)
		}
	}
	dataResponse := map[string]interface{}{
		"cvs": cvs,
		"assignees": recruitment.Assignees,
	}
	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get cvs successful",
		Data:    dataResponse,
	})
}

func (ctr *Controller) RemoveCv(c echo.Context) error {
	params := new(param.RemoveCvParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	count, err := ctr.RecruitmentRepo.CountCvById(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Cv does not exist",
		})
	}

	if err := ctr.RecruitmentRepo.DeleteCv(params.Id); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Remove cv successful",
	})
}

func (ctr *Controller) EditCv(c echo.Context) error {
	params := new(param.EditCvParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	count, err := ctr.RecruitmentRepo.CountCvById(params.Id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	if count == 0 {
		return c.JSON(http.StatusNotFound, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Cv does not exist",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	body, link, assignees, err := ctr.RecruitmentRepo.UpdateCv(
		userProfile.OrganizationID,
		userProfile.UserProfile.UserID,
		params, ctr.NotificationRepo,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	registrationTokens, err := ctr.FcmTokenRepo.SelectMultiFcmTokens(assignees, userProfile.UserProfile.UserID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	body = userProfile.UserProfile.FirstName + " " + userProfile.UserProfile.LastName + " " + body
	if len(registrationTokens) > 0 {
		for _, token := range registrationTokens {
			err := ctr.SendMessageToSpecificUser(token, "Micro Erp New Notification", body, link)
			if err != nil && err.Error() == "http error status: 400; reason: request contains an invalid argument; "+
				"code: invalid-argument; details: The registration token is not a valid FCM registration token" {
				_ = ctr.FcmTokenRepo.DeleteFcmToken(token)
			}
		}
	}

	if userProfile.Organization.Email != "" && userProfile.Organization.EmailPassword != "" {
		ctr.InitSmtp(userProfile.Organization.Email, userProfile.Organization.EmailPassword)
		emails, _ := ctr.UserRepo.SelectEmailByUserIds(assignees)
		sampleData := new(param.SampleData)
		sampleData.SendTo = emails
		sampleData.Content = "Hi there, " + body + ". Please click the button below for more information"
		sampleData.URL = os.Getenv("BASE_SPA_URL") + "/" + link
		if err := ctr.SendMail(
			"【Notification】【Micro erp】Update cv status",
			sampleData,
			cf.Recruitment,
		); err != nil {
			ctr.Logger.Error(err)
		}
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Update cv successful",
	})
}

func (ctr *Controller) CreateCvComment(c echo.Context) error {
	params := new(param.CreateCvComment)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	rcColumns := []string{"assignees"}
	recruitment, err := ctr.RecruitmentRepo.SelectJob(params.RecruitmentId, rcColumns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Recruitment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if userProfile.RoleID != cf.GeneralManagerRoleID &&
		userProfile.RoleID != cf.ManagerRoleID &&
		!utils.FindIntInSlice(recruitment.Assignees, userProfile.UserProfile.UserID) {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to create comment",
		})
	}

	body, link, assignees, err := ctr.RecruitmentRepo.InsertCvComment(
		userProfile.OrganizationID,
		userProfile.UserProfile.UserID,
		params,
		ctr.NotificationRepo,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	registrationTokens, err := ctr.FcmTokenRepo.SelectMultiFcmTokens(assignees, userProfile.UserProfile.UserID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System error",
		})
	}

	body = userProfile.UserProfile.FirstName + " " + userProfile.UserProfile.LastName + " " + body
	if len(registrationTokens) > 0 {
		for _, token := range registrationTokens {
			err := ctr.SendMessageToSpecificUser(token, "Micro Erp New Notification", body, link)
			if err != nil && err.Error() == "http error status: 400; reason: request contains an invalid argument; "+
				"code: invalid-argument; details: The registration token is not a valid FCM registration token" {
				_ = ctr.FcmTokenRepo.DeleteFcmToken(token)
			}
		}
	}

	if userProfile.Organization.Email != "" && userProfile.Organization.EmailPassword != "" {
		ctr.InitSmtp(userProfile.Organization.Email, userProfile.Organization.EmailPassword)
		emails, _ := ctr.UserRepo.SelectEmailByUserIds(assignees)
		sampleData := new(param.SampleData)
		sampleData.SendTo = emails
		sampleData.Content = "Hi there, " + body + ". Please click the button below for more information"
		sampleData.URL = os.Getenv("BASE_SPA_URL") + "/" + link
		if err := ctr.SendMail(
			"【Notification】【Micro erp】Add a comment to cv",
			sampleData,
			cf.Recruitment,
		); err != nil {
			ctr.Logger.Error(err)
		}
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Create comment successful",
	})
}

func (ctr *Controller) EditCvComment(c echo.Context) error {
	params := new(param.EditCvComment)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	columns := []string{"created_by"}
	cvComment, err := ctr.RecruitmentRepo.SelectCvCommentById(params.Id, columns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Comment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if userProfile.UserProfile.UserID != cvComment.CreatedBy {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to edit this comment",
		})
	}

	if err := ctr.RecruitmentRepo.UpdateCvComment(params.Id, params.Comment); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Edit comment successful",
	})
}

func (ctr *Controller) GetCvComments(c echo.Context) error {
	params := new(param.GetCvCommentsParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	rcColumns := []string{"assignees"}
	recruitment, err := ctr.RecruitmentRepo.SelectJob(params.RecruitmentId, rcColumns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Recruitment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if userProfile.RoleID != cf.GeneralManagerRoleID &&
		userProfile.RoleID != cf.ManagerRoleID &&
		!utils.FindIntInSlice(recruitment.Assignees, userProfile.UserProfile.UserID) {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to get cvs",
		})
	}

	columns := []string{"id", "created_by", "comment", "created_at", "updated_at"}
	cvComments, err := ctr.RecruitmentRepo.SelectCvCommentsByCvId(params.CvId, columns...)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	var comments []map[string]interface{}
	location, _ := time.LoadLocation("Asia/Ho_Chi_Minh")
	for _, cvComment := range cvComments {
		data := map[string]interface{}{
			"id":         cvComment.ID,
			"comment":    cvComment.Comment,
			"created_by": cvComment.CreatedBy,
			"created_at": cvComment.CreatedAt.In(location).Format(cf.FormatTimeDisplay),
			"updated_at": cvComment.UpdatedAt.In(location).Format(cf.FormatTimeDisplay),
		}

		comments = append(comments, data)
	}

	userRecords, err := ctr.UserRepo.GetAllUserNameByOrgID(userProfile.OrganizationID)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	users := make(map[int]string)
	if len(userRecords) > 0 {
		for _, user := range userRecords {
			users[user.UserID] = user.FullName
		}
	}

	dataResponse := map[string]interface{}{
		"comments": comments,
		"users":    users,
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Get cv comments successful",
		Data:    dataResponse,
	})
}

func (ctr *Controller) RemoveCvComment(c echo.Context) error {
	params := new(param.RemoveCvCommentParam)
	if err := c.Bind(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid Params",
		})
	}

	if _, err := valid.ValidateStruct(params); err != nil {
		return c.JSON(http.StatusBadRequest, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "Invalid field value",
		})
	}

	rcColumns := []string{"assignees"}
	recruitment, err := ctr.RecruitmentRepo.SelectJob(params.RecruitmentId, rcColumns...)
	if err != nil {
		if err.Error() == pg.ErrNoRows.Error() {
			return c.JSON(http.StatusNotFound, cf.JsonResponse{
				Status:  cf.FailResponseCode,
				Message: "Recruitment does not exist",
			})
		}

		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	userProfile := c.Get("user_profile").(m.User)
	if !utils.FindIntInSlice(recruitment.Assignees, userProfile.UserProfile.UserID) {
		return c.JSON(http.StatusMethodNotAllowed, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "You do not have permission to remove comment",
		})
	}

	if err := ctr.RecruitmentRepo.DeleteCvCommentById(params.Id); err != nil {
		return c.JSON(http.StatusInternalServerError, cf.JsonResponse{
			Status:  cf.FailResponseCode,
			Message: "System Error",
		})
	}

	return c.JSON(http.StatusOK, cf.JsonResponse{
		Status:  cf.SuccessResponseCode,
		Message: "Remove comment successful",
	})
}

func (ctr *Controller) SelectAssigneeAndAvatars(assignees []int) map[int][]byte {
	records := make(map[int][]byte)
	if len(assignees) == 0 {
		return records
	}

	userIdAndAvatars, err := ctr.UserRepo.SelectAvatarUsers(assignees)
	if err != nil && err.Error() != pg.ErrNoRows.Error() {
		panic(err)
	}

	for _, user := range userIdAndAvatars {
		var base64Img []byte
		if user.Avatar != "" {
			base64Img, err = ctr.Cloud.GetFileByFileName(user.Avatar, cf.AvatarFolderGCS)
			if err != nil {
				ctr.Logger.Error(err)
			}
		}

		records[user.UserId] = base64Img
	}

	return records
}
