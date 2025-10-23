import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CriarPassageiroUseCase } from '../use-cases/criar-passageiro.use-case';
import { ListarPassageirosUseCase } from '../use-cases/listar-passageiros.use-case';
import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';

@Controller('passageiros')
export class PassageiroController {
  constructor(
    private readonly criarPassageiroUseCase: CriarPassageiroUseCase,
    private readonly listarPassageirosUseCase: ListarPassageirosUseCase,
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
}
