import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { CriarVooUseCase } from '../use-cases/criar-voo.use-case';
import { ListarVoosUseCase } from '../use-cases/listar-voos.use-case';
import { ListarVooPorIdUseCase } from '../use-cases/listar-voo-por-id.use-case';
import { AtualizarVooUseCase } from '../use-cases/atualizar-voo.use-case';
import { DeletarVooUseCase } from '../use-cases/deletar-voo.use-case';
import { CriarVooDto } from '../dto/criar-voo.dto';
import { AtualizarVooDto } from '../dto/atualizar-voo.dto';
import { VooResponseDto } from '../dto/voo-response.dto';
import { PaginacaoQueryDto } from '../../../core/common/dto/paginacao-query.dto';
import { PaginaResultadoDto } from '../../../core/common/dto/pagina-resultado.dto';

@Controller('voos')
export class VooController {
  constructor(
    private readonly criarVooUseCase: CriarVooUseCase,
    private readonly listarVoosUseCase: ListarVoosUseCase,
    private readonly listarVooPorIdUseCase: ListarVooPorIdUseCase,
    private readonly atualizarVooUseCase: AtualizarVooUseCase,
    private readonly deletarVooUseCase: DeletarVooUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarVooDto): Promise<VooResponseDto> {
    const voo = await this.criarVooUseCase.execute({
      ...data,
      dataPartida: new Date(data.dataPartida),
      dataChegada: new Date(data.dataChegada),
    });

    return new VooResponseDto({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
    });
  }

  @Get()
  async listar(@Query() query: PaginacaoQueryDto): Promise<PaginaResultadoDto<VooResponseDto>> {
    const { page = 1, limit = 15 } = query;
    const { data, total } = await this.listarVoosUseCase.execute({ page, limit });

    const voos = data.map(voo => new VooResponseDto({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
    }));

    return new PaginaResultadoDto(voos, total, page, limit);
  }

  @Get(':id')
  async listarPorId(@Param('id', ParseIntPipe) id: number): Promise<VooResponseDto> {
    const voo = await this.listarVooPorIdUseCase.execute(id);

    if (!voo) {
      throw new NotFoundException('Voo não encontrado');
    }

    return new VooResponseDto({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
    });
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarVooDto,
  ): Promise<VooResponseDto> {
    const voo = await this.atualizarVooUseCase.execute(id, {
      ...data,
      dataPartida: data.dataPartida ? new Date(data.dataPartida) : undefined,
      dataChegada: data.dataChegada ? new Date(data.dataChegada) : undefined,
    });

    return new VooResponseDto({
      id: voo.id,
      numeroVoo: voo.numeroVoo,
      origem: voo.origem,
      destino: voo.destino,
      dataPartida: voo.dataPartida,
      dataChegada: voo.dataChegada,
      assentosDisponiveis: voo.assentosDisponiveis,
      preco: voo.preco,
      status: voo.status,
      createdAt: voo.createdAt,
    });
  }

  @Delete(':id')
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.deletarVooUseCase.execute(id);

    return {
      success,
      message: success ? 'Voo deletado com sucesso' : 'Erro ao deletar voo',
    };
  }
}
