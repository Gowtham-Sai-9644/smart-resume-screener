import os
from pypdf import PdfReader
from fastapi import HTTPException, status

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file using pypdf.
    Validates that the file contains usable text.
    """
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        # Clean and validate the extracted text
        cleaned_text = text.strip()
        
        # Simple heuristic to verify we extracted actual text, not just empty space or scan images
        if not cleaned_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="PDF appears to be empty or contains only images (scanned PDF). Please upload a text-based PDF."
            )
            
        # Check if the extracted text has any real alphanumeric character content
        letters_count = sum(c.isalpha() for c in cleaned_text)
        if letters_count < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Extracted text is too short or corrupted. Please upload a valid text-based PDF."
            )
            
        return cleaned_text
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to parse PDF file: {str(e)}"
        )

def extract_text_from_file(file_path: str) -> str:
    """
    Dispatcher to extract text based on file extensions (PDF, TXT).
    """
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".txt":
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read().strip()
            if not text or len(text) < 50:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Text file is empty or too short. Please upload a valid resume."
                )
            return text
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read text file: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Only PDF and TXT files are supported."
        )
