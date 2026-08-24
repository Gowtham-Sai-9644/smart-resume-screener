import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environmental variables from .env
load_dotenv()

from app.database import engine, Base, SessionLocal
from app.models import Job
from app.routes import jobs, resumes, matches

from sqlalchemy import text

# Initialize DB tables (creates them if they don't exist)
Base.metadata.create_all(bind=engine)

# Auto-migration: check and inject missing columns if they do not exist
db_conn = engine.connect()
try:
    result = db_conn.execute(text("PRAGMA table_info(matches)"))
    columns = [row[1] for row in result.fetchall()]
    
    if "stage" not in columns:
        db_conn.execute(text("ALTER TABLE matches ADD COLUMN stage VARCHAR DEFAULT 'Screening'"))
        print("Schema Migration: Added 'stage' column to 'matches' table.")
    if "notes" not in columns:
        db_conn.execute(text("ALTER TABLE matches ADD COLUMN notes TEXT DEFAULT ''"))
        print("Schema Migration: Added 'notes' column to 'matches' table.")
    db_conn.commit()
except Exception as e:
    print(f"Database schema migration status: {e}")
finally:
    db_conn.close()

# Seed default job description if database is empty
db = SessionLocal()
try:
    if db.query(Job).count() == 0:
        sample_job = Job(
            title="Senior Full Stack Engineer (Python & React)",
            description=(
                "We are looking for a Senior Full Stack Engineer to design and build scalable web applications.\n\n"
                "Key Requirements:\n"
                "- 5+ years of experience in software development.\n"
                "- Strong proficiency in Python (FastAPI or Django) and React (JavaScript/TypeScript).\n"
                "- Experience with relational databases (SQLite, PostgreSQL) and ORMs (SQLAlchemy).\n"
                "- Solid understanding of RESTful API design, HTML5, CSS3, and Tailwind CSS.\n"
                "- Bachelor's or Master's degree in Computer Science or a related engineering field."
            )
        )
        db.add(sample_job)
        db.commit()
finally:
    db.close()

app = FastAPI(
    title="Smart Resume Screener API",
    description="Intelligent recruitment assistant that parses resumes, analyzes job fits, and screens candidates using Gemini AI.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development; in production restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(jobs.router)
app.include_router(resumes.router)
app.include_router(matches.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Smart Resume Screener API",
        "docs": "/docs",
        "status": "healthy"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
