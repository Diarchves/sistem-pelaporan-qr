from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(models.Package).first():
        print("Database sudah berisi data. Seed dibatalkan.")
        db.close()
        return

    # 1. REGION
    region1 = models.Region(region_code="ACEH-01", region_name="Banda Aceh")
    db.add(region1)

    # 2. USER & EMPLOYEE
    user1 = models.User(username="admin", password="password", role="Admin", status="Active")
    user2 = models.User(username="teknisi1", password="password", role="Teknisi", status="Active")
    db.add_all([user1, user2])
    db.commit()

    emp1 = models.Employee(user_id=user1.user_id, employee_number="EMP-001", name="Admin Pusat", position="Manager", division="NOC")
    emp2 = models.Employee(user_id=user2.user_id, employee_number="EMP-002", name="Teknisi Budi", position="Teknisi Lapangan", division="Maintenance")
    db.add_all([emp1, emp2])
    db.commit()

    # 3. PACKAGE
    package1 = models.Package(package_name="Acehlink 20 Mbps", price=250000.0, service_type="Internet Fiber", description="Internet up to 20 Mbps unlimited")
    db.add(package1)
    db.commit()

    # 4. CLIENT
    client1 = models.Client(
        customer_number="ACL-001234",
        package_id=package1.package_id,
        name="Diaulhaq",
        phone="081234567890",
        address="Ruang tamu, Lantai 2, Kamar, Bagian belakang rumah"
    )
    db.add(client1)
    db.commit()
    db.refresh(client1)

    # 5. ODP
    odp1 = models.Odp(odp_code="ODP-BJA-01", region_code=region1.region_code, name="ODP Beurawe", capacity=16, used_core=8, available_core=8)
    db.add(odp1)

    # 6. QR CODE
    now = datetime.utcnow()
    qr1 = models.QrCode(
        client_id=client1.client_id,
        generated_by=user1.user_id,
        token="SEC-TKN-9821A",
        qr_data="QR-ACL-001234-9821A",
        status="Active",
        generated_at=now
    )
    db.add(qr1)
    db.commit()
    db.refresh(qr1)

    # 7. TICKET
    t1 = models.Ticket(
        ticket_number="LP-20260114-08",
        client_id=client1.client_id,
        odp_id=odp1.odp_id,
        qr_id=qr1.qr_id,
        issue_type="Gangguan Koneksi",
        description="Koneksi internet putus-nyambung sejak pagi hari, kecepatan tidak stabil.",
        warna_lampu="Merah",
        status_lampu="Berkedip",
        location="Ruang tamu, Lantai 2",
        reported_at=now - timedelta(hours=4),
        status="Diproses",
        priority="High"
    )
    
    t2 = models.Ticket(
        ticket_number="LP-20260110-05",
        client_id=client1.client_id,
        odp_id=odp1.odp_id,
        qr_id=qr1.qr_id,
        issue_type="Mati Total",
        description="Router tidak menyala setelah pemadaman listrik semalam.",
        warna_lampu="Tidak Menyala",
        status_lampu="Mati Total",
        location="Kamar utama",
        reported_at=now - timedelta(days=4),
        status="Selesai",
        priority="High",
        closed_at=now - timedelta(days=3)
    )
    db.add_all([t1, t2])
    db.commit()

    # 8. TICKET HANDLING
    th1 = models.TicketHandling(
        ticket_id=t1.ticket_id,
        employee_id=emp2.employee_id,
        action_taken="Pengecekan jaringan tiang",
        notes="Kabel optic sedikit tertekuk, sedang diperbaiki",
        start_time=now - timedelta(hours=1)
    )
    db.add(th1)
    db.commit()

    print("Seeding berhasil! Database 16-Tabel telah diinisiasi dan data pelanggan Diaulhaq telah dimasukkan.")
    db.close()

if __name__ == "__main__":
    seed()
