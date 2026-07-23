# Penjelasan Proyek Katalog Produk

## 1. Penjelasan Kode dan Arsitektur

### Backend API (NestJS Framework)

Backend menggunakan arsitektur modular yang memisahkan tanggung jawab kode menjadi Controller, Service, DTO, dan Entity.

- main.ts: Merupakan file entry point utama NestJS. Di dalam file ini, aplikasi diinisialisasi, mengaktifkan ValidationPipe secara global untuk memvalidasi masukan data, mengonfigurasi CORS untuk mengizinkan request dari frontend port 5188, dan menjalankan server pada port 3090.
- app.module.ts: Root module yang mengimpor dan mendaftarkan ProductModule sebagai modul utama aplikasi.
- product.entity.ts: Mendefinisikan struktur data resmi produk yang terdiri dari atribut id, name, category, price, stock, rating, description, imageUrl, isAvailable, createdAt, dan updatedAt.
- create-product.dto.ts: Berisi skema validasi Data Transfer Object menggunakan class-validator. Memastikan nama dan kategori tidak kosong, harga dan stok tidak bernilai negatif, serta rating berada dalam rentang 0.0 hingga 5.0.
- update-product.dto.ts: Turunan dari CreateProductDto dengan sifat opsional (PartialType) untuk kebutuhan pembaharuan data produk.
- product.service.ts: Berisi logika bisnis dan penyimpan data sementara (in-memory storage). Menyediakan fungsi pencarian (findAll) dengan dukungan pencarian kata kunci dan filter kategori/stok, pencarian detail (findOne), penambahan produk baru (create), pembaharuan data (update), dan penghapusan produk (remove).
- product.controller.ts: Menangani HTTP Request pada endpoint /api/v1/products dan mengarahkan pemanggilan fungsi ke ProductService.

### Frontend Client (React + Vite)

Frontend dibangun dengan React 18 dan Vite menggunakan pendekatan komponen modular dan antarmuka pengguna responsif.

- axiosInstance.js: Mengonfigurasi instance Axios dengan baseURL http://localhost:3090. Dilengkapi interceptor untuk mencetak log HTTP request/response pada konsol browser serta menangani error secara terpusat.
- ProductCatalog.jsx: Halaman utama aplikasi yang mengelola state daftar produk, kata kunci pencarian, filter kategori, status ketersediaan stok, serta modal form. Juga menghitung statistik header seperti total produk, total stok, rata-rata rating, dan produk stok habis.
- ProductCard.jsx: Komponen kartu visual untuk setiap produk. Menampilkan foto produk, badge kategori, badge status stok, harga dalam format Rupiah (IDR), rating bintang, serta tombol kontrol stok interaktif (+ dan -).
- ProductForm.jsx: Komponen form di dalam modal untuk menambah dan mengedit produk lengkap dengan validasi di sisi klien sebelum dikirim ke API backend.
- index.css: Berisi variabel warna CSS, sistem grid responsif, kartu produk, efek hover, dan animasi modal.

---

## 2. Kesimpulan

Aplikasi telah berhasil ditransformasikan secara penuh dari aplikasi Todo List menjadi Aplikasi Katalog Produk full-stack yang modern dan fungsional.
Backend NestJS mampu menyediakan REST API yang stabil pada port 3090 dengan validasi DTO yang ketat.
Frontend React memberikan pengalaman pengguna yang interaktif dengan pencarian realtime, filter kategori, format harga IDR, indikator stok interaktif, dan notifikasi toast.
Seluruh arsitektur disusun secara modular sehingga mudah untuk dikembangkan lebih lanjut di masa mendatang.

---

## 3. Link GitHub

https://github.com/Vincrescent/11-catalog

---

## 4. Struktur Folder

```text
d:\PWEB\11\
├── PENJELASAN_PROYEK.md
├── README.md
├── .gitignore
│
├── todo-api/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── product/
│           ├── product.module.ts
│           ├── product.controller.ts
│           ├── product.service.ts
│           ├── dto/
│           │   ├── create-product.dto.ts
│           │   └── update-product.dto.ts
│           └── entities/
│               └── product.entity.ts
│
└── todo-frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axiosInstance.js
        ├── components/
        │   ├── ProductCard.jsx
        │   ├── ProductForm.jsx
        │   ├── Modal.jsx
        │   ├── ConfirmModal.jsx
        │   └── Toast.jsx
        └── pages/
            └── ProductCatalog.jsx
```
