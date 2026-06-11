"""GigSaathi — Deadline Alert Routes.

Endpoints for checking advance tax deadlines and alerting users.
"""

from fastapi import APIRouter, HTTPException

from app.db.database import mongodb
from app.agent.tools import check_deadlines

router = APIRouter()


@router.get("/deadlines/{user_id}")
async def get_deadlines(user_id: str):
    """Get upcoming advance tax deadlines and amounts due.

    Returns the full advance tax schedule with past/future status,
    days remaining, amount due at each installment, and an alert level
    (urgent/warning/ok).

    Args:
        user_id: The user whose deadlines to check.
    """
    user = await mongodb.user_profiles.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    result = await check_deadlines(user_id)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    # Normalize to match frontend expectations:
    # backend returns "deadlines" array, frontend expects "installments"
    raw_deadlines = result.get("deadlines", [])
    installments = []
    for d in raw_deadlines:
        installments.append({
            "installment": d.get("label", ""),
            "due_date": d.get("due_date", ""),
            "cumulative_percent": d.get("cumulative_percent", 0),
            "amount_due": d.get("amount_due", 0),
            "status": "paid" if d.get("is_past") else ("due" if d.get("days_remaining", 99) <= 30 else "upcoming"),
            "days_remaining": d.get("days_remaining"),
            "alert_level": d.get("alert_level", "ok"),
        })

    # Normalize next_deadline
    next_dl = result.get("next_deadline")
    if next_dl:
        next_dl = {
            "installment": next_dl.get("label", ""),
            "due_date": next_dl.get("due_date", ""),
            "cumulative_percent": next_dl.get("cumulative_percent", 0),
            "amount_due": next_dl.get("amount_due", 0),
            "status": "due" if not next_dl.get("is_past") else "paid",
            "days_remaining": next_dl.get("days_remaining"),
            "alert_level": result.get("alert_level", "ok"),
        }

    return {
        **result,
        "installments": installments,
        "next_deadline": next_dl,
    }
