import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { SugestaoLugarDto } from '../dto/sugestao-lugar.dto';

export interface BuscaVoosGatewayContract {
  buscarOfertas(params: {
    origem: string;
    destino: string;
    data: string;
  }): Promise<OfertaVooDto[]>;

  buscarOfertaPorId(ofertaId: string): Promise<OfertaVooDto | null>;

  buscarSugestoesLugar(query: string): Promise<SugestaoLugarDto[]>;
}
