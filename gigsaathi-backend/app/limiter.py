"""GigSaathi — Rate Limiter.

Defines the shared slowapi Limiter instance used across the application.
Keeping it in its own module breaks the circular import that would occur if
route files imported the limiter directly from main.py.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Keyed by client IP. Per-endpoint limits are applied via @limiter.limit().
# The default (200/minute) acts as a global safety net across all routes.
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
