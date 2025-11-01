import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { CriarReservaUseCaseFactory } from '../use-cases/factory/criar-reserva.use-case.factory';
import { ListarReservasUseCaseFactory } from '../use-cases/factory/listar-reservas.use-case.factory';
import { ListarReservaPorIdUseCaseFactory } from '../use-cases/factory/listar-reserva-por-id.use-case.factory';
import { AtualizarReservaUseCaseFactory } from '../use-cases/factory/atualizar-reserva.use-case.factory';
import { DeletarReservaUseCaseFactory } from '../use-cases/factory/deletar-reserva.use-case.factory';

import { ReservaResponseDto } from '../dto/reserva-response.dto';
import { CriarReservaDto } from '../dto/criar-reserva.dto';
import { AtualizarReservaDto } from '../dto/atualizar-reserva.dto';


@Controller('reservas')
export class ReservaController {
        private readonly criarReservaUseCase;
        private readonly listarReservasUseCase; 
        private readonly listarReservaPorIdUseCase;
        private readonly atualizarReservaUseCase;
        private readonly deletarReservaUseCase;
    constructor(
        private readonly criarReservaUseCaseFactory: CriarReservaUseCaseFactory,
        private readonly listarReservasUseCaseFactory: ListarReservasUseCaseFactory,
        private readonly listarReservaPorIdUseCaseFactory: ListarReservaPorIdUseCaseFactory,
        private readonly atualizarReservaUseCaseFactory: AtualizarReservaUseCaseFactory,
        private readonly deletarReservaUseCaseFactory: DeletarReservaUseCaseFactory) {
        this.criarReservaUseCase = this.criarReservaUseCaseFactory.create();
        this.listarReservasUseCase = this.listarReservasUseCaseFactory.create();
        this.listarReservaPorIdUseCase = this.listarReservaPorIdUseCaseFactory.create();
        this.atualizarReservaUseCase = this.atualizarReservaUseCaseFactory.create();
        this.deletarReservaUseCase = this.deletarReservaUseCaseFactory.create();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async criar(@Body() data: CriarReservaDto): Promise<ReservaResponseDto> {
        const reserva = await this.criarReservaUseCase.execute(data);
        
        const criarReserva = new ReservaResponseDto({
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
        return criarReserva;
    }

    @Get(':id')
    async listarPorId(@Param('id', ParseIntPipe) id: number): Promise<ReservaResponseDto> {
        const reserva = await this.listarReservaPorIdUseCase.execute(id);
        
        if (!reserva) {
            throw new NotFoundException('Reserva não encontrada');
        }
        
        const listarReservaPorId = new ReservaResponseDto({
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
        return listarReservaPorId;
    }

    @Get()
    async listar(): Promise<ReservaResponseDto[]> {
        const reservas = await this.listarReservasUseCase.execute();
        
        const listarReservas = reservas.map(reserva => new ReservaResponseDto({
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
        return listarReservas;
    }

    @Put(':id')
    async atualizar(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: AtualizarReservaDto,
    ): Promise<ReservaResponseDto> {
        const reserva = await this.atualizarReservaUseCase.execute(id, data);

        const atualizarReserva = new ReservaResponseDto({
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
        return atualizarReserva
    }

    @Delete(':id')
    async deletar(@Param('id', ParseIntPipe) id: number): Promise<{success: boolean}> {
        const success = await this.deletarReservaUseCase.execute(id);

       return success;
    }
}