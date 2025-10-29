import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { CriarPassageiroUseCaseFactory } from '../use-cases/factory/criar-passageiro.use-case.factory';
import { ListarPassageirosUseCaseFactory } from '../use-cases/factory/listar-passageiros.use-case.factory';
import { ListarPassageiroPorIdUseCaseFactory } from '../use-cases/factory/listar-passageiro-por-id.use-case.factory';
import { AtualizarPassageiroUseCaseFactory } from '../use-cases/factory/atualizar-passageiro.use-case.factory';
import { DeletarPassageiroUseCaseFactory } from '../use-cases/factory/deletar-passageiro.use-case.factory';

import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { AtualizarPassageiroDto } from '../dto/atualizar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';

@Controller('passageiros')
export class PassageiroController {
  private readonly criarPassageiroUseCase;
  private readonly listarPassageirosUseCase;
  private readonly listarPassageiroPorIdUseCase;
  private readonly atualizarPassageiroUseCase;
  private readonly deletarPassageiroUseCase;

  constructor(
    private readonly criarPassageiroUseCaseFactory: CriarPassageiroUseCaseFactory,
    private readonly listarPassageirosUseCaseFactory: ListarPassageirosUseCaseFactory,
    private readonly listarPassageiroPorIdUseCaseFactory: ListarPassageiroPorIdUseCaseFactory,
    private readonly atualizarPassageiroUseCaseFactory: AtualizarPassageiroUseCaseFactory,
    private readonly deletarPassageiroUseCaseFactory: DeletarPassageiroUseCaseFactory,
  ) {
    this.criarPassageiroUseCase = this.criarPassageiroUseCaseFactory.create();
    this.listarPassageirosUseCase = this.listarPassageirosUseCaseFactory.create();
    this.listarPassageiroPorIdUseCase = this.listarPassageiroPorIdUseCaseFactory.create();
    this.atualizarPassageiroUseCase = this.atualizarPassageiroUseCaseFactory.create();
    this.deletarPassageiroUseCase = this.deletarPassageiroUseCaseFactory.create();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarPassageiroDto): Promise<PassageiroResponseDto> {
    const passageiro = await this.criarPassageiroUseCase.execute(data);
    
    return new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });
  }

  @Get()
  async listar(): Promise<PassageiroResponseDto[]> {
    const passageiros = await this.listarPassageirosUseCase.execute();
    
    return passageiros.map(passageiro => new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    }));
  }

  @Get(':id')
  async listarPorId(@Param('id', ParseIntPipe) id: number): Promise<PassageiroResponseDto> {
    const passageiro = await this.listarPassageiroPorIdUseCase.execute(id);
    
    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
    }
    
    return new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarPassageiroDto,
  ): Promise<PassageiroResponseDto> {
    const passageiro = await this.atualizarPassageiroUseCase.execute(id, data);
    
    return new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });
  }

  @Delete(':id')
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.deletarPassageiroUseCase.execute(id);
    
    return {
      success,
      message: success ? 'Passageiro deletado com sucesso' : 'Erro ao deletar passageiro'
    };
  }
}