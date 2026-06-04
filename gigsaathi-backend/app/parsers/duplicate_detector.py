"""GigSaathi — Duplicate Transaction Detector.

Detects duplicate transactions when both platform PDFs and bank statements
are uploaded. Platform PDF entries are treated as the source of truth.
Bank statement entries matching a platform entry (same date ±1 day, same amount ±₹1)
are flagged as duplicates.
"""

from datetime import datetime, timedelta

from app.db.database import mongodb


class DuplicateDetector:
    """Cross-references platform PDF entries against bank statement entries
    to prevent double-counting income."""

    # Tolerance for matching
    DATE_TOLERANCE_DAYS = 1
    AMOUNT_TOLERANCE_INR = 1.0

    async def detect_and_flag_duplicates(self, user_id: str) -> dict:
        """Scan all income records for a user and flag bank statement
        entries that duplicate platform entries.

        Args:
            user_id: The user whose records to scan.

        Returns:
            Dictionary with:
                - duplicates_found: Number of duplicates detected
                - duplicates_flagged: List of flagged record IDs
                - total_duplicate_amount: Sum of duplicate amounts
        """
        collection = mongodb.income_records

        # Get all platform entries (source of truth)
        platform_entries = await collection.find(
            {
                "user_id": user_id,
                "platform": {"$ne": "bank_statement"},
                "is_duplicate": False,
            }
        ).to_list(length=None)

        # Get all bank statement entries (candidates for duplicate flagging)
        bank_entries = await collection.find(
            {
                "user_id": user_id,
                "platform": "bank_statement",
                "is_duplicate": False,
                "transaction_type": "credit",  # Only incoming payments
            }
        ).to_list(length=None)

        duplicates_flagged = []
        total_duplicate_amount = 0.0

        # Build a hash map from platform entries keyed by (date_str, amount_bucket).
        # Amount is rounded to the nearest integer to absorb the ±₹1 tolerance.
        # This gives O(n) lookup instead of the previous O(n×m) nested loop.
        platform_map: dict[tuple, list] = {}
        for pe in platform_entries:
            pe_date = pe["payment_date"].date()
            key = (str(pe_date), round(pe["amount"]))
            platform_map.setdefault(key, []).append(pe)

        for bank_entry in bank_entries:
            bank_date = bank_entry["payment_date"].date()
            bank_amount = bank_entry["amount"]
            bank_rounded = round(bank_amount)

            # Check the exact date bucket and ±1-day neighbours to respect tolerance.
            matched = False
            for delta in (0, -1, 1):
                candidate_date = bank_date + timedelta(days=delta)
                key = (str(candidate_date), bank_rounded)
                candidates = platform_map.get(key, [])
                for platform_entry in candidates:
                    # Fine-grained amount check (±₹1)
                    if abs(bank_amount - platform_entry["amount"]) <= self.AMOUNT_TOLERANCE_INR:
                        await collection.update_one(
                            {"_id": bank_entry["_id"]},
                            {
                                "$set": {
                                    "is_duplicate": True,
                                    "duplicate_of": str(platform_entry["_id"]),
                                }
                            },
                        )
                        duplicates_flagged.append(str(bank_entry["_id"]))
                        total_duplicate_amount += bank_amount
                        matched = True
                        break
                if matched:
                    break

        return {
            "user_id": user_id,
            "duplicates_found": len(duplicates_flagged),
            "duplicates_flagged": duplicates_flagged,
            "total_duplicate_amount": total_duplicate_amount,
            "platform_entries_count": len(platform_entries),
            "bank_entries_scanned": len(bank_entries),
        }

    async def check_single_entry(
        self, user_id: str, amount: float, payment_date: datetime
    ) -> dict | None:
        """Check if a single entry has a potential duplicate.

        Args:
            user_id: The user ID to search within.
            amount: The transaction amount.
            payment_date: The transaction date.

        Returns:
            The matching platform entry if a duplicate is found, None otherwise.
        """
        collection = mongodb.income_records

        date_min = payment_date - timedelta(days=self.DATE_TOLERANCE_DAYS)
        date_max = payment_date + timedelta(days=self.DATE_TOLERANCE_DAYS)
        amount_min = amount - self.AMOUNT_TOLERANCE_INR
        amount_max = amount + self.AMOUNT_TOLERANCE_INR

        match = await collection.find_one(
            {
                "user_id": user_id,
                "platform": {"$ne": "bank_statement"},
                "payment_date": {"$gte": date_min, "$lte": date_max},
                "amount": {"$gte": amount_min, "$lte": amount_max},
                "is_duplicate": False,
            }
        )

        return match


# Singleton instance
duplicate_detector = DuplicateDetector()
