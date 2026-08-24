def calculate_weighted_score(
    skill_score: float,
    experience_score: float,
    education_score: float,
    role_fit_score: float
) -> float:
    """
    Calculates the final score out of 10 based on predefined recruiter weights:
    - Skills: 40%
    - Experience: 30%
    - Education: 10%
    - Role Fit: 20%
    """
    weighted = (
        (skill_score * 0.4) +
        (experience_score * 0.3) +
        (education_score * 0.1) +
        (role_fit_score * 0.2)
    )
    return round(weighted, 1)

def get_recommendation(score: float) -> str:
    """
    Determines recruiter recommendation based on transparent thresholds:
    - >= 8.0: SHORTLIST
    - 6.0 - 7.9: REVIEW
    - < 6.0: REJECT
    """
    if score >= 8.0:
        return "SHORTLIST"
    elif score >= 6.0:
        return "REVIEW"
    else:
        return "REJECT"
