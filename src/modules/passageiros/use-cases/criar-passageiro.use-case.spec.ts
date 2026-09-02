import { ConflictException } from '@nestjs/common';
import { CriarPassageiroUseCase } from './criar-passageiro.use-case';
import { PassageiroRepository } from '../repositories/passageiro.repository';
import { PassageiroEntity } from '../entities/passageiro.entity';

describe('CriarPassageiroUseCase', () => {
  let useCase: CriarPassageiroUseCase;
  let passageiroRepository: jest.Mocked<PassageiroRepository>;

  const dadosValidos = {
    nome: 'João Silva',
    email: 'joao@teste.com',
    cpf: '123.456.789-01',
    telefone: '(11) 91234-5678',
  };

  const passageiroCriado = PassageiroEntity.create({
    id: 1,
    ...dadosValidos,
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

    useCase = new CriarPassageiroUseCase(passageiroRepository);
  });

  it('deve criar um passageiro quando email e cpf ainda não existem', async () => {
    passageiroRepository.findByEmail.mockResolvedValue(null);
    passageiroRepository.findByCpf.mockResolvedValue(null);
    passageiroRepository.create.mockResolvedValue(passageiroCriado);

    const resultado = await useCase.execute(dadosValidos);

    expect(passageiroRepository.findByEmail).toHaveBeenCalledWith(
      dadosValidos.email,
    );
    expect(passageiroRepository.findByCpf).toHaveBeenCalledWith(
      dadosValidos.cpf,
    );
    expect(passageiroRepository.create).toHaveBeenCalledWith(dadosValidos);
    expect(resultado).toBe(passageiroCriado);
  });

  it('deve lançar ConflictException quando o email já está cadastrado', async () => {
    passageiroRepository.findByEmail.mockResolvedValue(passageiroCriado);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      ConflictException,
    );
    expect(passageiroRepository.findByCpf).not.toHaveBeenCalled();
    expect(passageiroRepository.create).not.toHaveBeenCalled();
  });

  it('deve lançar ConflictException quando o cpf já está cadastrado', async () => {
    passageiroRepository.findByEmail.mockResolvedValue(null);
    passageiroRepository.findByCpf.mockResolvedValue(passageiroCriado);

    await expect(useCase.execute(dadosValidos)).rejects.toThrow(
      ConflictException,
    );
    expect(passageiroRepository.create).not.toHaveBeenCalled();
  });
});
