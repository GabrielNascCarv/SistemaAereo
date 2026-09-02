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
import { TrechoReservaResponseDto } from '../../reservas/dto/trecho-reserva-response.dto';

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
  async importar(
    @Body() data: ImportarVooExternoDto,
  ): Promise<TrechoReservaResponseDto[]> {
    const trechos = await this.importarVooExternoUseCase.execute(data.ofertaId);

    return trechos.map(
      (trecho) =>
        new TrechoReservaResponseDto({
          vooId: trecho.vooId,
          direcao: trecho.direcao,
          ordem: trecho.ordem,
          voo: new VooResponseDto({
            id: trecho.voo.id,
            numeroVoo: trecho.voo.numeroVoo,
            origem: trecho.voo.origem,
            destino: trecho.voo.destino,
            dataPartida: trecho.voo.dataPartida,
            dataChegada: trecho.voo.dataChegada,
            assentosDisponiveis: trecho.voo.assentosDisponiveis,
            preco: trecho.voo.preco,
            status: trecho.voo.status,
            createdAt: trecho.voo.createdAt,
          }),
        }),
    );
  }
}
