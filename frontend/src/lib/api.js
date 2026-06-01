const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const defaultHeaders = {};
    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(
        `API Error ${res.status}: ${res.statusText} — ${errorBody}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error(`[GigSaathi API] ${endpoint}:`, error);
    throw error;
  }
}

/* ──────────────────────────────────────────────
   User endpoints
   ────────────────────────────────────────────── */

export async function fetchUser(userId) {
  return apiFetch(`/users/${userId}`);
}

export async function fetchUsers() {
  return apiFetch('/users');
}

/* ──────────────────────────────────────────────
   Income endpoint
   ────────────────────────────────────────────── */

export async function fetchIncomeSummary(userId) {
  return apiFetch(`/income/${userId}`);
}

/* ──────────────────────────────────────────────
   Tax endpoints
   ────────────────────────────────────────────── */

export async function fetchTaxCalculation(userId) {
  return apiFetch(`/tax/${userId}`);
}

export async function fetchDeductions(userId) {
  return apiFetch(`/tax/${userId}/deductions`);
}

export async function fetchITRSummary(userId) {
  return apiFetch(`/tax/${userId}/itr`);
}

/* ──────────────────────────────────────────────
   Deadlines
   ────────────────────────────────────────────── */

export async function fetchDeadlines(userId) {
  return apiFetch(`/deadlines/${userId}`);
}

/* ──────────────────────────────────────────────
   PDF Upload
   ────────────────────────────────────────────── */

export async function uploadPDFs(userId, files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  return apiFetch(`/upload/${userId}`, {
    method: 'POST',
    body: formData,
    // Content-Type is NOT set — browser adds multipart boundary automatically
  });
}

/* ──────────────────────────────────────────────
   Chat — regular request/response
   ────────────────────────────────────────────── */

export async function sendChatMessage(userId, message) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, message }),
  });
}

/* ──────────────────────────────────────────────
   Chat — SSE streaming
   ────────────────────────────────────────────── */

export async function streamChat(userId, message, onChunk) {
  try {
    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(
        `Stream Error ${res.status}: ${res.statusText} — ${errorBody}`
      );
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process SSE lines from the buffer
      const lines = buffer.split('\n');
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue;

        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            onChunk(parsed);
          } catch {
            onChunk({ content: data });
          }
        }
      }
    }
  } catch (error) {
    console.error('[GigSaathi API] Stream failed:', error);
    throw error;
  }
}

export async function clearChatHistory(userId) {
  return apiFetch(`/chat/${userId}/history`, {
    method: 'DELETE',
  });
}
