import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = process.env['API_BASE_URL'] ?? '';
  }

  // ─── Core HTTP Methods ─────────────────────────────────────────

  protected async get<T>(endpoint: string, token?: string): Promise<T> {
    const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  protected async post<T>(endpoint: string, body: object, token?: string): Promise<T> {
    const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      data: body,
      headers: this.buildHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  protected async put<T>(endpoint: string, body: object, token?: string): Promise<T> {
    const response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      data: body,
      headers: this.buildHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  protected async delete<T>(endpoint: string, token?: string): Promise<T> {
    const response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.buildHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  // ─── Helpers ───────────────────────────────────────────────────

  private buildHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: APIResponse): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `API request failed: ${response.status()} ${response.statusText()} — ${body}`,
      );
    }
    return response.json() as Promise<T>;
  }
}
