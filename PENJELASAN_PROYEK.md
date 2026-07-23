# 📚 Penjelasan Lengkap Proyek Full-Stack Katalog Produk (Product Catalog Studio)

Dokumen ini berisi penjelasan komprehensif mengenai arsitektur, penjelasan kode, struktur folder, serta tautan repositori GitHub dari aplikasi **Product Catalog Studio** yang dibangun dengan **NestJS (Backend API)** dan **React + Vite (Frontend SPA)**.

---

## 🔗 1. Tautan Repositori GitHub

- **GitHub Repository**: [https://github.com/Vincrescent/11-catalog](https://github.com/Vincrescent/11-catalog)
- **Branch Utama**: `main`

---

## 📁 2. Struktur Folder Proyek

```text
d:\PWEB\11\
├── PENJELASAN_PROYEK.md         # Dokumen penjelasan kode & proyek
├── README.md                    # Dokumentasi utama proyek & panduan instalasi
├── .gitignore                   # Konfigurasi file yang diabaikan git
│
├── todo-api/                    # BACKEND API (NestJS Framework)
│   ├── package.json             # Dependensi & skrip backend
│   ├── tsconfig.json            # Konfigurasi TypeScript backend
│   └── src/
│       ├── main.ts              # Entry point bootstrap NestJS (CORS, Pipes, Port 3090)
│       ├── app.module.ts        # Root module penampung ProductModule
│       └── product/             # Modul Fitur Produk (Domain Product)
│           ├── product.module.ts        # Deklarasi modul Product
│           ├── product.controller.ts    # Layer Controller REST API (/api/v1/products)
│           ├── product.service.ts       # Layer Business Logic & In-Memory Storage
│           ├── dto/                     # Data Transfer Objects & Validation
│           │   ├── create-product.dto.ts # Validasi input pembuatan produk
│           │   └── update-product.dto.ts # Validasi input pembaharuan produk
│           └── entities/                # Schema Entity / Model Data
│               └── product.entity.ts    # Class definisi tipe data Product
│
└── todo-frontend/               # FRONTEND SPA (React.js + Vite)
    ├── package.json             # Dependensi (React, Lucide Icons, Axios) & Script Dev (Port 5188)
    ├── vite.config.js           # Konfigurasi Vite dev server
    ├── index.html               # Entry Point HTML
    └── src/
        ├── main.jsx             # Entry Point React DOM Render
        ├── App.jsx              # Komponen utama pembungkus halaman
        ├── index.css            # Design System (CSS Variables, Grid, Card, Animations)
        ├── api/
        │   └── axiosInstance.js # Instance Axios + Interceptors (Logging & Handling)
        ├── components/          # Reusable UI Components
        │   ├── ProductCard.jsx   # Card visual produk (Gambar, Badge, Harga IDR, Stok)
        │   ├── ProductForm.jsx   # Form modal Tambah/Edit Produk dengan validasi
        │   ├── Modal.jsx         # Component Modal dialog generik
        │   ├── ConfirmModal.jsx  # Component Modal dialog konfirmasi hapus
        │   └── Toast.jsx         # Component Pop-up notifikasi real-time
        └── pages/
            └── ProductCatalog.jsx # Halaman utama (Stats overview, Search, Filter, Grid)
```

---

## 💻 3. Penjelasan Kode & Arsitektur (Code Explanation)

### A. Arsitektur Backend (NestJS API)

Backend dibangun menggunakan pola arsitektur **Modular Architecture (Controller-Service-DTO-Entity)** yang dipromosikan oleh NestJS.

#### 1. Bootstrap Server (`todo-api/src/main.ts`)
```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.enableCors({ origin: ['http://localhost:5188', 'http://127.0.0.1:5188'] });
const port = process.env.PORT || 3090;
await app.listen(port);
```
- **Fungsi**: Menginisialisasi aplikasi NestJS, menerapkan `ValidationPipe` secara global untuk sanitasi data masukan, mengkonfigurasi `CORS` agar mengizinkan request dari frontend pada port `5188`, serta menetapkan port server berjalan di **3090**.

#### 2. Entitas Produk (`todo-api/src/product/entities/product.entity.ts`)
```typescript
export class Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
```
- **Fungsi**: Mendefinisikan struktur data resmi produk yang disimpan dan diproses oleh aplikasi.

#### 3. Data Transfer Object & Validasi (`todo-api/src/product/dto/create-product.dto.ts`)
```typescript
export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() category: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) stock: number;
  @IsNumber() @Min(0) @Max(5) @IsOptional() rating?: number;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() imageUrl?: string;
}
```
- **Fungsi**: Memastikan setiap data yang dikirim melalui *request body* saat menambah/mengedit produk tervalidasi dengan ketat (mencegah string kosong, harga/stok negatif, atau nilai rating di luar jangkauan 0-5).

#### 4. Service / Business Logic (`todo-api/src/product/product.service.ts`)
- **Fungsi**: Mengelola array data in-memory produk. Menyediakan fungsi-fungsi utama:
  - `findAll(category, availableOnly, search)`: Menyaring data berdasarkan kategori produk, ketersediaan stok, dan kata kunci pencarian pada nama/deskripsi.
  - `findOne(id)`: Mencari detail produk spesifik atau melempar `NotFoundException` (404) jika tidak ada.
  - `create(dto)`: Menambahkan produk baru, mengatur waktu `createdAt`, dan menghitung status `isAvailable` berdasarkan jumlah stok.
  - `update(id, dto)`: Memperbarui data produk dan mengkalkulasi ulang `isAvailable`.
  - `remove(id)`: Menghapus produk dari repositori data.

#### 5. Controller REST API (`todo-api/src/product/product.controller.ts`)
```typescript
@Controller('api/v1/products')
export class ProductController {
  @Get() findAll(...)
  @Get(':id') findOne(...)
  @Post() create(...)
  @Put(':id') update(...)
  @Delete(':id') remove(...)
}
```
- **Fungsi**: Memetakan HTTP request ke fungsi yang ada pada `ProductService` untuk menghasilkan respon JSON standar RESTful API.

---

### B. Arsitektur Frontend (React SPA)

Frontend dibangun dengan **React 18 (Vite)** menerapkan prinsip *Component-Driven Architecture* dan desain visual *Nordic Minimalist Studio*.

#### 1. Centralized HTTP Client (`todo-frontend/src/api/axiosInstance.js`)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3090';
const api = axios.create({ baseURL: API_BASE_URL });
```
- **Fungsi**: Konfigurasi basis Axios yang dilengkapi *Interceptors* untuk mencetak log HTTP request/response pada konsol browser dan menangani pesan kesalahan (*error handling*) secara terpusat.

#### 2. Main Page State & Layout (`todo-frontend/src/pages/ProductCatalog.jsx`)
- **Fungsi**: Menjadi kontainer utama aplikasi yang mengendalikan state:
  - `products`: Daftar array produk yang diambil dari backend.
  - `selectedCategory` & `searchTerm` & `availableOnly`: State filter interaktif.
  - `modalOpen` & `editingProduct`: State untuk pengontrol dialog Modal Form.
  - `stats`: Kalkulasi matematis (*useMemo*) untuk statistik header (Total Produk, Total Unit Stok, Average Rating, Produk Stok Habis).

#### 3. Component Product Card (`todo-frontend/src/components/ProductCard.jsx`)
```javascript
const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
```
- **Fungsi**: Menampilkan visualisasi tiap unit produk dalam bentuk card yang kaya informasi:
  - Format mata uang Rupiah (IDR).
  - Badge Kategori & Indikator Stok (*Tersedia* vs *Stok Habis*).
  - Rating bintang (⭐).
  - Tombol cepat penambahan/pengurangan jumlah stok (*Quick Stock Adjust*).
  - Akses modal Edit dan Hapus produk.

#### 4. Component Product Form Modal (`todo-frontend/src/components/ProductForm.jsx`)
- **Fungsi**: Form interaktif di dalam modal untuk operasi **Create (POST)** dan **Update (PUT)**. Memiliki fitur validasi formulir di sisi klien (*client-side validation*) sebelum mengirimkan permintaan HTTP ke API backend.

#### 5. Custom Design System (`todo-frontend/src/index.css`)
- **Fungsi**: Menerapkan variabel CSS kustom (`--emerald-600`, `--bg-main`, `--radius-lg`, `--shadow-emerald`), tata letak CSS Grid yang responsif, efek hover mikro-animasi, serta estetika visual premium.

---

## 🎯 4. Kesimpulan (Conclusion)

1. **Transformasi Sukses**: Aplikasi telah berhasil ditransformasikan secara penuh dari aplikasi *Todo List* sederhana menjadi **Aplikasi Katalog Produk (Product Catalog Studio)** full-stack yang modern dan fungsional.
2. **REST API Terstruktur**: Backend NestJS menyediakan layanan API yang aman, menggunakan validasi DTO ketat, dan merespon dengan format JSON standar pada port `3090`.
3. **Pengalaman Pengguna (UX) Premium**: Frontend React memberikan pengalaman interaktif melalui pencarian realtime, filter kategori instant, indikator stok interaktif, notifikasi toast, serta antarmuka visual bergaya *Nordic Minimalist & Emerald Studio*.
4. **Siap Dikembangkan**: Struktur kode yang modular membuat proyek ini sangat mudah untuk diintegrasikan lebih lanjut dengan basis data permanen seperti PostgreSQL/MongoDB maupun payment gateway e-commerce di masa depan.
