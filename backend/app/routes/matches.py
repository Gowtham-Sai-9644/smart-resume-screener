from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas, llm, scoring

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.post("", response_model=List[schemas.MatchDetailResponse], status_code=status.HTTP_200_OK)
def evaluate_matches(request: schemas.MatchRequest, db: Session = Depends(get_db)):
    """
    Evaluates resumes against a job description.
    If `resume_ids` is provided, matches those specific resumes.
    Otherwise, matches ALL resumes in the database.
    """
    # 1. Fetch Job
    job = db.query(models.Job).filter(models.Job.id == request.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {request.job_id} not found."
        )

    # 2. Fetch Resumes
    if request.resume_ids:
        resumes = db.query(models.Resume).filter(models.Resume.id.in_(request.resume_ids)).all()
        if len(resumes) != len(request.resume_ids):
            found_ids = [r.id for r in resumes]
            missing_ids = list(set(request.resume_ids) - set(found_ids))
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resumes not found for IDs: {missing_ids}"
            )
    else:
        resumes = db.query(models.Resume).all()
        if not resumes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No resumes found in the database. Please upload resumes first."
            )

    results = []
    
    for resume in resumes:
        # Construct simplified structured profile for LLM matching (saves token overhead)
        candidate_profile = {
            "name": resume.name,
            "skills": resume.skills,
            "experience": resume.experience,
            "education": resume.education
        }
        
        try:
            # Step 1: Query Gemini for structured scores, strengths, gaps, and justification
            evaluation = llm.match_candidate_with_llm(candidate_profile, job.description)
            
            # Step 2: Compute deterministic weighted score in python backend
            final_score = scoring.calculate_weighted_score(
                skill_score=evaluation.skill_score,
                experience_score=evaluation.experience_score,
                education_score=evaluation.education_score,
                role_fit_score=evaluation.role_fit_score
            )
            
            # Step 3: Determine Recommendation category
            recommendation = scoring.get_recommendation(final_score)
            
            # Step 4: Check if match already exists
            existing_match = db.query(models.Match).filter(
                models.Match.resume_id == resume.id,
                models.Match.job_id == job.id
            ).first()
            
            if existing_match:
                # Update existing evaluation
                existing_match.score = final_score
                existing_match.skill_score = evaluation.skill_score
                existing_match.experience_score = evaluation.experience_score
                existing_match.education_score = evaluation.education_score
                existing_match.role_fit_score = evaluation.role_fit_score
                existing_match.justification = evaluation.justification
                existing_match.strengths = evaluation.strengths
                existing_match.gaps = evaluation.gaps
                existing_match.recommendation = recommendation
                db_match = existing_match
            else:
                # Create new evaluation
                db_match = models.Match(
                    resume_id=resume.id,
                    job_id=job.id,
                    score=final_score,
                    skill_score=evaluation.skill_score,
                    experience_score=evaluation.experience_score,
                    education_score=evaluation.education_score,
                    role_fit_score=evaluation.role_fit_score,
                    justification=evaluation.justification,
                    strengths=evaluation.strengths,
                    gaps=evaluation.gaps,
                    recommendation=recommendation
                )
                db.add(db_match)
                
            db.commit()
            db.refresh(db_match)
            
            # Formulate response object with joined fields manually to match schema response
            res_obj = schemas.MatchDetailResponse(
                id=db_match.id,
                resume_id=db_match.resume_id,
                job_id=db_match.job_id,
                score=db_match.score,
                skill_score=db_match.skill_score,
                experience_score=db_match.experience_score,
                education_score=db_match.education_score,
                role_fit_score=db_match.role_fit_score,
                justification=db_match.justification,
                strengths=db_match.strengths,
                gaps=db_match.gaps,
                recommendation=db_match.recommendation,
                created_at=db_match.created_at,
                resume=schemas.ResumeBase(
                    filename=resume.filename,
                    name=resume.name,
                    email=resume.email,
                    phone=resume.phone,
                    skills=resume.skills,
                    experience=resume.experience,
                    education=resume.education
                ),
                job_title=job.title
            )
            results.append(res_obj)
            
        except Exception as e:
            db.rollback()
            # If matching a single candidate fails, wrap in exception. If batch, keep going or raise.
            # In our case, we fail the entire request or report it. Let's raise an HTTP exception.
            if isinstance(e, HTTPException):
                raise HTTPException(
                    status_code=e.status_code,
                    detail=f"Error evaluating candidate '{resume.name or resume.filename}': {e.detail}"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error evaluating candidate '{resume.name or resume.filename}': {str(e)}"
            )
            
    return results

@router.get("", response_model=List[schemas.MatchDetailResponse])
def list_matches(
    job_id: Optional[int] = None,
    recommendation: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lists all matches, sorted by final score (highest first).
    Supports filtering by job_id and recommendation category.
    """
    query = db.query(models.Match)
    
    if job_id is not None:
        query = query.filter(models.Match.job_id == job_id)
    if recommendation is not None:
        query = query.filter(models.Match.recommendation == recommendation)
        
    db_matches = query.order_by(models.Match.score.desc()).all()
    
    results = []
    for m in db_matches:
        results.append(
            schemas.MatchDetailResponse(
                id=m.id,
                resume_id=m.resume_id,
                job_id=m.job_id,
                score=m.score,
                skill_score=m.skill_score,
                experience_score=m.experience_score,
                education_score=m.education_score,
                role_fit_score=m.role_fit_score,
                justification=m.justification,
                strengths=m.strengths,
                gaps=m.gaps,
                recommendation=m.recommendation,
                created_at=m.created_at,
                resume=schemas.ResumeBase(
                    filename=m.resume.filename,
                    name=m.resume.name,
                    email=m.resume.email,
                    phone=m.resume.phone,
                    skills=m.resume.skills,
                    experience=m.resume.experience,
                    education=m.resume.education
                ),
                job_title=m.job.title
            )
        )
    return results

@router.get("/{match_id}", response_model=schemas.MatchDetailResponse)
def get_match_detail(match_id: int, db: Session = Depends(get_db)):
    """
    Get detailed breakdown of a single evaluation.
    """
    m = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match evaluation with ID {match_id} not found."
        )
        
    return schemas.MatchDetailResponse(
        id=m.id,
        resume_id=m.resume_id,
        job_id=m.job_id,
        score=m.score,
        skill_score=m.skill_score,
        experience_score=m.experience_score,
        education_score=m.education_score,
        role_fit_score=m.role_fit_score,
        justification=m.justification,
        strengths=m.strengths,
        gaps=m.gaps,
        recommendation=m.recommendation,
        stage=m.stage,
        notes=m.notes,
        created_at=m.created_at,
        resume=schemas.ResumeBase(
            filename=m.resume.filename,
            name=m.resume.name,
            email=m.resume.email,
            phone=m.resume.phone,
            skills=m.resume.skills,
            experience=m.resume.experience,
            education=m.resume.education
        ),
        job_title=m.job.title
    )

@router.patch("/{match_id}", response_model=schemas.MatchDetailResponse)
def update_match(match_id: int, request: schemas.MatchUpdate, db: Session = Depends(get_db)):
    """
    Updates match evaluation details (such as recruiter notes or hiring pipeline stage).
    """
    m = db.query(models.Match).filter(models.Match.id == match_id).first()
    if not m:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Match evaluation with ID {match_id} not found."
        )
        
    if request.stage is not None:
        m.stage = request.stage
    if request.notes is not None:
        m.notes = request.notes
        
    db.commit()
    db.refresh(m)
    
    return schemas.MatchDetailResponse(
        id=m.id,
        resume_id=m.resume_id,
        job_id=m.job_id,
        score=m.score,
        skill_score=m.skill_score,
        experience_score=m.experience_score,
        education_score=m.education_score,
        role_fit_score=m.role_fit_score,
        justification=m.justification,
        strengths=m.strengths,
        gaps=m.gaps,
        recommendation=m.recommendation,
        stage=m.stage,
        notes=m.notes,
        created_at=m.created_at,
        resume=schemas.ResumeBase(
            filename=m.resume.filename,
            name=m.resume.name,
            email=m.resume.email,
            phone=m.resume.phone,
            skills=m.resume.skills,
            experience=m.resume.experience,
            education=m.resume.education
        ),
        job_title=m.job.title
    )

