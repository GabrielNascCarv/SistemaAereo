import { NotFoundException } from '@nestjs/common';
import { ImportarVooExternoUseCase } from './importar-voo-externo.use-case';
import { BuscaVoosGatewayContract } from '../contracts/busca-voos-gateway.contract';
import { OfertaVooDto } from '../dto/oferta-voo.dto';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { VooEntity } from '../../voos/entities/voo.entity';

describe('ImportarVooExternoUseCase', () => {
  let useCase: ImportarVooExternoUseCase;
  let gateway: jest.Mocked<BuscaVoosGatewayContract>;
  let vooRepository: jest.Mocked<VooRepository>;

  const oferta = new OfertaVooDto({
    ofertaId: 'off_123',
    companhia: 'Duffel Airways',
    numeroVoo: 'ZZ123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: '2026-12-01T10:00:00.000Z',
    dataChegada: '2026-12-01T11:00:00.000Z',
    preco: 499.9,
    moeda: 'BRL',
  });

  const vooImportado = VooEntity.create({
    id: 1,
    numeroVoo: 'ZZ123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: new Date(oferta.dataPartida),
    dataChegada: new Date(oferta.dataChegada),
    assentosDisponiveis: 1,
    preco: 499.9,
    status: 'AGENDADO',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    gateway = {
      buscarOfertas: jest.fn(),
      buscarOfertaPorId: jest.fn(),
    };

    vooRepository = {
      create: jest.fn(),
      findByNumeroVoo: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      possuiReservaConfirmada: jest.fn(),
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

  it('deve importar a oferta como um novo voo local', async () => {
    gateway.buscarOfertaPorId.mockResolvedValue(oferta);
    vooRepository.findByNumeroVoo.mockResolvedValue(null);
    vooRepository.create.mockResolvedValue(vooImportado);

    const resultado = await useCase.execute('off_123');

    expect(vooRepository.create).toHaveBeenCalledWith({
      numeroVoo: 'ZZ123',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: new Date(oferta.dataPartida),
      dataChegada: new Date(oferta.dataChegada),
      assentosDisponiveis: 1,
      preco: 499.9,
    });
    expect(resultado).toBe(vooImportado);
  });

  it('deve reaproveitar o voo já importado em vez de duplicar', async () => {
    gateway.buscarOfertaPorId.mockResolvedValue(oferta);
    vooRepository.findByNumeroVoo.mockResolvedValue(vooImportado);

    const resultado = await useCase.execute('off_123');

    expect(vooRepository.create).not.toHaveBeenCalled();
    expect(resultado).toBe(vooImportado);
  });
});
