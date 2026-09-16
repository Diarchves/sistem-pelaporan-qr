import React, { useState } from 'react';
import { Bell, Wifi, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function Header({ activeTab, pelanggan }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return {
          title: 'Dashboard Pelanggan',
          subtitle: 'Selamat datang di portal layanan mandiri Acehlink MEDIA',
        };
      case 'riwayat':
        return {
          title: 'Riwayat Pelaporan',
          subtitle: 'Pantau status penanganan tiket keluhan jaringan Anda',
        };
      case 'lapor':
        return {
          title: 'Formulir Laporan Gangguan',
          subtitle: 'Kirimkan kendala teknis secara langsung ke teknisi lapangan',
        };
      case 'profil':
        return {
          title: 'Profil Layanan Pelanggan',
          subtitle: 'Detail data langganan dan spesifikasi modem terpasang',
        };
      case 'detail':
        return {
          title: 'Pelacakan Status Tiket',
          subtitle: 'Progres tindakan teknisi dan riwayat penanganan',
        };
      default:
        return { title: 'Portal Layanan Acehlink', subtitle: '' };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="glass-panel border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
      {/* Mobile Brand */}
      <div className="md:hidden flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-navy rounded-xl flex items-center justify-center text-brand-cyan font-bold text-sm shadow-xs">
          A
        </div>
        <div>
          <span className="font-bold text-brand-navy text-sm block leading-tight tracking-tight">
            Acehlink <span className="text-brand-blue font-extrabold">MEDIA</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Layanan QR Pelanggan</span>
        </div>
      </div>

      {/* Desktop Title & Subtitle */}
      <div className="hidden md:block">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-brand-navy tracking-tight">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Koneksi Terhubung
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 font-normal">{subtitle}</p>}
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-2.5 md:gap-4 relative">
        {/* Network status pill for mobile */}
        <div className="md:hidden flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Online</span>
        </div>

        {/* Notification Bell Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifikasi"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-brand-ice text-slate-600 hover:text-brand-blue flex items-center justify-center transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-brand-navy">Pemberitahuan Sistem</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 mt-2.5">
                <div className="p-3 bg-brand-ice/70 border border-brand-blue/20 rounded-xl text-xs">
                  <p className="font-semibold text-brand-navy mb-0.5">Sistem Pelaporan Aktif</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Sesi Anda telah terotentikasi via QR Code resmi Acehlink Media.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <p className="font-semibold text-slate-800 mb-0.5">Layanan Pemeliharaan Jaringan</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Pemeriksaan rutin ODP berlangsung terjadwal setiap awal pekan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Badge on Desktop */}
        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-semibold text-brand-navy block leading-tight">
                {pelanggan?.nama}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="text-[11px] text-slate-400 font-mono">
                {pelanggan?.id_string}
              </span>
              <CopyButton text={pelanggan?.id_string || ''} label="Salin" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center font-bold text-xs shrink-0">
            {pelanggan?.nama ? pelanggan.nama.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}

