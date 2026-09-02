import { ListarVooPorIdUseCase } from './listar-voo-por-id.use-case';
import { VooRepository } from '../repositories/voo.repository';
import { VooEntity } from '../entities/voo.entity';

describe('ListarVooPorIdUseCase', () => {
  let useCase: ListarVooPorIdUseCase;
  let vooRepository: jest.Mocked<VooRepository>;

  const criarVoo = (overrides: Partial<Parameters<typeof VooEntity.create>[0]> = {}) =>
    VooEntity.create({
      id: 1,
      numeroVoo: 'AB123',
      origem: 'GRU',
      destino: 'GIG',
      dataPartida: new Date('2020-01-01T10:00:00.000Z'),
      dataChegada: new Date('2020-01-01T11:00:00.000Z'),
      assentosDisponiveis: 100,
      preco: 499.9,
      status: 'AGENDADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
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

    useCase = new ListarVooPorIdUseCase(vooRepository);
  });

  it('deve retornar null quando o voo não existe', async () => {
    vooRepository.findById.mockResolvedValue(null);

    const resultado = await useCase.execute(999);

    expect(resultado).toBeNull();
    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('deve retornar o voo sem alterar status quando a chegada ainda não passou', async () => {
    const voo = criarVoo({ dataChegada: new Date(Date.now() + 60_000) });
    vooRepository.findById.mockResolvedValue(voo);

    const resultado = await useCase.execute(1);

    expect(resultado).toBe(voo);
    expect(vooRepository.update).not.toHaveBeenCalled();
  });

  it('deve concluir automaticamente o voo AGENDADO cuja chegada já passou', async () => {
    const voo = criarVoo({ dataChegada: new Date('2020-01-01T11:00:00.000Z') });
    const vooConcluido = criarVoo({ status: 'CONCLUIDO' });
    vooRepository.findById.mockResolvedValue(voo);
    vooRepository.update.mockResolvedValue(vooConcluido);

    const resultado = await useCase.execute(1);

    expect(vooRepository.update).toHaveBeenCalledWith(1, { status: 'CONCLUIDO' });
    expect(resultado).toBe(vooConcluido);
  });

  it('não deve concluir automaticamente um voo já CANCELADO', async () => {
    const voo = criarVoo({ status: 'CANCELADO', dataChegada: new Date('2020-01-01T11:00:00.000Z') });
    vooRepository.findById.mockResolvedValue(voo);

    const resultado = await useCase.execute(1);

    expect(vooRepository.update).not.toHaveBeenCalled();
    expect(resultado).toBe(voo);
  });
});
