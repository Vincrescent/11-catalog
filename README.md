# Tugas 11 - Full-Stack Todo App (Nordic Minimalist Light & Emerald)

Aplikasi Full-Stack Todo App lengkap dengan fitur CRUD (Create, Read, Update, Delete) yang terintegrasi antara **Frontend React (Vite)** dan **Backend NestJS REST API**.

## 🛠️ Teknologi & Fitur

### Backend (NestJS)
- **Port**: `3005`
- **EndPoints**:
  - `GET /api/v1/todos` (Support query `?completed=true|false`)
  - `POST /api/v1/todos` (Tambah todo)
  - `GET /api/v1/todos/:id` (Get detail todo)
  - `PUT /api/v1/todos/:id` (Update todo)
  - `DELETE /api/v1/todos/:id` (Hapus todo)
- **Validation**: NestJS Global `ValidationPipe` (`class-validator`)
- **CORS**: Mengizinkan origin `http://localhost:5174`

### Frontend (React + Vite)
- **Port**: `5174`
- **Tema & Desain**: Nordic Minimalist Light & Emerald
- **Fitur Frontend**:
  - 📋 **List Todo**: Menampilkan seluruh data todo dengan status & priority badge
  - ➕ **Add Todo Modal (POST)**: Form modal reusable untuk menambah todo
  - ✏️ **Edit Todo Modal (PUT)**: Prepopulate data todo pada form modal untuk update
  - ☑️ **Toggle Complete (PUT)**: Quick checkbox toggle status selesai/belum
  - 🗑️ **Delete Todo (DELETE)**: Tombol hapus dilengkapi dialog modal konfirmasi
  - 🔍 **Search & Filter**: Filter tab ("Semua", "Aktif", "Selesai"), Filter Prioritas, dan Live Search
  - 🔄 **Auto Refetch**: Data otomatis diperbarui setelah setiap operasi CRUD
  - ⚡ **Axios Interceptor**: Logging request/response & penanganan error terpusat
  - 🔔 **Toast Notification**: Pop-up notifikasi sukses/gagal real-time
  - 📱 **Responsive**: Tampilan bersih, intuitif, dan mobile-friendly

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend NestJS (Port 3005)
```bash
cd todo-api
npm run start:dev
```
Akses Backend API di `http://localhost:3005`

### 2. Menjalankan Frontend React (Port 5174)
```bash
cd todo-frontend
npm run dev
```
Buka Browser di `http://localhost:5174`

---
*Repository*: https://github.com/Vincrescent/11-todo
