import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CustomerService, PrismaService],
  exports: [CustomerService],
})
export class CustomerModule {}
