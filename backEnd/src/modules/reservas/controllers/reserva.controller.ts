import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put } from '@nestjs/common';
import { CriarReservaUseCase } from '../use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from '../use-cases/listar-reservas.use-case';
import { ListarReservaPorIdUseCase } from '../use-cases/listar-reserva-por-id.use-case';
import { AtualizarReservaUseCase } from '../use-cases/atualizar-reserva.use-case';
import { ReservaResponseDto } from '../dto/reserva-response.dto';
import { CriarReservaDto } from '../dto/criar-reserva.dto';
import { AtualizarReservaDto } from '../dto/atualizar-reserva.dto';
import { AtualizarReservaParams } from '../contracts/reserva-repository.contract';

@Controller('reservas')
export class ReservaController {
    constructor(
        private readonly criarReservaUseCase: CriarReservaUseCase,
        private readonly listarReservasUseCase: ListarReservasUseCase,
        private readonly listarReservaPorIdUseCase: ListarReservaPorIdUseCase,
        private readonly atualizarReservaUseCase: AtualizarReservaUseCase, // ✅ Adicionar
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

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AtualizarReservaDto,
    ): Promise<ReservaResponseDto> {
        // ✅ Controller converte DTO para Params
        const updateData: AtualizarReservaParams = {
            codigoReserva: dto.codigoReserva,
            status: dto.status,
            numeroPassageiros: dto.numeroPassageiros,
            vooId: dto.vooId,
            passageiroId: dto.passageiroId,
        };

        const reserva = await this.atualizarReservaUseCase.execute(id, updateData);
        
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