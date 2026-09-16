import os
from fastapi import HTTPException, UploadFile, status

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

async def validate_and_save_upload(
    file: UploadFile,
    target_dir: str,
    prefix: str = "modem"
) -> str:
    """
    Memvalidasi ekstensi, MIME type, dan ukuran berkas sebelum disimpan.
    Mengembalikan path publik relatif (misal: /uploads/filename.ext).
    """
    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Berkas tidak valid."
        )

    # 1. Validasi Ekstensi
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format berkas '{ext}' tidak diizinkan. Gunakan JPG, PNG, atau WebP."
        )

    # 2. Validasi Content-Type
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"MIME type '{file.content_type}' tidak diizinkan."
        )

    # 3. Baca konten dan validasi ukuran berkas
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ukuran berkas melebihi batas maksimal ({MAX_FILE_SIZE // (1024 * 1024)} MB)."
        )

    # 4. Generate nama berkas unik yang aman (mencegah path traversal)
    import uuid
    safe_filename = f"{prefix}_{uuid.uuid4().hex[:12]}{ext}"
    destination = os.path.join(target_dir, safe_filename)

    with open(destination, "wb") as f:
        f.write(contents)

    return f"/uploads/{safe_filename}"
