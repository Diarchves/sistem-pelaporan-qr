import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Send,
  RefreshCw,
  AlertCircle,
  Bell,
  Trash2,
  Zap,
} from 'lucide-react';
import { SectionBox, Pill, LightboxModal } from './ui/Common';
import { submitLaporan } from '../services/api';

export default function TabLapor({ session, setActiveTab, onLaporanSuccess }) {
  const [fotos, setFotos] = useState([]);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [warnaLampu, setWarnaLampu] = useState('Merah');
  const [statusLampu, setStatusLampu] = useState('Berkedip');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [waktu, setWaktu] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [lokasi, setLokasi] = useState(session?.pelanggan?.alamat || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const quickIssues = [
    { label: 'Lampu LOS Merah Berkedip', warna: 'Merah', status: 'Berkedip', text: 'Lampu indikator LOS berkedip merah dan internet putus total tidak bisa browsing.' },
    { label: 'Internet Mati Total', warna: 'Merah', status: 'Menyala Tetap', text: 'Semua koneksi internet terputus, perangkat HP dan Laptop tidak mendapat akses data.' },
    { label: 'Koneksi Lambat & Lag', warna: 'Hijau', status: 'Menyala Tetap', text: 'Sinyal terhubung namun kecepatan internet sangat lambat dan sering RTO saat digunakan.' },
    { label: 'Modem Mati / Padam', warna: 'Tidak Menyala', status: 'Mati Total', text: 'Perangkat router/modem padam total dan tidak ada lampu indikator yang menyala.' },
  ];

  // Bersihkan blob URL saat komponen di-unmount
  useEffect(() => {
    return () => {
      fotos.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [fotos]);

  const handleApplyPreset = (item) => {
    setWarnaLampu(item.warna);
    setStatusLampu(item.status);
    setDeskripsi(item.text);
  };

  const handleFotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    if (fotos.length + selectedFiles.length > 5) {
      setErrorMessage('Maksimal 5 foto bukti modem yang dapat diunggah.');
      e.target.value = '';
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Ukuran berkas "${file.name}" melebihi batas maksimal 5 MB.`);
        e.target.value = '';
        return;
      }
    }

    setErrorMessage('');
    const newItems = selectedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFotos((prev) => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveFoto = (idToRemove) => {
    setFotos((prev) => {
      const target = prev.find((item) => item.id === idToRemove);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  const setWaktuSekarang = () => {
    const now = new Date();
    setTanggal(now.toISOString().split('T')[0]);
    setWaktu(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!warnaLampu || !statusLampu) {
      setErrorMessage('Harap tentukan indikator warna dan status lampu modem.');
      return;
    }

    if (deskripsi.trim().length < 10) {
      setErrorMessage('Deskripsi kendala minimal 10 karakter.');
      return;
    }

    if (fotos.length === 0) {
      setErrorMessage('Foto bukti kondisi lampu modem wajib diunggah (minimal 1 foto).');
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('id_pelanggan', session.id_pelanggan);
    fd.append('token', session.token);
    fd.append('gangguan', deskripsi.trim());
    fd.append('warna_lampu', warnaLampu);
    fd.append('status_lampu', statusLampu);
    fd.append('lokasi', lokasi.trim());

    const datetimeStr = `${tanggal}T${waktu}:00Z`;
    fd.append('waktu_kejadian', datetimeStr);

    fotos.forEach((item) => {
      fd.append('foto_modem', item.file);
    });

    try {
      const result = await submitLaporan(fd);
      onLaporanSuccess(result.no_tiket || 'Laporan');
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mengirimkan laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('beranda')}
          className="w-11 h-11 border border-slate-200/90 rounded-xl flex items-center justify-center text-brand-navy hover:bg-slate-100 bg-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-brand-navy tracking-tight">
            Formulir Pelaporan Gangguan
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Layanan pengaduan langsung pelanggan Acehlink Media
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Kolom Formulir Utama */}
        <div className="lg:col-span-2 space-y-5">
          {/* Preset Gejala Gangguan */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Zap className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold text-brand-navy">Pilih Cepat Gejala Gangguan:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickIssues.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(item)}
                  className="min-h-[38px] px-3 py-2 bg-slate-100 hover:bg-brand-ice text-slate-700 hover:text-brand-navy border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form id="lapor-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Bagian 1: Kondisi Lampu Indikator */}
            <SectionBox
              title="Kondisi Lampu Indikator Modem"
              subtitle="Pilih indikator yang sesuai dengan lampu pada router/modem Anda"
              prefix="1"
            >
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-brand-navy mb-2 block">
                    Warna Lampu Indikator <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Pill
                      active={warnaLampu === 'Merah'}
                      onClick={() => setWarnaLampu('Merah')}
                      label="Merah (LOS / Gangguan)"
                    />
                    <Pill
                      active={warnaLampu === 'Hijau'}
                      onClick={() => setWarnaLampu('Hijau')}
                      label="Hijau Normal"
                    />
                    <Pill
                      active={warnaLampu === 'Tidak Menyala'}
                      onClick={() => setWarnaLampu('Tidak Menyala')}
                      label="Tidak Menyala / Padam"
                    />
                    <Pill
                      active={warnaLampu === 'Lainnya'}
                      onClick={() => setWarnaLampu('Lainnya')}
                      label="Lainnya"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-navy mb-2 block">
                    Kedipan Lampu <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Pill
                      active={statusLampu === 'Berkedip'}
                      onClick={() => setStatusLampu('Berkedip')}
                      label="Berkedip Cepat / Lambat"
                    />
                    <Pill
                      active={statusLampu === 'Menyala Tetap'}
                      onClick={() => setStatusLampu('Menyala Tetap')}
                      label="Menyala Diam (Solid)"
                    />
                    <Pill
                      active={statusLampu === 'Mati Total'}
                      onClick={() => setStatusLampu('Mati Total')}
                      label="Mati Total"
                    />
                  </div>
                </div>
              </div>
            </SectionBox>

            {/* Bagian 2: Deskripsi Keluhan */}
            <SectionBox
              title="Deskripsi Detail Gangguan"
              subtitle="Ceritakan kendala yang dirasakan perangkat Anda saat mencoba terhubung"
              prefix="2"
            >
              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="Contoh: Lampu indikator LOS berkedip warna merah sejak pukul 08:00 pagi dan semua HP di rumah tidak dapat koneksi WiFi."
                  className="w-full p-3.5 border border-slate-200/90 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none resize-none leading-relaxed bg-white text-slate-900 transition-colors"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  maxLength={400}
                />
                <div className="flex justify-between items-center mt-1.5 text-xs">
                  <span
                    className={`font-semibold text-xs ${
                      deskripsi.trim().length < 10 ? 'text-amber-800' : 'text-emerald-800'
                    }`}
                  >
                    {deskripsi.trim().length < 10
                      ? `Kurang ${10 - deskripsi.trim().length} karakter lagi (min. 10)`
                      : '✓ Panjang deskripsi memadai'}
                  </span>
                  <span className="text-slate-500 font-mono text-xs">{deskripsi.length}/400</span>
                </div>
              </div>
            </SectionBox>

            {/* Bagian 3: Foto Bukti Modem */}
            <SectionBox
              title="Foto Bukti Lampu Modem (Wajib)"
              subtitle="Unggah 1 hingga 5 foto kondisi fisik atau lampu modem untuk verifikasi teknisi"
              prefix="3"
            >
              <div className="space-y-4">
                {/* Upload Dropzone / Button */}
                {fotos.length < 5 ? (
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-xl bg-slate-50 hover:bg-brand-ice transition-colors cursor-pointer flex flex-col items-center justify-center p-5 min-h-[120px] group focus-within:ring-2 focus-within:ring-brand-blue">
                    <div className="w-11 h-11 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-2.5 text-brand-navy shadow-2xs">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-brand-navy text-xs flex items-center gap-1">
                      {fotos.length === 0 ? 'Ambil Foto / Pilih Berkas' : 'Tambah Foto Lainnya'}{' '}
                      <span className="text-red-600 font-bold">*</span>
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 text-center max-w-sm">
                      Dapat memilih beberapa foto sekaligus (Maks. 5 foto, maks. 5 MB per foto)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600 font-medium">
                    Batas maksimal 5 foto telah tercapai. Hapus salah satu foto jika ingin mengganti.
                  </div>
                )}

                {/* Status Bar Jumlah Foto */}
                <div className="flex items-center justify-between text-xs px-0.5">
                  <span className="font-semibold text-slate-700">
                    Foto Terpilih: {fotos.length} dari 5 foto
                  </span>
                  <span
                    className={`font-semibold ${
                      fotos.length > 0 ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {fotos.length > 0
                      ? `✓ ${fotos.length} foto siap dikirim`
                      : 'Wajib melampirkan minimal 1 foto *'}
                  </span>
                </div>

                {/* Box Preview Grid */}
                {fotos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fotos.map((item, idx) => (
                      <div
                        key={item.id}
                        className="border border-slate-200 bg-white rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs group"
                      >
                        <div
                          onClick={() => setLightboxUrl(item.previewUrl)}
                          className="relative cursor-pointer shrink-0 rounded-lg overflow-hidden"
                          title="Perbesar foto"
                        >
                          <img
                            src={item.previewUrl}
                            alt={`Bukti modem ${idx + 1}`}
                            className="w-12 h-12 bg-slate-100 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-semibold text-brand-navy truncate"
                            title={item.file.name}
                          >
                            {item.file.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB • Foto #{idx + 1}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFoto(item.id)}
                          className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                          title={`Hapus foto ${item.file.name}`}
                          aria-label={`Hapus foto ${item.file.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 bg-slate-50">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-medium text-center shrink-0">
                      Foto
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">
                      Belum ada berkas foto yang dipilih.{' '}
                      <span className="text-amber-800 font-medium block mt-0.5">
                        Wajib menyertakan minimal 1 foto modem.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </SectionBox>

            {/* Bagian 4: Waktu & Lokasi */}
            <SectionBox
              title="Waktu Terjadinya Kendala & Posisi Router"
              subtitle="Bantu teknisi mengetahui durasi kendala dan letak fisik perangkat"
              prefix="4"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-brand-navy mb-1.5 block">Tanggal</label>
                    <input
                      type="date"
                      required
                      className="w-full min-h-[44px] p-2.5 border border-slate-200/90 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-blue outline-none bg-white text-slate-800"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-brand-navy">Waktu / Jam</label>
                      <button
                        type="button"
                        onClick={setWaktuSekarang}
                        className="text-xs font-semibold text-brand-blue hover:text-brand-navy cursor-pointer py-1"
                      >
                        Set Sekarang
                      </button>
                    </div>
                    <input
                      type="time"
                      required
                      className="w-full min-h-[44px] p-2.5 border border-slate-200/90 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-blue outline-none bg-white text-slate-800"
                      value={waktu}
                      onChange={(e) => setWaktu(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-navy mb-1.5 block">
                    Posisi / Ruangan Perangkat
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      className="w-full min-h-[44px] p-2.5 pl-9 border border-slate-200/90 rounded-xl text-xs focus:ring-2 focus:ring-brand-blue outline-none bg-white text-slate-800"
                      placeholder="Contoh: Ruang Tamu Lt. 1, Kamar Depan, dll."
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="text-slate-500">
                      Membantu teknisi saat kunjungan ke lokasi.
                    </span>
                    {session?.pelanggan?.alamat && (
                      <button
                        type="button"
                        onClick={() => setLokasi(session.pelanggan.alamat)}
                        className="font-semibold text-brand-blue hover:text-brand-navy cursor-pointer py-1"
                      >
                        Reset ke Alamat Terdaftar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SectionBox>
          </form>
        </div>

        {/* Kolom Kanan: Ringkasan Laporan & Tombol Submit */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5">
            <h4 className="font-bold text-brand-navy text-sm pb-2.5 border-b border-slate-100 flex items-center justify-between">
              <span>Ringkasan Laporan</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                DRAFT
              </span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Lampu Indikator</span>
                <span className="font-semibold text-brand-navy">
                  {warnaLampu} ({statusLampu})
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Foto Bukti</span>
                <span
                  className={`font-semibold text-xs ${
                    fotos.length > 0 ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {fotos.length > 0 ? `✓ ${fotos.length} Foto Terpilih` : 'Wajib Diunggah *'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-normal">Waktu Kejadian</span>
                <span className="font-semibold text-brand-navy">
                  {tanggal} {waktu}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-normal block mb-1">Deskripsi Ringkas:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg text-xs leading-relaxed line-clamp-3 font-normal border border-slate-100">
                  {deskripsi || 'Belum ada deskripsi yang diisi...'}
                </p>
              </div>
            </div>

            {/* Tombol Kirim Beraksen Soft Blue */}
            <button
              type="submit"
              form="lapor-form"
              disabled={isSubmitting}
              className="w-full min-h-[48px] bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs active:scale-[0.98] disabled:opacity-50 shadow-xs focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan Laporan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Gangguan</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/15 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="text-xs text-brand-navy leading-relaxed">
              <p className="font-semibold">Prioritas Penanganan</p>
              <p className="text-slate-600 mt-0.5 text-xs">
                Tiket gangguan yang disertai foto modem memudahkan teknisi menyiapkan peralatan kabel/modem pengganti sebelum ke lokasi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {lightboxUrl && (
        <LightboxModal
          src={lightboxUrl}
          alt="Preview Foto Modem"
          onClose={() => setLightboxUrl(null)}
        />
      )}
    </div>
  );
}
