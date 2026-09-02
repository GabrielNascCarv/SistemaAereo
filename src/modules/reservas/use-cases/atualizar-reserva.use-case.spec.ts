import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AtualizarReservaUseCase } from './atualizar-reserva.use-case';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { ReservaEntity } from '../entities/reserva.entity';
import { VooEntity } from '../../voos/entities/voo.entity';

describe('AtualizarReservaUseCase', () => {
  let useCase: AtualizarReservaUseCase;
  let reservaRepository: jest.Mocked<ReservaRepository>;
  let vooRepository: jest.Mocked<VooRepository>;

  const criarReserva = (
    overrides: Partial<Parameters<typeof ReservaEntity.create>[0]> = {},
  ) =>
    ReservaEntity.create({
      id: 1,
      codigoReserva: 'RES-XXXX-YYYY',
      dataReserva: new Date(),
      status: 'PENDENTE_PAGAMENTO',
      numeroPassageiros: 2,
      vooId: 1,
      passageiroId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  const criarVoo = (
    overrides: Partial<Parameters<typeof VooEntity.create>[0]> = {},
  ) =>
    VooEntity.create({
      id: 1,
      numeroVoo: 'AB123',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: new Date('2026-10-01T10:00:00.000Z'),
      dataChegada: new Date('2026-10-01T11:00:00.000Z'),
      assentosDisponiveis: 98,
      preco: 499.9,
      status: 'AGENDADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  beforeEach(() => {
    reservaRepository = {
      create: jest.fn(),
      findByCodigoReserva: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ReservaRepository>;

    vooRepository = {
      create: jest.fn(),
      findByNumeroVoo: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<VooRepository>;

    useCase = new AtualizarReservaUseCase(reservaRepository, vooRepository);
  });

  it('deve lançar NotFoundException quando a reserva não existe', async () => {
    reservaRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { status: 'CANCELADA' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar BadRequestException quando a reserva já está cancelada', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ status: 'CANCELADA' }),
    );

    await expect(useCase.execute(1, { numeroPassageiros: 3 })).rejects.toThrow(
      BadRequestException,
    );
    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('deve restaurar os assentos do voo ao cancelar a reserva', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ numeroPassageiros: 2 }),
    );
    vooRepository.findById.mockResolvedValue(
      criarVoo({ assentosDisponiveis: 98 }),
    );
    reservaRepository.update.mockResolvedValue(
      criarReserva({ status: 'CANCELADA' }),
    );

    await useCase.execute(1, { status: 'CANCELADA' });

    expect(vooRepository.update).toHaveBeenCalledWith(1, {
      assentosDisponiveis: 100,
    });
    expect(reservaRepository.update).toHaveBeenCalledWith(1, {
      status: 'CANCELADA',
    });
  });

  it('deve lançar BadRequestException ao aumentar passageiros sem assentos suficientes', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ numeroPassageiros: 2 }),
    );
    vooRepository.findById.mockResolvedValue(
      criarVoo({ assentosDisponiveis: 1 }),
    );

    await expect(useCase.execute(1, { numeroPassageiros: 4 })).rejects.toThrow(
      BadRequestException,
    );
    expect(reservaRepository.update).not.toHaveBeenCalled();
  });

  it('deve ajustar os assentos do voo ao mudar o número de passageiros da reserva', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ numeroPassageiros: 2 }),
    );
    vooRepository.findById.mockResolvedValue(
      criarVoo({ assentosDisponiveis: 98 }),
    );
    reservaRepository.update.mockResolvedValue(
      criarReserva({ numeroPassageiros: 4 }),
    );

    await useCase.execute(1, { numeroPassageiros: 4 });

    // diferença de +2 passageiros deve tirar 2 assentos disponíveis do voo
    expect(vooRepository.update).toHaveBeenCalledWith(1, {
      assentosDisponiveis: 96,
    });
  });
});
