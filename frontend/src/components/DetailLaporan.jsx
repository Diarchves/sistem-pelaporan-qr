import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  MessageSquare,
  ZoomIn,
} from 'lucide-react';
import {
  StatusBadge,
  TimelineItem,
  CopyButton,
  LedIndicator,
  LightboxModal,
} from './ui/Common';
import { formatDate, formatRelativeTime } from '../services/formatters';
import { API_BASE } from '../services/api';

export default function DetailLaporan({ selectedLaporan, setActiveTab }) {
  const [showLightbox, setShowLightbox] = useState(false);

  if (!selectedLaporan) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <p className="text-sm font-semibold text-brand-navy">Laporan belum dipilih</p>
        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className="mt-3 min-h-[44px] px-5 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const {
    no_tiket,
    status,
    waktu_laporan,
    foto_modem,
    warna_lampu,
    status_lampu,
    gangguan,
    waktu_kejadian,
    lokasi,
  } = selectedLaporan;

  const isDiproses = status === 'Diproses' || status === 'Selesai';
  const isSelesai = status === 'Selesai';

  const photoUrl = foto_modem ? `${API_BASE}${foto_modem}` : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header Detail */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('riwayat')}
            className="w-11 h-11 border border-slate-200/90 rounded-xl flex items-center justify-center text-brand-navy hover:bg-slate-100 bg-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue"
            title="Kembali ke Riwayat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-brand-navy tracking-tight">
              Detail Tiket Pelaporan
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-brand-blue font-mono font-semibold">{no_tiket}</span>
              <CopyButton text={no_tiket} label="Salin Tiket" />
            </div>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Kartu Status & Garis Waktu Penanganan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div>
            <span className="text-xs text-slate-500 font-normal">Nomor Registrasi Tiket</span>
            <p className="text-base font-bold text-brand-navy font-mono tracking-tight mt-0.5">
              {no_tiket}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Diajukan {formatRelativeTime(waktu_laporan)}</span>
          </div>
        </div>

        {/* Tahapan Penanganan */}
        <h4 className="font-bold text-brand-navy text-sm mb-4">
          Progres & Tahapan Penanganan
        </h4>

        <div className="relative pl-3 space-y-5 before:absolute before:inset-0 before:left-[17px] before:h-full before:w-px before:bg-slate-200">
          <TimelineItem
            active
            isDone
            title="Laporan Masuk & Terverifikasi"
            desc="Laporan gangguan berhasil diverifikasi dan diteruskan ke antrean teknisi lapangan Acehlink."
            date={formatDate(waktu_laporan)}
          />
          <TimelineItem
            active={isDiproses && !isSelesai}
            isDone={isSelesai}
            title="Penanganan oleh Teknisi"
            desc={
              status === 'Diproses'
                ? 'Teknisi lapangan sedang memeriksa sinyal redaman fiber atau menuju titik ODP pelanggan.'
                : isSelesai
                  ? 'Pemeriksaan dan perbaikan jaringan telah tuntas diselesaikan.'
                  : 'Menunggu alokasi teknisi lapangan.'
            }
            date={status === 'Diproses' ? 'Sedang berlangsung' : isSelesai ? 'Selesai' : null}
          />
          <TimelineItem
            active={false}
            isDone={isSelesai}
            title="Penyelesaian & Verifikasi Koneksi"
            desc={
              isSelesai
                ? 'Layanan internet telah aktif normal kembali.'
                : 'Menunggu konfirmasi pemulihan koneksi.'
            }
            isLast
          />
        </div>
      </div>

      {/* Informasi Masalah & Kondisi Modem */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <h4 className="font-bold text-brand-navy text-sm pb-2.5 border-b border-slate-100">
          Informasi Gangguan yang Dilaporkan
        </h4>

        <div className="space-y-3.5 text-xs">
          <div>
            <span className="text-slate-500 font-normal block mb-1">Deskripsi Keluhan:</span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-normal">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p>{gangguan}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div>
              <span className="text-slate-500 font-normal block mb-1">Status Lampu Modem:</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <LedIndicator color={warna_lampu} status={status_lampu} />
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-normal block mb-1">Waktu Mulai Gangguan:</span>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                {waktu_kejadian ? formatDate(waktu_kejadian) : '-'}
              </div>
            </div>
          </div>

          {lokasi && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-normal block mb-1">Posisi Router / Modem:</span>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{lokasi}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bukti Foto Modem */}
      {photoUrl && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
          <h4 className="font-bold text-brand-navy text-sm mb-3">Foto Kondisi Fisik Modem</h4>
          <div
            onClick={() => setShowLightbox(true)}
            className="relative rounded-xl overflow-hidden border border-slate-200 group cursor-pointer max-w-sm"
          >
            <img
              src={photoUrl}
              alt="Bukti Lampu Modem"
              className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
              <ZoomIn className="w-4 h-4" />
              <span>Perbesar Foto</span>
            </div>
          </div>
        </div>
      )}

      {showLightbox && photoUrl && (
        <LightboxModal
          src={photoUrl}
          alt={`Foto Modem Tiket ${no_tiket}`}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </div>
  );
}
