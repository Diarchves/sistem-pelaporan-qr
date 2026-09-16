import {
  Plus,
  Wifi,
  Radio,
  Clock,
  CheckCircle2,
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
      {/* Kartu Ringkasan Pelanggan & Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 flex flex-col justify-between shadow-xs">
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
                  <span className="text-xs text-slate-500">Status Langganan</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full flex items-center gap-1.5 border border-emerald-300">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                Aktif
              </span>
            </div>

            {/* Data Detail Pelanggan */}
            <div className="space-y-3 my-1">
              <div>
                <span className="text-xs text-slate-500 block font-normal">Nama Pelanggan</span>
                <span className="text-base font-bold text-brand-navy tracking-tight">
                  {session.pelanggan.nama}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block font-normal">ID Pelanggan</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs font-semibold text-brand-navy font-mono">
                      {session.pelanggan.id_string}
                    </span>
                    <CopyButton text={session.pelanggan.id_string} label="Salin" />
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block font-normal">Paket Langganan</span>
                  <span className="text-xs font-semibold text-brand-navy block mt-0.5 truncate">
                    {session.pelanggan.paket}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Laporan & Tombol Aksi */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-brand-navy text-sm tracking-tight">
                Ringkasan Laporan
              </h3>
              <span className="text-xs text-slate-500 font-normal">Terkini</span>
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

          {/* Kotak Tindakan: Buat Laporan Baru */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-brand-navy text-sm">Mengalami Kendala Jaringan?</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Kirimkan pengaduan langsung ke teknisi lapangan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('lapor')}
              className="w-full sm:w-auto min-h-[44px] shrink-0 bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs active:scale-[0.98] shadow-xs focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Buat Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bagian Laporan Terbaru */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-brand-navy text-sm tracking-tight">
              Laporan Terbaru
            </h3>
            <p className="text-xs text-slate-500">
              Daftar tiket keluhan terakhir yang Anda ajukan
            </p>
          </div>
          {session.riwayat_laporan.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('riwayat')}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-brand-navy hover:text-brand-blue flex items-center gap-1 cursor-pointer transition-colors bg-white hover:bg-slate-100 rounded-lg border border-slate-200/90 focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <span>Lihat Semua ({session.riwayat_laporan.length})</span>
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
            <div className="col-span-2 p-10 text-center text-slate-600 bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center justify-center shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-brand-navy">Tidak ada kendala aktif saat ini</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Koneksi internet Anda berjalan normal. Jika mengalami kendala kapan saja, klik tombol Buat Laporan di atas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
