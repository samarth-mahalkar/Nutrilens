# FastAPI Backend Setup Guide

## Prerequisites
Make sure you have Python 3.8+ installed:
```bash
python3 --version
```

## 1. Create Backend Directory
```bash
mkdir nutrilens-backend
cd nutrilens-backend
```

## 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate     # On Windows
```

## 3. Install Dependencies
```bash
pip install fastapi uvicorn pydantic requests python-multipart pyzbar Pillow opencv-python
```

## 4. Create main.py (see the main.py file created alongside this)

## 5. Start the Backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 6. Test the Backend
Open another terminal and test:
```bash
curl http://localhost:8000/health
```

You should see:
```json
{"status": "healthy", "message": "Nutrilens Backend is running"}
```

## API Endpoints
- GET /health - Health check
- POST /scan-image - Upload image for barcode scanning
- GET /scan/{barcode} - Scan by manual barcode entry

## CORS Configuration
The backend is configured to accept requests from:
- http://localhost:3000
- http://localhost:3001
- http://localhost:3002
- http://localhost:8080 (for Vite dev server)
