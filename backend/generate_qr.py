import sys
import os
import secrets
import qrcode
from datetime import datetime, timezone
from database import SessionLocal
import models

# Konfigurasi URL web frontend
BASE_URL = "http://localhost:5173"
QR_OUTPUT_DIR = "qr_codes"

def generate_qr_for_client(client_id: int):
    # Buat direktori output jika belum ada
    os.makedirs(QR_OUTPUT_DIR, exist_ok=True)

    db = SessionLocal()
    try:
        # Cek apakah client_id tersebut valid di database
        client = db.query(models.Client).filter(models.Client.client_id == client_id).first()
        if not client:
            print(f"❌ Error: Pelanggan dengan ID {client_id} tidak ditemukan.")
            return

        # Generate token unik dan aman (32 karakter acak)
        unique_token = secrets.token_urlsafe(16)
        
        # Format URL yang akan disimpan di dalam QR code
        qr_url = f"{BASE_URL}/?id_pelanggan={client_id}&token={unique_token}"
        
        # Format label untuk QR data
        qr_data_label = f"QR-{client.customer_number}-{unique_token[:8].upper()}"

        # Simpan ke tabel QrCode di database
        now = datetime.now(timezone.utc)
        qr_record = models.QrCode(
            client_id=client_id,
            generated_by=1, # Default ke admin pertama, atau sesuaikan jika ada user spesifik
            token=unique_token,
            qr_data=qr_data_label,
            status="Active",
            generated_at=now
        )
        
        db.add(qr_record)
        db.commit()
        db.refresh(qr_record)

        # Generate Gambar QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        # Simpan file gambar
        filename = os.path.join(QR_OUTPUT_DIR, f"{client.customer_number}.png")
        img.save(filename)
        
        print("✅ Berhasil membuat QR Code baru!")
        print("-" * 40)
        print(f"Pelanggan : {client.name} ({client.customer_number})")
        print(f"Token Unik: {unique_token}")
        print(f"URL       : {qr_url}")
        print(f"File QR   : {filename}")
        print("-" * 40)

    except Exception as e:
        print(f"❌ Terjadi kesalahan: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Penggunaan: python generate_qr.py <id_pelanggan>")
        print("Contoh    : python generate_qr.py 1")
    else:
        try:
            client_id_arg = int(sys.argv[1])
            generate_qr_for_client(client_id_arg)
        except ValueError:
            print("❌ Error: id_pelanggan harus berupa angka bulat (integer).")
