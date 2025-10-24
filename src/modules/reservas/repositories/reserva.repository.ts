import { PrismaService } from "src/core/database/prisma.service";
import { ReservaEntity } from "../entities/reserva.entity";
import { CriarReservaDto } from "../dto/criar-reserva.dto";
import { ReservaRepositoryContract } from "../contracts/reserva-repository.contract";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservaRepository implements ReservaRepositoryContract {
    constructor(private prisma: PrismaService) {}

    async create(data: {
        codigoReserva: string;
        numeroPassageiros: number;
        vooId: number;
        passageiroId: number;
    }): Promise<ReservaEntity> {
        const reserva = await this.prisma.reserva.create({
            data: {
                ...data,
                dataReserva: new Date(),
                status: 'CONFIRMADA'
            },
        });
        return ReservaEntity.create(reserva);
    }
}