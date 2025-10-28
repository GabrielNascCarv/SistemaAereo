import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../core/database/prisma.service";
import { ReservaEntity } from "../entities/reserva.entity";
import { CriarReservaDto } from "../dto/criar-reserva.dto";
import { ReservaRepositoryContract } from "../contracts/reserva-repository.contract";

@Injectable()
export class ReservaRepository implements ReservaRepositoryContract {
    constructor(private prisma: PrismaService) {}

    async create(data: CriarReservaDto): Promise<ReservaEntity> {
        const codigoReserva = data.codigoReserva || `RES${Date.now()}`;
        
        const reserva = await this.prisma.reserva.create({
            data: {
                codigoReserva,
                numeroPassageiros: data.numeroPassageiros,
                vooId: data.vooId,
                passageiroId: data.passageiroId,
                dataReserva: new Date(),
                status: 'CONFIRMADA'
            },
        });
        return ReservaEntity.create(reserva);
    }

    async findAll(): Promise<ReservaEntity[]> {
        const reservas = await this.prisma.reserva.findMany({
            orderBy: { createdAt: 'desc' },
        });
        
        return reservas.map(reserva => ReservaEntity.create(reserva));
    }

    async findById(id: number): Promise<ReservaEntity | null> {
        const reserva = await this.prisma.reserva.findUnique({
            where: { id },
        });

        return reserva ? ReservaEntity.create(reserva) : null;
    }
}
