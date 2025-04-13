// src/company/dto/create-company.dto.ts

import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAdminDto } from '../../user/dto/create-admin.dto';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpjOrCpf: string;

  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
}
