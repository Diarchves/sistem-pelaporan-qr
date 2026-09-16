from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
from schemas import QRValidationResponse, PelangganInfo, LaporanItem

router = APIRouter(prefix="/api/pelanggan", tags=["Pelanggan & QR"])

@router.get("/validate", response_model=QRValidationResponse)
def validate_pelanggan_qr(
    id_pelanggan: int = Query(..., description="ID Pelanggan dari parameter QR"),
    token: str = Query(..., description="Token verifikasi QR"),
    db: Session = Depends(get_db)
):
    """
    Memvalidasi akses QR code pelanggan dan mengembalikan profil serta riwayat laporan.
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
            detail="Akses Ditolak: QR Code tidak valid atau sudah kadaluarsa."
        )

    client = qr.client
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data pelanggan tidak ditemukan."
        )

    package = client.package

    # Ambil riwayat laporan pelanggan, terurut dari yang terbaru
    tickets = db.query(models.Ticket).filter(
        models.Ticket.client_id == client.client_id
    ).order_by(models.Ticket.reported_at.desc()).all()

    riwayat = [
        LaporanItem(
            no_tiket=t.ticket_number,
            gangguan=t.description,
            warna_lampu=t.warna_lampu,
            status_lampu=t.status_lampu,
            lokasi=t.location,
            waktu_kejadian=t.reported_at.isoformat() if t.reported_at else None,
            status=t.status,
            foto_modem=t.photo_modem,
            waktu_laporan=t.reported_at.isoformat() if t.reported_at else None
        )
        for t in tickets
    ]

    return QRValidationResponse(
        authenticated=True,
        id_pelanggan=client.client_id,
        token=qr.token,
        pelanggan=PelangganInfo(
            id_string=client.customer_number,
            nama=client.name,
            alamat=client.address,
            no_telepon=client.phone,
            paket=package.package_name if package else "-"
        ),
        riwayat_laporan=riwayat
    )
