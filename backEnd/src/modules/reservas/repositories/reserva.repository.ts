import { PrismaService } from "src/core/database/prisma.service";
import { ReservaEntity } from "../entities/reserva.entity";
import { CriarReservaDto } from "../dto/criar-reserva.dto";
import { ReservaRepositoryContract } from "../contracts/reserva-repository.contract";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservaRepository implements ReservaRepositoryContract {
    constructor(private prisma: PrismaService) {}

    async create(data: CriarReservaDto): Promise<ReservaEntity> {
        // Gera código de reserva se não foi fornecido
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
}