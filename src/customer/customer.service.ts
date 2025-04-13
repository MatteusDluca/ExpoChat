import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(phone: string, companyId: string) {
    const existing = await this.prisma.customer.findUnique({
      where: { phone },
    });
    if (existing) return existing;

    return this.prisma.customer.create({
      data: {
        phone,
        name: 'Unknown',
        companyId,
      },
    });
  }

  async updateName(id: string, name: string) {
    return this.prisma.customer.update({
      where: { id },
      data: { name },
    });
  }
}
