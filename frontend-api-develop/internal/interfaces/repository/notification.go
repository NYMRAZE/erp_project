package repository

import (
	"github.com/go-pg/pg/v9"
	param "gitlab.****************.vn/micro_erp/frontend-api/internal/interfaces/requestparams"
)

type NotificationRepository interface {
	InsertNotificationWithTx(tx *pg.Tx, organizationId int, sender int, params *param.InsertNotificationParam) error
	UpdateNotificationStatusRead(organizationId int, receiver int) error
	UpdateNotificationStatus(params *param.UpdateNotificationStatusParam) error
	CheckNotificationExist(id int) (int, error)
	SelectNotifications(organizationId int, params *param.GetNotificationsParam) ([]param.GetNotificationRecord, int, error)
	CountNotificationsUnRead(organizationId int, receiver int) (int, error)
	DeleteNotification(id int) error
}
