import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';

import { CriarVooUseCaseFactory } from '../use-cases/factory/criar-voo.use-case.factory';
import { ListarVooUseCaseFactory } from '../use-cases/factory/listar-voo.use-case.factory';
import { AtualizarVooUseCaseFactory } from '../use-cases/factory/atualizar-voo.use-case.factory';
import { DeletarVooUseCaseFactory } from '../use-cases/factory/deletar-voo.use-case.factory';

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
    const criarVooUseCase = this.criarVooUseCaseFactory.create();
    const voo = await criarVooUseCase.execute(data);
    
    const vooResponse = new VooResponseDto({
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

    return vooResponse;
  }

  @Get()
  async listar(): Promise<VooResponseDto[]> {
    const listarVooUseCase = this.listarVooUseCaseFactory.create();
    const voos = await listarVooUseCase.execute();
    
    const voosResponse = voos.map(voo => {
      const vooResponse = new VooResponseDto({
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
      return vooResponse;
    });

    return voosResponse;
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarVooDto,
  ): Promise<VooResponseDto> {
    const atualizarVooUseCase = this.atualizarVooUseCaseFactory.create();
    const voo = await atualizarVooUseCase.execute(id, data);
    
    const vooResponse = new VooResponseDto({
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

    return vooResponse;
  }

  @Delete(':id')
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean}> {
      const deletarVooUseCase = this.deletarVooUseCaseFactory.create();
      const success = await deletarVooUseCase.execute({ id });
      
      const deletarVoo = {
          success
      };
      return deletarVoo;
  }
}