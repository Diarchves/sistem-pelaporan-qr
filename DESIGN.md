# DESIGN.md — Panduan Identitas & Arah Desain Antarmuka

> **Peringatan (Honest Warning)**: Dokumen ini disusun oleh agent AI berdasarkan preferensi brief pengguna. Panduan ini berfungsi sebagai jiwa identitas visual agar antarmuka tidak jatuh ke dalam estetika template AI generik (slop).

---

## 🧭 Identitas & Konteks Produk

- **Produk**: Sistem Pelaporan Khusus Pelanggan Berbasis QR Code (PT AcehLink Media).
- **Target Pengguna**: Pelanggan internet rumah tangga & kantor yang sedang mengalami gangguan jaringan internet, memindai QR Code di stiker router/modem, dan membutuhkan kejelasan penanganan secara cepat tanpa repot mengingat sandi/login.
- **Nilai Utama**: Cepat dimuat pada kondisi koneksi darurat/lambat, navigasi intuitif (jempol mobile-first), status tiket transparan dan jujur, tidak ada elemen dekoratif palsu.

---

## 🎛️ Dials (Tingkat Energi & Dinamika Visual)

```text
Dial: ENERGY 2 / RHYTHM 2 / MOTION 1
```

- **ENERGY 2 (Balanced)**: Terlihat profesional, tenang, dan dapat dipercaya layaknya layanan utilitas ISP modern; bukan landing page marketing norak, melainkan aplikasi layanan pelanggan fungsional.
- **RHYTHM 2 (Varied & Terstruktur)**: Komposisi antarbagian bervariasi sesuai konteks (ringkasan status koneksi, form unggah bukti fisik modem, dan kartu riwayat timeline), tidak berupa grid seragam yang monoton.
- **MOTION 1 (Calm & Efisien)**: Transisi mikro hanya pada feedback aksi (status tiket terbuka, tab switching, spinner kirim form). Bebas dari animasi melayang (*floating*), *fade up* berantai, atau efek berat yang memperlambat koneksi.

---

## 🎨 Palet Warna (Soft Color System)

Maksimal 2–3 warna inti + 1 aksen fungsional, menggunakan versi warna lembut (*soft*) dan mematuhi standar kontras WCAG AA (R-25 & R-29):

1. **Warna Primer & Aksen Utama (Brand Action)**: Soft Ocean Blue (`#2A69AC` / hover `#21558C`) — memberikan kesan tenang, bersih, andal, dan ramah pengguna. Digunakan untuk tombol tindakan utama (CTA), tombol BottomNav aktif, dan pill navigasi.
2. **Warna Netral (Background & Surfaces)**:
   - Light Surface: Cool Off-White / Soft Slate (`#F8FAFC`, `#FFFFFF`)
   - Text Utama: Slate 800 (`#1E293B`)
   - Text Sekunder: Slate 600 / Slate 500 (`#475569` / `#64748B`)
   - Border: Slate 200 (`#E2E8F0`)
   - Tint Area: Soft Ocean Ice (`#F0F5FA`)
3. **Warna Semantik Versi Lembut (Status Jaringan & Tiket)**:
   - *Pending / Menunggu*: Soft Amber (`#D97706` dengan latar `#FFFBEB`)
   - *Diproses / Investigasi*: Soft Sky Blue (`#0284C7` dengan latar `#F0F9FF`)
   - *Selesai / Normal*: Soft Emerald (`#059669` dengan latar `#ECFDF5`)
   - *Gangguan / Kendala*: Soft Rose (`#E11D48` dengan latar `#FEF2F2`)

*Aturan*: Dilarang menggunakan warna neon jenuh menyilaukan, gradien orbs bersinar acak (*glow spam*), atau latar belakang kotak-kotak blueprint.

---

## ✍️ Tipografi (Typography)

- **Keluarga Font**: `Inter` atau `Plus Jakarta Sans` dengan fallback sans-serif sistem (`system-ui, -apple-system, sans-serif`).
- **Skala & Hierarki**:
  - Judul Utama (H1/H2): Bobot Semi-bold / Bold, ukuran proporsional, pelacakan huruf (letter spacing) wajar.
  - Teks Isi: Regular (14px–16px) dengan *line-height* longgar (1.5–1.6) untuk keterbacaan tinggi di layar kecil.
  - Teks Teknis (ID Pelanggan, Token, IP Router, Serial Number): Font Monospace bersih (`JetBrains Mono` / `ui-monospace`) hanya untuk data teknis spesifik.

---

## 📱 Tata Letak & Ergonomi Mobile (Layout & Accessibility)

- **Mobile-First**: Batas lebar layar terpusat (`max-w-md` atau `max-w-lg`) yang nyaman digenggam satu tangan di smartphone.
- **Fokus Tunggal per Layar**: Setiap tab (Beranda, Buat Laporan, Riwayat Tiket, Profil Layanan) memiliki satu titik fokus utama yang jelas tanpa kompetisi visual.
- **Ukuran Target Sentuh (Tap Targets)**: Semua tombol dan navigasi minimal berukuran 44px × 44px.
- **Navigasi Bawah (Bottom Navigation)**: Tab navigasi bawah yang mudah dijangkau ibu jari pengguna dengan indikator aktif yang kontras dan jelas.
- **Formulir Laporan yang Ringkas**:
  - Input pilihan cepat jenis gangguan (misal: Lampu LOS Merah, Internet Lambat, Total Mati).
  - Unggah foto bukti kondisi modem dengan preview instan dan tombol hapus/ganti.
  - Indikasi jelas saat sedang proses pengunggahan foto.

---

## 📋 Prinsip Konten & Kejujuran (Content & Craftsmanship)

1. **Bebas Em Dash (`—`)**: Gunakan koma, titik dua, atau tanda kurung pada teks antarmuka sesuai aturan R-02.
2. **Data & Status Nyata**: Tidak menyertakan statistik pemasaran kosong ("99.9% uptime", "Ribuan pelanggan"). Hanya tampilkan data aktual pelanggan dan tiket laporan mereka (R-17, R-36, R-38).
3. **Status UI Lengkap**: Setiap komponen yang mengambil data wajib memiliki 3 state: *Loading State* (indikator jelas), *Empty State* (pesan ramah saat belum ada tiket), dan *Error State* (pesan gagal yang memandu pengguna) (R-27).
4. **Semua Elemen Interaktif Berfungsi**: Tidak ada tombol dekoratif kosong atau tautan hantu (R-26).
