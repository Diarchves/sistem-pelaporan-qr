"""
Unit & Integration tests untuk Sistem Pelaporan QR Backend.
Menguji validasi schema, router pelanggan, dan router laporan.
"""
import sys
import os

# Tambahkan path backend ke sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models
from routers.pelanggan import validate_pelanggan_qr
from routers.laporan import get_detail_laporan, update_status_laporan
from schemas import TicketStatusUpdate

def test_pelanggan_validation():
    db = SessionLocal()
    try:
        # Cek data dummy dari seed: id_pelanggan=1, token="SEC-TKN-9821A"
        qr = db.query(models.QrCode).filter(models.QrCode.client_id == 1).first()
        if not qr:
            print("❌ QR Code tidak ditemukan, pastikan seed.py sudah dijalankan.")
            return False

        res = validate_pelanggan_qr(id_pelanggan=qr.client_id, token=qr.token, db=db)
        assert res.authenticated is True
        assert res.pelanggan.nama is not None
        assert res.token == qr.token
        print(f"✅ validate_pelanggan_qr: Berhasil memvalidasi pelanggan '{res.pelanggan.nama}'")
        return True
    finally:
        db.close()

def test_laporan_status_update():
    db = SessionLocal()
    try:
        # Cari tiket pertama
        ticket = db.query(models.Ticket).first()
        if not ticket:
            print("⚠️ Belum ada tiket di database untuk diuji update.")
            return True

        original_status = ticket.status
        # Uji patch status
        update_status_laporan(
            ticket_number=ticket.ticket_number,
            payload=TicketStatusUpdate(status="Diproses", notes="Teknisi sedang menuju lokasi"),
            db=db
        )
        db.refresh(ticket)
        assert ticket.status == "Diproses"
        print(f"✅ update_status_laporan: Tiket '{ticket.ticket_number}' berhasil diubah statusnya ke '{ticket.status}'")

        # Kembalikan status
        ticket.status = original_status
        db.commit()
        return True
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Menjalankan Pengujian Backend ===")
    ok1 = test_pelanggan_validation()
    ok2 = test_laporan_status_update()
    if ok1 and ok2:
        print("🎉 Semua pengujian backend berhasil!")
    else:
        print("❌ Pengujian gagal!")
        sys.exit(1)
