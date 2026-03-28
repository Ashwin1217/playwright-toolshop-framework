import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { Product, PaginatedProducts } from '../types';

export class ProductsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getProducts(params?: {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }): Promise<PaginatedProducts> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.perPage) queryParams.append('per_page', params.perPage.toString());
    if (params?.sortBy) queryParams.append('sort', params.sortBy);
    if (params?.sortOrder) queryParams.append('direction', params.sortOrder);
    if (params?.search) queryParams.append('q', params.search);

    const query = queryParams.toString();
    const endpoint = query ? `/products?${query}` : '/products';
    return this.get<PaginatedProducts>(endpoint);
  }

  async getProductById(productId: string): Promise<Product> {
    return this.get<Product>(`/products/${productId}`);
  }

  async searchProducts(searchTerm: string): Promise<PaginatedProducts> {
    return this.getProducts({ search: searchTerm });
  }
}
