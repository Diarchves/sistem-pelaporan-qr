import { useState, useMemo } from 'react';
import { Search, Inbox, X, Plus } from 'lucide-react';
import { LaporanCard } from './ui/Common';

export default function TabRiwayat({ session, setActiveTab, setSelectedLaporan }) {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const statusCounts = useMemo(() => {
    const list = session.riwayat_laporan || [];
    return {
      Semua: list.length,
      Menunggu: list.filter((l) => l.status === 'Menunggu').length,
      Diproses: list.filter((l) => l.status === 'Diproses').length,
      Selesai: list.filter((l) => l.status === 'Selesai').length,
    };
  }, [session.riwayat_laporan]);

  const filteredLaporan = useMemo(() => {
    return (session.riwayat_laporan || []).filter((lap) => {
      const matchesStatus = filterStatus === 'Semua' || lap.status === filterStatus;
      const matchesSearch =
        !searchQuery ||
        lap.no_tiket.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lap.gangguan && lap.gangguan.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [session.riwayat_laporan, filterStatus, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Riwayat & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-navy tracking-tight">
            Riwayat Laporan Gangguan
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Pantau status pemeriksaan dan riwayat perbaikan koneksi internet Anda
          </p>
        </div>

        {/* Filter Status dengan tap target >= 44px */}
        <div className="flex flex-wrap items-center gap-2">
          {['Semua', 'Menunggu', 'Diproses', 'Selesai'].map((status) => {
            const count = statusCounts[status] || 0;
            const isActive = filterStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-blue ${
                  isActive
                    ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-brand-blue'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 font-semibold'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pencarian Tiket */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Cari nomor tiket (ACL-...) atau kata kunci keluhan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-colors placeholder:text-slate-400 text-slate-800"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Bersihkan pencarian"
            className="w-10 h-10 absolute right-1.5 top-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid Kartu Laporan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLaporan.map((lap) => (
          <LaporanCard
            key={lap.no_tiket}
            lap={lap}
            onClick={() => {
              setSelectedLaporan(lap);
              setActiveTab('detail');
            }}
          />
        ))}

        {filteredLaporan.length === 0 && (
          <div className="col-span-2 py-12 px-6 text-center bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center justify-center shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-brand-ice text-brand-blue flex items-center justify-center mb-3 border border-brand-blue/20">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-brand-navy">Tidak ada laporan ditemukan</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {searchQuery
                ? `Tidak ada tiket laporan yang cocok dengan kata kunci "${searchQuery}".`
                : `Tidak ada tiket keluhan pada kategori filter "${filterStatus}".`}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('lapor')}
              className="mt-4 min-h-[44px] px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Laporan Baru</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
