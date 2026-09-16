import { Home, Clock, PlusCircle, User, Headphones, ExternalLink } from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function Sidebar({ activeTab, setActiveTab, pelanggan }) {
  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-slate-200/90 flex-col sticky top-0 h-screen shrink-0 justify-between select-none">
      <div>
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
            A
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-brand-navy block leading-tight">
              Acehlink <span className="text-brand-blue font-extrabold">MEDIA</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
              Portal QR Pelanggan
            </span>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="p-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Menu Utama
          </p>

          <NavItem
            active={activeTab === 'beranda'}
            onClick={() => setActiveTab('beranda')}
            icon={<Home className="w-4 h-4" />}
            label="Beranda"
            description="Overview dan status layanan"
          />

          <NavItem
            active={activeTab === 'riwayat'}
            onClick={() => setActiveTab('riwayat')}
            icon={<Clock className="w-4 h-4" />}
            label="Riwayat Laporan"
            description="Pelacakan progres tiket"
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
            description="Informasi paket dan modem"
          />
        </nav>
      </div>

      {/* Area Bantuan dan Info Pelanggan */}
      <div className="p-4 space-y-3">
        <div className="bg-brand-ice border border-brand-blue/20 text-brand-navy rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-white text-brand-blue border border-brand-blue/20 flex items-center justify-center">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-brand-navy">Pusat Bantuan Acehlink</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Butuh konfirmasi darurat langsung ke tim support NOC?
          </p>
          <a
            href="https://wa.me/628116800000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Hubungi WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center font-bold text-xs shrink-0">
            {pelanggan?.nama ? pelanggan.nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-navy truncate">{pelanggan?.nama}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-slate-500 font-mono truncate">
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
    type="button"
    onClick={onClick}
    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-xs cursor-pointer group text-left focus-visible:ring-2 focus-visible:ring-brand-blue ${
      active && !highlight
        ? 'bg-brand-ice text-brand-navy font-semibold border border-brand-blue/30'
        : ''
    } ${!active && !highlight ? 'text-slate-700 hover:bg-slate-100 hover:text-brand-navy' : ''} ${
      highlight
        ? 'bg-brand-blue hover:bg-brand-blue-hover text-white shadow-xs my-1.5 font-semibold'
        : ''
    }`}
  >
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
        highlight
          ? 'bg-white/20 text-white'
          : active
          ? 'bg-brand-blue text-white'
          : 'bg-slate-100 text-slate-600 group-hover:bg-brand-ice group-hover:text-brand-blue'
      }`}
    >
      {icon}
    </div>
    <div className="overflow-hidden">
      <span className="block leading-tight font-semibold">{label}</span>
      {description && (
        <span
          className={`text-[11px] block truncate ${
            highlight ? 'text-blue-100' : 'text-slate-500'
          }`}
        >
          {description}
        </span>
      )}
    </div>
  </button>
);
