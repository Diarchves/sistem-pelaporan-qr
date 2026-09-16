import React from 'react';
import { Home, Clock, Plus, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 px-4 z-40 pointer-events-none">
      <nav className="pointer-events-auto max-w-sm mx-auto glass-panel border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-900/10 flex justify-around items-center py-2 px-2.5">
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

        {/* Floating Center Action Button */}
        <button
          onClick={() => setActiveTab('lapor')}
          aria-label="Buat Laporan Baru"
          className="relative -mt-5 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-md shadow-brand-blue/30 ring-4 ring-white active:scale-95 transition-transform">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-semibold text-brand-blue block text-center mt-1">
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
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors select-none cursor-pointer ${
      active ? 'text-brand-blue font-semibold' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div
      className={`p-1.5 rounded-xl transition-colors ${
        active ? 'bg-brand-ice text-brand-blue' : 'text-slate-400'
      }`}
    >
      {icon}
    </div>
    <span className="text-[10px] tracking-tight">{label}</span>
  </button>
);

