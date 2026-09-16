import React from 'react';
import {
  Plus,
  ChevronRight,
  Wifi,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { StatCard, LaporanCard, CopyButton } from './ui/Common';

export default function TabBeranda({ session, setActiveTab, setSelectedLaporan }) {
  const laporanSelesai = session.riwayat_laporan.filter((l) => l.status === 'Selesai').length;
  const laporanMenunggu = session.riwayat_laporan.filter((l) => l.status === 'Menunggu').length;
  const laporanDiproses = session.riwayat_laporan.filter((l) => l.status === 'Diproses').length;
  const totalLaporan = session.riwayat_laporan.length;

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* Top Banner / Pelanggan & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Modern Minimalist Subscriber Info Card - Acehlink Palette */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-ice text-brand-blue flex items-center justify-center border border-brand-blue/20">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-navy block leading-tight">
                    Layanan Pelanggan
                  </span>
                  <span className="text-[10px] text-slate-400">Status Langganan</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-full flex items-center gap-1.5 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Aktif
              </span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 my-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-normal">Nama Pelanggan</span>
                <span className="text-base font-bold text-brand-navy tracking-tight">
                  {session.pelanggan.nama}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">ID Pelanggan</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-brand-navy font-mono">
                      {session.pelanggan.id_string}
                    </span>
                    <CopyButton text={session.pelanggan.id_string} label="Salin" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-normal">Paket Langganan</span>
                  <span className="text-xs font-semibold text-brand-navy block mt-0.5 truncate">
                    {session.pelanggan.paket}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 block font-normal">Alamat Pemasangan</span>
                <p className="text-xs text-slate-600 font-normal leading-relaxed mt-0.5 line-clamp-2">
                  {session.pelanggan.alamat || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-500 font-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" /> Terverifikasi QR
            </span>
            <button
              onClick={() => setActiveTab('profil')}
              className="text-brand-blue hover:text-brand-navy font-medium flex items-center gap-0.5 cursor-pointer transition-colors"
            >
              Detail Profil <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ringkasan Laporan & Action Button */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-brand-navy text-sm tracking-tight">
                Ringkasan Laporan
              </h3>
              <span className="text-xs text-slate-400 font-normal">Terkini</span>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-3.5">
              <StatCard count={totalLaporan} label="Total" variant="info" icon={FileText} />
              <StatCard
                count={laporanMenunggu + laporanDiproses}
                label="Diproses"
                variant="warning"
                icon={Clock}
              />
              <StatCard
                count={laporanSelesai}
                label="Selesai"
                variant="success"
                icon={CheckCircle2}
              />
            </div>
          </div>

          {/* Action Card: Buat Laporan Baru */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-brand-navy text-xs md:text-sm">Kendala Jaringan?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kirimkan pengaduan langsung ke teknisi lapangan.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('lapor')}
              className="w-full sm:w-auto shrink-0 bg-brand-navy hover:bg-brand-deep text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Laporan Terbaru Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-brand-navy text-sm tracking-tight">
              Laporan Terbaru
            </h3>
            <p className="text-xs text-slate-400">
              Daftar tiket keluhan terakhir yang Anda ajukan
            </p>
          </div>
          {session.riwayat_laporan.length > 0 && (
            <button
              onClick={() => setActiveTab('riwayat')}
              className="text-xs font-medium text-brand-navy hover:text-brand-blue flex items-center gap-0.5 cursor-pointer transition-colors bg-white hover:bg-brand-ice/50 px-2.5 py-1 rounded-lg border border-slate-200/80"
            >
              Lihat Semua ({session.riwayat_laporan.length}) <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {session.riwayat_laporan.slice(0, 2).map((lap) => (
            <LaporanCard
              key={lap.no_tiket}
              lap={lap}
              onClick={() => {
                setSelectedLaporan(lap);
                setActiveTab('detail');
              }}
            />
          ))}

          {session.riwayat_laporan.length === 0 && (
            <div className="col-span-2 p-10 text-center text-slate-500 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-brand-navy">Tidak ada kendala aktif saat ini</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Koneksi internet Anda berjalan normal. Jika mengalami kendala kapan saja, klik tombol Buat Laporan di atas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

