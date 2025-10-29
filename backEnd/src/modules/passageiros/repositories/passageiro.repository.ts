import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { 
  IPassageiroRepository,
  TCreatePassageiroRepository,
  TUpdatePassageiroRepository
 } from '../contracts/passageiro-repository.contract';
import { PassageiroEntity } from '../entities/passageiro.entity';

@Injectable()
export class PassageiroRepository implements IPassageiroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TCreatePassageiroRepository): Promise<PassageiroEntity> {
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

  async findAll(): Promise<PassageiroEntity[]> {
    const passageiros = await this.prisma.passageiro.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return passageiros.map(passageiro => PassageiroEntity.create(passageiro));
  }

  async update(id: number, data: Partial<TUpdatePassageiroRepository>): Promise<PassageiroEntity> {
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
    } catch (error) {
      return false;
    }
  }

}
