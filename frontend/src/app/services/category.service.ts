import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../models/product.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  categories = signal<Category[]>([]);

  constructor(private http: HttpClient) {}

  async loadCategories() {
    const categories = await firstValueFrom(
      this.http.get<Category[]>(this.baseUrl),
    );
    this.categories.set(categories);
  }

  async createCategory(name: string): Promise<Category> {
    const cat = await firstValueFrom(
      this.http.post<Category>(this.baseUrl, { name }),
    );
    await this.loadCategories();
    return cat;
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    const cat = await firstValueFrom(
      this.http.put<Category>(`${this.baseUrl}/${id}`, { name }),
    );
    await this.loadCategories();
    return cat;
  }

  async deleteCategory(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
    await this.loadCategories();
  }
}
