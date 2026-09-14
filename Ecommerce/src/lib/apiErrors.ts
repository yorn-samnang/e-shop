import axios from 'axios';

function collectMessages(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectMessages);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(collectMessages);
  }
  return [];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  const data = error.response?.data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['message', 'error', 'detail', 'email', 'username', 'password', 'non_field_errors']) {
      const messages = collectMessages(record[key]);
      if (messages.length) return messages.join(' ');
    }
  }

  const messages = collectMessages(data);
  return messages.length ? messages.join(' ') : fallback;
}
