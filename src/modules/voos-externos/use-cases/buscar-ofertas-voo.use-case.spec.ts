import { BuscarOfertasVooUseCase } from './buscar-ofertas-voo.use-case';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';

describe('BuscarOfertasVooUseCase', () => {
  let useCase: BuscarOfertasVooUseCase;
  let gateway: jest.Mocked<BuscaVoosGatewayContract>;

  beforeEach(() => {
    gateway = {
      buscarOfertas: jest.fn(),
      buscarOfertaPorId: jest.fn(),
    };

    useCase = new BuscarOfertasVooUseCase(gateway);
  });

  it('deve repassar a busca ao gateway e retornar as ofertas', async () => {
    const ofertas = [
      new OfertaVooDto({
        ofertaId: 'off_123',
        companhia: 'Duffel Airways',
        numeroVoo: 'ZZ123',
        origem: 'GRU',
        destino: 'GIG',
        dataPartida: '2026-12-01T10:00:00.000Z',
        dataChegada: '2026-12-01T11:00:00.000Z',
        preco: 499.9,
        moeda: 'BRL',
      }),
    ];
    gateway.buscarOfertas.mockResolvedValue(ofertas);

    const params = { origem: 'GRU', destino: 'GIG', data: '2026-12-01' };
    const resultado = await useCase.execute(params);

    expect(gateway.buscarOfertas).toHaveBeenCalledWith(params);
    expect(resultado).toBe(ofertas);
  });
});
