import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { IAtualizarPassageiroUseCase, TAtualizarPassageiroUseCase } from '../contracts/atualizar-passageiro-use-case.contract';
import { PassageiroEntity } from '../entities/passageiro.entity';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class AtualizarPassageiroUseCase implements IAtualizarPassageiroUseCase {
  constructor(
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  async execute(id: number, data: TAtualizarPassageiroUseCase): Promise <PassageiroEntity> {
   
    const passageiroExistente = await this.passageiroRepository.findById(id);
    if (!passageiroExistente) {
      throw new NotFoundException('Passageiro não encontrado');
    }

    if (data.email && data.email !== passageiroExistente.email) {
      const passageiroComEmail = await this.passageiroRepository.findByEmail(data.email);
      if (passageiroComEmail) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    if (data.cpf && data.cpf !== passageiroExistente.cpf) {
      const passageiroComCpf = await this.passageiroRepository.findByCpf(data.cpf);
      if (passageiroComCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    }

    // Preparar dados para atualização - mantém valores existentes se não fornecidos
    const dataAtualizacao = {
      nome: data.nome ?? passageiroExistente.nome,
      email: data.email ?? passageiroExistente.email,
      cpf: data.cpf ?? passageiroExistente.cpf,
      telefone: data.telefone ?? passageiroExistente.telefone ?? undefined,
    };

    const passageiro = await this.passageiroRepository.update(id, dataAtualizacao);
    return passageiro;
  }
}
