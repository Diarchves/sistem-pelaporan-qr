from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# ============ SCHEMAS PELANGGAN & QR ============

class PelangganInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_string: str = Field(..., description="Nomor ID/Pelanggan")
    nama: str = Field(..., description="Nama lengkap pelanggan")
    alamat: Optional[str] = Field(None, description="Alamat pemasangan")
    no_telepon: Optional[str] = Field(None, description="Nomor telepon pelanggan")
    paket: str = Field(..., description="Nama paket langganan internet")


class LaporanItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    no_tiket: str
    gangguan: Optional[str] = None
    warna_lampu: Optional[str] = None
    status_lampu: Optional[str] = None
    lokasi: Optional[str] = None
    waktu_kejadian: Optional[str] = None
    status: str
    foto_modem: Optional[str] = None
    waktu_laporan: Optional[str] = None


class QRValidationResponse(BaseModel):
    authenticated: bool
    id_pelanggan: int
    token: str
    pelanggan: PelangganInfo
    riwayat_laporan: List[LaporanItem]


# ============ SCHEMAS LAPORAN ============

class LaporanSubmitResponse(BaseModel):
    status: str
    no_tiket: str
    message: str = "Laporan berhasil dikirim dan akan segera diproses tim teknisi."


class TicketStatusUpdate(BaseModel):
    status: str = Field(..., description="Status baru: Menunggu | Diproses | Selesai | Dibatalkan")
    notes: Optional[str] = Field(None, description="Catatan tindakan penanganan")
    technician_id: Optional[int] = Field(None, description="ID Teknisi yang menangani")
