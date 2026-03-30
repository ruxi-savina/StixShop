export interface Category {
  id: number;
  name: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
}

export type AvailabilityStatus = 'AVAILABLE' | 'RENTED' | 'SOLD';
export type Label = 'RENT' | 'SELL';

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  rentalUnits: number;
  availabilityStatus: AvailabilityStatus;
  label: Label;
  isVisible: boolean;
  categoryId: number;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  rentalUnits: number;
  availabilityStatus?: AvailabilityStatus;
  label?: Label;
  isVisible?: boolean;
  categoryId: number;
  imageUrls?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
