import { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Copy,
  Check,
  X,
  Activity,
} from 'lucide-react';
import { formatRelativeTime } from '../../services/formatters';

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
      className={`inline-flex items-center justify-center min-h-[36px] min-w-[36px] gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
        copied
          ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-blue'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'Tersalin' : label}</span>
    </button>
  );
};

export const StatCard = ({ count, label, variant = 'default', icon: Icon }) => {
  const styles = {
    default: {
      text: 'text-brand-navy',
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-brand-blue/40',
      iconBg: 'bg-brand-ice text-brand-blue',
    },
    warning: {
      text: 'text-amber-800',
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-700',
    },
    success: {
      text: 'text-emerald-800',
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    info: {
      text: 'text-brand-blue',
      bg: 'bg-white',
      border: 'border-slate-200/90 hover:border-brand-blue/50',
      iconBg: 'bg-brand-ice text-brand-blue',
    },
  }[variant] || styles.default;

  return (
    <div
      className={`${styles.bg} ${styles.border} transition-colors duration-150 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-xs border`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs md:text-sm text-slate-600 font-medium">{label}</span>
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
        <span className="text-xs font-medium text-slate-500">Tiket</span>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  let badgeStyle = {
    container: 'bg-slate-100 text-slate-800 border-slate-300',
    dot: 'bg-slate-500',
  };

  if (status === 'Selesai') {
    badgeStyle = {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-600',
    };
  } else if (status === 'Diproses') {
    badgeStyle = {
      container: 'bg-sky-50 text-sky-800 border-sky-300',
      dot: 'bg-sky-600',
    };
  } else if (status === 'Menunggu') {
    badgeStyle = {
      container: 'bg-amber-50 text-amber-900 border-amber-300',
      dot: 'bg-amber-600',
    };
  }

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border inline-flex items-center gap-1.5 select-none ${badgeStyle.container}`}
    >
      <span className={`inline-block rounded-full h-1.5 w-1.5 ${badgeStyle.dot}`} />
      {status}
    </span>
  );
};

export const LedIndicator = ({ color, status, size = 'md' }) => {
  const isRed = color === 'Merah';
  const isGreen = color === 'Hijau';
  const isOff = color === 'Tidak Menyala' || status === 'Mati Total';
  const isBlink = status === 'Berkedip';

  let colorClass;
  if (isRed) {
    colorClass = 'bg-red-600 border-red-500';
  } else if (isGreen) {
    colorClass = 'bg-emerald-600 border-emerald-500';
  } else if (isOff) {
    colorClass = 'bg-slate-300 border-slate-400';
  } else {
    colorClass = 'bg-amber-600 border-amber-500';
  }

  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-block rounded-full border ${sizeClass} ${colorClass} ${
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
    className="group bg-white border border-slate-200/90 hover:border-brand-blue/50 transition-colors duration-150 rounded-2xl p-5 cursor-pointer flex flex-col justify-between shadow-xs"
    onClick={onClick}
  >
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
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 mb-3">
          <LedIndicator color={lap.warna_lampu} status={lap.status_lampu} size="sm" />
        </div>
      )}
    </div>

    <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-100">
      <span className="flex items-center gap-1.5 font-normal">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        <span>{formatRelativeTime(lap.waktu_laporan)}</span>
      </span>
      <span className="font-semibold text-brand-blue underline-offset-2 group-hover:underline">
        Lihat Detail
      </span>
    </div>
  </div>
);

export const SectionBox = ({ title, subtitle, prefix, children }) => (
  <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-5 md:p-6 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <span className="w-7 h-7 rounded-xl bg-brand-ice text-brand-navy border border-brand-blue/20 flex items-center justify-center text-xs font-bold shrink-0">
        {prefix}
      </span>
      <div>
        <h3 className="font-bold text-brand-navy text-sm md:text-base leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

export const Pill = ({ active, label, icon: Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[44px] px-4 py-2.5 text-xs md:text-sm font-medium rounded-xl border transition-colors flex items-center gap-2 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-blue ${
      active
        ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-semibold'
        : 'bg-white text-slate-700 border-slate-200/90 hover:bg-brand-ice hover:text-brand-blue hover:border-brand-blue/30'
    }`}
  >
    {active ? <CheckCircle2 className="w-4 h-4 text-white" /> : Icon && <Icon className="w-4 h-4 text-slate-500" />}
    {label}
  </button>
);

export const TimelineItem = ({ active, title, desc, date, isDone, isLast }) => (
  <div className="relative z-10 flex gap-4">
    <div
      className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${
        isDone
          ? 'bg-emerald-600 border-emerald-600 text-white'
          : active
          ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
          : 'bg-white border-slate-300 text-slate-400'
      }`}
    >
      {isDone ? <CheckCircle2 className="w-4 h-4" /> : active ? <Activity className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
    </div>
    <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-semibold ${active || isDone ? 'text-brand-navy' : 'text-slate-500'}`}>
          {title}
        </p>
        {active && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            Sedang Berlangsung
          </span>
        )}
      </div>
      {date && <p className="text-xs text-slate-500 mt-0.5 font-normal">{date}</p>}
      {desc && (
        <div className="mt-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 inline-block font-normal leading-relaxed">
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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-5 py-3 bg-slate-900 border-b border-slate-800 text-white">
          <span className="text-xs font-medium text-slate-200">{alt || 'Bukti Foto Modem'}</span>
          <button
            onClick={onClose}
            aria-label="Tutup pratinjau foto"
            className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 flex items-center justify-center overflow-auto">
          <img src={src} alt={alt} className="max-h-[80vh] w-auto object-contain rounded-lg" />
        </div>
      </div>
    </div>
  );
};
