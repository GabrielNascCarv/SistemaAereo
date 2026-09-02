import { NotFoundException } from '@nestjs/common';
import { ImportarVooExternoUseCase } from './importar-voo-externo.use-case';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { SliceOfertaDto } from '../dto/slice-oferta.dto';
import { SegmentoOfertaDto } from '../dto/segmento-oferta.dto';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { VooEntity } from '../../voos/entities/voo.entity';

describe('ImportarVooExternoUseCase', () => {
  let useCase: ImportarVooExternoUseCase;
  let gateway: jest.Mocked<BuscaVoosGatewayContract>;
  let vooRepository: jest.Mocked<VooRepository>;

  const segmento = (
    overrides: Partial<ConstructorParameters<typeof SegmentoOfertaDto>[0]> = {},
  ) =>
    new SegmentoOfertaDto({
      numeroVoo: 'ZZ123',
      companhia: 'Duffel Airways',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: '2026-12-01T10:00:00.000Z',
      dataChegada: '2026-12-01T11:00:00.000Z',
      ...overrides,
    });

  const ofertaSoIda = new OfertaVooDto({
    ofertaId: 'off_123',
    preco: 500,
    moeda: 'BRL',
    origem: 'GRU',
    destino: 'GIG',
    idaEVolta: false,
    slices: [new SliceOfertaDto({ direcao: 'IDA', segmentos: [segmento()] })],
  });

  const criarVoo = (
    overrides: Partial<Parameters<typeof VooEntity.create>[0]> = {},
  ) =>
    VooEntity.create({
      id: 1,
      numeroVoo: 'ZZ123',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: new Date('2026-12-01T10:00:00.000Z'),
      dataChegada: new Date('2026-12-01T11:00:00.000Z'),
      assentosDisponiveis: 1,
      preco: 500,
      status: 'AGENDADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  beforeEach(() => {
    gateway = {
      buscarOfertas: jest.fn(),
      buscarOfertaPorId: jest.fn(),
      buscarSugestoesLugar: jest.fn(),
    };

    vooRepository = {
      create: jest.fn(),
      findByNumeroVoo: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      possuiReservaAtiva: jest.fn(),
    } as unknown as jest.Mocked<VooRepository>;

    useCase = new ImportarVooExternoUseCase(gateway, vooRepository);
  });

  it('deve lançar NotFoundException quando a oferta não existe na Duffel', async () => {
    gateway.buscarOfertaPorId.mockResolvedValue(null);

    await expect(useCase.execute('off_inexistente')).rejects.toThrow(
      NotFoundException,
    );
    expect(vooRepository.create).not.toHaveBeenCalled();
  });

  it('deve importar uma oferta só de ida como um único trecho', async () => {
    const voo = criarVoo();
    gateway.buscarOfertaPorId.mockResolvedValue(ofertaSoIda);
    vooRepository.findByNumeroVoo.mockResolvedValue(null);
    vooRepository.create.mockResolvedValue(voo);

    const resultado = await useCase.execute('off_123');

    expect(vooRepository.create).toHaveBeenCalledWith({
      numeroVoo: 'ZZ123',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: new Date('2026-12-01T10:00:00.000Z'),
      dataChegada: new Date('2026-12-01T11:00:00.000Z'),
      assentosDisponiveis: 1,
      preco: 500,
    });
    expect(resultado).toEqual([{ vooId: 1, direcao: 'IDA', ordem: 1, voo }]);
  });

  it('deve reaproveitar o voo já importado em vez de duplicar', async () => {
    const vooExistente = criarVoo();
    gateway.buscarOfertaPorId.mockResolvedValue(ofertaSoIda);
    vooRepository.findByNumeroVoo.mockResolvedValue(vooExistente);

    const resultado = await useCase.execute('off_123');

    expect(vooRepository.create).not.toHaveBeenCalled();
    expect(resultado).toEqual([
      { vooId: 1, direcao: 'IDA', ordem: 1, voo: vooExistente },
    ]);
  });

  it('deve importar um itinerário de ida e volta com conexão, na ordem correta', async () => {
    const oferta = new OfertaVooDto({
      ofertaId: 'off_456',
      preco: 800,
      moeda: 'BRL',
      origem: 'GRU',
      destino: 'JFK',
      idaEVolta: true,
      slices: [
        new SliceOfertaDto({
          direcao: 'IDA',
          segmentos: [
            segmento({ numeroVoo: 'AA100', origem: 'GRU', destino: 'MIA' }),
            segmento({ numeroVoo: 'AA200', origem: 'MIA', destino: 'JFK' }),
          ],
        }),
        new SliceOfertaDto({
          direcao: 'VOLTA',
          segmentos: [
            segmento({ numeroVoo: 'AA300', origem: 'JFK', destino: 'GRU' }),
          ],
        }),
      ],
    });
    gateway.buscarOfertaPorId.mockResolvedValue(oferta);
    vooRepository.findByNumeroVoo.mockResolvedValue(null);
    vooRepository.create.mockImplementation((data) =>
      Promise.resolve(
        criarVoo({
          id:
            data.numeroVoo === 'AA100' ? 1 : data.numeroVoo === 'AA200' ? 2 : 3,
          numeroVoo: data.numeroVoo,
          origem: data.origem,
          destino: data.destino,
        }),
      ),
    );

    const resultado = await useCase.execute('off_456');

    expect(vooRepository.create).toHaveBeenCalledTimes(3);
    // preço dividido igualmente entre os 3 trechos importados
    expect(vooRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ numeroVoo: 'AA100', preco: 800 / 3 }),
    );
    expect(resultado).toEqual([
      expect.objectContaining({ vooId: 1, direcao: 'IDA', ordem: 1 }),
      expect.objectContaining({ vooId: 2, direcao: 'IDA', ordem: 2 }),
      expect.objectContaining({ vooId: 3, direcao: 'VOLTA', ordem: 1 }),
    ]);
  });

  it('não deve confundir ida e volta quando reaproveitam o mesmo número de voo em datas diferentes', async () => {
    // Regressão: a Duffel (sandbox) às vezes reusa o mesmo numeroVoo para a
    // ida e a volta. findByNumeroVoo precisa considerar a data de partida,
    // senão a volta é importada como cópia da ida.
    const oferta = new OfertaVooDto({
      ofertaId: 'off_789',
      preco: 400,
      moeda: 'USD',
      origem: 'STN',
      destino: 'JFK',
      idaEVolta: true,
      slices: [
        new SliceOfertaDto({
          direcao: 'IDA',
          segmentos: [
            segmento({
              numeroVoo: 'IB3167',
              origem: 'STN',
              destino: 'JFK',
              dataPartida: '2026-12-01T00:00:00.000Z',
              dataChegada: '2026-12-01T03:00:00.000Z',
            }),
          ],
        }),
        new SliceOfertaDto({
          direcao: 'VOLTA',
          segmentos: [
            segmento({
              numeroVoo: 'IB3167',
              origem: 'JFK',
              destino: 'STN',
              dataPartida: '2026-12-10T06:58:00.000Z',
              dataChegada: '2026-12-10T19:56:00.000Z',
            }),
          ],
        }),
      ],
    });
    gateway.buscarOfertaPorId.mockResolvedValue(oferta);
    vooRepository.findByNumeroVoo.mockResolvedValue(null);
    vooRepository.create.mockImplementation((data) =>
      Promise.resolve(
        criarVoo({
          id: data.origem === 'STN' ? 1 : 2,
          numeroVoo: data.numeroVoo,
          origem: data.origem,
          destino: data.destino,
          dataPartida: data.dataPartida,
          dataChegada: data.dataChegada,
        }),
      ),
    );

    const resultado = await useCase.execute('off_789');

    // busca cada segmento pela combinação número + data, não só o número
    expect(vooRepository.findByNumeroVoo).toHaveBeenCalledWith(
      'IB3167',
      new Date('2026-12-01T00:00:00.000Z'),
    );
    expect(vooRepository.findByNumeroVoo).toHaveBeenCalledWith(
      'IB3167',
      new Date('2026-12-10T06:58:00.000Z'),
    );
    expect(vooRepository.create).toHaveBeenCalledTimes(2);
    expect(resultado[0].voo.origem).toBe('STN');
    expect(resultado[1].voo.origem).toBe('JFK');
    expect(resultado[0].vooId).not.toBe(resultado[1].vooId);
  });
});
