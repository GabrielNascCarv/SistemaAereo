import { IsString, IsNumber, IsDateString, IsOptional, Matches, Length, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class AtualizarVooDto {
  @IsOptional()
  @IsString({ message: 'Número do voo deve ser uma string' })
  @Matches(/^[A-Z]{2}\d{4}$/, { 
    message: 'Número do voo deve estar no formato AA0000 (ex: BR1234)' 
  })
  numeroVoo?: string;

  @IsOptional()
  @IsString({ message: 'Origem deve ser uma string' })
  @Length(2, 100, { message: 'Origem deve ter entre 2 e 100 caracteres' })
  origem?: string;

  @IsOptional()
  @IsString({ message: 'Destino deve ser uma string' })
  @Length(2, 100, { message: 'Destino deve ter entre 2 e 100 caracteres' })
  destino?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de partida deve ser uma data válida' })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dataPartida?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Data de chegada deve ser uma data válida' })
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dataChegada?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Assentos disponíveis deve ser um número' })
  @Min(1, { message: 'Assentos disponíveis deve ser pelo menos 1' })
  @Max(500, { message: 'Assentos disponíveis deve ser no máximo 500' })
  assentosDisponiveis?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  preco?: number;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  @Matches(/^(AGENDADO|CANCELADO|CONCLUIDO)$/, { 
    message: 'Status deve ser AGENDADO, CANCELADO ou CONCLUIDO' 
  })
  status?: string;
}