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

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM & Database**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) dengan SQLite (Mudah dimigrasikan ke PostgreSQL/MySQL)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)
- **QR Generator**: `qrcode[pil]`

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Proyek

```text
sistem-pelaporan-qr/
├── backend/
│   ├── main.py              # Entry point FastAPI, routing, CORS, dan static files
│   ├── database.py          # Konfigurasi koneksi SQLite & session SQLAlchemy
│   ├── models.py            # Definisi skema relasi database (Clients, Tickets, QrCodes, dll)
│   ├── schemas.py           # Pydantic schemas untuk validasi request & response
│   ├── security.py          # Validasi tipe file & sanitasi nama file upload
│   ├── seed.py              # Inisialisasi database awal beserta data dummy
│   ├── generate_qr.py       # Generator token & gambar QR Code per pelanggan
│   ├── requirements.txt     # Dependensi Python
│   ├── routers/             # Endpoint modular
│   │   ├── pelanggan.py     # Endpoint verifikasi QR & info pelanggan
│   │   └── laporan.py       # Endpoint pembuatan tiket & update status
│   ├── qr_codes/            # Hasil cetak berkas gambar QR Code (.png)
│   └── uploads/             # Berkas foto keluhan yang diunggah pelanggan
├── frontend/
│   ├── src/
│   │   ├── components/      # Komponen antarmuka (Header, Form, Riwayat, Profil)
│   │   ├── services/api.js  # Integrasi Axios/Fetch ke backend FastAPI
│   │   ├── App.jsx          # Logika navigasi & state utama
│   │   └── main.jsx         # Entry point React
│   ├── package.json
│   └── vite.config.js
├── ERD-UTAMA.png            # Visualisasi Entity Relationship Diagram
├── Main-ERD.mermaid         # Definisi Mermaid schema relasi database
├── .gitignore               # Konfigurasi git ignore
├── LICENSE                  # Lisensi proyek (MIT)
└── README.md                # Dokumentasi proyek
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Prasyarat Sistem
- **Python** 3.10 atau versi lebih baru
- **Node.js** v18+ dan **npm**
- **Git**

---

### 2. Menjalankan Backend

1. Buka terminal dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```

2. Buat virtual environment dan aktifkan:
   ```bash
   python -m venv .venv
   # Di Linux / macOS:
   source .venv/bin/activate
   # Di Windows:
   .venv\Scripts\activate
   ```

3. Pasang seluruh dependensi:
   ```bash
   pip install -r requirements.txt
   ```

4. Jalankan seeder data awal (opsional, untuk membuat data awal dan sampel pelanggan):
   ```bash
   python seed.py
   ```

5. Jalankan server FastAPI:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   > 📖 Dokumentasi Swagger UI interaktif dapat diakses di: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Generate QR Code Pelanggan

Untuk menghasilkan QR Code bagi pelanggan tertentu:
```bash
python generate_qr.py <id_pelanggan>
```
*Contoh:*
```bash
python generate_qr.py 1
```
Hasil file gambar QR Code akan tersimpan di folder `backend/qr_codes/<customer_number>.png` lengkap dengan URL akses berparameter token rahasia.

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
