import React, { useState, useMemo } from 'react';
import { Search, Inbox, X, Plus, Filter } from 'lucide-react';
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
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-navy tracking-tight">
            Riwayat Laporan Gangguan
          </h2>
          <p className="text-xs text-slate-400 font-normal">
            Pantau status pemeriksaan dan riwayat perbaikan koneksi internet Anda
          </p>
        </div>

        {/* Filter Pills with Badge Counts - Acehlink Palette */}
        <div className="flex flex-wrap items-center gap-2">
          {['Semua', 'Menunggu', 'Diproses', 'Selesai'].map((status) => {
            const count = statusCounts[status] || 0;
            const isActive = filterStatus === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-brand-ice/40 hover:text-brand-navy hover:border-brand-blue/30'
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-ice text-brand-blue font-semibold'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Cari nomor tiket (ACL-...) atau kata kunci keluhan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs md:text-sm focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors placeholder:text-slate-400 font-normal"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Laporan Grid */}
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
          <div className="col-span-2 py-12 px-6 text-center bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-xl bg-brand-ice text-brand-blue flex items-center justify-center mb-2.5 border border-brand-blue/20">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-brand-navy">Tidak ada laporan ditemukan</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? `Tidak ada tiket laporan yang cocok dengan kata kunci "${searchQuery}".`
                : `Tidak ada laporan pengaduan pada filter status "${filterStatus}".`}
            </p>
            <button
              onClick={() => setActiveTab('lapor')}
              className="mt-4 px-4 py-2 bg-brand-navy hover:bg-brand-deep text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
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

