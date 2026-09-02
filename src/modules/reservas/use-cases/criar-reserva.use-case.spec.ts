import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CriarReservaUseCase } from './criar-reserva.use-case';
import { ReservaRepository } from '../repositories/reserva.repository';
import { VooRepository } from '../../voos/repositories/voo.repository';
import { PassageiroRepository } from '../../passageiros/repositories/passageiro.repository';
import { ReservaEntity } from '../entities/reserva.entity';
import { TrechoReservaEntity } from '../entities/trecho-reserva.entity';
import { VooEntity } from '../../voos/entities/voo.entity';
import { PassageiroEntity } from '../../passageiros/entities/passageiro.entity';

describe('CriarReservaUseCase', () => {
  let useCase: CriarReservaUseCase;
  let reservaRepository: jest.Mocked<ReservaRepository>;
  let vooRepository: jest.Mocked<VooRepository>;
  let passageiroRepository: jest.Mocked<PassageiroRepository>;

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
      assentosDisponiveis: 100,
      preco: 499.9,
      status: 'AGENDADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  const passageiro = PassageiroEntity.create({
    id: 1,
    nome: 'João Silva',
    email: 'joao@teste.com',
    cpf: '123.456.789-01',
    telefone: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const reservaCriada = ReservaEntity.create({
    id: 1,
    codigoReserva: 'RES-XXXX-YYYY',
    dataReserva: new Date(),
    status: 'PENDENTE_PAGAMENTO',
    numeroPassageiros: 2,
    passageiroId: 1,
    trechos: [
      TrechoReservaEntity.create({
        id: 1,
        vooId: 1,
        direcao: 'IDA',
        ordem: 1,
        voo: criarVoo(),
      }),
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
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

    passageiroRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PassageiroRepository>;

    useCase = new CriarReservaUseCase(
      reservaRepository,
      vooRepository,
      passageiroRepository,
    );
  });

  const dadosValidos = {
    passageiroId: 1,
    numeroPassageiros: 2,
    trechos: [{ vooId: 1, direcao: 'IDA' as const, ordem: 1 }],
  };

  it('deve lançar BadRequestException quando não há trechos', async () => {
    await expect(
      useCase.execute({ ...dadosValidos, trechos: [] }),
    ).rejects.toThrow(BadRequestException);
    expect(reservaRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar NotFoundException quando o voo não existe', async () => {
    vooRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      NotFoundException,
    );
    expect(reservaRepository.create).not.toHaveBeenCalled();
  });

  it.each(['CANCELADO', 'CONCLUIDO'])(
    'deve lançar BadRequestException quando o voo está %s',
    async (status) => {
      vooRepository.findById.mockResolvedValue(criarVoo({ status }));

      await expect(useCase.execute(dadosValidos)).rejects.toThrow(
        BadRequestException,
      );
      expect(reservaRepository.create).not.toHaveBeenCalled();
    },
  );

  it('deve lançar NotFoundException quando o passageiro não existe', async () => {
    vooRepository.findById.mockResolvedValue(criarVoo());
    passageiroRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      NotFoundException,
    );
    expect(reservaRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar BadRequestException quando não há assentos suficientes', async () => {
    vooRepository.findById.mockResolvedValue(
      criarVoo({ assentosDisponiveis: 1 }),
    );
    passageiroRepository.findById.mockResolvedValue(passageiro);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      BadRequestException,
    );
    expect(reservaRepository.create).not.toHaveBeenCalled();
  });

  it('deve criar a reserva e decrementar os assentos disponíveis do voo', async () => {
    const voo = criarVoo({ assentosDisponiveis: 100 });
    vooRepository.findById.mockResolvedValue(voo);
    passageiroRepository.findById.mockResolvedValue(passageiro);
    reservaRepository.findByCodigoReserva.mockResolvedValue(null);
    reservaRepository.create.mockResolvedValue(reservaCriada);

    const resultado = await useCase.execute(dadosValidos);

    expect(reservaRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- matcher do Jest é tipado como `any`
        codigoReserva: expect.stringMatching(/^RES-/),
        numeroPassageiros: 2,
        passageiroId: 1,
        trechos: dadosValidos.trechos,
        status: 'PENDENTE_PAGAMENTO',
      }),
    );
    expect(vooRepository.update).toHaveBeenCalledWith(voo.id, {
      assentosDisponiveis: 98,
    });
    expect(resultado).toBe(reservaCriada);
  });

  it('deve validar cada trecho de um itinerário de ida e volta', async () => {
    const vooIda = criarVoo({ id: 1, numeroVoo: 'AB123' });
    const vooVolta = criarVoo({ id: 2, numeroVoo: 'CD456' });
    vooRepository.findById.mockImplementation((id) =>
      Promise.resolve(id === 1 ? vooIda : id === 2 ? vooVolta : null),
    );
    passageiroRepository.findById.mockResolvedValue(passageiro);
    reservaRepository.findByCodigoReserva.mockResolvedValue(null);
    reservaRepository.create.mockResolvedValue(reservaCriada);

    const dados = {
      passageiroId: 1,
      numeroPassageiros: 1,
      trechos: [
        { vooId: 1, direcao: 'IDA' as const, ordem: 1 },
        { vooId: 2, direcao: 'VOLTA' as const, ordem: 1 },
      ],
    };

    await useCase.execute(dados);

    expect(vooRepository.findById).toHaveBeenCalledWith(1);
    expect(vooRepository.findById).toHaveBeenCalledWith(2);
    expect(vooRepository.update).toHaveBeenCalledWith(1, {
      assentosDisponiveis: 99,
    });
    expect(vooRepository.update).toHaveBeenCalledWith(2, {
      assentosDisponiveis: 99,
    });
  });
});
