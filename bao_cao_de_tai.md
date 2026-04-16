# BÁO CÁO ĐỀ TÀI
## NỀN TẢNG QUẢN LÝ DỰ ÁN NHÓM B2B – MERN STACK SaaS

---

## 1. SLIDE MỞ ĐẦU

- **Tên môn học:** Lập trình Web Nâng Cao / Phát triển ứng dụng Full-Stack
- **Tên đề tài:** Xây dựng nền tảng quản lý dự án nhóm dạng SaaS sử dụng MERN Stack
- **GVBM:** *(Điền tên giảng viên)*
- **Thành viên nhóm:** *(Điền tên các thành viên)*

---

## 2. GIỚI THIỆU ĐỀ TÀI

### Lý do chọn đề tài

Trong bối cảnh làm việc từ xa và cộng tác nhóm ngày càng phổ biến, nhu cầu về một công cụ quản lý dự án chuyên nghiệp, linh hoạt và dễ sử dụng ngày càng tăng cao. Các nền tảng nổi tiếng như Trello, Jira, ClickUp đã chứng minh được thị trường rộng lớn cho phân khúc này.

Nhóm nhận thấy đây là cơ hội tốt để học và áp dụng kiến thức về:
- Phát triển ứng dụng Web Full-Stack với MERN Stack
- Mô hình SaaS đa workspace (nhiều tổ chức dùng chung nền tảng)
- Phân quyền người dùng theo vai trò (RBAC)
- Xác thực hiện đại (Session + OAuth 2.0 Google)

### Mục tiêu đề tài

- Xây dựng hệ thống quản lý dự án đa người dùng, đa workspace
- Triển khai đầy đủ chức năng CRUD cho Workspace, Project, Task, Member
- Phân quyền theo vai trò: **Owner**, **Admin**, **Member**
- Tích hợp xác thực Google OAuth 2.0
- Giao diện hiện đại, tối ưu trải nghiệm người dùng, hỗ trợ Dark Mode
- Mở rộng với Kanban Board, Calendar View, và File Attachment

---

## 3. GIỚI THIỆU MERN STACK

### M – MongoDB
- **Loại:** Cơ sở dữ liệu NoSQL (Document-oriented)
- **Vai trò:** Lưu trữ toàn bộ dữ liệu ứng dụng (users, workspaces, projects, tasks...)
- **Lợi ích:** Schema linh hoạt, phù hợp với dữ liệu JSON, dễ scale
- **ODM sử dụng:** **Mongoose** – giúp định nghĩa schema, validate dữ liệu, và tương tác với MongoDB

### E – Express.js
- **Loại:** Web framework cho Node.js
- **Vai trò:** Xây dựng REST API (Backend server)
- **Tính năng dùng:** Router, Middleware, Error Handling

### R – React.js
- **Loại:** JavaScript library cho UI
- **Vai trò:** Xây dựng giao diện người dùng (Frontend)
- **Build tool:** **Vite** (thay vì Create React App – nhanh hơn nhiều)
- **Language:** TypeScript (kiểm tra kiểu tĩnh)

### N – Node.js
- **Loại:** Runtime environment để chạy JavaScript phía server
- **Vai trò:** Nền tảng cho Express.js server

---

## 4. CÁC FRAMEWORK & THƯ VIỆN SỬ DỤNG

### Backend (Node.js + Express)

| Thư viện | Mục đích |
|---|---|
| **express** | Web framework chính |
| **mongoose** | ODM cho MongoDB |
| **passport.js** | Middleware xác thực |
| **passport-local** | Xác thực bằng email/password |
| **passport-google-oauth20** | Xác thực qua Google OAuth 2.0 |
| **cookie-session** | Duy trì trạng thái đăng nhập qua Session Cookie (không dùng JWT) |
| **bcrypt** | Mã hóa mật khẩu (hash + compare) |
| **zod** | Validate dữ liệu đầu vào (request body) |
| **cors** | Cho phép cross-origin request từ frontend |
| **dotenv** | Quản lý biến môi trường |
| **cloudinary** | Cloud storage để lưu file đính kèm (ảnh, PDF...) |
| **multer** | Middleware upload file (multipart/form-data) |
| **uuid** | Tạo mã ngẫu nhiên (invite code, task code) |
| **ts-node-dev** | Hot-reload server TypeScript trong development |

### Xác thực & Bảo mật

- **Duy trì đăng nhập:** Sử dụng **Session Cookie** (cookie-session) + **Passport.js serialize/deserialize**. Phiên đăng nhập được lưu trong session với `maxAge: 24 giờ`.
- **Không dùng JWT:** Thay vào đó dùng server-side session để bảo mật hơn và tránh token theft.
- **Mã hóa mật khẩu:** `bcrypt` với `hashValue()` và `compareValue()`.
- **Phân quyền:** Custom middleware `roleGuard(role, [Permissions.XXX])` kiểm tra quyền trước khi thực hiện hành động.

> **Lưu ý:** Dự án KHÔNG dùng gửi email (nodemailer). Xác thực hoàn toàn qua Local (email+password) và Google OAuth.

### Frontend (React + TypeScript)

| Thư viện | Mục đích |
|---|---|
| **React 18** | UI Library chính |
| **TypeScript** | Kiểm tra kiểu tĩnh |
| **Vite** | Build tool và dev server |
| **React Router DOM v7** | Routing (điều hướng trang) |
| **TanStack Query (React Query)** | Server state management, caching, fetching |
| **Zustand** | Client state management (global state) |
| **Axios** | HTTP client gọi API |
| **React Hook Form + Zod** | Quản lý form và validate phía client |
| **shadcn/ui** | Component UI library (dựa trên Radix UI) |
| **Tailwind CSS** | Utility-first CSS framework |
| **Lucide React** | Icons |
| **@dnd-kit** | Drag & Drop cho Kanban Board |
| **FullCalendar** | Calendar view hiển thị task theo ngày |
| **recharts** | Biểu đồ (Bar Chart, Donut Chart) cho Dashboard |
| **next-themes** | Dark/Light Mode toggle |
| **date-fns** | Xử lý ngày tháng |
| **nuqs** | URL state management (filter params) |
| **emoji-mart** | Picker emoji cho project icon |

---

## 5. CÁC CHỨC NĂNG ĐÃ THỰC HIỆN

### 5.1 Xác thực người dùng (Authentication)
- ✅ Đăng ký tài khoản (Register)
- ✅ Đăng nhập bằng Email/Password (Local Strategy)
- ✅ Đăng nhập bằng Google OAuth 2.0
- ✅ Đăng xuất (Logout)
- ✅ Phiên đăng nhập lưu qua Session Cookie (24h)
- ✅ Bảo vệ route với middleware `isAuthenticated`

### 5.2 Quản lý Workspace
- ✅ Tạo workspace mới
- ✅ Chỉnh sửa thông tin workspace
- ✅ Xóa workspace
- ✅ Xem danh sách workspace mà user tham gia
- ✅ Invite member vào workspace qua Invite Code
- ✅ Phân quyền thành viên: Owner / Admin / Member
- ✅ Dashboard thống kê: Total Tasks, Overdue, Completed
- ✅ Biểu đồ Bar Chart & Donut Chart phân tích task

### 5.3 Quản lý Project
- ✅ Tạo, chỉnh sửa, xóa project
- ✅ Chọn emoji đại diện cho project
- ✅ Xem danh sách project trong workspace
- ✅ Recent Projects trên Dashboard

### 5.4 Quản lý Task
- ✅ Tạo task với: tiêu đề, mô tả, priority, status, assignee, dueDate
- ✅ Chỉnh sửa, xóa task
- ✅ Bộ lọc task theo: status, priority, assignee, keyword
- ✅ Task Code tự động sinh (VD: TASK-001)
- ✅ Recent Tasks trên Dashboard

### 5.5 Kanban Board (Nâng cao)
- ✅ Giao diện Kanban với 5 cột: Backlog, Todo, In Progress, Review, Done
- ✅ Kéo thả task giữa các cột (dnd-kit)
- ✅ Tự động cập nhật trạng thái task lên database sau khi kéo
- ✅ Drag Overlay hiệu ứng mượt mà
- ✅ Nút Edit trực tiếp trên card Kanban

### 5.6 Calendar View (Nâng cao)
- ✅ Hiển thị task theo deadline trên lịch (FullCalendar)
- ✅ Màu sắc phân biệt theo priority (đỏ/cam/xanh)
- ✅ Click vào event để xem chi tiết task
- ✅ Hỗ trợ Month / Week / Day view

### 5.7 File Attachment (Nâng cao)
- ✅ Upload file đính kèm vào task (ảnh, PDF, DOCX, ZIP)
- ✅ Lưu trữ trên Cloudinary
- ✅ Hiển thị file đã upload trong Edit Task dialog
- ✅ Xóa file đính kèm

### 5.8 Quản lý thành viên
- ✅ Xem danh sách thành viên trong workspace
- ✅ Thay đổi vai trò thành viên
- ✅ Recent Members trên Dashboard

### 5.9 UI/UX
- ✅ Dark Mode / Light Mode toggle
- ✅ Giao diện responsive
- ✅ Breadcrumb navigation
- ✅ Toast notifications
- ✅ Loading states và skeleton

---

## 6. CÁC COLLECTION TRONG MONGODB

Dự án sử dụng **7 collection** chính:

| Collection | Mô tả | Các trường chính |
|---|---|---|
| **users** | Thông tin người dùng | name, email, password (hashed), profilePicture, currentWorkspace, isActive, lastLogin |
| **accounts** | Tài khoản OAuth | provider (LOCAL/GOOGLE), providerId, userId, refreshToken, tokenExpiry |
| **workspaces** | Tổ chức/nhóm làm việc | name, description, owner (ref User), inviteCode |
| **members** | Quan hệ User ↔ Workspace | userId (ref User), workspaceId (ref Workspace), role (ref Role), joinedAt |
| **roles** | Vai trò & quyền hạn | name (OWNER/ADMIN/MEMBER), permissions[] |
| **projects** | Dự án trong workspace | name, emoji, description, workspace (ref Workspace), createdBy (ref User) |
| **tasks** | Công việc trong project | taskCode, title, description, status, priority, assignedTo, project, workspace, dueDate, attachments[] |

### Quan hệ giữa các Collection:
```
User (1) ←→ (N) Account       [OAuth providers]
User (N) ←→ (N) Workspace     [qua Member collection]
Workspace (1) → (N) Project
Project (1) → (N) Task
User (1) → (N) Task            [assignedTo]
```

---

## 7. TEST VỚI POSTMAN

### Nhóm API Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập (email, password) |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/google` | Bắt đầu Google OAuth |
| GET | `/api/auth/google/callback` | Callback sau Google OAuth |

### Nhóm API Workspace (`/api/workspace`) — cần đăng nhập
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/workspace/create/new` | Tạo workspace mới |
| GET | `/api/workspace/all` | Lấy danh sách workspace của user |
| GET | `/api/workspace/:id` | Lấy thông tin workspace |
| PUT | `/api/workspace/update/:id` | Cập nhật workspace |
| DELETE | `/api/workspace/delete/:id` | Xóa workspace |
| GET | `/api/workspace/members/:id` | Lấy danh sách thành viên |
| GET | `/api/workspace/analytics/:id` | Lấy thống kê workspace |
| PUT | `/api/workspace/change/member/role/:id` | Đổi vai trò thành viên |

### Nhóm API Project (`/api/project`) — cần đăng nhập
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/project/workspace/:workspaceId/create` | Tạo project |
| GET | `/api/project/workspace/:workspaceId/all` | Lấy danh sách project |
| GET | `/api/project/:id/workspace/:workspaceId` | Lấy thông tin project |
| PUT | `/api/project/:id/workspace/:workspaceId/update` | Cập nhật project |
| DELETE | `/api/project/:id/workspace/:workspaceId/delete` | Xóa project |
| GET | `/api/project/:id/workspace/:workspaceId/analytics` | Thống kê project |

### Nhóm API Task (`/api/task`) — cần đăng nhập
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/task/project/:projectId/workspace/:workspaceId/create` | Tạo task |
| GET | `/api/task/workspace/:workspaceId/all` | Lấy tất cả task (có filter) |
| GET | `/api/task/:id/project/:projectId/workspace/:workspaceId` | Lấy chi tiết task |
| PUT | `/api/task/:id/project/:projectId/workspace/:workspaceId/update` | Cập nhật task |
| DELETE | `/api/task/:id/workspace/:workspaceId/delete` | Xóa task |
| POST | `/api/task/:id/project/:projectId/workspace/:workspaceId/upload` | Upload file đính kèm |
| DELETE | `/api/task/:id/project/:projectId/workspace/:workspaceId/attachment/:publicId/delete` | Xóa file đính kèm |

### Nhóm API Member (`/api/member`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/member/workspace/:workspaceId/join` | Tham gia workspace qua invite code |

---

## 8. SITEMAP

```
/ (Root)
├── /sign-in              → Trang đăng nhập
├── /sign-up              → Trang đăng ký
├── /google/callback      → Xử lý Google OAuth callback
│
└── /workspace/:workspaceId
    ├── /                 → Dashboard (Analytics + Recent Items)
    ├── /tasks            → Tất cả Tasks
    │   ├── Tab: List View    → Bảng danh sách task
    │   ├── Tab: Kanban Board → Drag & Drop Kanban
    │   └── Tab: Calendar     → Lịch theo deadline
    ├── /members          → Quản lý thành viên
    ├── /settings         → Cài đặt workspace
    └── /project/:projectId → Chi tiết project & tasks
```

---

## 9. HẠN CHẾ & HƯỚNG PHÁT TRIỂN

### Hạn chế hiện tại
- Chưa có hệ thống gửi email thông báo (invite member, task assigned...)
- Chưa có tính năng real-time (WebSocket/Socket.io) — thông báo cập nhật ngay lập tức
- File attachment chỉ có ở Edit Task, không thể upload khi tạo task
- Chưa có tính năng comment/thảo luận trong task
- Chưa có phân trang cho Kanban Board
- Chưa triển khai kiểm thử tự động (Unit Test, Integration Test)

### Hướng phát triển
- ✨ Tích hợp **Socket.io** cho real-time: thông báo khi có task mới, member join...
- ✨ Thêm **Nodemailer** gửi email thông báo (assign task, invite member)
- ✨ Tính năng **Comment** và **Activity Log** trong từng task
- ✨ Tích hợp **AI** (GPT) để gợi ý ưu tiên task và phân công công việc
- ✨ Export báo cáo dạng **PDF/Excel**
- ✨ Ứng dụng **Mobile** (React Native)
- ✨ **Subscription/Billing** cho mô hình SaaS thực thụ (Stripe)
- ✨ Kiểm thử với **Jest** + **Supertest**

---

## 10. TÀI LIỆU THAM KHẢO

1. MongoDB Documentation – https://www.mongodb.com/docs/
2. Mongoose Documentation – https://mongoosejs.com/docs/guide.html
3. Express.js Documentation – https://expressjs.com/
4. React Documentation – https://react.dev/
5. Vite Documentation – https://vitejs.dev/
6. Passport.js Documentation – https://www.passportjs.org/
7. TanStack Query (React Query) – https://tanstack.com/query/
8. shadcn/ui Components – https://ui.shadcn.com/
9. Tailwind CSS – https://tailwindcss.com/
10. @dnd-kit – https://dnd-kit.com/
11. FullCalendar – https://fullcalendar.io/docs
12. Recharts – https://recharts.org/
13. Cloudinary Docs – https://cloudinary.com/documentation
14. Zod Validation – https://zod.dev/

---

## 11. GỢI Ý NỘI DUNG SLIDE PPT

### Slide 1: Trang bìa
- Tên đề tài: **"Xây dựng nền tảng quản lý dự án nhóm B2B – MERN Stack SaaS"**
- Logo MERN Stack, tên trường, môn học, thành viên, GVBM

### Slide 2-3: Giới thiệu đề tài
- Lý do + Mục tiêu (xem mục 2)
- So sánh với Trello/Jira/ClickUp

### Slide 4: MERN Stack là gì?
- 4 ô vuông với icon MongoDB / Express / React / Node
- Giải thích ngắn vai trò từng phần

### Slide 5: Kiến trúc hệ thống
- Sơ đồ: Client (React) ↔ REST API (Express) ↔ Database (MongoDB)
- Thêm Cloudinary (file storage), Google OAuth

### Slide 6: Các thư viện đáng chú ý
- Backend: Passport.js, cookie-session, bcrypt, zod, multer, cloudinary
- Frontend: React Query, shadcn/ui, dnd-kit, FullCalendar, recharts

### Slide 7: MongoDB Collections
- Bảng 7 collections (xem mục 6)
- Sơ đồ quan hệ đơn giản

### Slide 8: Xác thực & Bảo mật
- Cookie Session thay vì JWT (lý do tại sao)
- Passport Local + Google OAuth flow
- bcrypt mã hóa mật khẩu
- roleGuard phân quyền RBAC

### Slide 9-10: Các chức năng chính
- Danh sách chức năng với icon ✅
- Screenshot giao diện (Dashboard, Kanban, Calendar)

### Slide 11: Test với Postman
- Ảnh chụp màn hình Postman một vài API
- Bảng các endpoint chính

### Slide 12: Demo Live
- Mở trình duyệt demo trực tiếp

### Slide 13: Hạn chế & Hướng phát triển

### Slide 14: Tài liệu tham khảo

### Slide 15: Cảm ơn
- "Thank You!" + GitHub repo link + QR code (nếu có)

---

*Tài liệu này được tổng hợp từ source code thực tế của dự án.*
