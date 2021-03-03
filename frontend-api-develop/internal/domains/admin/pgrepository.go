package admin

import (
	"github.com/go-pg/pg/v9"
	"github.com/labstack/echo/v4"
	cm "gitlab.****************.vn/micro_erp/frontend-api/internal/common"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
	m "gitlab.****************.vn/micro_erp/frontend-api/internal/models"
)

type PgAdminRepository struct {
	cm.AppRepository
}

func NewPgAdminRepository(logger echo.Logger) (repo *PgAdminRepository) {
	repo = &PgAdminRepository{}
	repo.Init(logger)
	return
}

func (repo *PgAdminRepository) InsertOrgModule(
	organizationId int,
	moudleId int,
) error {
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		orgModule := m.OrganizationModule{
			OrganizationId: organizationId,
			ModuleId: moudleId,
		}
		transErr = tx.Insert(&orgModule)
		if transErr != nil {
			repo.Logger.Error(transErr)
			return transErr
		}

		return transErr
	})

	return err
}

func (repo *PgAdminRepository) SelectFunctionsOrg(organizationId int) ([]param.FunctionRecord, error) {
	var functionRecord []param.FunctionRecord
	err := repo.DB.Model(&m.OrganizationModule{}).
		ColumnExpr("f.id, f.name").
		Join("JOIN modules as m on orgm.module_id = m.id").
		Join("JOIN functions AS f ON m.id = f.module_id").
		Where("orgm.organization_id = ?", organizationId).
		Order("f.id").
		Select(&functionRecord)

	if err != nil {
		repo.Logger.Errorf("%+v", err)
	}

	return functionRecord, err
}

func (repo *PgAdminRepository) InsertUserPermission(
	organizationId int,
	userID int,
	functionId int,
	status int,
) error {
	err := repo.DB.RunInTransaction(func(tx *pg.Tx) error {
		var transErr error
		userPermission := m.UserPermission{
			OrganizationId: organizationId,
			UserID: userID,
			FunctionID: functionId,
			Status: status,
		}
		transErr = tx.Insert(&userPermission)
		if transErr != nil {
			repo.Logger.Error(transErr)
			return transErr
		}

		return transErr
	})

	return err
}