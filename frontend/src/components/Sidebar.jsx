import React from 'react';
import { Home, Clock, PlusCircle, User, Headphones, ExternalLink } from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function Sidebar({ activeTab, setActiveTab, pelanggan }) {
  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-slate-200/80 flex-col sticky top-0 h-screen shrink-0 justify-between select-none">
      <div>
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-navy rounded-xl flex items-center justify-center text-brand-cyan font-bold text-base shadow-xs shrink-0">
            A
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-brand-navy block leading-tight">
              Acehlink <span className="text-brand-blue font-extrabold">MEDIA</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Portal QR Pelanggan
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Menu Utama
          </p>

          <NavItem
            active={activeTab === 'beranda'}
            onClick={() => setActiveTab('beranda')}
            icon={<Home className="w-4 h-4" />}
            label="Beranda"
            description="Overview & status layanan"
          />

          <NavItem
            active={activeTab === 'riwayat'}
            onClick={() => setActiveTab('riwayat')}
            icon={<Clock className="w-4 h-4" />}
            label="Riwayat Laporan"
            description="Tracking progres tiket"
          />

          <NavItem
            active={activeTab === 'lapor'}
            onClick={() => setActiveTab('lapor')}
            icon={<PlusCircle className="w-4 h-4" />}
            label="Buat Laporan Baru"
            description="Pengaduan gangguan cepat"
            highlight
          />

          <NavItem
            active={activeTab === 'profil'}
            onClick={() => setActiveTab('profil')}
            icon={<User className="w-4 h-4" />}
            label="Profil Pelanggan"
            description="Informasi paket & modem"
          />
        </nav>
      </div>

      {/* Bottom Help & Profile Area */}
      <div className="p-4 space-y-3">
        {/* Quick Hotline WhatsApp Box - Acehlink Palette */}
        <div className="bg-brand-ice/90 border border-brand-blue/20 text-brand-navy rounded-2xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-white text-brand-blue border border-brand-blue/20 flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-brand-navy">Call Center 24/7</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
            Butuh panduan teknisi langsung atau darurat?
          </p>
          <a
            href="https://wa.me/628001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand-navy hover:bg-brand-deep text-white text-xs font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Hubungi WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Customer Identity Capsule */}
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center font-bold text-xs shrink-0">
            {pelanggan?.nama ? pelanggan.nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-navy truncate">{pelanggan?.nama}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-slate-400 font-mono truncate">
                {pelanggan?.id_string}
              </span>
              <CopyButton text={pelanggan?.id_string || ''} label="Salin" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const NavItem = ({ icon, label, description, active, onClick, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-xs cursor-pointer group text-left ${
      active && !highlight
        ? 'bg-brand-ice text-brand-navy font-semibold border border-brand-blue/20'
        : ''
    } ${!active && !highlight ? 'text-slate-600 hover:bg-slate-50 hover:text-brand-navy' : ''} ${
      highlight
        ? 'bg-brand-blue hover:bg-[#0075e3] text-white shadow-xs my-1.5'
        : ''
    }`}
  >
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        highlight
          ? 'bg-white/20 text-white'
          : active
          ? 'bg-brand-blue text-white'
          : 'bg-slate-100 text-slate-500 group-hover:bg-brand-ice group-hover:text-brand-blue'
      }`}
    >
      {icon}
    </div>
    <div className="overflow-hidden">
      <span className="block leading-tight font-semibold">{label}</span>
      {description && (
        <span
          className={`text-[10px] block truncate ${
            highlight ? 'text-blue-100' : 'text-slate-400'
          }`}
        >
          {description}
        </span>
      )}
    </div>
  </button>
);

