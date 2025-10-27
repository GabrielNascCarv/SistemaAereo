import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { CriarVooUseCase } from '../use-cases/criar-voo.use-case';
import { ListarVooUseCase } from '../use-cases/listar-voos-use-case';
import { CriarVooDto } from '../dto/criar-voo.dto';
import { VooResponseDto } from '../dto/voo-response.dto';

@Controller('voos')
export class VooController {
  constructor(
    private readonly criarVooUseCase: CriarVooUseCase,
    private readonly listarVooUseCase: ListarVooUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarVooDto): Promise<VooResponseDto> {
    const voo = await this.criarVooUseCase.execute(data);
    
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
    const voos = await this.listarVooUseCase.execute();
    return voos.map(voo => new VooResponseDto(voo));
  }
}
