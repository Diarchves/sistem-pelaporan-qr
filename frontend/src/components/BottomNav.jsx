import { Home, Clock, Plus, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 px-4 z-40 pointer-events-none">
      <nav
        aria-label="Navigasi Bawah"
        className="pointer-events-auto max-w-sm mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-md flex justify-around items-center py-1 px-2"
      >
        <BottomNavItem
          active={activeTab === 'beranda'}
          onClick={() => setActiveTab('beranda')}
          icon={<Home className="w-5 h-5" />}
          label="Beranda"
        />

        <BottomNavItem
          active={activeTab === 'riwayat'}
          onClick={() => setActiveTab('riwayat')}
          icon={<Clock className="w-5 h-5" />}
          label="Riwayat"
        />

        <button
          type="button"
          onClick={() => setActiveTab('lapor')}
          aria-label="Buat Laporan Gangguan Baru"
          className="relative -mt-5 group cursor-pointer focus-visible:outline-hidden"
        >
          <div className="w-13 h-13 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white flex items-center justify-center shadow-md ring-4 ring-white active:scale-95 transition-transform focus-visible:ring-brand-blue">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-brand-blue block text-center mt-1">
            Lapor
          </span>
        </button>

        <BottomNavItem
          active={activeTab === 'profil'}
          onClick={() => setActiveTab('profil')}
          icon={<User className="w-5 h-5" />}
          label="Profil"
        />
      </nav>
    </div>
  );
}

const BottomNavItem = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[48px] min-w-[54px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue ${
      active ? 'text-brand-blue font-bold' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    <div
      className={`p-1 rounded-lg transition-colors ${
        active ? 'bg-brand-ice text-brand-blue' : 'text-slate-500'
      }`}
    >
      {icon}
    </div>
    <span className="text-[11px] tracking-tight">{label}</span>
  </button>
);
