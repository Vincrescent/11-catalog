# Tugas 11 - Full-Stack Product Catalog App (Nordic Minimalist & Emerald)

Aplikasi Full-Stack Katalog Produk (Product Catalog Studio) lengkap dengan fitur CRUD (Create, Read, Update, Delete), manajemen stok, format harga Rupiah (IDR), rating produk, serta filter kategori yang terintegrasi antara **Frontend React (Vite)** dan **Backend NestJS REST API**.

## 🛠️ Teknologi & Fitur

### Backend (NestJS API)
- **Port Default**: `3090`
- **EndPoints API**:
  - `GET /api/v1/products` (Support query `?category=Electronics`, `?available=true`, `?search=keyword`)
  - `GET /api/v1/products/:id` (Detail produk)
  - `POST /api/v1/products` (Tambah produk baru dengan validasi `class-validator`)
  - `PUT /api/v1/products/:id` (Update informasi/stok produk)
  - `DELETE /api/v1/products/:id` (Hapus produk dari katalog)
- **Validation**: NestJS Global `ValidationPipe` (`class-validator`)
- **CORS**: Mengizinkan origin `http://localhost:5188` & `http://localhost:5174`

### Frontend (React + Vite)
- **Port Default**: `5188`
- **Tema & Desain**: Nordic Minimalist Light & Emerald Studio
- **Fitur Frontend**:
  - 🛍️ **Grid Katalog Produk**: Menampilkan daftar produk dengan foto, badge kategori, badge stok, bintang rating, dan format harga Rupiah (IDR).
  - 📊 **Stats Dashboard Overview**: Ringkasan Total Produk, Total Unit Stok, Rata-rata Rating, dan Jumlah Produk Habis.
  - ➕ **Modal Tambah Produk (POST)**: Form modal reusable untuk input data produk baru.
  - ✏️ **Modal Edit Produk (PUT)**: Edit nama, kategori, harga, stok, rating, URL gambar, dan deskripsi produk.
  - 📦 **Quick Stock Control**: Tombol cepat penambahan/pengurangan jumlah stok secara interaktif.
  - 🗑️ **Modal Hapus Produk (DELETE)**: Dialog modal konfirmasi hapus produk.
  - 🔍 **Search & Filter Realtime**: Filter Kategori ("Semua", "Electronics", "Gadgets", "Fashion", "Home", "Aksesoris"), Filter "Hanya Stok Tersedia", serta pencarian nama/deskripsi produk.
  - ⚡ **Axios Interceptors**: Interceptor logging request/response dan pesan error terpusat.
  - 🔔 **Toast Notification**: Pop-up pemberitahuan aksi CRUD real-time.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend NestJS (Port 3090)
```bash
cd todo-api
cmd /c "npm run start:dev"
```
Akses Backend API di `http://localhost:3090/api/v1/products`

### 2. Menjalankan Frontend React (Port 5188)
```bash
cd todo-frontend
cmd /c "npm run dev"
```
Buka Browser di `http://localhost:5188`
