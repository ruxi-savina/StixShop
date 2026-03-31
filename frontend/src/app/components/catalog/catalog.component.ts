import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { AvailabilityStatus, Label, Product } from '../../models/product.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, ProductFormComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  searchQuery = signal('');
  selectedCategory = signal<number | null>(null);
  selectedStatus = signal<AvailabilityStatus | ''>('');
  selectedLabel = signal<Label | ''>('');

  showProductForm = signal(false);
  editingProductId = signal<number | null>(null);

  private cardImageIndexes = new Map<number, number>();

  getCardImageIndex(productId: number): number {
    return this.cardImageIndexes.get(productId) ?? 0;
  }

  prevCardImage(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    const len = product.images.length;
    if (len < 2) return;
    const current = this.getCardImageIndex(product.id);
    this.cardImageIndexes.set(product.id, (current - 1 + len) % len);
  }

  nextCardImage(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    const len = product.images.length;
    if (len < 2) return;
    const current = this.getCardImageIndex(product.id);
    this.cardImageIndexes.set(product.id, (current + 1) % len);
  }

  // Category management
  showCategoryManager = signal(false);
  newCategoryName = signal('');
  editingCategoryId = signal<number | null>(null);
  editingCategoryName = signal('');

  constructor(
    public productService: ProductService,
    public categoryService: CategoryService,
    public authService: AuthService,
  ) {
    // Re-fetch products whenever the admin state changes (login or logout)
    effect(() => {
      authService.isLoggedIn();
      this.applyFilters();
    }, { allowSignalWrites: true });
  }

  products = computed(() => this.productService.products());
  categories = computed(() => this.categoryService.categories());

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    await Promise.all([
      this.categoryService.loadCategories(),
      this.applyFilters(),
    ]);
  }

  async applyFilters() {
    await this.productService.loadProducts({
      search: this.searchQuery() || undefined,
      categoryId: this.selectedCategory() ?? undefined,
      availabilityStatus: this.selectedStatus() || undefined,
      label: this.selectedLabel() || undefined,
      isVisible: this.authService.isAdmin() ? undefined : 'true',
    });
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    this.applyFilters();
  }

  onCategoryChange(value: string) {
    this.selectedCategory.set(value ? +value : null);
    this.applyFilters();
  }

  onStatusChange(value: string) {
    this.selectedStatus.set(value as AvailabilityStatus | '');
    this.applyFilters();
  }

  onLabelChange(value: string) {
    this.selectedLabel.set(value as Label | '');
    this.applyFilters();
  }

  openAddProduct() {
    this.editingProductId.set(null);
    this.showProductForm.set(true);
  }

  openEditProduct(id: number) {
    this.editingProductId.set(id);
    this.showProductForm.set(true);
  }

  onProductFormClose() {
    this.showProductForm.set(false);
    this.editingProductId.set(null);
    this.applyFilters();
  }

  async toggleVisibility(id: number) {
    await this.productService.toggleVisibility(id);
    await this.applyFilters();
  }

  async deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      await this.productService.deleteProduct(id);
      await this.applyFilters();
    }
  }

  // Category management
  toggleCategoryManager() {
    this.showCategoryManager.set(!this.showCategoryManager());
  }

  async addCategory() {
    const name = this.newCategoryName().trim();
    if (!name) return;
    await this.categoryService.createCategory(name);
    this.newCategoryName.set('');
  }

  startEditCategory(id: number, name: string) {
    this.editingCategoryId.set(id);
    this.editingCategoryName.set(name);
  }

  async saveCategory() {
    const id = this.editingCategoryId();
    const name = this.editingCategoryName().trim();
    if (!id || !name) return;
    await this.categoryService.updateCategory(id, name);
    this.editingCategoryId.set(null);
    this.editingCategoryName.set('');
  }

  cancelEditCategory() {
    this.editingCategoryId.set(null);
    this.editingCategoryName.set('');
  }

  async removeCategory(id: number) {
    if (confirm('Are you sure? Categories with products cannot be deleted.')) {
      try {
        await this.categoryService.deleteCategory(id);
      } catch (e: any) {
        alert(e?.error?.message || 'Cannot delete this category');
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'status-available';
      case 'RENTED': return 'status-rented';
      case 'SOLD': return 'status-sold';
      default: return '';
    }
  }

  getLabelClass(label: string): string {
    return label === 'RENT' ? 'label-rent' : 'label-sell';
  }
}
