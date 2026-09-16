import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TabBeranda from './components/TabBeranda';
import TabLapor from './components/TabLapor';
import TabRiwayat from './components/TabRiwayat';
import TabProfil from './components/TabProfil';
import DetailLaporan from './components/DetailLaporan';

import { validateSession } from './services/api';

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('beranda'); // beranda | riwayat | lapor | profil | detail
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Baca parameter dari URL atau dari sessionStorage aktif
  const [authCreds] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id_pelanggan');
      const urlTkn = params.get('token');

      if (urlId && urlTkn) {
        // Simpan ke sessionStorage untuk sesi tab ini
        sessionStorage.setItem('qr_id_pelanggan', urlId);
        sessionStorage.setItem('qr_token', urlTkn);

        // Bersihkan parameter query dari URL address bar secara mulus
        window.history.replaceState({}, document.title, window.location.pathname);

        return { idPelanggan: urlId, token: urlTkn };
      }

      // Jika URL sudah bersih (misal saat refresh halaman di sesi yang sama)
      const storedId = sessionStorage.getItem('qr_id_pelanggan');
      const storedTkn = sessionStorage.getItem('qr_token');
      if (storedId && storedTkn) {
        return { idPelanggan: storedId, token: storedTkn };
      }
    } catch {
      // fallback jika sessionStorage tidak tersedia
    }

    return { idPelanggan: null, token: null };
  });

  const { idPelanggan, token } = authCreds;

  const fetchSessionData = useCallback(async () => {
    if (!idPelanggan || !token) {
      setError('Akses Terproteksi QR.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await validateSession(idPelanggan, token);
      setSession(data);
      setError('');
    } catch (err) {
      setError(err.message || 'QR Code tidak valid atau telah kadaluarsa.');
      setSession(null);
      try {
        sessionStorage.removeItem('qr_id_pelanggan');
        sessionStorage.removeItem('qr_token');
      } catch {
        // ignore
      }
    } finally {
      setIsLoading(false);
    }
  }, [idPelanggan, token]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  const handleLaporanSuccess = async (ticketNumber) => {
    setToastMessage(`Laporan ${ticketNumber} berhasil dikirim! Teknisi kami akan segera menindaklanjuti.`);
    await fetchSessionData();
    setActiveTab('beranda');

    // Auto-dismiss toast
    setTimeout(() => {
      setToastMessage('');
    }, 6000);
  };

  // Jika tidak ada parameter QR (id_pelanggan & token), mutlak langsung tampilkan website acehlink.id tanpa loading dan tanpa floating apapun
  if (!idPelanggan || !token) {
    return (
      <iframe
        src="https://acehlink.id"
        title="Acehlink Media"
        className="w-full h-screen border-0 block"
      />
    );
  }

  // Loading Screen - hanya muncul jika sedang memvalidasi token QR
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-cyan flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
          A
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-blue" />
          <span>Memverifikasi Akses QR Pelanggan...</span>
        </div>
      </div>
    );
  }

  // Jika token QR tidak valid di backend, mutlak alihkan ke website acehlink.id
  if (error || !session) {
    return (
      <iframe
        src="https://acehlink.id"
        title="Acehlink Media"
        className="w-full h-screen border-0 block"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] flex flex-col md:flex-row font-sans text-brand-navy">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pelanggan={session.pelanggan}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-28 md:pb-8">
        <Header activeTab={activeTab} pelanggan={session.pelanggan} />

        {/* Floating Toast Notification - Acehlink Minimalist */}
        {toastMessage && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 mt-4 w-full">
            <div className="bg-brand-navy text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3 text-xs md:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 border border-brand-deep">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage('')}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {activeTab === 'beranda' && (
            <TabBeranda
              session={session}
              setActiveTab={setActiveTab}
              setSelectedLaporan={setSelectedLaporan}
            />
          )}

          {activeTab === 'riwayat' && (
            <TabRiwayat
              session={session}
              setActiveTab={setActiveTab}
              setSelectedLaporan={setSelectedLaporan}
            />
          )}

          {activeTab === 'lapor' && (
            <TabLapor
              session={session}
              setActiveTab={setActiveTab}
              onLaporanSuccess={handleLaporanSuccess}
            />
          )}

          {activeTab === 'profil' && (
            <TabProfil session={session} />
          )}

          {activeTab === 'detail' && (
            <DetailLaporan
              selectedLaporan={selectedLaporan}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

