import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, parser, llm

router = APIRouter(prefix="/resumes", tags=["Resumes"])

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=List[schemas.Resume], status_code=status.HTTP_201_CREATED)
async def upload_resumes(
    files: List[UploadFile] = File(...),
    job_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Upload and parse multiple resume files (PDF or TXT).
    If a job_id is provided, it automatically computes and saves matching scores for the job spec.
    """
    created_resumes = []
    
    for file in files:
        # Check file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in [".pdf", ".txt"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}' for file {file.filename}. Only PDF and TXT are supported."
            )
        
        # Save file to uploads folder
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file {file.filename} locally: {str(e)}"
            )
            
        try:
            # Step 1: Extract Text & Validate
            raw_text = parser.extract_text_from_file(file_path)
            
            # Step 2: Local Parsing to Structured Pydantic Model
            parsed_resume = llm.parse_resume_with_llm(raw_text)
            
            # Convert nested Pydantic schemas to standard JSON serializable dicts
            exp_dicts = [exp.model_dump() for exp in parsed_resume.experience]
            edu_dicts = [edu.model_dump() for edu in parsed_resume.education]
            
            # Step 3: Save to Database
            db_resume = models.Resume(
                filename=file.filename,
                raw_text=raw_text,
                name=parsed_resume.name,
                email=parsed_resume.email,
                phone=parsed_resume.phone,
                skills=parsed_resume.skills,
                experience=exp_dicts,
                education=edu_dicts
            )
            db.add(db_resume)
            db.commit()
            db.refresh(db_resume)
            
            # Step 4: Automatically calculate match if job_id is specified
            if job_id is not None:
                job = db.query(models.Job).filter(models.Job.id == job_id).first()
                if job:
                    candidate_profile = {
                        "name": db_resume.name,
                        "skills": db_resume.skills,
                        "experience": db_resume.experience,
                        "education": db_resume.education
                    }
                    evaluation = llm.match_candidate_with_llm(candidate_profile, job.description)
                    from app import scoring
                    final_score = scoring.calculate_weighted_score(
                        skill_score=evaluation.skill_score,
                        experience_score=evaluation.experience_score,
                        education_score=evaluation.education_score,
                        role_fit_score=evaluation.role_fit_score
                    )
                    recommendation = scoring.get_recommendation(final_score)
                    
                    db_match = models.Match(
                        resume_id=db_resume.id,
                        job_id=job.id,
                        score=final_score,
                        skill_score=evaluation.skill_score,
                        experience_score=evaluation.experience_score,
                        education_score=evaluation.education_score,
                        role_fit_score=evaluation.role_fit_score,
                        justification=evaluation.justification,
                        strengths=evaluation.strengths,
                        gaps=evaluation.gaps,
                        recommendation=recommendation,
                        stage="Screening",
                        notes=""
                    )
                    db.add(db_match)
                    db.commit()
            
            created_resumes.append(db_resume)
            
        except Exception as e:
            # Clean up the file if processing failed
            if os.path.exists(file_path):
                os.remove(file_path)
            db.rollback()
            
            # Let the error carry through or wrap it with file name context
            if isinstance(e, HTTPException):
                raise HTTPException(
                    status_code=e.status_code,
                    detail=f"Error parsing file '{file.filename}': {e.detail}"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing file '{file.filename}': {str(e)}"
            )
            
    return created_resumes

@router.get("", response_model=List[schemas.Resume])
def list_resumes(db: Session = Depends(get_db)):
    """
    Get all uploaded and parsed resumes.
    """
    return db.query(models.Resume).order_by(models.Resume.created_at.desc()).all()

@router.delete("/{resume_id}", status_code=status.HTTP_200_OK)
def delete_resume(resume_id: int, db: Session = Depends(get_db)):
    """
    Delete a resume from the database. All related matches are deleted automatically via Cascade.
    """
    resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Try to delete the local file if it exists
    file_path = os.path.join(UPLOAD_DIR, resume.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass
            
    db.delete(resume)
    db.commit()
    return {"message": "Successfully deleted candidate resume and associated records."}

