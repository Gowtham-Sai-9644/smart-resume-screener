from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    matches = relationship("Match", back_populates="job", cascade="all, delete-orphan")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    name = Column(String, index=True, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    skills = Column(JSON, nullable=True)        # List of skills: e.g., ["Python", "FastAPI"]
    experience = Column(JSON, nullable=True)    # List of experience dicts
    education = Column(JSON, nullable=True)     # List of education dicts
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    matches = relationship("Match", back_populates="resume", cascade="all, delete-orphan")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    
    score = Column(Float, nullable=False)  # Final weighted score (e.g. 8.6)
    skill_score = Column(Float, nullable=False)
    experience_score = Column(Float, nullable=False)
    education_score = Column(Float, nullable=False)
    role_fit_score = Column(Float, nullable=False)
    
    justification = Column(Text, nullable=False)
    strengths = Column(JSON, nullable=True)  # List of strings
    gaps = Column(JSON, nullable=True)       # List of strings
    recommendation = Column(String, nullable=False)  # SHORTLIST, REVIEW, REJECT
    stage = Column(String, default="Screening", nullable=False)  # Screening, Interview, Offered, Hired, Rejected
    notes = Column(Text, default="", nullable=True)              # Recruiter internal notes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("Job", back_populates="matches")
    resume = relationship("Resume", back_populates="matches")
