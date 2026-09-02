import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { VooRepositoryContract } from '../contracts/voo-repository.contract';
import { VooEntity } from '../entities/voo.entity';

@Injectable()
export class VooRepository implements VooRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status?: string;
  }): Promise<VooEntity> {
    const voo = await this.prisma.voo.create({
      data,
    });

    return VooEntity.create(voo);
  }

  async findByNumeroVoo(numeroVoo: string): Promise<VooEntity | null> {
    const voo = await this.prisma.voo.findUnique({
      where: { numeroVoo },
    });

    return voo ? VooEntity.create(voo) : null;
  }

  async findById(id: number): Promise<VooEntity | null> {
    const voo = await this.prisma.voo.findUnique({
      where: { id },
    });

    return voo ? VooEntity.create(voo) : null;
  }

  async findAll(params: { skip: number; take: number }): Promise<{
    data: VooEntity[];
    total: number;
  }> {
    const [voos, total] = await Promise.all([
      this.prisma.voo.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.voo.count(),
    ]);

    return {
      data: voos.map(voo => VooEntity.create(voo)),
      total,
    };
  }

  async update(id: number, data: {
    numeroVoo?: string;
    origem?: string;
    destino?: string;
    dataPartida?: Date;
    dataChegada?: Date;
    assentosDisponiveis?: number;
    preco?: number;
    status?: string;
  }): Promise<VooEntity> {
    const voo = await this.prisma.voo.update({
      where: { id },
      data,
    });

    return VooEntity.create(voo);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.voo.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
