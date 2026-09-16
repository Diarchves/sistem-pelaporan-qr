import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Camera,
  MessageSquare,
  ZoomIn,
  ExternalLink,
} from 'lucide-react';
import {
  formatDate,
  formatRelativeTime,
  StatusBadge,
  TimelineItem,
  CopyButton,
  LedIndicator,
  LightboxModal,
} from './ui/Common';
import { API_BASE } from '../services/api';

export default function DetailLaporan({ selectedLaporan, setActiveTab }) {
  const [showLightbox, setShowLightbox] = useState(false);

  if (!selectedLaporan) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <p className="text-sm font-semibold text-brand-navy">Laporan belum dipilih</p>
        <button
          onClick={() => setActiveTab('riwayat')}
          className="mt-3 px-4 py-2 bg-brand-navy hover:bg-brand-deep text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
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
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('riwayat')}
            className="w-9 h-9 border border-slate-200/80 rounded-xl flex items-center justify-center text-brand-navy hover:bg-brand-ice bg-white transition-colors cursor-pointer"
            title="Kembali ke Riwayat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-brand-navy tracking-tight">
              Detail Tiket Pelaporan
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-brand-blue font-mono font-medium">{no_tiket}</span>
              <CopyButton text={no_tiket} label="Salin Tiket" />
            </div>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Main Status & Interactive Timeline Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div>
            <span className="text-xs text-slate-400 font-normal">Nomor Registrasi Tiket</span>
            <p className="text-base font-bold text-brand-navy font-mono tracking-tight mt-0.5">
              {no_tiket}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 w-fit">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Diajukan {formatRelativeTime(waktu_laporan)}</span>
          </div>
        </div>

        {/* Stepper Timeline */}
        <h4 className="font-semibold text-brand-navy text-sm mb-4">
          Progres & Tahapan Penanganan
        </h4>

        <div className="relative pl-3 space-y-5 before:absolute before:inset-0 before:left-[17px] before:h-full before:w-px before:bg-slate-200">
          <TimelineItem
            active
            isDone
            title="Laporan Masuk & Terverifikasi"
            desc="Laporan gangguan berhasil masuk ke antrean teknisi NOC Acehlink Media."
            date={formatDate(waktu_laporan)}
          />
          <TimelineItem
            active={isDiproses && !isSelesai}
            isDone={isSelesai}
            title="Penanganan oleh Teknisi"
            desc={
              status === 'Diproses'
                ? 'Teknisi lapangan sedang melakukan analisa sinyal redaman kabel fiber / menuju titik ODP Anda.'
                : isSelesai
                  ? 'Pemeriksaan dan perbaikan telah tuntas dilakukan.'
                  : 'Menunggu penugasan teknisi terdekat.'
            }
          />
          <TimelineItem
            active={isSelesai}
            isDone={isSelesai}
            isLast
            title="Tiket Selesai"
            desc={
              isSelesai
                ? 'Jaringan internet telah pulih normal kembali. Terima kasih atas laporan Anda.'
                : 'Menunggu konfirmasi verifikasi dari tim teknisi dan pelanggan.'
            }
          />
        </div>
      </div>

      {/* Modem Photo Card (If available) */}
      {photoUrl && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-brand-navy text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-brand-blue" />
              <span>Bukti Foto Kondisi Modem</span>
            </h4>
            <span className="text-[11px] text-slate-400">Klik untuk memperbesar</span>
          </div>

          <div
            onClick={() => setShowLightbox(true)}
            className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 relative group cursor-pointer"
          >
            <img
              src={photoUrl}
              alt="Foto Modem"
              className="w-full h-auto object-contain max-h-72 rounded-xl group-hover:scale-[1.01] transition-transform"
            />
            <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5 backdrop-blur-[1px]">
              <ZoomIn className="w-4 h-4" />
              <span>Perbesar Foto</span>
            </div>
          </div>
        </div>
      )}

      {/* Kondisi Lampu Indikator */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <h4 className="font-semibold text-brand-navy text-sm mb-3">Indikator Lampu Perangkat</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block font-normal">Warna Lampu</span>
            <div className="mt-1.5">
              <LedIndicator color={warna_lampu} status={status_lampu} size="md" />
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block font-normal">Status Kedipan</span>
            <span className="text-sm font-semibold text-brand-navy block mt-1.5 font-mono">
              {status_lampu || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Deskripsi Gangguan */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <h4 className="font-semibold text-brand-navy text-sm mb-2.5">Deskripsi Keluhan Pelanggan</h4>
        <div className="text-xs md:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 font-normal">
          {gangguan || '-'}
        </div>
      </div>

      {/* Detail Waktu & Lokasi */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex justify-between items-start text-xs border-b border-slate-100 pb-2.5">
          <span className="text-slate-500 flex items-center gap-1.5 font-normal">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Waktu Awal Kendala
          </span>
          <span className="font-medium text-brand-navy">{formatDate(waktu_kejadian)}</span>
        </div>
        <div className="flex justify-between items-start text-xs">
          <span className="text-slate-500 flex items-center gap-1.5 font-normal">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Posisi Perangkat
          </span>
          <span className="font-medium text-brand-navy text-right max-w-[240px]">
            {lokasi || '-'}
          </span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer select-none text-xs md:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat</span>
        </button>

        <a
          href={`https://wa.me/628001234567?text=${encodeURIComponent(
            `Halo Admin Acehlink MEDIA, saya ingin menanyakan progres tiket laporan saya dengan nomor ${no_tiket}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer select-none text-xs md:text-sm shadow-xs"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Tanyakan Tiket via WhatsApp</span>
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>

      {/* Lightbox Modal */}
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
