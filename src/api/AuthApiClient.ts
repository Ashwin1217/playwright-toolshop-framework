import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { LoginRequest, LoginResponse } from '../types';

export class AuthApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/users/login', credentials);
  }

  async getToken(email: string, password: string): Promise<string> {
    const response = await this.login({ email, password });
    return response.access_token;
  }
}
