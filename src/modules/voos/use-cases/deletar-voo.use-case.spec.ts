import { NotFoundException } from '@nestjs/common';
import { DeletarVooUseCase } from './deletar-voo.use-case';
import { VooRepository } from '../repositories/voo.repository';
import { VooEntity } from '../entities/voo.entity';

describe('DeletarVooUseCase', () => {
  let useCase: DeletarVooUseCase;
  let vooRepository: jest.Mocked<VooRepository>;

  const vooExistente = VooEntity.create({
    id: 1,
    numeroVoo: 'AB123',
    origem: 'GRU',
    destino: 'GIG',
    dataPartida: new Date('2026-10-01T10:00:00.000Z'),
    dataChegada: new Date('2026-10-01T11:00:00.000Z'),
    assentosDisponiveis: 100,
    preco: 499.9,
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

    useCase = new DeletarVooUseCase(vooRepository);
  });

  it('deve lançar NotFoundException quando o voo não existe', async () => {
    vooRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(vooRepository.delete).not.toHaveBeenCalled();
  });

  it('deve deletar e retornar true quando o voo existe', async () => {
    vooRepository.findById.mockResolvedValue(vooExistente);
    vooRepository.delete.mockResolvedValue(true);

    const resultado = await useCase.execute(1);

    expect(vooRepository.delete).toHaveBeenCalledWith(1);
    expect(resultado).toBe(true);
  });
});
