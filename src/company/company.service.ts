// src/company/company.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { name, cnpjOrCpf, admin } = createCompanyDto;

    const existingCompany = await this.prisma.company.findUnique({
      where: { cnpjOrCpf },
    });
    if (existingCompany) {
      throw new ConflictException('Company with this CNPJ/CPF already exists');
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    const company = await this.prisma.company.create({
      data: {
        name,
        cnpjOrCpf,
        users: {
          create: {
            name: admin.name,
            email: admin.email,
            cpf: admin.cpf,
            password: hashedPassword,
            role: 'ADMIN',
          },
        },
      },
      include: {
        users: true,
      },
    });

    return company;
  }
}
