import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete, Query } from '@nestjs/common';
import { CriarPassageiroUseCase } from '../use-cases/criar-passageiro.use-case';
import { ListarPassageirosUseCase } from '../use-cases/listar-passageiros.use-case';
import { ListarPassageiroPorIdUseCase } from '../use-cases/listar-passageiro-por-id.use-case';
import { AtualizarPassageiroUseCase } from '../use-cases/atualizar-passageiro.use-case';
import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { AtualizarPassageiroDto } from '../dto/atualizar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';
import { DeletarPassageiroUseCase } from '../use-cases/deletar-passageiro.use-case';
import { PaginacaoQueryDto } from '../../../core/common/dto/paginacao-query.dto';
import { PaginaResultadoDto } from '../../../core/common/dto/pagina-resultado.dto';

@Controller('passageiros')
export class PassageiroController {
  constructor(
    private readonly criarPassageiroUseCase: CriarPassageiroUseCase,
    private readonly listarPassageirosUseCase: ListarPassageirosUseCase,
    private readonly listarPassageiroPorIdUseCase: ListarPassageiroPorIdUseCase,
    private readonly atualizarPassageiroUseCase: AtualizarPassageiroUseCase,
    private readonly deletarPassageiroUseCase: DeletarPassageiroUseCase,
  ) {}

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
  async listar(@Query() query: PaginacaoQueryDto): Promise<PaginaResultadoDto<PassageiroResponseDto>> {
    const { page = 1, limit = 15 } = query;
    const { data, total } = await this.listarPassageirosUseCase.execute({ page, limit });

    const passageiros = data.map(passageiro => new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    }));

    return new PaginaResultadoDto(passageiros, total, page, limit);
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
