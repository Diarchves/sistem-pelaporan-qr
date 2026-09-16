import { useState, useEffect, useCallback } from 'react';
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
  const [activeTab, setActiveTab] = useState('beranda');
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const [authCreds] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id_pelanggan');
      const urlTkn = params.get('token');

      if (urlId && urlTkn) {
        sessionStorage.setItem('qr_id_pelanggan', urlId);
        sessionStorage.setItem('qr_token', urlTkn);
        window.history.replaceState({}, document.title, window.location.pathname);
        return { idPelanggan: urlId, token: urlTkn };
      }

      const storedId = sessionStorage.getItem('qr_id_pelanggan');
      const storedTkn = sessionStorage.getItem('qr_token');
      if (storedId && storedTkn) {
        return { idPelanggan: storedId, token: storedTkn };
      }
    } catch {
      // fallback
    }

    return { idPelanggan: null, token: null };
  });

  const { idPelanggan, token } = authCreds;

  useEffect(() => {
    let isCancelled = false;

    async function loadSession() {
      if (!idPelanggan || !token) {
        setError('Akses Terproteksi QR.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await validateSession(idPelanggan, token);
        if (!isCancelled) {
          setSession(data);
          setError('');
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'QR Code tidak valid atau telah kadaluarsa.');
          setSession(null);
          try {
            sessionStorage.removeItem('qr_id_pelanggan');
            sessionStorage.removeItem('qr_token');
          } catch {
            // ignore
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isCancelled = true;
    };
  }, [idPelanggan, token]);

  const refetchSession = useCallback(async () => {
    if (!idPelanggan || !token) return;
    try {
      const data = await validateSession(idPelanggan, token);
      setSession(data);
    } catch {
      // ignore
    }
  }, [idPelanggan, token]);

  const handleLaporanSuccess = async (ticketNumber) => {
    setToastMessage(`Laporan ${ticketNumber} berhasil dikirim! Teknisi kami akan segera menindaklanjuti.`);
    await refetchSession();
    setActiveTab('beranda');

    setTimeout(() => {
      setToastMessage('');
    }, 6000);
  };

  if (!idPelanggan || !token) {
    return (
      <iframe
        src="https://acehlink.id"
        title="Acehlink Media"
        className="w-full h-screen border-0 block"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
          A
        </div>
        <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-brand-blue" />
          <span>Memverifikasi Akses QR Pelanggan...</span>
        </div>
      </div>
    );
  }

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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pelanggan={session.pelanggan}
      />

      <main className="flex-1 flex flex-col min-w-0 pb-28 md:pb-8">
        <Header activeTab={activeTab} pelanggan={session.pelanggan} />

        {toastMessage && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 mt-4 w-full">
            <div className="bg-brand-navy text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs md:text-sm font-medium border border-brand-deep">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage('')}
                aria-label="Tutup pesan"
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer"
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

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
