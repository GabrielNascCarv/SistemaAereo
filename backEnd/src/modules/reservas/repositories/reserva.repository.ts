import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/database/prisma.service";
import { 
    IReservaRepository, 
    TCriarReservaParams, 
    TAtualizarReservaParams 
} from "../contracts/reserva-repository.contract";
import { ReservaEntity } from "../entities/reserva.entity";

@Injectable()
export class ReservaRepository implements IReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TCriarReservaParams): Promise<ReservaEntity> {
    const reserva = await this.prisma.reserva.create({
        data,
    });

    return ReservaEntity.create(reserva);
  }

    async findById(id: number): Promise<ReservaEntity | null> {
        const reserva = await this.prisma.reserva.findUnique({
            where: { id },
        });

        return reserva ? ReservaEntity.create(reserva) : null;
    }

    async findAll(): Promise<ReservaEntity[]> {
        const reservas = await this.prisma.reserva.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return reservas.map(reserva => ReservaEntity.create(reserva));
    }

    async update(id: number, data: Partial<TAtualizarReservaParams>): Promise<ReservaEntity> {
        const reserva = await this.prisma.reserva.update({
            where: { id },
            data,
        });
        return ReservaEntity.create(reserva);
    }

    async findByCodigoReserva(codigoReserva: string): Promise<ReservaEntity | null> {
        const reserva = await this.prisma.reserva.findUnique({
            where: { codigoReserva },
        });
        return reserva ? ReservaEntity.create(reserva) : null;
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.reserva.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}