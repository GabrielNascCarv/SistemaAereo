import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { ReservaRepositoryContract } from '../contracts/reserva-repository.contract';
import { ReservaEntity } from '../entities/reserva.entity';
import { TrechoReservaEntity } from '../entities/trecho-reserva.entity';
import { VooEntity } from '../../voos/entities/voo.entity';

const INCLUDE_TRECHOS = {
  trechos: {
    include: { voo: true },
    orderBy: [{ direcao: 'asc' as const }, { ordem: 'asc' as const }],
  },
};

@Injectable()
export class ReservaRepository implements ReservaRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    codigoReserva: string;
    numeroPassageiros: number;
    passageiroId: number;
    status?: string;
    trechos: Array<{ vooId: number; direcao: 'IDA' | 'VOLTA'; ordem: number }>;
  }): Promise<ReservaEntity> {
    const { trechos, ...dadosReserva } = data;

    const reserva = await this.prisma.reserva.create({
      data: {
        ...dadosReserva,
        trechos: {
          create: trechos.map((trecho) => ({
            vooId: trecho.vooId,
            direcao: trecho.direcao,
            ordem: trecho.ordem,
          })),
        },
      },
      include: INCLUDE_TRECHOS,
    });

    return this.paraEntidade(reserva);
  }

  async findByCodigoReserva(
    codigoReserva: string,
  ): Promise<ReservaEntity | null> {
    const reserva = await this.prisma.reserva.findUnique({
      where: { codigoReserva },
      include: INCLUDE_TRECHOS,
    });

    return reserva ? this.paraEntidade(reserva) : null;
  }

  async findById(id: number): Promise<ReservaEntity | null> {
    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: INCLUDE_TRECHOS,
    });

    return reserva ? this.paraEntidade(reserva) : null;
  }

  async findAll(params: { skip: number; take: number }): Promise<{
    data: ReservaEntity[];
    total: number;
  }> {
    const [reservas, total] = await Promise.all([
      this.prisma.reserva.findMany({
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: INCLUDE_TRECHOS,
      }),
      this.prisma.reserva.count(),
    ]);

    return {
      data: reservas.map((reserva) => this.paraEntidade(reserva)),
      total,
    };
  }

  async update(
    id: number,
    data: {
      status?: string;
      numeroPassageiros?: number;
    },
  ): Promise<ReservaEntity> {
    const reserva = await this.prisma.reserva.update({
      where: { id },
      data,
      include: INCLUDE_TRECHOS,
    });

    return this.paraEntidade(reserva);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.reserva.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  private paraEntidade(reserva: {
    id: number;
    codigoReserva: string;
    dataReserva: Date;
    status: string;
    numeroPassageiros: number;
    passageiroId: number;
    createdAt: Date;
    updatedAt: Date;
    trechos: Array<{
      id: number;
      vooId: number;
      direcao: string;
      ordem: number;
      voo: Parameters<typeof VooEntity.create>[0];
    }>;
  }): ReservaEntity {
    return ReservaEntity.create({
      ...reserva,
      trechos: reserva.trechos.map((trecho) =>
        TrechoReservaEntity.create({
          id: trecho.id,
          vooId: trecho.vooId,
          direcao: trecho.direcao as 'IDA' | 'VOLTA',
          ordem: trecho.ordem,
          voo: VooEntity.create(trecho.voo),
        }),
      ),
    });
  }
}
