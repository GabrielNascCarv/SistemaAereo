import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCaseFactory } from '../use-cases/factory/listar-voo.use-case.factory';
import { AtualizarVooUseCaseFactory } from '../use-cases/factory/atualizar-voo.use-case.factory';
import { DeletarVooUseCaseFactory } from '../use-cases/factory/deletar-voo.use-case.factory';
import type { ICriarVooUseCaseContract } from '../contracts/criar-voo-use-case.contract';
import type { IListarVooUseCaseContract } from '../contracts/listar-voo-use-case.contract';
import type { IAtualizarVooUseCaseContract } from '../contracts/atualizar-voo-use-case.contract';
import type { IDeletarVooUseCaseContract } from '../contracts/deletar-voo-use-case.contract';
import { CriarVooDto } from '../dto/criar-voo.dto';
import { AtualizarVooDto } from '../dto/atualizar-voo.dto';
import { VooResponseDto } from '../dto/voo-response.dto';

@Controller('voos')
export class VooController {
  constructor(
    private readonly criarVooUseCaseFactory: CriarVooUseCaseFactory,
    private readonly listarVooUseCaseFactory: ListarVooUseCaseFactory,
    private readonly atualizarVooUseCaseFactory: AtualizarVooUseCaseFactory,
    private readonly deletarVooUseCaseFactory: DeletarVooUseCaseFactory,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarVooDto): Promise<VooResponseDto> {
    const criarVooUseCase: ICriarVooUseCaseContract = this.criarVooUseCaseFactory.create();
    const voo = await criarVooUseCase.execute({
      numeroVoo: data.numeroVoo,
      origem: data.origem,
      destino: data.destino,
      dataPartida: data.dataPartida,
      dataChegada: data.dataChegada,
      assentosDisponiveis: data.assentosDisponiveis,
      preco: data.preco,
      status: data.status,
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
    const listarVooUseCase: IListarVooUseCaseContract = this.listarVooUseCaseFactory.create();
    const voos = await listarVooUseCase.execute();
    
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

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarVooDto,
  ): Promise<VooResponseDto> {
    const atualizarVooUseCase: IAtualizarVooUseCaseContract = this.atualizarVooUseCaseFactory.create();
    const voo = await atualizarVooUseCase.execute(id, {
      numeroVoo: data.numeroVoo,
      origem: data.origem,
      destino: data.destino,
      dataPartida: data.dataPartida,
      dataChegada: data.dataChegada,
      assentosDisponiveis: data.assentosDisponiveis,
      preco: data.preco,
      status: data.status,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deletarVooUseCase: IDeletarVooUseCaseContract = this.deletarVooUseCaseFactory.create();
    await deletarVooUseCase.execute({ id });
  }
}