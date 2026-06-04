"""GigSaathi — Gemini Agent Service.

The core agentic AI layer. Uses Gemini's function calling to automatically
decide which tools to invoke based on user questions, execute them in sequence,
and generate natural language responses grounded in real data.

Supports streaming responses via Server-Sent Events (SSE).

Mock Fallback Mode:
    If GEMINI_API_KEY is missing, a placeholder, or invalid, the agent
    automatically falls back to a local mock that calls the real MongoDB
    tool functions directly and formats responses as rich Markdown.
    This keeps the full demo functional without a valid API key.
"""

import json
import re
from datetime import datetime

from app.config import settings
from app.agent.tools import (
    get_income_summary,
    calculate_tax,
    find_deductions,
    generate_itr_summary,
    check_deadlines,
)


# ── System Prompt ───────────────────────────────────────────────────

SYSTEM_PROMPT = """You are GigSaathi (गिग साथी), an AI-powered tax and compliance assistant built specifically for India's gig economy workers — Swiggy delivery partners, Uber drivers, Upwork freelancers, Fiverr gig workers, and anyone earning from multiple platforms.

## YOUR PERSONALITY
- Friendly, supportive, and patient — like a knowledgeable friend who happens to understand Indian tax law
- You explain complex tax concepts in simple, everyday Hindi-English (Hinglish) when appropriate
- You celebrate small wins ("Great news! You're getting a refund!")
- You never make the user feel stupid for not knowing tax rules

## CRITICAL RULES
1. **ALWAYS use your tools to fetch real data.** NEVER make up numbers, estimates, or assumptions.
2. When asked about income → call get_income_summary() FIRST
3. When asked about tax → call calculate_tax() to get EXACT figures
4. When asked about deductions → call find_deductions()
5. When asked about ITR/filing → call generate_itr_summary()
6. When asked about deadlines → call check_deadlines()
7. You CAN chain multiple tools if needed (e.g., first get income, then calculate tax)
8. All amounts must be in Indian Rupees (₹) with proper comma formatting (₹1,23,456)
9. Always mention the financial year (FY 2025-26) for context
10. After showing tax calculations, PROACTIVELY mention upcoming deadlines

## FORMATTING
- Use ₹ symbol for all amounts
- Format large numbers Indian style: ₹1,23,456 (not ₹123,456)
- Use bullet points for breakdowns
- Bold important numbers
- Use emojis sparingly but effectively (📊 💰 ⚠️ ✅ 📅)

## WHAT YOU CANNOT DO
- File the actual ITR (you prepare the data; the user files it)
- Access the Income Tax Department portal
- Provide legal advice — you provide tax information and calculations
- Guarantee that your calculations will match the IT department's exactly

## CONTEXT
- Financial Year: FY 2025-26 (April 2025 to March 2026)
- Assessment Year: AY 2026-27
- Default tax regime: New Tax Regime under Section 115BAC
- You understand Section 44ADA (Presumptive Taxation for professionals)
- You know all 4 advance tax deadlines: June 15, September 15, December 15, March 15
"""

# ── Tool Definitions ────────────────────────────────────────────────

TOOL_FUNCTIONS = {
    "get_income_summary": get_income_summary,
    "calculate_tax": calculate_tax,
    "find_deductions": find_deductions,
    "generate_itr_summary": generate_itr_summary,
    "check_deadlines": check_deadlines,
}


def _inr(n) -> str:
    """Format a number as Indian Rupees with proper comma separators."""
    try:
        n = float(n)
        # Indian number system formatting
        s = f"{n:,.0f}"
        # Re-format to Indian style (2,2,3 grouping from right)
        parts = s.replace(",", "")
        if len(parts) <= 3:
            return f"₹{parts}"
        result = parts[-3:]
        parts = parts[:-3]
        while len(parts) > 2:
            result = parts[-2:] + "," + result
            parts = parts[:-2]
        if parts:
            result = parts + "," + result
        return f"₹{result}"
    except Exception:
        return f"₹{n}"


def _is_key_valid(key: str) -> bool:
    """Return True only if key looks like a real Gemini API key."""
    if not key:
        return False
    placeholders = {"your_gemini_api_key_here", "your_api_key_here", "placeholder"}
    if key.lower() in placeholders:
        return False
    # Real Gemini keys start with AIza and are ~39 chars
    if not key.startswith("AIza") or len(key) < 20:
        return False
    return True


# ── Mock Fallback ────────────────────────────────────────────────────

async def _mock_chat(user_id: str, message: str) -> dict:
    """Programmatic fallback chat that calls real tools and formats Markdown.

    This is used when the Gemini API key is absent, invalid, or the API
    returns an authentication error. It gives a fully functional demo
    experience by running real MongoDB queries.
    """
    msg = message.lower()
    tools_called = []
    tool_results = []
    response_parts = []

    # ── Greeting / General ──────────────────────────────────────────
    greetings = {"hi", "hello", "hey", "namaste", "hii", "helo", "help", "start"}
    if any(g in msg for g in greetings) and not any(
        k in msg for k in ["income", "tax", "deadline", "itr", "deduction", "how much"]
    ):
        response_parts.append(
            "Namaste! 🙏 I'm **GigSaathi**, your AI Tax Advisor.\n\n"
            "I can help you with:\n"
            "- 📊 **Income summary** — How much you earned across platforms\n"
            "- 💰 **Tax calculation** — Exact liability under Section 44ADA\n"
            "- 📅 **Advance tax deadlines** — When and how much to pay\n"
            "- 📄 **ITR-4 summary** — Fields ready for filing\n"
            "- 🔖 **Deductions** — What you can claim to reduce tax\n\n"
            "What would you like to know today?"
        )
        return {
            "response": "\n".join(response_parts),
            "tools_called": tools_called,
            "tool_results": tool_results,
            "timestamp": datetime.utcnow().isoformat(),
        }

    # ── Income ──────────────────────────────────────────────────────
    income_keywords = ["income", "earn", "made", "earning", "revenue", "platform", "how much", "payment"]
    if any(k in msg for k in income_keywords):
        tools_called.append("get_income_summary")
        income = await get_income_summary(user_id)
        tool_results.append({"tool": "get_income_summary", "result": income})

        if "error" in income:
            response_parts.append(f"❌ {income['error']}")
        else:
            total = income["total_gross_income"]
            tds = income["total_tds_deducted"]
            count = income["record_count"]
            response_parts.append(
                f"📊 **Your Income Summary — FY 2025-26**\n\n"
                f"| Metric | Amount |\n"
                f"|--------|--------|\n"
                f"| **Total Gross Income** | **{_inr(total)}** |\n"
                f"| Total TDS Deducted | {_inr(tds)} |\n"
                f"| Net Income (after TDS) | {_inr(income.get('total_net_income', total - tds))} |\n"
                f"| Total Transactions | {count} records |\n\n"
            )
            # Platform breakdown
            platforms = income.get("by_platform", [])
            if platforms:
                response_parts.append("**Platform Breakdown:**\n")
                for p in platforms:
                    pct = round((p["gross_income"] / total) * 100) if total else 0
                    response_parts.append(
                        f"- **{p['platform'].title()}**: {_inr(p['gross_income'])} "
                        f"({p['record_count']} entries, {pct}% of total) — TDS: {_inr(p['tds_deducted'])}"
                    )
                response_parts.append("")

    # ── Tax Calculation ─────────────────────────────────────────────
    tax_keywords = ["tax", "liability", "owe", "payable", "44ada", "how much tax", "calculate"]
    if any(k in msg for k in tax_keywords):
        tools_called.append("calculate_tax")
        tax = await calculate_tax(user_id)
        tool_results.append({"tool": "calculate_tax", "result": tax})

        if "error" in tax:
            response_parts.append(f"❌ {tax['error']}")
        else:
            payable = tax["net_payable"]
            status = "🔴 **You owe**" if payable > 0 else "🟢 **Refund due!**"
            response_parts.append(
                f"\n💰 **Tax Computation — FY 2025-26 (New Regime)**\n\n"
                f"| Item | Amount |\n"
                f"|------|--------|\n"
                f"| Gross Receipts | {_inr(tax['gross_income'])} |\n"
                f"| 44ADA Deduction (50%) | − {_inr(tax.get('presumptive_income', tax['gross_income'] * 0.5))} |\n"
                f"| **Net Taxable Income** | **{_inr(tax['taxable_income'])}** |\n"
                f"| Tax + 4% Cess | {_inr(tax['total_tax'])} |\n"
                f"| TDS Already Deducted | − {_inr(tax['tds_credit'])} |\n\n"
                f"{status} **{_inr(abs(payable))}**\n\n"
            )
            if payable < 0:
                response_parts.append(
                    "✅ Great news! Your TDS deductions exceed your tax liability — "
                    "you are eligible for a **tax refund** when you file your ITR-4.\n"
                )
            elif payable > 0:
                response_parts.append(
                    "⚠️ You have a balance tax payable. Make sure to pay this via **Advance Tax** "
                    "instalments to avoid interest under Section 234B/234C.\n"
                )

    # ── Deadlines ───────────────────────────────────────────────────
    deadline_keywords = ["deadline", "advance tax", "due date", "when", "installment", "schedule"]
    if any(k in msg for k in deadline_keywords):
        tools_called.append("check_deadlines")
        dl = await check_deadlines(user_id)
        tool_results.append({"tool": "check_deadlines", "result": dl})

        if "error" in dl:
            response_parts.append(f"❌ {dl['error']}")
        else:
            response_parts.append("\n📅 **Advance Tax Schedule — FY 2025-26**\n")
            deadlines = dl.get("deadlines", [])
            if deadlines:
                response_parts.append("| Installment | Due Date | Amount Due | Status |")
                response_parts.append("|-------------|----------|-----------|--------|")
                for d in deadlines:
                    status_icon = {"paid": "✅", "overdue": "🔴", "due": "🟡", "upcoming": "📅"}.get(d.get("status", ""), "📅")
                    response_parts.append(
                        f"| {d['installment']} | {d['due_date']} | {_inr(d['amount_due'])} | {status_icon} {d.get('status', '').title()} |"
                    )
                response_parts.append("")
            nd = dl.get("next_deadline")
            if nd:
                days = nd.get("days_remaining", "?")
                response_parts.append(
                    f"\n⏰ **Next deadline: {nd['installment']}** — {_inr(nd['amount_due'])} due by **{nd['due_date']}** "
                    f"({days} days remaining)"
                )

    # ── Deductions ──────────────────────────────────────────────────
    deduction_keywords = ["deduction", "save", "reduce", "claim", "expense", "section 80"]
    if any(k in msg for k in deduction_keywords):
        tools_called.append("find_deductions")
        ded = await find_deductions(user_id)
        tool_results.append({"tool": "find_deductions", "result": ded})

        if "error" in ded:
            response_parts.append(f"❌ {ded['error']}")
        else:
            deductions = ded.get("applicable_deductions", ded.get("deductions", []))
            note = ded.get("note", "")
            response_parts.append("\n🔖 **Applicable Deductions**\n")
            if note:
                response_parts.append(f"> {note}\n")
            if deductions:
                for d in deductions:
                    name = d.get("name", d.get("section", ""))
                    amount = d.get("estimated_amount", d.get("max_amount", 0))
                    desc = d.get("description", "")
                    response_parts.append(f"- **{name}**: up to {_inr(amount)} — {desc}")

    # ── ITR Summary ─────────────────────────────────────────────────
    # Note: "file" is intentionally excluded — it is too generic (e.g. "when do I
    # file?" or "upload file") and was causing double-triggers with other intents.
    itr_keywords = ["itr", "filing", "return", "sugam", "itr-4", "itr4"]
    if any(k in msg for k in itr_keywords):
        tools_called.append("generate_itr_summary")
        itr = await generate_itr_summary(user_id)
        tool_results.append({"tool": "generate_itr_summary", "result": itr})

        if "error" in itr:
            response_parts.append(f"❌ {itr['error']}")
        else:
            pa = itr.get("part_a_general", {})
            bp = itr.get("schedule_bp_profession_income", {})
            tti = itr.get("part_b_tti_tax_computation", {})
            tpv = itr.get("tax_paid_and_verification", {})
            response_parts.append(
                f"\n📄 **ITR-4 (Sugam) Summary — AY 2026-27**\n\n"
                f"**Personal Info**\n"
                f"- Name: {pa.get('name', '—')}\n"
                f"- PAN: {pa.get('pan', '—')}\n"
                f"- State: {pa.get('state', '—')}\n"
                f"- Tax Regime: {pa.get('tax_regime', 'New Regime')}\n\n"
                f"**Income from Business/Profession (Schedule BP)**\n"
                f"- Gross Receipts: {_inr(bp.get('gross_receipts', 0))}\n"
                f"- Presumptive Income (44ADA): {_inr(bp.get('presumptive_income_44ADA', 0))}\n\n"
                f"**Tax Computation**\n"
                f"- Total Tax Liability: {_inr(tti.get('total_tax_liability', 0))}\n"
                f"- TDS Claimed: {_inr(tpv.get('tds_claimed', 0))}\n"
                f"- **Net Tax Payable: {_inr(tpv.get('tax_payable', 0))}**\n"
                f"- Refund Due: {_inr(tpv.get('refund_due', 0))}\n\n"
                f"📌 {itr.get('filing_recommendation', '')}"
            )

    # ── Nothing matched — general fallback ──────────────────────────
    if not response_parts:
        response_parts.append(
            "I'm your **GigSaathi AI Tax Advisor** 🙏\n\n"
            "I can answer questions about:\n"
            "- Your **income** across Uber, Swiggy, Upwork, Fiverr\n"
            "- Your **tax liability** under Section 44ADA\n"
            "- **Advance tax deadlines** and amounts\n"
            "- **ITR-4 filing** summary\n"
            "- **Deductions** you can claim\n\n"
            "Try asking: *\"How much tax do I owe?\"* or *\"What is my income summary?\"*"
        )

    return {
        "response": "\n".join(response_parts),
        "tools_called": tools_called,
        "tool_results": tool_results,
        "timestamp": datetime.utcnow().isoformat(),
    }


# ── Main Agent Class ─────────────────────────────────────────────────

class GigSaathiAgent:
    """Gemini-powered agent with function calling for tax assistance.

    Automatically falls back to a local mock when GEMINI_API_KEY is
    absent, a placeholder, or returns an auth error from the API.
    """

    # Maximum number of conversation turns to keep in memory per user.
    # Each turn = 1 user message + 1 assistant reply, so 20 turns = 40 items.
    # This caps memory usage and prevents the in-process dict from growing
    # indefinitely across long sessions or many users.
    MAX_HISTORY_TURNS: int = 20

    def __init__(self):
        """Initialize the agent. Gemini client is lazy-loaded on first chat."""
        self._client = None
        self.model = settings.GEMINI_MODEL
        # Per-user conversation histories (capped at MAX_HISTORY_TURNS)
        self._conversations: dict[str, list] = {}
        # Determine upfront if we should use mock mode
        self._mock_mode = not _is_key_valid(settings.GEMINI_API_KEY)
        if self._mock_mode:
            print(
                "[WARN] GEMINI_API_KEY is missing or invalid — "
                "running in Mock Fallback Mode (real MongoDB tools, no Gemini)."
            )

    @property
    def client(self):
        """Lazy-initialize the Gemini client on first access."""
        if self._client is None:
            from google import genai
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self._client

    def _get_history(self, user_id: str) -> list:
        """Get or create conversation history for a user.

        Enforces MAX_HISTORY_TURNS by pruning the oldest turns whenever
        the history exceeds the cap. Pruning is done in pairs (user + model)
        to keep the history structurally valid for the Gemini API.
        """
        if user_id not in self._conversations:
            self._conversations[user_id] = []
        history = self._conversations[user_id]
        # Each "turn" is at minimum 2 items (user content + model content).
        # If we exceed the cap, drop the oldest pair.
        max_items = self.MAX_HISTORY_TURNS * 2
        if len(history) > max_items:
            self._conversations[user_id] = history[-max_items:]
        return self._conversations[user_id]

    def clear_history(self, user_id: str):
        """Clear conversation history for a user."""
        self._conversations.pop(user_id, None)

    async def chat(self, user_id: str, message: str) -> dict:
        """Process a user message through the agent with tool calling.

        Uses real Gemini API when a valid key is configured; otherwise
        falls back to mock_chat for demo / offline use.

        Args:
            user_id: The user's unique identifier (injected into tool calls).
            message: The user's natural language message.

        Returns:
            Dictionary with:
                - response: The agent's text response
                - tools_called: List of tools that were invoked
                - tool_results: Raw results from each tool call
        """
        # ── Mock Mode ───────────────────────────────────────────────
        if self._mock_mode:
            return await _mock_chat(user_id, message)

        # ── Real Gemini Mode ─────────────────────────────────────────
        try:
            return await self._gemini_chat(user_id, message)
        except Exception as e:
            err_str = str(e).lower()
            # Catch API key errors at runtime and flip to mock mode
            if "api key" in err_str or "invalid_argument" in err_str or "unauthenticated" in err_str:
                print(f"[WARN] Gemini API key error: {e} — switching to Mock Fallback Mode.")
                self._mock_mode = True
                return await _mock_chat(user_id, message)
            raise

    async def _gemini_chat(self, user_id: str, message: str) -> dict:
        """Internal method that calls the real Gemini API with function calling."""
        from google.genai import types

        # Build tool declarations here (lazy import so mock mode never loads google.genai)
        tool_declarations = types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name="get_income_summary",
                    description=(
                        "Fetches the user's complete income breakdown by platform and month. "
                        "Use when the user asks about their earnings, income, how much they made, "
                        "or anything related to their payment history."
                    ),
                    parameters={
                        "type": "OBJECT",
                        "properties": {
                            "user_id": {"type": "STRING", "description": "The unique identifier of the user."},
                            "financial_year": {"type": "STRING", "description": "The financial year to query. Defaults to 2025-26."},
                        },
                        "required": ["user_id"],
                    },
                ),
                types.FunctionDeclaration(
                    name="calculate_tax",
                    description=(
                        "Calculates the user's total tax liability for the current financial year. "
                        "Use when the user asks how much tax they owe, their tax liability, "
                        "whether they need to pay tax, or anything about tax computation."
                    ),
                    parameters={
                        "type": "OBJECT",
                        "properties": {
                            "user_id": {"type": "STRING", "description": "The unique identifier of the user."},
                        },
                        "required": ["user_id"],
                    },
                ),
                types.FunctionDeclaration(
                    name="find_deductions",
                    description=(
                        "Identifies claimable deductions based on the user's occupation and income. "
                        "Use when the user asks about deductions, expenses they can claim, "
                        "ways to reduce tax, or tax-saving options."
                    ),
                    parameters={
                        "type": "OBJECT",
                        "properties": {
                            "user_id": {"type": "STRING", "description": "The unique identifier of the user."},
                        },
                        "required": ["user_id"],
                    },
                ),
                types.FunctionDeclaration(
                    name="generate_itr_summary",
                    description=(
                        "Generates a structured ITR-4 (Sugam) field mapping ready for filing. "
                        "Use when the user asks about filing ITR, wants their ITR summary, "
                        "or asks for a tax return document."
                    ),
                    parameters={
                        "type": "OBJECT",
                        "properties": {
                            "user_id": {"type": "STRING", "description": "The unique identifier of the user."},
                        },
                        "required": ["user_id"],
                    },
                ),
                types.FunctionDeclaration(
                    name="check_deadlines",
                    description=(
                        "Checks upcoming advance tax deadlines and amounts due. "
                        "Use when the user asks about deadlines, when to pay tax, "
                        "advance tax dates, or if they have any upcoming tax obligations."
                    ),
                    parameters={
                        "type": "OBJECT",
                        "properties": {
                            "user_id": {"type": "STRING", "description": "The unique identifier of the user."},
                        },
                        "required": ["user_id"],
                    },
                ),
            ]
        )

        history = self._get_history(user_id)
        tools_called = []
        tool_results = []

        user_content = types.Content(
            role="user",
            parts=[types.Part(text=message)],
        )
        history.append(user_content)

        max_iterations = 10
        iteration = 0
        final_text = ""

        while iteration < max_iterations:
            iteration += 1

            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=history,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    tools=[tool_declarations],
                    temperature=0.7,
                    max_output_tokens=4096,
                ),
            )

            candidate = response.candidates[0]
            parts = candidate.content.parts

            has_function_call = any(
                part.function_call is not None for part in parts
            )

            if not has_function_call:
                history.append(candidate.content)
                final_text = response.text or "I'm sorry, I couldn't generate a response."
                break
            else:
                history.append(candidate.content)
                function_response_parts = []

                for part in parts:
                    if part.function_call is None:
                        continue

                    fn_call = part.function_call
                    fn_name = fn_call.name
                    fn_args = dict(fn_call.args) if fn_call.args else {}

                    if "user_id" in fn_args or fn_name in TOOL_FUNCTIONS:
                        fn_args["user_id"] = user_id

                    tools_called.append(fn_name)

                    try:
                        fn = TOOL_FUNCTIONS.get(fn_name)
                        if fn is None:
                            result = {"error": f"Unknown tool: {fn_name}"}
                        else:
                            result = await fn(**fn_args)

                        tool_results.append({"tool": fn_name, "result": result})
                    except Exception as e:
                        result = {"error": f"Tool execution failed: {str(e)}"}
                        tool_results.append({"tool": fn_name, "error": str(e)})

                    function_response_parts.append(
                        types.Part(
                            function_response=types.FunctionResponse(
                                name=fn_name,
                                response=result,
                            )
                        )
                    )

                fn_response_content = types.Content(
                    role="user",
                    parts=function_response_parts,
                )
                history.append(fn_response_content)
        else:
            final_text = "I ran into a loop processing your request. Please try again."

        return {
            "response": final_text,
            "tools_called": tools_called,
            "tool_results": tool_results,
            "timestamp": datetime.utcnow().isoformat(),
        }


# Singleton instance
agent = GigSaathiAgent()
