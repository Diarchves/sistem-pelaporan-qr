import os
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from database import get_db
import models
from schemas import LaporanSubmitResponse, LaporanItem, TicketStatusUpdate
from security import validate_and_save_upload

router = APIRouter(prefix="/api/laporan", tags=["Pelaporan Gangguan"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("", response_model=LaporanSubmitResponse, status_code=status.HTTP_201_CREATED)
async def submit_laporan(
    id_pelanggan: int = Form(..., description="ID Pelanggan pengirim laporan"),
    token: str = Form(..., description="Token QR aktif"),
    gangguan: str = Form(..., description="Deskripsi keluhan atau gangguan"),
    warna_lampu: Optional[str] = Form(None, description="Warna indikator lampu modem"),
    status_lampu: Optional[str] = Form(None, description="Status lampu (Berkedip/Mati/Menyala)"),
    lokasi: Optional[str] = Form(None, description="Lokasi modem"),
    waktu_kejadian: Optional[str] = Form(None, description="Waktu awal kendala dialami"),
    foto_modem: Optional[UploadFile] = File(None, description="Foto bukti indikator modem"),
    db: Session = Depends(get_db)
):
    """
    Mengirim laporan gangguan baru yang diverifikasi dengan token QR pelanggan.
    """
    clean_token = token.strip()
    qr = db.query(models.QrCode).filter(
        models.QrCode.client_id == id_pelanggan,
        models.QrCode.token == clean_token,
        models.QrCode.status == "Active"
    ).first()

    if not qr:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses Ditolak: Token QR tidak valid atau sudah tidak aktif."
        )

    # Validasi dan simpan foto jika ada
    foto_url = None
    if foto_modem and foto_modem.filename:
        foto_url = await validate_and_save_upload(foto_modem, UPLOAD_DIR, prefix="modem")

    now = datetime.now(timezone.utc)
    # Format nomor tiket unik: LP-YYYYMMDD-XXXX
    no_tiket = f"LP-{now.strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"

    laporan_baru = models.Ticket(
        ticket_number=no_tiket,
        client_id=qr.client_id,
        qr_id=qr.qr_id,
        issue_type="Gangguan Koneksi",
        priority="Normal",
        status="Menunggu",
        description=gangguan.strip(),
        warna_lampu=warna_lampu,
        status_lampu=status_lampu,
        location=lokasi,
        photo_modem=foto_url,
        reported_at=now
    )

    db.add(laporan_baru)
    db.commit()
    db.refresh(laporan_baru)

    return LaporanSubmitResponse(
        status="success",
        no_tiket=laporan_baru.ticket_number,
        message="Laporan gangguan berhasil dikirim. Teknisi kami akan segera memprosesnya."
    )


@router.get("/{ticket_number}", response_model=LaporanItem)
def get_detail_laporan(ticket_number: str, db: Session = Depends(get_db)):
    """
    Mendapatkan informasi detail suatu tiket laporan berdasarkan nomor tiket.
    """
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_number == ticket_number
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tiket dengan nomor '{ticket_number}' tidak ditemukan."
        )

    return LaporanItem(
        no_tiket=ticket.ticket_number,
        gangguan=ticket.description,
        warna_lampu=ticket.warna_lampu,
        status_lampu=ticket.status_lampu,
        lokasi=ticket.location,
        waktu_kejadian=ticket.reported_at.isoformat() if ticket.reported_at else None,
        status=ticket.status,
        foto_modem=ticket.photo_modem,
        waktu_laporan=ticket.reported_at.isoformat() if ticket.reported_at else None
    )


@router.patch("/{ticket_number}/status")
def update_status_laporan(
    ticket_number: str,
    payload: TicketStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Memperbarui status tiket (Menunggu -> Diproses -> Selesai) oleh teknisi / admin.
    """
    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_number == ticket_number
    ).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tiket '{ticket_number}' tidak ditemukan."
        )

    ticket.status = payload.status
    now = datetime.now(timezone.utc)

    if payload.status == "Diproses" and not ticket.taken_at:
        ticket.taken_at = now
    elif payload.status == "Selesai":
        ticket.closed_at = now

    if payload.technician_id:
        ticket.assigned_employee_id = payload.technician_id

    # Jika ada catatan handling dan teknisi yang bertanggung jawab
    handling_employee_id = payload.technician_id or ticket.assigned_employee_id
    if payload.notes and handling_employee_id:
        handling = models.TicketHandling(
            ticket_id=ticket.ticket_id,
            employee_id=handling_employee_id,
            action_taken=payload.notes,
            notes=f"Perubahan status menjadi {payload.status}",
            start_time=now
        )
        db.add(handling)

    db.commit()
    return {"status": "success", "ticket_number": ticket.ticket_number, "new_status": ticket.status}
