import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CriarPassageiroUseCase } from '../use-cases/criar-passageiro.use-case';
import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';

@Controller('passageiros')
export class PassageiroController {
  constructor(
    private readonly criarPassageiroUseCase: CriarPassageiroUseCase,
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
}
