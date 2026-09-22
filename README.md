# 🌐 Sistem Pelaporan Khusus Pelanggan Berbasis QR Code
### *Proyek Magang — PT AcehLink Media*

Aplikasi pelaporan gangguan layanan internet cepat, aman, dan terverifikasi untuk pelanggan AcehLink Media. Sistem ini memanfaatkan **QR Code unik per pelanggan** yang ditempelkan pada perangkat modem/ONT, memungkinkan pelanggan melaporkan keluhan tanpa perlu repot melakukan login atau memasukkan ID pelanggan secara manual.

---

## 📌 Fitur Utama

- **Otentikasi Cepat via QR Code**: Akses instan dengan memindai QR Code unik yang terpasang pada modem/router pelanggan.
- **Formulir Pelaporan Interaktif**:
  - Pilihan jenis kendala dan status lampu indikator modem (LOS, PON, Internet, Power).
  - Deskripsi keluhan rinci beserta perkiraan waktu mulai kendala.
  - Unggah foto bukti fisik lampu indikator modem secara langsung.
- **Pelacakan Tiket Real-Time**: Status pengerjaan tiket terpantau transparan (`Menunggu` ➔ `Diproses` ➔ `Selesai`).
- **Riwayat Pelaporan**: Melihat catatan seluruh laporan yang pernah diajukan sebelumnya.
- **Profil Pelanggan Terintegrasi**: Menampilkan nama pelanggan, ID pelanggan (`customer_number`), paket langganan aktif, dan alamat pemasangan.
- **Generator QR Code Mandiri**: Skrip Python untuk menghasilkan token verifikasi aman dan berkas gambar QR Code secara otomatis.

---

## 🛠️ Tech Stack
 
### **Backend (Terintegrasi ke `backend-api`)**
- **Framework**: [NestJS 10.x](https://nestjs.com/) (TypeScript)
- **ORM & Database**: [Prisma ORM 5.x](https://www.prisma.io/) dengan PostgreSQL 16 (Docker)
- **Validation**: `class-validator` & `class-transformer`
- **Dokumentasi**: Swagger / OpenAPI 3.0 interaktif
- **QR Generator**: `qrcode` (TypeScript CLI `npm run qr`)

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Proyek

```text
sistem-pelaporan-qr/
├── frontend/
│   ├── src/
│   │   ├── components/      # Komponen antarmuka (Header, Form, Riwayat, Profil, Detail)
│   │   ├── services/api.js  # Integrasi Axios/Fetch ke backend utama (port 3000)
│   │   ├── App.jsx          # Logika navigasi & state utama
│   │   └── main.jsx         # Entry point React
│   ├── package.json
│   ├── vite.config.js
│   └── .env                 # VITE_API_BASE_URL=http://localhost:3000
├── ERD-UTAMA.png            # Visualisasi Entity Relationship Diagram
├── Main-ERD.mermaid         # Definisi Mermaid schema relasi database
├── .gitignore               # Konfigurasi git ignore
├── LICENSE                  # Lisensi proyek (MIT)
└── README.md                # Dokumentasi proyek
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Menjalankan Backend API Utama

Backend API kini terintegrasi secara modular pada folder `backend-api` di root workspace:
```bash
# Dari root workspace:
docker compose up -d
```
API akan berjalan di `http://localhost:3000` dengan Swagger docs di `http://localhost:3000/api/docs`.

### 2. Generate QR Code Pelanggan

Untuk menghasilkan token dan barcode QR pelanggan:
```bash
cd backend-api
npm run qr -- <id_atau_kode_pelanggan>
# Contoh: npm run qr -- ACL-001234
```

---

### 4. Menjalankan Frontend

1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Pasang dependensi Node.js:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
4. Buka tautan yang muncul di browser, atau gunakan tautan berparameter hasil generate QR code:
   ```text
   http://localhost:5173/?id_pelanggan=1&token=SEC-TKN-9821A
   ```

---

## 📡 Ringkasan API Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Pemeriksaan status server API |
| `GET` | `/api/pelanggan/validate` | Validasi akses QR code pelanggan dan profil |
| `POST` | `/api/laporan` | Mengirimkan tiket laporan gangguan baru + upload foto |
| `GET` | `/api/laporan/{ticket_number}` | Mengambil detail laporan berdasarkan nomor tiket |
| `PATCH` | `/api/laporan/{ticket_number}/status` | Memperbarui status penanganan tiket oleh teknisi |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) — Hak Cipta (c) 2026 Diarchves (AcehLink Media).
