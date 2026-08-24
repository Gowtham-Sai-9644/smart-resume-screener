from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# --- EXPERIENCE & EDUCATION ---
class ExperienceDetail(BaseModel):
    company: Optional[str] = Field(..., description="Name of the company or organization or null if not found")
    role: Optional[str] = Field(..., description="Job title or role or null if not found")
    duration: Optional[str] = Field(..., description="Duration, e.g., '2 years', '2021 - 2023' or null if not found")
    description: Optional[str] = Field(..., description="Brief description of responsibilities/projects or null if not found")

class EducationDetail(BaseModel):
    institution: Optional[str] = Field(..., description="Name of school, college, or university or null if not found")
    degree: Optional[str] = Field(..., description="Degree or certificate obtained, e.g. B.Tech Computer Science or null if not found")
    graduation_year: Optional[str] = Field(..., description="Graduation year or date or null if not found")


# --- LLM RESPONSES ---
class LLMResumeParse(BaseModel):
    name: str = Field(..., description="Candidate's full name")
    email: Optional[str] = Field(..., description="Candidate's email address or null if not found")
    phone: Optional[str] = Field(..., description="Candidate's phone number or null if not found")
    skills: List[str] = Field(..., description="List of technical and soft skills extracted, empty list if none found")
    experience: List[ExperienceDetail] = Field(..., description="Extracted work history, empty list if none found")
    education: List[EducationDetail] = Field(..., description="Extracted education details, empty list if none found")

class LLMCandidateMatch(BaseModel):
    skill_score: float = Field(..., ge=1, le=10, description="Score for technical/soft skills fit out of 10")
    experience_score: float = Field(..., ge=1, le=10, description="Score for years and quality of experience out of 10")
    education_score: float = Field(..., ge=1, le=10, description="Score for educational background alignment out of 10")
    role_fit_score: float = Field(..., ge=1, le=10, description="Score for general role/culture/dynamic fit out of 10")
    strengths: List[str] = Field(..., description="Detailed list of candidate's strengths relative to the JD. Keep bullet points concise and evidence-based.")
    gaps: List[str] = Field(..., description="Detailed list of missing skills, experience gaps, or weaknesses relative to the JD. Keep bullet points concise and evidence-based.")
    justification: str = Field(..., description="A detailed explanation explaining why the candidate received these scores based on evidence in the resume. Avoid generic statements.")


# --- JOB SCHEMAS ---
class JobBase(BaseModel):
    title: str
    description: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- RESUME SCHEMAS ---
class ResumeBase(BaseModel):
    filename: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[List[ExperienceDetail]] = []
    education: Optional[List[EducationDetail]] = []

class ResumeCreate(BaseModel):
    filename: str
    raw_text: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: Optional[List[str]] = []
    experience: Optional[List[ExperienceDetail]] = []
    education: Optional[List[EducationDetail]] = []

class Resume(ResumeBase):
    id: int
    raw_text: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- MATCH SCHEMAS ---
class MatchBase(BaseModel):
    resume_id: int
    job_id: int
    score: float
    skill_score: float
    experience_score: float
    education_score: float
    role_fit_score: float
    justification: str
    strengths: List[str]
    gaps: List[str]
    recommendation: str
    stage: Optional[str] = "Screening"
    notes: Optional[str] = ""

class MatchCreate(MatchBase):
    pass

class Match(MatchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MatchDetailResponse(Match):
    resume: ResumeBase
    job_title: str

    class Config:
        from_attributes = True

class MatchUpdate(BaseModel):
    stage: Optional[str] = None
    notes: Optional[str] = None

class MatchRequest(BaseModel):
    job_id: int
    resume_ids: Optional[List[int]] = None


