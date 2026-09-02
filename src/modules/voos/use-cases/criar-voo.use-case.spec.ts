import { ConflictException } from '@nestjs/common';
import { CriarVooUseCase } from './criar-voo.use-case';
import { VooRepository } from '../repositories/voo.repository';
import { VooEntity } from '../entities/voo.entity';

describe('CriarVooUseCase', () => {
  let useCase: CriarVooUseCase;
  let vooRepository: jest.Mocked<VooRepository>;

  const dadosValidos = {
    numeroVoo: 'AB123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: new Date('2026-10-01T10:00:00.000Z'),
    dataChegada: new Date('2026-10-01T11:00:00.000Z'),
    assentosDisponiveis: 100,
    preco: 499.9,
  };

  const vooCriado = VooEntity.create({
    id: 1,
    ...dadosValidos,
    status: 'AGENDADO',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    vooRepository = {
      create: jest.fn(),
      findByNumeroVoo: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<VooRepository>;

    useCase = new CriarVooUseCase(vooRepository);
  });

  it('deve criar um voo quando o número do voo ainda não existe', async () => {
    vooRepository.findByNumeroVoo.mockResolvedValue(null);
    vooRepository.create.mockResolvedValue(vooCriado);

    const resultado = await useCase.execute(dadosValidos);

    expect(vooRepository.findByNumeroVoo).toHaveBeenCalledWith(
      dadosValidos.numeroVoo,
    );
    expect(vooRepository.create).toHaveBeenCalledWith(dadosValidos);
    expect(resultado).toBe(vooCriado);
  });

  it('deve lançar ConflictException quando o número do voo já está cadastrado', async () => {
    vooRepository.findByNumeroVoo.mockResolvedValue(vooCriado);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      ConflictException,
    );
    expect(vooRepository.create).not.toHaveBeenCalled();
  });
});
