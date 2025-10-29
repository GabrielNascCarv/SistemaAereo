import { Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { ICriarPassageiroUseCase } from '../contracts/criar-passageiro-use-case.contract';
import { IAtualizarPassageiroUseCase } from '../contracts/atualizar-passageiro-use-case.contract';
import { IListarPassageiroPorIdUseCase } from '../contracts/listar-passageiro-por-id-use-case.contract';
import { IListarPassageirosUseCase } from '../contracts/listar-passageiros-use-case.contract';
import { IDeletarPassageiroUseCase } from '../contracts/deletar-passageiro-use-case.contract';

import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { AtualizarPassageiroDto } from '../dto/atualizar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';

export class PassageiroController {
  constructor(
    private readonly criarPassageiroUseCase: ICriarPassageiroUseCase,
    private readonly listarPassageirosUseCase: IListarPassageirosUseCase,
    private readonly listarPassageiroPorIdUseCase: IListarPassageiroPorIdUseCase,
    private readonly atualizarPassageiroUseCase: IAtualizarPassageiroUseCase,
    private readonly deletarPassageiroUseCase: IDeletarPassageiroUseCase,
  ) {}

  async criar(data: CriarPassageiroDto): Promise<PassageiroResponseDto> {
    const passageiro = await this.criarPassageiroUseCase.execute(data);
    
    const criarPassageiro = new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });

    return criarPassageiro;
  }

  async listar(): Promise<PassageiroResponseDto[]> {
    const passageiros = await this.listarPassageirosUseCase.execute();
    
    const listarPassageiro = passageiros.map(passageiro => new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    }));

    return listarPassageiro;
  }

  async listarPorId(id: number): Promise<PassageiroResponseDto> {
    const passageiro = await this.listarPassageiroPorIdUseCase.execute(id);
    
    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
    }
    
    const listarPorId = new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });

    return listarPorId
  }

  async atualizar(id: number, data: AtualizarPassageiroDto): Promise<PassageiroResponseDto> {
      const passageiro = await this.atualizarPassageiroUseCase.execute(id, data);
    
    const atualizarPassageiro = new PassageiroResponseDto({
      id: passageiro.id,
      nome: passageiro.nome,
      email: passageiro.email,
      cpf: passageiro.cpf,
      telefone: passageiro.telefone,
      createdAt: passageiro.createdAt,
    });

    return atualizarPassageiro
  }

  async deletar(id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.deletarPassageiroUseCase.execute(id);
    
    const deletado = {
      success,
      message: success ? 'Passageiro deletado com sucesso' : 'Erro ao deletar passageiro'
    };

    return deletado
  }
}
