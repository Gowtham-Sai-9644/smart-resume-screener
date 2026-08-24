from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=schemas.Job, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    db_job = models.Job(title=job.title, description=job.description)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("", response_model=List[schemas.Job])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).order_by(models.Job.created_at.desc()).all()

@router.delete("/{job_id}", status_code=status.HTTP_200_OK)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    """
    Deletes a job specification and cascadingly deletes all evaluations for it.
    """
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job description with ID {job_id} not found."
        )
    db.delete(job)
    db.commit()
    return {"message": f"Successfully deleted job opening '{job.title}' and associated records."}

