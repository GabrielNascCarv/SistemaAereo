import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException  } from '@nestjs/common';
import { CriarReservaUseCase } from '../use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from '../use-cases/listar-reservas.use-case';
import { ListarReservaPorIdUseCase } from '../use-cases/listar-reserva-por-id.use-case';
import { ReservaResponseDto } from '../dto/reserva-response.dto';
import { CriarReservaDto } from '../dto/criar-reserva.dto';

@Controller('reservas')
export class ReservaController {
    constructor(
        private readonly criarReservaUseCase: CriarReservaUseCase,
        private readonly listarReservasUseCase: ListarReservasUseCase,
        private readonly listarReservaPorIdUseCase: ListarReservaPorIdUseCase,
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

    @Get(':id')
    async listarPorId(@Param('id', ParseIntPipe) id: number): Promise<ReservaResponseDto> {
        const reserva = await this.listarReservaPorIdUseCase.execute(id);

        if (!reserva) {
            throw new NotFoundException('Reserva não encontrada');
        }

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

    @Get()
    async listar(): Promise<ReservaResponseDto[]> {
        const reservas = await this.listarReservasUseCase.execute();
        
        return reservas.map(reserva => new ReservaResponseDto({
            id: reserva.id,
            codigoReserva: reserva.codigoReserva,
            dataReserva: reserva.dataReserva,
            status: reserva.status,
            numeroPassageiros: reserva.numeroPassageiros,
            vooId: reserva.vooId,
            passageiroId: reserva.passageiroId,
            createdAt: reserva.createdAt,
            updatedAt: reserva.updatedAt,
        }));
    }
}