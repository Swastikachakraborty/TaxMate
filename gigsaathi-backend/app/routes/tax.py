"""GigSaathi — Tax Calculation Routes.

Endpoints for tax computation and ITR-4 summary generation.
"""

from fastapi import APIRouter, HTTPException

from app.db.database import mongodb
from app.agent.tools import calculate_tax, generate_itr_summary, find_deductions

router = APIRouter()


@router.get("/tax/{user_id}")
async def get_tax_calculation(user_id: str):
    """Calculate and return the user's tax liability.

    Applies Section 44ADA if opted, uses FY 2025-26 new regime slabs,
    and returns a detailed breakdown including slab-wise tax, cess,
    TDS credit, and net payable.

    Args:
        user_id: The user whose tax to calculate.
    """
    user = await mongodb.user_profiles.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    result = await calculate_tax(user_id)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    # Add field aliases the frontend Dashboard expects
    result["deduction_44ada"] = result.get("presumptive_income") or 0
    result["net_taxable_income"] = result.get("taxable_income", 0)
    # gross_income is already in result

    return result


@router.get("/tax/{user_id}/itr")
async def get_itr_summary(user_id: str):
    """Generate ITR-4 (Sugam) field mapping for the user.

    Returns a structured document with all fields needed to file ITR-4,
    including personal info, income computation, tax calculation, and
    TDS details.

    Args:
        user_id: The user whose ITR to generate.
    """
    user = await mongodb.user_profiles.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    result = await generate_itr_summary(user_id)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    # Adapt the backend tool response to match the frontend ItrSummary interface
    pi = result.get("part_a_general", {})
    bp = result.get("schedule_bp_profession_income", {})
    ti = result.get("part_b_total_income", {})
    tc = result.get("part_b_tti_tax_computation", {})
    tp = result.get("tax_paid_and_verification", {})

    platform_income = {
        p["platform"]: p["gross_income"]
        for p in bp.get("platform_wise_receipts", [])
    }

    return {
        "user_id": user_id,
        "form_type": result.get("form_type", "ITR-4"),
        "assessment_year": result.get("assessment_year", "2026-27"),
        "personal_info": {
            "name": pi.get("name", ""),
            "pan_number": pi.get("pan") or "",
            "state": pi.get("state", ""),
        },
        "income_computation": {
            "gross_receipts": bp.get("gross_receipts", 0),
            "deduction_44ada": bp.get("presumptive_income_44ADA", 0),
            "net_taxable": ti.get("total_taxable_income", 0),
        },
        "tax_computation": {
            "total_tax": tc.get("total_tax_liability", 0),
            "tds_credit": tp.get("tds_claimed", 0),
            "net_payable": tp.get("tax_payable", 0),
        },
        "platform_income": platform_income,
    }


@router.get("/tax/{user_id}/deductions")
async def get_deductions(user_id: str):
    """Get applicable deductions for the user.

    Returns occupation-specific deductions with estimated amounts.
    Includes a note about 44ADA implications if the user has opted for it.

    Args:
        user_id: The user whose deductions to find.
    """
    user = await mongodb.user_profiles.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")

    result = await find_deductions(user_id)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result
