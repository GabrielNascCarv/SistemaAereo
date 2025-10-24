import { Injectable, NotFoundException } from "@nestjs/common";
import type { DeletarPassageiroUseCaseContract } from "../contracts/deletar-passageiro-use-case.contract";
import { PassageiroRepository } from "../repositories/passageiro.repository";

@Injectable()
export class DeletarPassageiroUseCase implements DeletarPassageiroUseCaseContract {
  constructor(private readonly passageiroRepository: PassageiroRepository) {}

  async execute(id: number): Promise<boolean> {
    const passageiro = await this.passageiroRepository.findById(id);
    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
    }
    return await this.passageiroRepository.delete(id);
  }
}