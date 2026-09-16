from database import SessionLocal
import models

db = SessionLocal()
qr = db.query(models.QrCode).filter(models.QrCode.id_pelanggan == 1, models.QrCode.token == "SEC-TKN-9821A").first()
print(qr)
if qr:
    print(f"Status: {qr.status}, Type: {type(qr.status)}")
