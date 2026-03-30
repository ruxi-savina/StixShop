import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product, CreateProductPayload, UpdateProductPayload, AvailabilityStatus, Label } from '../models/product.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  products = signal<Product[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  async loadProducts(params?: {
    search?: string;
    categoryId?: number;
    availabilityStatus?: AvailabilityStatus;
    label?: Label;
    isVisible?: string;
  }) {
    this.loading.set(true);
    try {
      const queryParams: Record<string, string> = {};
      if (params?.search) queryParams['search'] = params.search;
      if (params?.categoryId) queryParams['categoryId'] = params.categoryId.toString();
      if (params?.availabilityStatus) queryParams['availabilityStatus'] = params.availabilityStatus;
      if (params?.label) queryParams['label'] = params.label;
      if (params?.isVisible !== undefined) queryParams['isVisible'] = params.isVisible;

      const products = await firstValueFrom(
        this.http.get<Product[]>(this.baseUrl, { params: queryParams }),
      );
      this.products.set(products);
    } finally {
      this.loading.set(false);
    }
  }

  async getProduct(id: number): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${this.baseUrl}/${id}`));
  }

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(this.baseUrl, payload));
  }

  async updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
    return firstValueFrom(this.http.put<Product>(`${this.baseUrl}/${id}`, payload));
  }

  async toggleVisibility(id: number): Promise<Product> {
    return firstValueFrom(this.http.patch<Product>(`${this.baseUrl}/${id}/visibility`, {}));
  }

  async deleteProduct(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
  }
}
