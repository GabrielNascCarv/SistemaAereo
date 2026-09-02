import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CriarReservaUseCase } from '../use-cases/criar-reserva.use-case';
import { ListarReservasUseCase } from '../use-cases/listar-reservas.use-case';
import { ListarReservaPorIdUseCase } from '../use-cases/listar-reserva-por-id.use-case';
import { AtualizarReservaUseCase } from '../use-cases/atualizar-reserva.use-case';
import { DeletarReservaUseCase } from '../use-cases/deletar-reserva.use-case';
import { CriarReservaDto } from '../dto/criar-reserva.dto';
import { AtualizarReservaDto } from '../dto/atualizar-reserva.dto';
import { ReservaResponseDto } from '../dto/reserva-response.dto';
import { TrechoReservaResponseDto } from '../dto/trecho-reserva-response.dto';
import { VooResponseDto } from '../../voos/dto/voo-response.dto';
import { ReservaEntity } from '../entities/reserva.entity';
import { PaginacaoQueryDto } from '../../../core/common/dto/paginacao-query.dto';
import { PaginaResultadoDto } from '../../../core/common/dto/pagina-resultado.dto';

@Controller('reservas')
export class ReservaController {
  constructor(
    private readonly criarReservaUseCase: CriarReservaUseCase,
    private readonly listarReservasUseCase: ListarReservasUseCase,
    private readonly listarReservaPorIdUseCase: ListarReservaPorIdUseCase,
    private readonly atualizarReservaUseCase: AtualizarReservaUseCase,
    private readonly deletarReservaUseCase: DeletarReservaUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarReservaDto): Promise<ReservaResponseDto> {
    const reserva = await this.criarReservaUseCase.execute(data);
    return this.paraResponseDto(reserva);
  }

  @Get()
  async listar(
    @Query() query: PaginacaoQueryDto,
  ): Promise<PaginaResultadoDto<ReservaResponseDto>> {
    const { page = 1, limit = 15 } = query;
    const { data, total } = await this.listarReservasUseCase.execute({
      page,
      limit,
    });

    const reservas = data.map((reserva) => this.paraResponseDto(reserva));

    return new PaginaResultadoDto(reservas, total, page, limit);
  }

  @Get(':id')
  async listarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReservaResponseDto> {
    const reserva = await this.listarReservaPorIdUseCase.execute(id);

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return this.paraResponseDto(reserva);
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarReservaDto,
  ): Promise<ReservaResponseDto> {
    const reserva = await this.atualizarReservaUseCase.execute(id, data);
    return this.paraResponseDto(reserva);
  }

  @Delete(':id')
  async deletar(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.deletarReservaUseCase.execute(id);

    return {
      success,
      message: success
        ? 'Reserva deletada com sucesso'
        : 'Erro ao deletar reserva',
    };
  }

  private paraResponseDto(reserva: ReservaEntity): ReservaResponseDto {
    return new ReservaResponseDto({
      id: reserva.id,
      codigoReserva: reserva.codigoReserva,
      dataReserva: reserva.dataReserva,
      status: reserva.status,
      numeroPassageiros: reserva.numeroPassageiros,
      passageiroId: reserva.passageiroId,
      createdAt: reserva.createdAt,
      trechos: reserva.trechos.map(
        (trecho) =>
          new TrechoReservaResponseDto({
            vooId: trecho.vooId,
            direcao: trecho.direcao,
            ordem: trecho.ordem,
            voo: new VooResponseDto({
              id: trecho.voo.id,
              numeroVoo: trecho.voo.numeroVoo,
              origem: trecho.voo.origem,
              destino: trecho.voo.destino,
              dataPartida: trecho.voo.dataPartida,
              dataChegada: trecho.voo.dataChegada,
              assentosDisponiveis: trecho.voo.assentosDisponiveis,
              preco: trecho.voo.preco,
              status: trecho.voo.status,
              createdAt: trecho.voo.createdAt,
            }),
          }),
      ),
    });
  }
}
