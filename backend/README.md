# FitTrack FastAPI Backend

A production-quality REST API built with FastAPI, SQLAlchemy, and PostgreSQL for the FitTrack Android app.

## Quick Start

### 1. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` (optional, defaults to local SQLite if PostgreSQL is not configured):
```powershell
copy .env.example .env
```

### 3. Start Server
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger Docs:
http://localhost:8000/docs
