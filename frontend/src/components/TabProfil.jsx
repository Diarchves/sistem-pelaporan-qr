import React from 'react';
import {
  User,
  Wifi,
  Phone,
  MapPin,
  QrCode,
  ShieldCheck,
  Headphones,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { CopyButton } from './ui/Common';

export default function TabProfil({ session }) {
  const { pelanggan, token, id_pelanggan } = session;

  return (
    <div className="max-w-xl mx-auto space-y-5 pt-1">
      {/* Digital Pass Card Header - Modern Minimalist */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
              <span className="text-xs text-slate-400 font-mono">
                {pelanggan.id_string}
              </span>
              <CopyButton text={pelanggan.id_string} label="Salin ID" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded-full border border-emerald-200/60 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pelanggan Aktif Terverifikasi QR
          </span>
          <span className="text-slate-400 font-mono text-[11px]">ID #{id_pelanggan}</span>
        </div>
      </div>

      {/* Detail Layanan Internet */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Spesifikasi Layanan
          </h3>
          <span className="text-[11px] font-semibold text-brand-blue bg-brand-ice px-2.5 py-0.5 rounded-md border border-brand-blue/20">
            Fiber Optic
          </span>
        </div>

        <div className="flex items-start gap-3.5 py-1 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-ice text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 block font-normal">Paket Langganan</span>
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
            <span className="text-xs text-slate-400 block font-normal">Nomor Telepon / Kontak</span>
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
            <span className="text-xs text-slate-400 block font-normal">Alamat Pemasangan</span>
            <p className="text-xs font-normal text-slate-600 leading-relaxed mt-0.5">
              {pelanggan.alamat || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* QR Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-brand-blue" />
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Token Keamanan QR Code
          </h3>
        </div>

        <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
          <span className="text-slate-500 font-normal">Nomor Registrasi Sistem</span>
          <span className="font-mono font-medium text-brand-navy">CLIENT-{id_pelanggan}</span>
        </div>

        <div className="flex justify-between items-center text-xs py-1">
          <span className="text-slate-500 font-normal">Token Akses Sesi</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-brand-blue font-medium truncate max-w-[150px]">
              {token}
            </span>
            <CopyButton text={token} label="Salin" />
          </div>
        </div>
      </div>

      {/* Call Center Support Box - Minimalist with Acehlink Palette */}
      <div className="bg-brand-ice/80 border border-brand-blue/20 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-brand-blue border border-brand-blue/20 flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-brand-navy">Bantuan Layanan Acehlink</p>
            <p className="text-slate-500 mt-0.5">
              Call Center: <strong className="font-mono text-brand-navy">0800-1-234-567</strong>
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/628001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-brand-navy hover:bg-brand-deep text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <span>Chat WA</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
