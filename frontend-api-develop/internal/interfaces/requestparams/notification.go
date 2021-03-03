package requestparams

import "time"

type InsertNotificationParam struct {
	Receiver    int    `json:"receiver" valid:"required"`
	Content     string `json:"content" valid:"required"`
	RedirectUrl string `json:"redirect_url" valid:"required"`
}

type UpdateNotificationStatusReadParam struct {
	Receiver    int `json:"receiver" valid:"required"`
}

type GetNotificationsParam struct {
	Receiver    int `json:"receiver" valid:"required"`
	CurrentPage int `json:"current_page" valid:"required"`
	RowPerPage  int `json:"row_per_page"`
}

type GetNotificationRecord struct {
	Id           int       `json:"id"`
	Sender       string    `json:"sender"`
	AvatarSender string    `json:"avatar_sender"`
	Content      string    `json:"content"`
	Status       int       `json:"status"`
	RedirectUrl  string    `json:"redirect_url"`
	CreatedAt    time.Time `json:"created_at"`
}

type RemoveNotificationParam struct {
	Id       int `json:"id" valid:"required"`
	Receiver int `json:"receiver" valid:"required"`
}

type UpdateNotificationStatusParam struct {
	Id       int `json:"id" valid:"required"`
	Status   int `json:"status" valid:"required"`
	Receiver int `json:"receiver" valid:"required"`
}

type GetTotalNotificationsUnreadParam struct {
	ClientTime string `json:"client_time" valid:"required"`
}

type SampleData struct {
	URL     string
	SendTo  []string
	SendCc  []string
	Content string
	OrgTag  string
}
