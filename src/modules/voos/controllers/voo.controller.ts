import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { CriarVooUseCase } from '../use-cases/criar-voo.use-case';
import { ListarVoosUseCase } from '../use-cases/listar-voos.use-case';
import { ListarVooPorIdUseCase } from '../use-cases/listar-voo-por-id.use-case';
import { AtualizarVooUseCase } from '../use-cases/atualizar-voo.use-case';
import { DeletarVooUseCase } from '../use-cases/deletar-voo.use-case';
import { CriarVooDto } from '../dto/criar-voo.dto';
import { AtualizarVooDto } from '../dto/atualizar-voo.dto';
import { VooResponseDto } from '../dto/voo-response.dto';

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
  async listar(): Promise<VooResponseDto[]> {
    const voos = await this.listarVoosUseCase.execute();

    return voos.map(voo => new VooResponseDto({
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
