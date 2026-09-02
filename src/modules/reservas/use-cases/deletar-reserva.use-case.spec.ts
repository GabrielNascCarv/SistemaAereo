import { NotFoundException } from '@nestjs/common';
import { DeletarReservaUseCase } from './deletar-reserva.use-case';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { ReservaEntity } from '../entities/reserva.entity';
import { TrechoReservaEntity } from '../entities/trecho-reserva.entity';
import { VooEntity } from '../../voos/entities/voo.entity';

describe('DeletarReservaUseCase', () => {
  let useCase: DeletarReservaUseCase;
  let reservaRepository: jest.Mocked<ReservaRepository>;
  let vooRepository: jest.Mocked<VooRepository>;

  const voo = VooEntity.create({
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
  });

  const criarReserva = (
    overrides: Partial<Parameters<typeof ReservaEntity.create>[0]> = {},
  ) =>
    ReservaEntity.create({
      id: 1,
      codigoReserva: 'RES-XXXX-YYYY',
      dataReserva: new Date(),
      status: 'PENDENTE_PAGAMENTO',
      numeroPassageiros: 2,
      passageiroId: 1,
      trechos: [
        TrechoReservaEntity.create({
          id: 1,
          vooId: voo.id,
          direcao: 'IDA',
          ordem: 1,
          voo,
        }),
      ],
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

    useCase = new DeletarReservaUseCase(reservaRepository, vooRepository);
  });

  it('deve lançar NotFoundException quando a reserva não existe', async () => {
    reservaRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(reservaRepository.delete).not.toHaveBeenCalled();
  });

  it('deve restaurar os assentos do voo ao deletar uma reserva ativa', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ numeroPassageiros: 2 }),
    );
    reservaRepository.delete.mockResolvedValue(true);

    const resultado = await useCase.execute(1);

    expect(vooRepository.update).toHaveBeenCalledWith(voo.id, {
      assentosDisponiveis: 100,
    });
    expect(resultado).toBe(true);
  });

  it('não deve alterar assentos ao deletar uma reserva já cancelada', async () => {
    reservaRepository.findById.mockResolvedValue(
      criarReserva({ status: 'CANCELADA' }),
    );
    reservaRepository.delete.mockResolvedValue(true);

    await useCase.execute(1);

    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('não deve tentar restaurar assentos quando a exclusão falhar', async () => {
    reservaRepository.findById.mockResolvedValue(criarReserva());
    reservaRepository.delete.mockResolvedValue(false);

    const resultado = await useCase.execute(1);

    expect(vooRepository.update).not.toHaveBeenCalled();
    expect(resultado).toBe(false);
  });
});
