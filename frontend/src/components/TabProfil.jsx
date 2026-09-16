import {
  Phone,
  MapPin,
  ShieldCheck,
  Headphones,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function TabProfil({ session }) {
  const { pelanggan, id_pelanggan } = session;

  return (
    <div className="max-w-xl mx-auto space-y-5 pt-1">
      {/* Header Kartu Pelanggan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-ice text-brand-navy flex items-center justify-center font-bold text-lg border border-brand-blue/20 shrink-0">
            {pelanggan.nama ? pelanggan.nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-brand-navy tracking-tight truncate">
                {pelanggan.nama}
              </h2>
              <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-mono">
                {pelanggan.id_string}
              </span>
              <CopyButton text={pelanggan.id_string} label="Salin ID" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-300 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Pelanggan Aktif Terverifikasi QR
          </span>
          <span className="text-slate-500 font-mono text-xs">ID #{id_pelanggan}</span>
        </div>
      </div>

      {/* Detail Layanan Internet */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Spesifikasi Layanan
          </h3>
          <span className="text-xs font-semibold text-brand-blue bg-brand-ice px-2.5 py-1 rounded-md border border-brand-blue/20">
            Fiber Optic
          </span>
        </div>

        <div className="flex items-start gap-3.5 py-1 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-500 block font-normal">Paket Langganan</span>
            <span className="text-sm font-bold text-brand-navy mt-0.5 block">
              {pelanggan.paket}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 py-1 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-500 block font-normal">Nomor Telepon / Kontak</span>
            <span className="text-sm font-semibold text-brand-navy mt-0.5 block">
              {pelanggan.no_telepon || '-'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 py-1">
          <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-500 block font-normal">Alamat Pemasangan</span>
            <p className="text-xs font-normal text-slate-700 leading-relaxed mt-0.5">
              {pelanggan.alamat || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Pusat Bantuan dan Kontak WhatsApp */}
      <div className="bg-brand-ice border border-brand-blue/20 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-navy text-xs md:text-sm">Bantuan Call Center</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Konsultasi status sambungan dan kendala administrasi
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/628116800000"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] shrink-0 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <span>Chat WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
