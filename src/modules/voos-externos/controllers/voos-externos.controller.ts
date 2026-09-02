import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { BuscarOfertasVooUseCase } from '../use-cases/buscar-ofertas-voo.use-case';
import { ImportarVooExternoUseCase } from '../use-cases/importar-voo-externo.use-case';
import { BuscarSugestoesLugarUseCase } from '../use-cases/buscar-sugestoes-lugar.use-case';
import { BuscarVoosExternosDto } from '../dto/buscar-voos-externos.dto';
import { ImportarVooExternoDto } from '../dto/importar-voo-externo.dto';
import { BuscarSugestoesLugarDto } from '../dto/buscar-sugestoes-lugar.dto';
import { VooResponseDto } from '../../voos/dto/voo-response.dto';

@Controller('voos-externos')
export class VoosExternosController {
  constructor(
    private readonly buscarOfertasVooUseCase: BuscarOfertasVooUseCase,
    private readonly importarVooExternoUseCase: ImportarVooExternoUseCase,
    private readonly buscarSugestoesLugarUseCase: BuscarSugestoesLugarUseCase,
  ) {}

  @Get('busca')
  async buscar(@Query() query: BuscarVoosExternosDto) {
    return this.buscarOfertasVooUseCase.execute(query);
  }

  @Get('lugares')
  async lugares(@Query() query: BuscarSugestoesLugarDto) {
    return this.buscarSugestoesLugarUseCase.execute(query.query);
  }

  @Post('importar')
  @HttpCode(HttpStatus.CREATED)
  async importar(@Body() data: ImportarVooExternoDto): Promise<VooResponseDto> {
    const voo = await this.importarVooExternoUseCase.execute(data.ofertaId);

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
}
