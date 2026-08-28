/**
 * Shared helper for calling third-party APIs (Upbit, 블록미디어 RSS, and any
 * future provider such as Coinness) from the server only.
 *
 * Security rules for any new external integration built on top of this:
 * 1. Never call the third-party API from the Expo client. Always proxy through
 *    an api-server route so API keys stay server-side and are never shipped in
 *    the mobile bundle or visible in client network traffic.
 * 2. Read credentials from `process.env` (set via Replit Secrets), never hardcode
 *    them, and never include them in a URL that gets logged or echoed back to a
 *    client in an error message.
 * 3. Always fetch through `fetchExternal` so a slow/hanging upstream can't tie up
 *    a request indefinitely.
 * 4. Never forward the raw upstream response body or headers to the client on
 *    error — they can contain the request URL (with query-string keys), internal
 *    hostnames, or other provider-specific details. Log the detail server-side
 *    with `logger`, and return a generic message to the client instead.
 */
import { logger } from "./logger";

const DEFAULT_TIMEOUT_MS = 8_000;

export class ExternalFetchError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "ExternalFetchError";
  }
}

/**
 * fetch() with an enforced timeout. Use this for every outbound call to a
 * third-party API so one slow provider can't exhaust server resources.
 */
export async function fetchExternal(url: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    // Do not leak the request URL (which may contain an API key query param) into
    // the error message; log it server-side only.
    logger.error({ err: error, host: safeHost(url) }, "External API request failed");
    throw new ExternalFetchError("외부 API 요청에 실패했습니다.", error);
  } finally {
    clearTimeout(timeout);
  }
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "unknown-host";
  }
}
