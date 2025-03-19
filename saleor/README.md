# PrimePOD - Hướng dẫn cài đặt và sử dụng

<div align="center">
  <img width="200" alt="primepod-logo" src="https://user-images.githubusercontent.com/4006792/214636328-8e4f83e8-66cb-4114-a3d8-473eb908b9c3.png">
</div>

## Giới thiệu

PrimePOD là nền tảng thương mại điện tử mã nguồn mở sử dụng GraphQL API. Hướng dẫn này sẽ giúp bạn cài đặt và chạy PrimePOD bằng Docker.

## Yêu cầu hệ thống

- Docker và Docker Compose đã được cài đặt
- Đã clone repository PrimePOD về máy

## Các bước cài đặt

### 1. Khởi động các container

```bash
docker-compose -f .devcontainer/docker-compose.yml up -d
```

Lệnh này sẽ khởi động các container sau:
- **primepod**: Backend API (GraphQL) - http://localhost:8000
- **dashboard**: Giao diện quản trị - http://localhost:9000
- **db**: PostgreSQL database
- **redis**: Redis cache
- **mailpit**: Email testing - http://localhost:8025
- **adminer**: Database management - http://localhost:8080

### 2. Cài đặt dependencies và chuẩn bị database

```bash
# Cài đặt các dependency Python
docker-compose -f .devcontainer/docker-compose.yml exec primepod poetry install

# Tạo cấu trúc database
docker-compose -f .devcontainer/docker-compose.yml exec primepod python manage.py migrate
```

### 3. Tạo dữ liệu mẫu và tài khoản admin

```bash
docker-compose -f .devcontainer/docker-compose.yml exec primepod python manage.py populatedb --createsuperuser
```

Lệnh này sẽ tạo:
- Tài khoản admin (Email: admin@example.com, Password: admin)
- Dữ liệu mẫu (sản phẩm, danh mục, đơn hàng, v.v.)

### 4. Truy cập các dịch vụ

#### Đăng nhập vào Dashboard

- URL: http://localhost:9000
- Email: admin@example.com
- Password: admin

#### Quản lý database với Adminer

- URL: http://localhost:8080
- System: PostgreSQL
- Server: db
- Username: primepod
- Password: primepod
- Database: primepod

#### Truy cập GraphQL API

- GraphQL Playground: http://localhost:8000/graphql/
- API Endpoint: http://localhost:8000/graphql/

#### Kiểm tra email gửi đi

- URL: http://localhost:8025

## Thiết lập Storefront (Web bán hàng)

Để chạy web bán hàng (storefront), bạn cần thực hiện các bước sau:

### 1. Cài đặt React Storefront

```bash
# Tạo thư mục cho storefront
mkdir -p primepod-storefront

# Di chuyển vào thư mục
cd primepod-storefront

# Clone repository storefront
git clone https://github.com/saleor/react-storefront.git .

# Cài đặt dependencies
npm install
```

### 2. Cấu hình kết nối với API

Tạo file `.env.local` trong thư mục storefront với nội dung:

```
NEXT_PUBLIC_API_URI=http://localhost:8000/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

### 3. Khởi động Storefront

```bash
npm run dev
```

Sau khi khởi động, bạn có thể truy cập web bán hàng tại: http://localhost:3000

## Thay đổi logo và thương hiệu

### 1. Thay đổi logo

Logo được lưu trữ tại các vị trí sau:

- **Dashboard logo**: Được quản lý bởi container dashboard
- **Storefront logo**: Trong thư mục `public/images` của project storefront
- **Backend logo**: Trong thư mục `saleor/static/images`

Để thay đổi logo backend:

1. Tạo logo mới với tên "PrimePOD" và lưu với các định dạng sau:
   - PNG: `saleor/static/images/primepod-logo.png`
   - SVG: `saleor/static/images/logo-light.svg`

2. Kích thước đề xuất:
   - Logo chính: 200x80 px
   - Logo icon: 64x64 px

### 2. Thay đổi thương hiệu trong code

Ngoài việc thay đổi trong README, bạn cần cập nhật tên thương hiệu trong các file sau:

```bash
# Tìm các file chứa tên "Saleor"
grep -r "Saleor" --include="*.py" --include="*.html" d:/GIA BAO/GIA BAO/saleor
```

Các file quan trọng cần thay đổi:
- `saleor/site/models.py`: Thay đổi tên site mặc định
- `templates/base.html`: Thay đổi tên trong title và meta tags
- `templates/dashboard/base.html`: Thay đổi tên trong dashboard

## Các lệnh hữu ích

### Dừng các container

```bash
docker-compose -f .devcontainer/docker-compose.yml down
```

### Xem logs của container

```bash
docker-compose -f .devcontainer/docker-compose.yml logs primepod
```

### Khởi động lại một container cụ thể

```bash
docker-compose -f .devcontainer/docker-compose.yml restart primepod
```

## Xử lý sự cố

### 1. Không thể kết nối đến GraphQL API

- Kiểm tra logs: `docker-compose -f .devcontainer/docker-compose.yml logs primepod`
- Đảm bảo container primepod đang chạy: `docker ps`
- Khởi động lại container: `docker-compose -f .devcontainer/docker-compose.yml restart primepod`

### 2. Không thể đăng nhập vào Dashboard

- Kiểm tra kết nối GraphQL API
- Tạo lại dữ liệu mẫu và tài khoản admin
- Kiểm tra logs: `docker-compose -f .devcontainer/docker-compose.yml logs dashboard`

### 3. Lỗi database

- Kiểm tra logs: `docker-compose -f .devcontainer/docker-compose.yml logs db`
- Đảm bảo container db đang chạy: `docker ps`
- Kiểm tra kết nối database bằng Adminer

## Cấu trúc dự án

- **.devcontainer/**: Cấu hình Docker và môi trường phát triển
- **primepod/**: Mã nguồn chính của backend
- **templates/**: Template HTML
- **locale/**: File ngôn ngữ
- **static/**: File tĩnh (CSS, JS, hình ảnh)

## Tài liệu tham khảo

- [Tài liệu chính thức PrimePOD](https://docs.primepod.io/)
- [GraphQL API Reference](https://docs.primepod.io/docs/3.x/developer/graphql/)
