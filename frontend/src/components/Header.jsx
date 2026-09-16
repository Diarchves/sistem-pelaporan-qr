import { useState } from 'react';
import { Bell, ShieldCheck, X } from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function Header({ activeTab, pelanggan }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return {
          title: 'Beranda Layanan Pelanggan',
          subtitle: 'Pusat pelaporan dan pemantauan kendala koneksi internet Anda',
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/90 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-xs">
      {/* Mobile Brand */}
      <div className="md:hidden flex items-center gap-2.5">
        <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs">
          A
        </div>
        <div>
          <span className="font-bold text-brand-navy text-sm block leading-tight tracking-tight">
            Acehlink <span className="text-brand-blue font-extrabold">MEDIA</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">Layanan QR Pelanggan</span>
        </div>
      </div>

      {/* Desktop Title & Subtitle */}
      <div className="hidden md:block">
        <h1 className="text-lg font-bold text-brand-navy tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-normal">{subtitle}</p>}
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-2.5 md:gap-4 relative">

        {/* Notification Bell Button with 44px tap target */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifikasi sistem"
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Notification Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-2xl shadow-lg p-4 z-50 animate-in fade-in duration-150">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-brand-navy">Informasi Sesi</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Tutup notifikasi"
                  className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 mt-2.5">
                <div className="p-3 bg-brand-ice border border-brand-blue/20 rounded-xl text-xs">
                  <p className="font-semibold text-brand-navy mb-0.5">Sesi Pelaporan Aktif</p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Sesi terverifikasi melalui pemindaian QR Code resmi pada router pelanggan.
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
              <span className="text-xs text-slate-500 font-mono">
                {pelanggan?.id_string}
              </span>
              <CopyButton text={pelanggan?.id_string || ''} label="Salin" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center font-bold text-xs shrink-0">
            {pelanggan?.nama ? pelanggan.nama.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
