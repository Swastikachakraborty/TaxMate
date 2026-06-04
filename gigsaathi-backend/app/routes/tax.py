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

    mapped_result = {
        "user_id": user_id,
        "form_type": result.get("form_type"),
        "assessment_year": result.get("assessment_year"),
        "personal_info": {
            "name": result["part_a_general"]["name"],
            "pan_number": result["part_a_general"]["pan"],
            "state": result["part_a_general"]["state"]
        },
        "income_computation": {
            "gross_receipts": result["schedule_bp_profession_income"]["gross_receipts"],
            "deduction_44ada": result["schedule_bp_profession_income"]["gross_receipts"] * 0.5,
            "net_taxable": result["schedule_bp_profession_income"]["presumptive_income_44ADA"]
        },
        "tax_computation": {
            "total_tax": result["part_b_tti_tax_computation"]["total_tax_liability"],
            "tds_credit": result["schedule_tds"]["total_tds_deducted"],
            "advance_tax_paid": result["tax_paid_and_verification"]["advance_tax_paid"],
            "net_payable": result["tax_paid_and_verification"]["tax_payable"] - result["tax_paid_and_verification"]["refund_due"]
        },
        "platform_income": {
            p["platform"]: p["gross_income"]
            for p in result["schedule_bp_profession_income"]["platform_wise_receipts"]
        }
    }

    return mapped_result


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
