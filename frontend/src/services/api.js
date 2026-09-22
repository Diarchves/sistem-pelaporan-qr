/**
 * API Service Layer untuk Sistem Pelaporan QR Acehlink MEDIA.
 * Menerapkan pola standard error handling dan modular fetch client.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

export { API_BASE };

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Terjadi kesalahan pada server';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

/**
 * Validasi session QR Code pelanggan
 */
export async function validateSession(idPelanggan, token) {
  const url = `${API_BASE}/api/pelanggan/validate?id_pelanggan=${encodeURIComponent(idPelanggan)}&token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  return handleResponse(res);
}

/**
 * Kirim formulir laporan kendala beserta foto modem opsional
 */
export async function submitLaporan(formData) {
  const res = await fetch(`${API_BASE}/api/laporan`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(res);
}

/**
 * Ambil detail satu tiket laporan
 */
export async function getDetailLaporan(noTiket) {
  const res = await fetch(`${API_BASE}/api/laporan/${encodeURIComponent(noTiket)}`);
  return handleResponse(res);
}
