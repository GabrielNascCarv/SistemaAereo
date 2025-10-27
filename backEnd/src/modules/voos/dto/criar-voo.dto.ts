import { IsString, IsNotEmpty, IsNumber, IsDateString, Min, Max, IsOptional, Matches, Length } from 'class-validator';

export class CriarVooDto {
  @IsString({ message: 'Número do voo deve ser uma string' })
  @IsNotEmpty({ message: 'Número do voo é obrigatório' })
  @Matches(/^[A-Z]{2}\d{4}$/, { 
    message: 'Número do voo deve estar no formato AA0000 (ex: BR1234)' 
  })
  numeroVoo: string;

  @IsString({ message: 'Origem deve ser uma string' })
  @IsNotEmpty({ message: 'Origem é obrigatória' })
  @Length(2, 100, { message: 'Origem deve ter entre 2 e 100 caracteres' })
  origem: string;

  @IsString({ message: 'Destino deve ser uma string' })
  @IsNotEmpty({ message: 'Destino é obrigatório' })
  @Length(2, 100, { message: 'Destino deve ter entre 2 e 100 caracteres' })
  destino: string;

  @IsDateString({}, { message: 'Data de partida deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de partida é obrigatória' })
  dataPartida: string;

  @IsDateString({}, { message: 'Data de chegada deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de chegada é obrigatória' })
  dataChegada: string;

  @IsNumber({}, { message: 'Assentos disponíveis deve ser um número' })
  @IsNotEmpty({ message: 'Assentos disponíveis é obrigatório' })
  @Min(1, { message: 'Assentos disponíveis deve ser pelo menos 1' })
  @Max(500, { message: 'Assentos disponíveis deve ser no máximo 500' })
  assentosDisponiveis: number;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  preco: number;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  @Matches(/^(AGENDADO|CANCELADO|CONCLUIDO)$/, { 
    message: 'Status deve ser AGENDADO, CANCELADO ou CONCLUIDO' 
  })
  status?: string;
}
