package configs

const (
	DayOffTypeOvertime = 1
	MoneyTypeOvertime  = 2

	WorkAtNoon    = 1
	NotWorkAtNoon = 2
)

var MapOvertimeType = map[int]string{
	DayOffTypeOvertime: "Take Day Off",
	MoneyTypeOvertime:  "Take Money",
}

var MapStatusOvertimeType = map[int]string{
	PendingRequestStatus: "Pending",
	DenyRequestStatus:    "Deny",
	AcceptRequestStatus:  "Accept",
}

var EnOvertimeCategories = map[string]string{
	"Employee Id":        "Employee Id",
	"Full Name":          "Full Name",
	"Branch":             "Branch",
	"Project":            "Project",
	"Date":               "Date",
	"Weekday":            "Weekday",
	"Range Time":         "Range Time",
	"Working Time":       "Working Time",
	"Weight":             "Weight",
	"Total Working Time": "Total Working Time",
	"Type":               "Type",
	"Status":             "Status",
	"Note":               "Note",
}

var JpOvertimeCategories = map[string]string{
	"Employee Id":        "社員コード",
	"Full Name":          "氏名",
	"Branch":             "支店",
	"Project":            "プロジェクト",
	"Date":               "残業日",
	"Weekday":            "曜日",
	"Range Time":         "残業期間",
	"Working Time":       "残業時間",
	"Weight":             "ウェイト",
	"Total Working Time": "合計残業時間",
	"Type":               "残業タイプ",
	"Status":             "承認状況",
	"Note":               "備考",
}

var VnOvertimeCategories = map[string]string{
	"Employee Id":        "Mã nhân viên",
	"Full Name":          "Họ và tên",
	"Branch":             "Chi nhánh",
	"Project":            "Dự án",
	"Date":               "Ngày",
	"Weekday":            "Thứ",
	"Range Time":         "Khoảng thời gian",
	"Working Time":       "Thời gian làm việc",
	"Weight":             "Trọng số",
	"Total Working Time": "Thời gian làm thực",
	"Type":               "Loại",
	"Status":             "Trạng thái",
	"Note":               "Ghi chú",
}
