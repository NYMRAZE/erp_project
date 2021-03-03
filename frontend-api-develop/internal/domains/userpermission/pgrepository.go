package userpermission

import (
	"github.com/labstack/echo/v4"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

type PgUserPermissionRepository struct {
	cm.AppRepository
}

func NewPgUserPermissionRepository(logger echo.Logger) (repo *PgUserPermissionRepository) {
	repo = &PgUserPermissionRepository{}
	repo.Init(logger)
	return
}

func (repo *PgUserPermissionRepository) UpdateUserPermission(organizationId int, param *param.EditUserPermissionParam) error {
	_, err := repo.DB.Model(&m.UserPermission{Status: param.Status}).
		Column("status", "updated_at").
		Where("user_id = ?", param.ID).
		Where("function_id = ?", param.FunctionID).
		Where("organization_id = ?", organizationId).
		Update()

	if err != nil {
		repo.Logger.Error(err)
	}

	return err
}

func (repo *PgUserPermissionRepository) SelectPermissions(organizationId int, userId int) ([]param.SelectPermissionRecords, error) {
	var userPermission []param.SelectPermissionRecords
	err := repo.DB.Model(&m.OrganizationModule{}).
		ColumnExpr("up.status, up.function_id").
		ColumnExpr("f.name").
		ColumnExpr("orgm.module_id").
		Join("JOIN modules as m on orgm.module_id = m.id").
		Join("JOIN functions AS f ON m.id = f.module_id").
		Join("JOIN user_permissions as up on up.function_id = f.id").
		Where("orgm.organization_id = ? AND up.user_id = ?", organizationId, userId).
		Order("up.function_id").
		Select(&userPermission)

	if err != nil {
		repo.Logger.Errorf("%+v", err)
	}

	return userPermission, err
}

func (repo *PgUserPermissionRepository) SelectUserPermission(organizationId int, userPermissionParams *param.UserPermissionParams) ([]param.UserPermissionRecords, int, error) {
	var records []param.UserPermissionRecords
	user := m.UserProfileExpand{}
	userName := "%" + userPermissionParams.Name + "%"
	totalRow, err := repo.DB.Model(&user).
		ColumnExpr("usr.id, usr.email, usr.role_id").
		ColumnExpr("pro.avatar, pro.first_name, pro.last_name").
		ColumnExpr("COUNT(up.user_id) AS has_custom").
		Join("JOIN user_profiles AS pro ON pro.user_id = usr.id").
		Join("FULL OUTER JOIN user_permissions AS up ON up.user_id = usr.id").
		Where("usr.organization_id = ?", organizationId).
		Where("vietnamese_unaccent(LOWER(pro.first_name)) || ' ' || vietnamese_unaccent(LOWER(pro.last_name)) LIKE vietnamese_unaccent(LOWER(?0))", userName).
		Offset((userPermissionParams.CurrentPage - 1) * userPermissionParams.RowPerPage).
		Order("usr.id ASC").
		Limit(userPermissionParams.RowPerPage).
		Group("usr.id", "pro.avatar", "pro.first_name", "pro.last_name").
		SelectAndCount(&records)

	if err != nil {
		repo.Logger.Errorf("%+v", err)
	}

	return records, totalRow, err
}
