import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AtualizarVooUseCase } from './atualizar-voo.use-case';
import { VooRepository } from '../repositories/voo.repository';
import { VooEntity } from '../entities/voo.entity';

describe('AtualizarVooUseCase', () => {
  let useCase: AtualizarVooUseCase;
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
      possuiReservaAtiva: jest.fn(),
    } as unknown as jest.Mocked<VooRepository>;

    vooRepository.possuiReservaAtiva.mockResolvedValue(false);

    useCase = new AtualizarVooUseCase(vooRepository);
  });

  it('deve lançar NotFoundException quando o voo não existe', async () => {
    vooRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { preco: 599.9 })).rejects.toThrow(
      NotFoundException,
    );
    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('deve atualizar sem checar número do voo quando ele não muda', async () => {
    vooRepository.findById.mockResolvedValue(vooExistente);
    vooRepository.update.mockResolvedValue(vooExistente);

    await useCase.execute(1, { preco: 599.9 });

    expect(vooRepository.findByNumeroVoo).not.toHaveBeenCalled();
    expect(vooRepository.update).toHaveBeenCalledWith(1, { preco: 599.9 });
  });

  it('deve lançar ConflictException quando o novo número já pertence a outro voo', async () => {
    vooRepository.findById.mockResolvedValue(vooExistente);
    vooRepository.findByNumeroVoo.mockResolvedValue(
      VooEntity.create({ ...vooExistente, id: 2, numeroVoo: 'CD456' }),
    );

    await expect(useCase.execute(1, { numeroVoo: 'CD456' })).rejects.toThrow(
      ConflictException,
    );
    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('não deve checar reservas confirmadas quando as datas não mudam', async () => {
    vooRepository.findById.mockResolvedValue(vooExistente);
    vooRepository.update.mockResolvedValue(vooExistente);

    await useCase.execute(1, { preco: 599.9 });

    expect(vooRepository.possuiReservaAtiva).not.toHaveBeenCalled();
  });

  it.each([
    ['dataPartida', { dataPartida: new Date('2026-11-01T10:00:00.000Z') }],
    ['dataChegada', { dataChegada: new Date('2026-11-01T11:00:00.000Z') }],
  ])(
    'deve lançar BadRequestException ao alterar %s de um voo com reserva confirmada',
    async (_campo, alteracao) => {
      vooRepository.findById.mockResolvedValue(vooExistente);
      vooRepository.possuiReservaAtiva.mockResolvedValue(true);

      await expect(useCase.execute(1, alteracao)).rejects.toThrow(
        BadRequestException,
      );
      expect(vooRepository.update).not.toHaveBeenCalled();
    },
  );

  it('deve permitir alterar as datas quando não há reserva confirmada', async () => {
    vooRepository.findById.mockResolvedValue(vooExistente);
    vooRepository.possuiReservaAtiva.mockResolvedValue(false);
    vooRepository.update.mockResolvedValue(vooExistente);

    const novaData = { dataPartida: new Date('2026-11-01T10:00:00.000Z') };
    await useCase.execute(1, novaData);

    expect(vooRepository.update).toHaveBeenCalledWith(1, novaData);
  });
});
