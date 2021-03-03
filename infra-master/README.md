# infra

# == Micro_erp ==

## Cấu trúc thư mục micro_erp

```
micro_erp
    ├── infra
    |    ├── dev
    |    |    └──front
    |    └── production
    |
    ├── frontend-spa
    |    └──app
    |
    ├── frontend-api
    |    └──app
    |
    ├── backend-spa
    |
    ├── backend-api
    |
    ├── backend-api
    |
    └── docs
```

## 1. Kết nối với Gitlab 
- Tạo các folder theo cây thư mục sau:

```
micro_erp
    ├── infra
    |
    ├── frontend-spa
    |
    ├── frontend-api
    |
    ├── backend-spa
    |
    ├── backend-api
    |
    ├── backend-api
    |
    └── docs
```

a) Sao chép từ micro_erp trên gitlab
    _ Sử dung git bash chạy các lệnh như sau
    
```console
$ cd <đường dẫn folder chứa folder project>
$ git init
$ git clone git@gitlab.************.vn:micro_erp/infra.git
$ git clone git@gitlab.************.vn:micro_erp/frontend-spa.git
$ git clone git@gitlab.************.vn:micro_erp/frontend-api.git
$ git clone git@gitlab.************.vn:micro_erp/backend-spa.git
$ git clone git@gitlab.************.vn:micro_erp/backend-api.git
$ git clone git@gitlab.************.vn:micro_erp/docs.git
```

b) Remote infra

```console
$ cd infra
$ git pull
```
_ Kiểm tra xem source đã về chưa.

c) Remote frontend-api

```console
$ cd frontend-api
$ git pull
```

d) Remote frontend-spa

```console
$ cd frontend-spa
$ git pull
```

## 2. Cài đặt và chạy Vagrant
- Download và cài đặt Vagrant bằng đường link  sau: [https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)
- Trường hợp máy có cài Docker sẽ xảy ra xung đột vào đường link sau để fix: [https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)
- Dùng cmd chạy các lênh sau: 

```console
//trỏ đến folder có chứa Vagrantfile
$ cd <đường dẫn folder infra>/infra/dev
//cài đặt vagrant machine
$ vagrant up
//đăng nhập vào vagrant machine
$ vagrant ssh 
```

## 3. Chạy Docker
- Trong infra\dev\front duplicate file .env.sample và đổi tên thành .env (thực hiện thao tác này ở ngoài window cho dễ)
- Sau khi đăng nhập vào vagrant, trỏ đến thư mục có chứa file docker-compose.yml và chạy lệnh cài đặt docker-compose up

```console
$ cd /vagrant/infra/dev/front
$ docker-compose up
```

Mở trình duyệt chạy 2 đường dẫn sau để xác nhận kết quả:
- frontend-spa: http://demo1.localhost
- frontend-api: http://demo2.localhost
