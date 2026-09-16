import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, engine
import models
from routers import pelanggan, laporan

# Auto-create tables if not exists
Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Sistem Pelaporan Khusus Pelanggan QR",
    description="API Pelaporan Gangguan Layanan Internet Berbasis QR Code",
    version="1.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded photos
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Modular Routers
app.include_router(pelanggan.router)
app.include_router(laporan.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "Sistem Pelaporan QR API"}
