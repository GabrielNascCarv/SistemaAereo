import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CriarReservaUseCase } from '../use-cases/criar-reserva.use-case';
import { ReservaResponseDto } from '../dto/reserva-response.dto';
import { CriarReservaDto } from '../dto/criar-reserva.dto';

@Controller('reservas')
export class ReservaController {
    constructor(
        private readonly criarReservaUseCase: CriarReservaUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async criar(@Body() data: CriarReservaDto): Promise<ReservaResponseDto> {
        const reserva = await this.criarReservaUseCase.execute(data);
        
        return new ReservaResponseDto({
            id: reserva.id,
            codigoReserva: reserva.codigoReserva,
            dataReserva: reserva.dataReserva,
            status: reserva.status,
            numeroPassageiros: reserva.numeroPassageiros,
            vooId: reserva.vooId,
            passageiroId: reserva.passageiroId,
            createdAt: reserva.createdAt,
            updatedAt: reserva.updatedAt,
        });
    }
}