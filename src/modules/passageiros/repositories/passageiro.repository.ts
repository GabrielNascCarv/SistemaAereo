import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { PassageiroRepositoryContract } from '../contracts/passageiro-repository.contract';
import { PassageiroEntity } from '../entities/passageiro.entity';

@Injectable()
export class PassageiroRepository implements PassageiroRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  }): Promise<PassageiroEntity> {
    const passageiro = await this.prisma.passageiro.create({
      data,
    });

    return PassageiroEntity.create(passageiro);
  }

  async findByEmail(email: string): Promise<PassageiroEntity | null> {
    const passageiro = await this.prisma.passageiro.findUnique({
      where: { email },
    });

    return passageiro ? PassageiroEntity.create(passageiro) : null;
  }

  async findByCpf(cpf: string): Promise<PassageiroEntity | null> {
    const passageiro = await this.prisma.passageiro.findUnique({
      where: { cpf },
    });

    return passageiro ? PassageiroEntity.create(passageiro) : null;
  }

  async findById(id: number): Promise<PassageiroEntity | null> {
    const passageiro = await this.prisma.passageiro.findUnique({
      where: { id },
    });

    return passageiro ? PassageiroEntity.create(passageiro) : null;
  }

  async findAll(params: { skip: number; take: number }): Promise<{
    data: PassageiroEntity[];
    total: number;
  }> {
    const [passageiros, total] = await Promise.all([
      this.prisma.passageiro.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.passageiro.count(),
    ]);

    return {
      data: passageiros.map((passageiro) =>
        PassageiroEntity.create(passageiro),
      ),
      total,
    };
  }

  async update(
    id: number,
    data: {
      nome?: string;
      email?: string;
      cpf?: string;
      telefone?: string;
    },
  ): Promise<PassageiroEntity> {
    const passageiro = await this.prisma.passageiro.update({
      where: { id },
      data,
    });

    return PassageiroEntity.create(passageiro);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.passageiro.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
