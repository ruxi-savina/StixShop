import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { AvailabilityStatus, Label, RentalPeriod } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  longDescription!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  rentalUnits!: number;

  @IsEnum(AvailabilityStatus)
  @IsOptional()
  availabilityStatus?: AvailabilityStatus;

  @IsEnum(Label)
  @IsOptional()
  label?: Label;

  @IsEnum(RentalPeriod)
  @IsOptional()
  rentalPeriod?: RentalPeriod;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsNumber()
  categoryId!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagesToDelete?: string[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  rentalUnits?: number;

  @IsEnum(AvailabilityStatus)
  @IsOptional()
  availabilityStatus?: AvailabilityStatus;

  @IsEnum(Label)
  @IsOptional()
  label?: Label;

  @IsEnum(RentalPeriod)
  @IsOptional()
  rentalPeriod?: RentalPeriod;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagesToDelete?: string[];
}
