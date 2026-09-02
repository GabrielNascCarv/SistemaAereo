import { ConflictException, NotFoundException } from '@nestjs/common';
import { AtualizarPassageiroUseCase } from './atualizar-passageiro.use-case';
import { PassageiroRepository } from '../repositories/passageiro.repository';
import { PassageiroEntity } from '../entities/passageiro.entity';

describe('AtualizarPassageiroUseCase', () => {
  let useCase: AtualizarPassageiroUseCase;
  let passageiroRepository: jest.Mocked<PassageiroRepository>;

  const passageiroExistente = PassageiroEntity.create({
    id: 1,
    nome: 'João Silva',
    email: 'joao@teste.com',
    cpf: '123.456.789-01',
    telefone: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    passageiroRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PassageiroRepository>;

    useCase = new AtualizarPassageiroUseCase(passageiroRepository);
  });

  it('deve lançar NotFoundException quando o passageiro não existe', async () => {
    passageiroRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { nome: 'Novo Nome' })).rejects.toThrow(NotFoundException);
    expect(passageiroRepository.update).not.toHaveBeenCalled();
  });

  it('deve atualizar sem checar email/cpf quando eles não mudam', async () => {
    passageiroRepository.findById.mockResolvedValue(passageiroExistente);
    passageiroRepository.update.mockResolvedValue(passageiroExistente);

    await useCase.execute(1, { nome: 'Novo Nome' });

    expect(passageiroRepository.findByEmail).not.toHaveBeenCalled();
    expect(passageiroRepository.findByCpf).not.toHaveBeenCalled();
    expect(passageiroRepository.update).toHaveBeenCalledWith(1, { nome: 'Novo Nome' });
  });

  it('deve lançar ConflictException quando o novo email já pertence a outro passageiro', async () => {
    passageiroRepository.findById.mockResolvedValue(passageiroExistente);
    passageiroRepository.findByEmail.mockResolvedValue(
      PassageiroEntity.create({ ...passageiroExistente, id: 2 }),
    );

    await expect(
      useCase.execute(1, { email: 'outro@teste.com' }),
    ).rejects.toThrow(ConflictException);
    expect(passageiroRepository.update).not.toHaveBeenCalled();
  });

  it('deve lançar ConflictException quando o novo cpf já pertence a outro passageiro', async () => {
    passageiroRepository.findById.mockResolvedValue(passageiroExistente);
    passageiroRepository.findByCpf.mockResolvedValue(
      PassageiroEntity.create({ ...passageiroExistente, id: 2 }),
    );

    await expect(
      useCase.execute(1, { cpf: '987.654.321-00' }),
    ).rejects.toThrow(ConflictException);
    expect(passageiroRepository.update).not.toHaveBeenCalled();
  });
});
