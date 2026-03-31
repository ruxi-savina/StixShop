import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AvailabilityStatus, Label, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async findAll(params: {
    search?: string;
    categoryId?: number;
    availabilityStatus?: AvailabilityStatus;
    label?: Label;
    isVisible?: boolean;
  }) {
    const where: Prisma.ProductWhereInput = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { shortDescription: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }

    if (params.availabilityStatus) {
      where.availabilityStatus = params.availabilityStatus;
    }

    if (params.label) {
      where.label = params.label;
    }

    // By default only show visible products (unless admin explicitly requests all)
    if (params.isVisible !== undefined) {
      where.isVisible = params.isVisible;
    }

    return this.prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const { imageUrls, ...data } = dto;

    return this.prisma.product.create({
      data: {
        ...data,
        images: imageUrls?.length
          ? { create: imageUrls.map((url) => ({ url })) }
          : undefined,
      },
      include: { images: true, category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    const { imageUrls, ...data } = dto;

    // If new images are provided, replace all existing ones
    if (imageUrls !== undefined) {
      const oldImages = await this.prisma.productImage.findMany({
        where: { productId: id },
        select: { url: true },
      });
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      await this.uploadService.deleteImages(oldImages.map((img) => img.url));
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        images:
          imageUrls !== undefined
            ? { create: imageUrls.map((url) => ({ url })) }
            : undefined,
      },
      include: { images: true, category: true },
    });
  }

  async toggleVisibility(id: number) {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isVisible: !product.isVisible },
      include: { images: true, category: true },
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.uploadService.deleteImages(product.images.map((img) => img.url));
    return this.prisma.product.delete({
      where: { id },
      include: { images: true, category: true },
    });
  }
}
