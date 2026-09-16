import React, { useState } from 'react';
import {
  Clock,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  X,
  AlertCircle,
  Activity,
} from 'lucide-react';

export const formatDate = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\./g, ':');
};

export const formatRelativeTime = (isoString) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);

  if (diffSec < 60) return 'Baru saja';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(isoString);
};

export const CopyButton = ({ text, label = 'Salin' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Tersalin!' : label}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${copied
          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 active:scale-95'
        }`}
    >
      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
      <span>{copied ? 'Tersalin' : label}</span>
    </button>
  );
};

export const StatCard = ({ count, label, variant = 'default', icon: Icon }) => {
  const styles = {
    default: {
      text: 'text-brand-navy',
      bg: 'bg-white',
      border: 'border-slate-200/80 hover:border-brand-blue/30',
      iconBg: 'bg-brand-ice text-brand-navy',
    },
    warning: {
      text: 'text-amber-700',
      bg: 'bg-white',
      border: 'border-slate-200/80 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    success: {
      text: 'text-emerald-700',
      bg: 'bg-white',
      border: 'border-slate-200/80 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    info: {
      text: 'text-brand-blue',
      bg: 'bg-white',
      border: 'border-slate-200/80 hover:border-brand-blue/40',
      iconBg: 'bg-brand-ice text-brand-blue',
    },
  }[variant] || styles.default;

  return (
    <div
      className={`${styles.bg} ${styles.border} transition-all duration-200 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] border`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs md:text-sm text-slate-500 font-medium">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <span className={`text-3xl md:text-4xl font-extrabold ${styles.text} tracking-tight`}>
          {count}
        </span>
        <span className="text-[11px] font-medium text-slate-400">Tiket</span>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  let badgeStyle = {
    container: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
    pulse: false,
  };

  if (status === 'Selesai') {
    badgeStyle = {
      container: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
      dot: 'bg-emerald-500',
      pulse: false,
    };
  } else if (status === 'Diproses') {
    badgeStyle = {
      container: 'bg-brand-ice text-brand-blue border-brand-blue/30',
      dot: 'bg-brand-blue',
      pulse: true,
    };
  } else if (status === 'Menunggu') {
    badgeStyle = {
      container: 'bg-amber-50 text-amber-700 border-amber-200/70',
      dot: 'bg-amber-500',
      pulse: true,
    };
  }

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5 transition-all ${badgeStyle.container}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {badgeStyle.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeStyle.dot} opacity-75`}
          ></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${badgeStyle.dot}`}></span>
      </span>
      {status}
    </span>
  );
};

export const LedIndicator = ({ color, status, size = 'md' }) => {
  const isRed = color === 'Merah';
  const isGreen = color === 'Hijau';
  const isOff = color === 'Tidak Menyala' || status === 'Mati Total';
  const isBlink = status === 'Berkedip';

  let colorClass = 'bg-slate-400 border-slate-300';
  let glowClass = '';

  if (isRed) {
    colorClass = 'bg-red-500 border-red-400 text-red-500';
    glowClass = 'shadow-[0_0_10px_rgba(239,68,68,0.9)]';
  } else if (isGreen) {
    colorClass = 'bg-emerald-500 border-emerald-400 text-emerald-500';
    glowClass = 'shadow-[0_0_10px_rgba(16,185,129,0.9)]';
  } else if (isOff) {
    colorClass = 'bg-slate-300 border-slate-400 text-slate-300';
    glowClass = '';
  } else {
    colorClass = 'bg-amber-500 border-amber-400 text-amber-500';
    glowClass = 'shadow-[0_0_10px_rgba(245,158,11,0.9)]';
  }

  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-block rounded-full border-2 ${sizeClass} ${colorClass} ${glowClass} ${
          isBlink ? 'animate-led-blink' : ''
        }`}
      />
      <span className="text-xs font-medium text-slate-700">
        {color} {status && `(${status})`}
      </span>
    </div>
  );
};

export const LaporanCard = ({ lap, onClick }) => (
  <div
    className="group bg-white border border-slate-200/80 hover:border-brand-blue/50 hover:shadow-[0_2px_8px_rgba(0,132,255,0.08)] transition-all duration-200 rounded-2xl p-5 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    onClick={onClick}
  >
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-navy via-brand-deep to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
    <div>
      <div className="flex justify-between items-start mb-3 gap-2">
        <span className="font-bold text-brand-navy text-sm tracking-tight font-mono group-hover:text-brand-blue transition-colors">
          {lap.no_tiket}
        </span>
        <StatusBadge status={lap.status} />
      </div>

      <p className="text-sm text-slate-700 mb-3.5 line-clamp-2 leading-relaxed font-normal">
        {lap.gangguan}
      </p>

      {lap.warna_lampu && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 mb-3">
          <LedIndicator color={lap.warna_lampu} status={lap.status_lampu} size="sm" />
        </div>
      )}
    </div>

    <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-100">
      <span className="flex items-center gap-1.5 font-normal">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{formatRelativeTime(lap.waktu_laporan)}</span>
      </span>
      <span className="font-semibold text-brand-blue flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
        Periksa <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </div>
);

export const SectionBox = ({ title, subtitle, prefix, children }) => (
  <div className="bg-white border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-2xl p-5 md:p-6 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-xl bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center text-xs font-bold shrink-0">
        {prefix}
      </span>
      <div>
        <h3 className="font-bold text-brand-navy text-sm md:text-base leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

export const Pill = ({ active, label, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-2 text-xs md:text-sm font-medium rounded-xl border transition-colors flex items-center gap-2 select-none cursor-pointer ${
      active
        ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
        : 'bg-white text-slate-700 border-slate-200/80 hover:bg-brand-ice/40 hover:text-brand-navy hover:border-brand-blue/30'
    }`}
  >
    {active ? <CheckCircle2 className="w-4 h-4 text-brand-cyan" /> : Icon && <Icon className="w-4 h-4 text-slate-400" />}
    {label}
  </button>
);

export const TimelineItem = ({ active, title, desc, date, isDone, isLast }) => (
  <div className="relative z-10 flex gap-4">
    <div
      className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
        isDone
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : active
          ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
          : 'bg-white border-slate-200 text-slate-400'
      }`}
    >
      {isDone ? <CheckCircle2 className="w-4 h-4" /> : active ? <Activity className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
    </div>
    <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-semibold ${active || isDone ? 'text-brand-navy' : 'text-slate-400'}`}>
          {title}
        </p>
        {active && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-ice text-brand-blue">
            Sedang Berlangsung
          </span>
        )}
      </div>
      {date && <p className="text-xs text-slate-400 mt-0.5 font-normal">{date}</p>}
      {desc && (
        <div className="mt-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 inline-block font-normal leading-relaxed">
          {desc}
        </div>
      )}
    </div>
  </div>
);

export const LightboxModal = ({ src, alt, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-3 bg-slate-900/90 border-b border-white/10 text-white">
          <span className="text-xs font-medium text-slate-300">{alt || 'Bukti Foto Modem'}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 flex items-center justify-center overflow-auto">
          <img src={src} alt={alt} className="max-h-[80vh] w-auto object-contain rounded-xl" />
        </div>
      </div>
    </div>
  );
};

