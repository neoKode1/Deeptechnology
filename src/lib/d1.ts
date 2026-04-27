/**
 * Cloudflare D1 REST client for Vercel serverless routes.
 *
 * D1 isn't directly accessible from outside Cloudflare Workers, so we hit the
 * REST `/query` endpoint instead. Each call is a single SQL statement with
 * positional params; results are returned as `{ results, meta }`.
 *
 * Required env vars:
 *   CF_ACCOUNT_ID       — Cloudflare account UUID
 *   CF_D1_DATABASE_ID   — D1 database UUID
 *   CF_D1_API_TOKEN     — API token with `Account → D1 → Edit`
 */
const API_BASE = 'https://api.cloudflare.com/client/v4';

interface D1QueryResult<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
    last_row_id?: number;
    changes?: number;
  };
}

interface D1ApiResponse<T> {
  success: boolean;
  result: D1QueryResult<T>[];
  errors: { code: number; message: string }[];
}

function endpoint(): string {
  const account = process.env.CF_ACCOUNT_ID;
  const db = process.env.CF_D1_DATABASE_ID;
  if (!account || !db) {
    throw new Error('Missing CF_ACCOUNT_ID or CF_D1_DATABASE_ID');
  }
  return `${API_BASE}/accounts/${account}/d1/database/${db}/query`;
}

async function call<T>(sql: string, params: unknown[] = []): Promise<D1QueryResult<T>> {
  const token = process.env.CF_D1_API_TOKEN;
  if (!token) throw new Error('Missing CF_D1_API_TOKEN');

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const body = (await res.json()) as D1ApiResponse<T>;
  if (!res.ok || !body.success) {
    const msg = body.errors?.map((e) => `${e.code}: ${e.message}`).join('; ') || res.statusText;
    throw new Error(`D1 error: ${msg}`);
  }
  return body.result[0];
}

/** Run a SELECT and return all rows. */
export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const r = await call<T>(sql, params);
  return r.results ?? [];
}

/** Run a SELECT and return the first row (or null). */
export async function d1First<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await d1Query<T>(sql, params);
  return rows[0] ?? null;
}

/** Run an INSERT/UPDATE/DELETE and return rows-changed metadata. */
export async function d1Exec(
  sql: string,
  params: unknown[] = [],
): Promise<{ changes: number; lastRowId?: number }> {
  const r = await call(sql, params);
  return { changes: r.meta.changes ?? 0, lastRowId: r.meta.last_row_id };
}
