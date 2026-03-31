import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';
import { Product, AvailabilityStatus, Label, RentalPeriod } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @Input() productId: number | null = null;
  @Output() closed = new EventEmitter<void>();

  loading = signal(false);
  uploading = signal(false);

  name = signal('');
  shortDescription = signal('');
  longDescription = signal('');
  price = signal(0);
  rentalUnits = signal(1);
  availabilityStatus = signal<AvailabilityStatus>('AVAILABLE');
  label = signal<Label>('RENT');
  rentalPeriod = signal<RentalPeriod>('DAY');
  isVisible = signal(true);
  categoryId = signal<number | null>(null);
  imageUrls = signal<string[]>([]);

  constructor(
    private productService: ProductService,
    public categoryService: CategoryService,
    private uploadService: UploadService,
  ) {}

  get isEditing() {
    return this.productId !== null;
  }

  ngOnInit() {
    this.categoryService.loadCategories();
    if (this.productId) {
      this.loadProduct();
    }
  }

  async loadProduct() {
    if (!this.productId) return;
    this.loading.set(true);
    try {
      const p = await this.productService.getProduct(this.productId);
      this.name.set(p.name);
      this.shortDescription.set(p.shortDescription);
      this.longDescription.set(p.longDescription);
      this.price.set(p.price);
      this.rentalUnits.set(p.rentalUnits);
      this.availabilityStatus.set(p.availabilityStatus);
      this.label.set(p.label);
      this.rentalPeriod.set(p.rentalPeriod);
      this.isVisible.set(p.isVisible);
      this.categoryId.set(p.categoryId);
      this.imageUrls.set(p.images.map((img) => img.url));
    } finally {
      this.loading.set(false);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.uploading.set(true);
    try {
      const urls = [...this.imageUrls()];
      for (const file of Array.from(input.files)) {
        const url = await this.uploadService.uploadImage(file);
        urls.push(url);
      }
      this.imageUrls.set(urls);
    } finally {
      this.uploading.set(false);
    }
  }

  removeImage(index: number) {
    const urls = [...this.imageUrls()];
    urls.splice(index, 1);
    this.imageUrls.set(urls);
  }

  close() {
    this.closed.emit();
  }

  async submit() {
    if (!this.categoryId()) {
      alert('Please select a category');
      return;
    }

    this.loading.set(true);
    try {
      const payload = {
        name: this.name(),
        shortDescription: this.shortDescription(),
        longDescription: this.longDescription(),
        price: this.price(),
        rentalUnits: this.rentalUnits(),
        availabilityStatus: this.availabilityStatus(),
        label: this.label(),
        rentalPeriod: this.label() === 'RENT' ? this.rentalPeriod() : undefined,
        isVisible: this.isVisible(),
        categoryId: this.categoryId()!,
        imageUrls: this.imageUrls(),
      };

      if (this.isEditing) {
        await this.productService.updateProduct(this.productId!, payload);
      } else {
        await this.productService.createProduct(payload);
      }

      this.close();
    } finally {
      this.loading.set(false);
    }
  }
}
