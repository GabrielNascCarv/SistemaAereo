import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseIntPipe, NotFoundException, Put, Delete } from '@nestjs/common';
import { PassageiroControllerFactory } from './passageiro.controller.factory';
import { CriarPassageiroDto } from '../dto/criar-passageiro.dto';
import { AtualizarPassageiroDto } from '../dto/atualizar-passageiro.dto';
import { PassageiroResponseDto } from '../dto/passageiro-response.dto';

@Controller('passageiros')
export class PassageiroRoutesController {
  private readonly passageiroController;

  constructor(private readonly passageiroControllerFactory: PassageiroControllerFactory) {
    // Cria o controller através da factory
    this.passageiroController = this.passageiroControllerFactory.create();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() data: CriarPassageiroDto): Promise<PassageiroResponseDto> {
    return await this.passageiroController.criar(data);
  }

  @Get()
  async listar(): Promise<PassageiroResponseDto[]> {
    return await this.passageiroController.listar();
  }

  @Get(':id')
  async listarPorId(@Param('id', ParseIntPipe) id: number): Promise<PassageiroResponseDto> {
    return await this.passageiroController.listarPorId(id);
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AtualizarPassageiroDto,
  ): Promise<PassageiroResponseDto> {
    return await this.passageiroController.atualizar(id, data);
  }

  @Delete(':id')
  async deletar(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    return await this.passageiroController.deletar(id);
  }
}

