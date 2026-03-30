import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async create(name: string) {
    const existing = await this.prisma.category.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException(`Category "${name}" already exists`);
    }
    return this.prisma.category.create({ data: { name } });
  }

  async update(id: number, name: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (category._count.products > 0) {
      throw new ConflictException(
        `Cannot delete category "${category.name}" — it still has ${category._count.products} product(s).`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
