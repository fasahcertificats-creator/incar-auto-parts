import type {
  AdminCategory,
  AdminCategoryInput,
  AdminCustomerDetail,
  AdminCustomerListResponse,
  AdminCustomerMergeResponse,
  AdminCustomerUpdateInput,
  AdminInquiryDetail,
  AdminLoginResponse,
  AdminMake,
  AdminMakeInput,
  AdminModel,
  AdminModelInput,
  AdminProductBulkImportSummary,
  AdminProductDetail,
  AdminProductImage,
  AdminProductInput,
  AdminProductListResponse,
  AdminQuoteCreateInput,
  AdminQuoteDetail,
  AdminQuoteListResponse,
  AdminQuoteUpdateInput,
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
  customerId?: string,
): Promise<AdminRequestListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (customerId) params.set("customerId", customerId);
  return request<AdminRequestListResponse>(`/v1/admin/requests?${params.toString()}`);
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

export function adminListCustomers(
  limit: number,
  offset: number,
  search?: string,
  category?: string,
): Promise<AdminCustomerListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  return request<AdminCustomerListResponse>(`/v1/admin/customers?${params.toString()}`);
}

export function adminGetCustomer(id: string): Promise<AdminCustomerDetail> {
  return request<AdminCustomerDetail>(`/v1/admin/customers/${id}`);
}

export function adminUpdateCustomer(
  id: string,
  payload: AdminCustomerUpdateInput,
): Promise<AdminCustomerDetail> {
  return request<AdminCustomerDetail>(`/v1/admin/customers/${id}`, jsonInit("PATCH", payload));
}

export function adminMergeCustomers(
  survivorId: string,
  mergeCustomerId: string,
): Promise<AdminCustomerMergeResponse> {
  return request<AdminCustomerMergeResponse>(
    `/v1/admin/customers/${survivorId}/merge`,
    jsonInit("POST", { mergeCustomerId }),
  );
}

export function adminListMakes(): Promise<AdminMake[]> {
  return request<AdminMake[]>("/v1/admin/makes");
}

export function adminGetMake(id: string): Promise<AdminMake> {
  return request<AdminMake>(`/v1/admin/makes/${id}`);
}

export function adminCreateMake(payload: AdminMakeInput): Promise<AdminMake> {
  return request<AdminMake>("/v1/admin/makes", jsonInit("POST", payload));
}

export function adminUpdateMake(id: string, payload: AdminMakeInput): Promise<AdminMake> {
  return request<AdminMake>(`/v1/admin/makes/${id}`, jsonInit("PATCH", payload));
}

export function adminListModels(makeId?: string): Promise<AdminModel[]> {
  const params = makeId ? `?makeId=${encodeURIComponent(makeId)}` : "";
  return request<AdminModel[]>(`/v1/admin/models${params}`);
}

export function adminGetModel(id: string): Promise<AdminModel> {
  return request<AdminModel>(`/v1/admin/models/${id}`);
}

export function adminCreateModel(payload: AdminModelInput): Promise<AdminModel> {
  return request<AdminModel>("/v1/admin/models", jsonInit("POST", payload));
}

export function adminUpdateModel(id: string, payload: AdminModelInput): Promise<AdminModel> {
  return request<AdminModel>(`/v1/admin/models/${id}`, jsonInit("PATCH", payload));
}

export function adminListCategories(): Promise<AdminCategory[]> {
  return request<AdminCategory[]>("/v1/admin/categories");
}

export function adminGetCategory(id: string): Promise<AdminCategory> {
  return request<AdminCategory>(`/v1/admin/categories/${id}`);
}

export function adminCreateCategory(payload: AdminCategoryInput): Promise<AdminCategory> {
  return request<AdminCategory>("/v1/admin/categories", jsonInit("POST", payload));
}

export function adminUpdateCategory(
  id: string,
  payload: AdminCategoryInput,
): Promise<AdminCategory> {
  return request<AdminCategory>(`/v1/admin/categories/${id}`, jsonInit("PATCH", payload));
}

export function adminReorderCategories(orderedIds: string[]): Promise<AdminCategory[]> {
  return request<AdminCategory[]>(
    "/v1/admin/categories/reorder",
    jsonInit("POST", { orderedIds }),
  );
}

export function adminListProducts(
  limit: number,
  offset: number,
  search?: string,
  categoryId?: string,
  status?: string,
): Promise<AdminProductListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (search) params.set("search", search);
  if (categoryId) params.set("categoryId", categoryId);
  if (status) params.set("status", status);
  return request<AdminProductListResponse>(`/v1/admin/products?${params.toString()}`);
}

export function adminGetProduct(id: string): Promise<AdminProductDetail> {
  return request<AdminProductDetail>(`/v1/admin/products/${id}`);
}

export function adminCreateProduct(payload: AdminProductInput): Promise<AdminProductDetail> {
  return request<AdminProductDetail>("/v1/admin/products", jsonInit("POST", payload));
}

export function adminUpdateProduct(
  id: string,
  payload: AdminProductInput,
): Promise<AdminProductDetail> {
  return request<AdminProductDetail>(`/v1/admin/products/${id}`, jsonInit("PATCH", payload));
}

export function adminUploadProductImage(
  productId: string,
  file: File,
  altAr?: string,
  altEn?: string,
): Promise<AdminProductImage[]> {
  const form = new FormData();
  form.append("file", file);
  const params = new URLSearchParams();
  if (altAr) params.set("altAr", altAr);
  if (altEn) params.set("altEn", altEn);
  const query = params.size ? `?${params.toString()}` : "";
  // No Content-Type header here — the browser sets multipart/form-data with
  // the correct boundary itself; setting it manually breaks the boundary.
  return request<AdminProductImage[]>(`/v1/admin/products/${productId}/images${query}`, {
    method: "POST",
    body: form,
  });
}

export function adminReorderProductImages(
  productId: string,
  orderedImageIds: string[],
): Promise<AdminProductImage[]> {
  return request<AdminProductImage[]>(
    `/v1/admin/products/${productId}/images/order`,
    jsonInit("PATCH", { orderedImageIds }),
  );
}

export function adminBulkImportProducts(file: File): Promise<AdminProductBulkImportSummary> {
  const form = new FormData();
  form.append("file", file);
  return request<AdminProductBulkImportSummary>("/v1/admin/products/import", {
    method: "POST",
    body: form,
  });
}

export function adminDeleteProductImage(
  productId: string,
  imageId: string,
): Promise<AdminProductImage[]> {
  return request<AdminProductImage[]>(`/v1/admin/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}

export function adminListQuotes(
  limit: number,
  offset: number,
  customerId?: string,
  requestId?: string,
  status?: string,
): Promise<AdminQuoteListResponse> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (customerId) params.set("customerId", customerId);
  if (requestId) params.set("requestId", requestId);
  if (status) params.set("status", status);
  return request<AdminQuoteListResponse>(`/v1/admin/quotes?${params.toString()}`);
}

export function adminGetQuote(id: string): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}`);
}

export function adminCreateQuote(payload: AdminQuoteCreateInput): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>("/v1/admin/quotes", jsonInit("POST", payload));
}

export function adminUpdateQuote(
  id: string,
  payload: AdminQuoteUpdateInput,
): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}`, jsonInit("PATCH", payload));
}

export function adminUploadQuoteAttachment(id: string, file: File): Promise<AdminQuoteDetail> {
  const form = new FormData();
  form.append("file", file);
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}/attachment`, {
    method: "POST",
    body: form,
  });
}

export function adminDeleteQuoteAttachment(id: string): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}/attachment`, { method: "DELETE" });
}

export function adminSendQuote(id: string): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}/send`, { method: "POST" });
}

export function adminUpdateQuoteStatus(id: string, status: string): Promise<AdminQuoteDetail> {
  return request<AdminQuoteDetail>(`/v1/admin/quotes/${id}/status`, jsonInit("PATCH", { status }));
}
