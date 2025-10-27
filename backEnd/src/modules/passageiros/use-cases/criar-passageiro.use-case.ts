import { Injectable, ConflictException } from '@nestjs/common';
import type { CriarPassageiroUseCaseContract } from '../contracts/criar-passageiro-use-case.contract';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class CriarPassageiroUseCase implements CriarPassageiroUseCaseContract {
  constructor(
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  async execute(data: {
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
  }) {
    // Verificar se email já existe
    const passageiroExistenteEmail = await this.passageiroRepository.findByEmail(
      data.email,
    );
    if (passageiroExistenteEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    // Verificar se CPF já existe
    const passageiroExistenteCpf = await this.passageiroRepository.findByCpf(
      data.cpf,
    );
    if (passageiroExistenteCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Criar passageiro
    const passageiro = await this.passageiroRepository.create(data);

    return passageiro;
  }
}
