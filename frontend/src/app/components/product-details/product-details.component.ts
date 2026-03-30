import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  selectedImageIndex = signal(0);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct(id);
  }

  async loadProduct(id: number) {
    this.loading.set(true);
    try {
      const product = await this.productService.getProduct(id);
      this.product.set(product);
    } finally {
      this.loading.set(false);
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
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
