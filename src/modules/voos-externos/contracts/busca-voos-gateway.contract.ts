import { OfertaVooDto } from '../dto/oferta-voo.dto';

export interface BuscaVoosGatewayContract {
  buscarOfertas(params: {
    origem: string;
    destino: string;
    data: string;
  }): Promise<OfertaVooDto[]>;

  buscarOfertaPorId(ofertaId: string): Promise<OfertaVooDto | null>;
}
