"""GigSaathi — Income Summary Routes.

Endpoints for fetching income data — total earnings, platform breakdowns,
and monthly trends. These endpoints hit MongoDB directly (no agent involved).
"""

from fastapi import APIRouter, HTTPException

from app.db.database import mongodb
from app.agent.tools import get_income_summary

router = APIRouter()


@router.get("/income/{user_id}")
async def get_income(user_id: str, financial_year: str = "2025-26"):
    """Get the user's complete income summary.

    Returns total earnings, TDS deducted, and breakdowns by platform
    and month. Excludes duplicate records.

    Args:
        user_id: The user whose income to fetch.
        financial_year: Financial year to query. Defaults to 2025-26.
    """
    user = await mongodb.user_profiles.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    summary = await get_income_summary(user_id, financial_year)

    # Normalize to match the frontend IncomeSummary interface:
    # Convert by_platform array → platform_breakdown Record
    by_platform = summary.get("by_platform", [])
    platform_breakdown = {
        p["platform"]: {
            "gross": p["gross_income"],
            "tds": p["tds_deducted"],
            "count": p["record_count"],
        }
        for p in by_platform
    }

    # Convert by_month array → monthly_breakdown Record (month-year string → amount)
    by_month = summary.get("by_month", [])
    monthly_breakdown = {
        f"{m['month']} {m['year']}": m["gross_income"]
        for m in by_month
    }

    return {
        **summary,
        "net_income": summary.get("total_net_income", 0),
        "platform_breakdown": platform_breakdown,
        "monthly_breakdown": monthly_breakdown,
    }


@router.get("/income/{user_id}/records")
async def get_income_records(
    user_id: str,
    platform: str | None = None,
    include_duplicates: bool = False,
    limit: int = 100,
    skip: int = 0,
):
    """Get individual income records for a user.

    Args:
        user_id: The user whose records to fetch.
        platform: Optional filter by platform name.
        include_duplicates: Whether to include duplicate-flagged records.
        limit: Max records to return (default 100).
        skip: Number of records to skip (for pagination).
    """
    query = {"user_id": user_id}

    if not include_duplicates:
        query["is_duplicate"] = False

    if platform:
        query["platform"] = platform.lower()

    cursor = (
        mongodb.income_records.find(query)
        .sort("payment_date", -1)
        .skip(skip)
        .limit(limit)
    )

    records = await cursor.to_list(length=limit)
    total = await mongodb.income_records.count_documents(query)

    return {
        "user_id": user_id,
        "records": [
            {
                "id": str(r["_id"]),
                "platform": r["platform"],
                "amount": r["amount"],
                "tds_deducted": r["tds_deducted"],
                "payment_date": r["payment_date"].isoformat(),
                "source_pdf_name": r.get("source_pdf_name", ""),
                "description": r.get("description", ""),
                "is_duplicate": r.get("is_duplicate", False),
            }
            for r in records
        ],
        "total": total,
        "limit": limit,
        "skip": skip,
    }
