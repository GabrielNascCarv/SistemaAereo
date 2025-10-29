import { Injectable, ConflictException } from '@nestjs/common';
import type { ICriarPassageiroUseCase, TCreatePassageiroUseCase } from '../contracts/criar-passageiro-use-case.contract';
import { PassageiroEntity } from '../entities/passageiro.entity';
import { PassageiroRepository } from '../repositories/passageiro.repository';

@Injectable()
export class CriarPassageiroUseCase implements ICriarPassageiroUseCase {
  constructor(
    private readonly passageiroRepository: PassageiroRepository,
  ) {}

  async execute(data: TCreatePassageiroUseCase): Promise<PassageiroEntity> {
   
    const passageiroExistenteEmail = await this.passageiroRepository.findByEmail(
      data.email,
    );
    if (passageiroExistenteEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    const passageiroExistenteCpf = await this.passageiroRepository.findByCpf(
      data.cpf,
    );
    if (passageiroExistenteCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const passageiro = await this.passageiroRepository.create(data);

    return passageiro;
  }
}
