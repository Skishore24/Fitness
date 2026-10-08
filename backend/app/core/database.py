"""
Database Engine & Session Management with Resilient Fallback
"""
import logging
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

logger = logging.getLogger("fittrack.database")


def get_sanitized_db_url(url: str) -> str:
    """Ensure passwords containing special characters like '@' are safely encoded."""
    if not url:
        return "sqlite:///./fittrack.db"
    if url.startswith("sqlite"):
        return url
    try:
        if "://" in url:
            prefix, rest = url.split("://", 1)
            if "@" in rest:
                user_pass, host_part = rest.rsplit("@", 1)
                if ":" in user_pass:
                    user, password = user_pass.split(":", 1)
                    decoded_pw = urllib.parse.unquote(password)
                    encoded_pw = urllib.parse.quote_plus(decoded_pw)
                    return f"{prefix}://{user}:{encoded_pw}@{host_part}"
    except Exception as exc:
        logger.warning(f"Failed to sanitize database URL: {exc}")
    return url


db_url = get_sanitized_db_url(settings.DATABASE_URL)
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )
    with engine.connect() as test_conn:
        pass
    print(f"INFO:     Connected to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")
except Exception as exc:
    print(f"WARNING:  Failed to connect to primary DB ({exc}). Falling back to local SQLite.")
    db_url = "sqlite:///./fittrack.db"
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
