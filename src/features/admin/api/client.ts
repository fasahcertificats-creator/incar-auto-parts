import type {
  AdminInquiryDetail,
  AdminLoginResponse,
  AdminRequestListResponse,
  AdminRfqRequestDetail,
} from "./contracts";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string | null,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

type ErrorEnvelope = { error?: { code?: unknown; message?: unknown } };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      credentials: "include",
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new AdminApiError("The admin service is unreachable.", 0, null);
  }

  if (!response.ok) {
    let code: string | null = null;
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as ErrorEnvelope;
      if (typeof body.error?.code === "string") code = body.error.code;
      if (typeof body.error?.message === "string") message = body.error.message;
    } catch {
      // Keep the generic message above if the error body isn't JSON.
    }
    throw new AdminApiError(message, response.status, code);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function jsonInit(method: string, body?: unknown): RequestInit {
  // Fastify's default JSON parser rejects a request that declares
  // Content-Type: application/json but sends zero bytes (adminLogout has
  // no body), so that header must only be set when there's a body to match.
  if (body === undefined) return { method };
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  return request<AdminLoginResponse>("/v1/admin/login", jsonInit("POST", { username, password }));
}

export function adminLogout(): Promise<void> {
  return request<void>("/v1/admin/logout", jsonInit("POST"));
}

export function adminListRequests(
  limit: number,
  offset: number,
): Promise<AdminRequestListResponse> {
  return request<AdminRequestListResponse>(
    `/v1/admin/requests?limit=${limit}&offset=${offset}`,
  );
}

export function adminGetRfqDetail(id: string): Promise<AdminRfqRequestDetail> {
  return request<AdminRfqRequestDetail>(`/v1/admin/requests/rfq/${id}`);
}

export function adminGetInquiryDetail(id: string): Promise<AdminInquiryDetail> {
  return request<AdminInquiryDetail>(`/v1/admin/requests/inquiry/${id}`);
}

export function adminUpdateRfqStatus(
  id: string,
  status: string,
  internalNote?: string,
): Promise<AdminRfqRequestDetail> {
  return request<AdminRfqRequestDetail>(
    `/v1/admin/requests/rfq/${id}/status`,
    jsonInit("PATCH", { status, internalNote: internalNote || undefined }),
  );
}

export function adminUpdateInquiryStatus(
  id: string,
  status: string,
): Promise<AdminInquiryDetail> {
  return request<AdminInquiryDetail>(
    `/v1/admin/requests/inquiry/${id}/status`,
    jsonInit("PATCH", { status }),
  );
}
