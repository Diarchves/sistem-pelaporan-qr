from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, Date
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# ============ MASTER DATA ============

class Region(Base):
    __tablename__ = "region"
    region_code = Column(String(50), primary_key=True, index=True)
    region_name = Column(String(150), nullable=False)

    odps = relationship("Odp", back_populates="region")
    modems = relationship("Modem", back_populates="region")


class User(Base):
    __tablename__ = "user"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="user", uselist=False)
    qr_codes = relationship("QrCode", back_populates="generator")
    attendances = relationship("Attendance", back_populates="user")


class Employee(Base):
    __tablename__ = "employee"
    employee_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=True)
    employee_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    position = Column(String(100), nullable=True)
    division = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(150), nullable=True)
    photo = Column(String(255), nullable=True)

    user = relationship("User", back_populates="employee")
    modem_transactions = relationship("ModemTransaction", back_populates="employee")
    assigned_tickets = relationship("Ticket", back_populates="assigned_employee")
    ticket_handlings = relationship("TicketHandling", back_populates="employee")
    work_evidences = relationship("WorkEvidence", back_populates="uploader")
    shift_members = relationship("ShiftMember", back_populates="employee")


class Package(Base):
    __tablename__ = "package"
    package_id = Column(Integer, primary_key=True, index=True)
    package_name = Column(String(150), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    service_type = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    clients = relationship("Client", back_populates="package")


class Client(Base):
    __tablename__ = "client"
    client_id = Column(Integer, primary_key=True, index=True)
    customer_number = Column(String(50), unique=True, index=True, nullable=False)
    package_id = Column(Integer, ForeignKey("package.package_id"), nullable=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    package = relationship("Package", back_populates="clients")
    modem_transactions = relationship("ModemTransaction", back_populates="client")
    qr_codes = relationship("QrCode", back_populates="client")
    tickets = relationship("Ticket", back_populates="client")


# ============ INFRASTRUKTUR JARINGAN ============

class Odp(Base):
    __tablename__ = "odp"
    odp_id = Column(Integer, primary_key=True, index=True)
    odp_code = Column(String(50), unique=True, index=True, nullable=False)
    region_code = Column(String(50), ForeignKey("region.region_code"), nullable=True)
    name = Column(String(150), nullable=False)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    status = Column(String(50), nullable=True)
    capacity = Column(Integer, default=0)
    used_core = Column(Integer, default=0)
    available_core = Column(Integer, default=0)

    region = relationship("Region", back_populates="odps")
    tickets = relationship("Ticket", back_populates="odp")
    attendances = relationship("Attendance", back_populates="odp")


# ============ INVENTARIS & ASET ============

class Modem(Base):
    __tablename__ = "modem"
    serial_number = Column(String(100), primary_key=True, index=True)
    mac_address = Column(String(100), nullable=True)
    brand_type = Column(String(100), nullable=True)
    current_region_code = Column(String(50), ForeignKey("region.region_code"), nullable=True)
    status = Column(String(50), nullable=True)
    date_in_warehouse = Column(Date, nullable=True)
    date_out_warehouse = Column(Date, nullable=True)

    region = relationship("Region", back_populates="modems")
    transactions = relationship("ModemTransaction", back_populates="modem")


class ModemTransaction(Base):
    __tablename__ = "modem_transaction"
    transaction_id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(100), ForeignKey("modem.serial_number"), nullable=False)
    client_id = Column(Integer, ForeignKey("client.client_id"), nullable=True)
    employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=True)
    install_date = Column(Date, nullable=True)
    uninstall_date = Column(Date, nullable=True)
    old_modem_serial = Column(String(100), nullable=True)
    service_status = Column(String(50), nullable=True)

    modem = relationship("Modem", back_populates="transactions")
    client = relationship("Client", back_populates="modem_transactions")
    employee = relationship("Employee", back_populates="modem_transactions")


class Inventory(Base):
    __tablename__ = "inventory"
    inventory_id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String(50), unique=True, index=True, nullable=False)
    item_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=True)
    stock = Column(Integer, default=0)
    unit = Column(String(50), nullable=True)

    usages = relationship("InventoryUsage", back_populates="inventory")


class InventoryUsage(Base):
    __tablename__ = "inventory_usage"
    usage_id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.inventory_id"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("ticket.ticket_id"), nullable=True)
    quantity = Column(Integer, nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow)

    inventory = relationship("Inventory", back_populates="usages")
    ticket = relationship("Ticket", back_populates="inventory_usages")


# ============ TICKETING / PELAPORAN ============

class QrCode(Base):
    __tablename__ = "qr_code"
    qr_id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client.client_id"), nullable=False)
    generated_by = Column(Integer, ForeignKey("user.user_id"), nullable=True)
    token = Column(String(100), unique=True, index=True, nullable=False)
    qr_data = Column(String(255), nullable=True)
    status = Column(String(50), default="Active")
    generated_at = Column(DateTime, default=datetime.utcnow)
    expired_at = Column(DateTime, nullable=True)

    client = relationship("Client", back_populates="qr_codes")
    generator = relationship("User", back_populates="qr_codes")
    tickets = relationship("Ticket", back_populates="qr_code")


class Ticket(Base):
    __tablename__ = "ticket"
    ticket_id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String(100), unique=True, index=True, nullable=False)
    client_id = Column(Integer, ForeignKey("client.client_id"), nullable=True)
    odp_id = Column(Integer, ForeignKey("odp.odp_id"), nullable=True)
    qr_id = Column(Integer, ForeignKey("qr_code.qr_id"), nullable=True)
    assigned_employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=True)
    
    issue_type = Column(String(100), nullable=True)
    priority = Column(String(50), nullable=True)
    status = Column(String(50), default="Menunggu")
    description = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    photo_modem = Column(String(255), nullable=True)
    reported_at = Column(DateTime, default=datetime.utcnow)
    taken_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)

    # Added to support web frontend functionality
    warna_lampu = Column(String(50), nullable=True)
    status_lampu = Column(String(50), nullable=True)

    client = relationship("Client", back_populates="tickets")
    odp = relationship("Odp", back_populates="tickets")
    qr_code = relationship("QrCode", back_populates="tickets")
    assigned_employee = relationship("Employee", back_populates="assigned_tickets")
    handlings = relationship("TicketHandling", back_populates="ticket")
    work_evidences = relationship("WorkEvidence", back_populates="ticket")
    inventory_usages = relationship("InventoryUsage", back_populates="ticket")
    attendances = relationship("Attendance", back_populates="ticket")


class TicketHandling(Base):
    __tablename__ = "ticket_handling"
    handling_id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("ticket.ticket_id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=False)
    action_taken = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    ticket = relationship("Ticket", back_populates="handlings")
    employee = relationship("Employee", back_populates="ticket_handlings")


class WorkEvidence(Base):
    __tablename__ = "work_evidence"
    evidence_id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("ticket.ticket_id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("employee.employee_id"), nullable=True)
    photo = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="work_evidences")
    uploader = relationship("Employee", back_populates="work_evidences")


# ============ SDM & OPERASIONAL ============

class Shift(Base):
    __tablename__ = "shift"
    shift_id = Column(Integer, primary_key=True, index=True)
    shift_name = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String(50), default="Active")

    shift_members = relationship("ShiftMember", back_populates="shift")
    attendances = relationship("Attendance", back_populates="shift")


class ShiftMember(Base):
    __tablename__ = "shift_member"
    shift_member_id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shift.shift_id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employee.employee_id"), nullable=False)

    shift = relationship("Shift", back_populates="shift_members")
    employee = relationship("Employee", back_populates="shift_members")


class Attendance(Base):
    __tablename__ = "attendance"
    attendance_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("ticket.ticket_id"), nullable=True)
    shift_id = Column(Integer, ForeignKey("shift.shift_id"), nullable=True)
    odp_id = Column(Integer, ForeignKey("odp.odp_id"), nullable=True)
    
    attendance_type = Column(String(50), nullable=True)
    action = Column(String(50), nullable=True)
    attendance_time = Column(DateTime, default=datetime.utcnow)
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    accuracy = Column(Numeric(10, 2), nullable=True)
    face_photo = Column(String(255), nullable=True)
    status = Column(String(50), nullable=True)

    user = relationship("User", back_populates="attendances")
    ticket = relationship("Ticket", back_populates="attendances")
    shift = relationship("Shift", back_populates="attendances")
    odp = relationship("Odp", back_populates="attendances")
