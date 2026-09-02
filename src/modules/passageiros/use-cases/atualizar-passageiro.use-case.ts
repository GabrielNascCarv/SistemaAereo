import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { AtualizarPassageiroUseCaseContract } from '../contracts/atualizar-passageiro-use-case.contract';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class AtualizarPassageiroUseCase
  implements AtualizarPassageiroUseCaseContract
{
  constructor(private readonly passageiroRepository: PassageiroRepository) {}

  async execute(
    id: number,
    data: {
      nome?: string;
      email?: string;
      cpf?: string;
      telefone?: string;
    },
  ) {
    // Verificar se o passageiro existe
    const passageiroExistente = await this.passageiroRepository.findById(id);
    if (!passageiroExistente) {
      throw new NotFoundException('Passageiro não encontrado');
    }

    // Verificar se email já existe (se estiver sendo atualizado)
    if (data.email && data.email !== passageiroExistente.email) {
      const passageiroComEmail = await this.passageiroRepository.findByEmail(
        data.email,
      );
      if (passageiroComEmail) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Verificar se CPF já existe (se estiver sendo atualizado)
    if (data.cpf && data.cpf !== passageiroExistente.cpf) {
      const passageiroComCpf = await this.passageiroRepository.findByCpf(
        data.cpf,
      );
      if (passageiroComCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    const passageiro = await this.passageiroRepository.update(id, data);
    return passageiro;
  }
}
