import { BuscarOfertasVooUseCase } from './buscar-ofertas-voo.use-case';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { SliceOfertaDto } from '../dto/slice-oferta.dto';
import { SegmentoOfertaDto } from '../dto/segmento-oferta.dto';

describe('BuscarOfertasVooUseCase', () => {
  let useCase: BuscarOfertasVooUseCase;
  let gateway: jest.Mocked<BuscaVoosGatewayContract>;

  beforeEach(() => {
    gateway = {
      buscarOfertas: jest.fn(),
      buscarOfertaPorId: jest.fn(),
      buscarSugestoesLugar: jest.fn(),
    };

    useCase = new BuscarOfertasVooUseCase(gateway);
  });

  it('deve repassar a busca ao gateway e retornar as ofertas', async () => {
    const ofertas = [
      new OfertaVooDto({
        ofertaId: 'off_123',
        preco: 499.9,
        moeda: 'BRL',
        origem: 'GRU',
        destino: 'GIG',
        idaEVolta: false,
        slices: [
          new SliceOfertaDto({
            direcao: 'IDA',
            segmentos: [
              new SegmentoOfertaDto({
                numeroVoo: 'ZZ123',
                companhia: 'Duffel Airways',
                origem: 'GRU',
                destino: 'GIG',
                dataPartida: '2026-12-01T10:00:00.000Z',
                dataChegada: '2026-12-01T11:00:00.000Z',
              }),
            ],
          }),
        ],
      }),
    ];
    gateway.buscarOfertas.mockResolvedValue(ofertas);

    const params = { origem: 'GRU', destino: 'GIG', dataIda: '2026-12-01' };
    const resultado = await useCase.execute(params);

    expect(gateway.buscarOfertas).toHaveBeenCalledWith(params);
    expect(resultado).toBe(ofertas);
  });
});
