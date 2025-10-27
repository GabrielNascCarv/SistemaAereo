import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { VooEntity } from '../entities/voo.entity';
import type { VooRepositoryContract } from '../contracts/voo-repository.contract';

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
    status: string;
  }): Promise<VooEntity> {
    const voo = await this.prisma.voo.create({
      data,
    });

    return VooEntity.create({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
      updatedAt: voo.updatedAt,
    });
  }

  async findByNumeroVoo(numeroVoo: string): Promise<VooEntity | null> {
    const voo = await this.prisma.voo.findUnique({
      where: { numeroVoo },
    });

    if (!voo) {
      return null;
    }

    return VooEntity.create({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
      updatedAt: voo.updatedAt,
    });
  }

  async findById(id: number): Promise<VooEntity | null> {
    const voo = await this.prisma.voo.findUnique({
      where: { id },
    });

    if (!voo) {
      return null;
    }

    return VooEntity.create({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
      updatedAt: voo.updatedAt,
    });
  }

  async findAll(): Promise<VooEntity[]> {
    const voos = await this.prisma.voo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return voos.map(voo => VooEntity.create({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
      updatedAt: voo.updatedAt,
    }));
  }

  async update(id: number, data: Partial<{
    numeroVoo: string;
    origem: string;
    destino: string;
    dataPartida: Date;
    dataChegada: Date;
    assentosDisponiveis: number;
    preco: number;
    status: string;
  }>): Promise<VooEntity> {
    const voo = await this.prisma.voo.update({
      where: { id },
      data,
    });

    return VooEntity.create({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
      updatedAt: voo.updatedAt,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.voo.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
