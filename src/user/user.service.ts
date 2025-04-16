import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    currentUser: { role: Role; companyId: string },
  ) {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create users.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
        companyId: currentUser.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Método para adicionar um usuário à fila de atendimento
  addToQueue(userId: string) {
    // Lógica para adicionar o usuário à fila
    // Exemplo: this.queue.push(userId);
    console.log(`Usuário ${userId} adicionado à fila de atendimento.`);
  }

  // Método para transferir uma conversa para outro atendente
  transferConversation(conversationId: string, newUserId: string) {
    // Lógica para transferir a conversa
    // Exemplo: Atualizar o atendente responsável pela conversa no banco de dados
    console.log(
      `Conversa ${conversationId} transferida para o usuário ${newUserId}.`,
    );
  }
}
