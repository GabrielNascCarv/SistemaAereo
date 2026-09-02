import { NotFoundException } from '@nestjs/common';
import { DeletarPassageiroUseCase } from './deletar-passageiro.use-case';
import { PassageiroRepository } from '../repositories/passageiro.repository';
import { PassageiroEntity } from '../entities/passageiro.entity';

describe('DeletarPassageiroUseCase', () => {
  let useCase: DeletarPassageiroUseCase;
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

    useCase = new DeletarPassageiroUseCase(passageiroRepository);
  });

  it('deve lançar NotFoundException quando o passageiro não existe', async () => {
    passageiroRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
    expect(passageiroRepository.delete).not.toHaveBeenCalled();
  });

  it('deve deletar e retornar true quando o passageiro existe', async () => {
    passageiroRepository.findById.mockResolvedValue(passageiroExistente);
    passageiroRepository.delete.mockResolvedValue(true);

    const resultado = await useCase.execute(1);

    expect(passageiroRepository.delete).toHaveBeenCalledWith(1);
    expect(resultado).toBe(true);
  });
});
