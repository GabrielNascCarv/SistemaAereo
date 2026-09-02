import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsDateString,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarVooDto {
  @IsString({ message: 'Número do voo deve ser uma string' })
  @IsNotEmpty({ message: 'Número do voo é obrigatório' })
  @MaxLength(10, { message: 'Número do voo deve ter no máximo 10 caracteres' })
  numeroVoo: string;

  @IsString({ message: 'Origem deve ser uma string' })
  @IsNotEmpty({ message: 'Origem é obrigatória' })
  @MaxLength(100, { message: 'Origem deve ter no máximo 100 caracteres' })
  origem: string;

  @IsString({ message: 'Destino deve ser uma string' })
  @IsNotEmpty({ message: 'Destino é obrigatório' })
  @MaxLength(100, { message: 'Destino deve ter no máximo 100 caracteres' })
  destino: string;

  @IsDateString({}, { message: 'Data de partida deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de partida é obrigatória' })
  dataPartida: string;

  @IsDateString({}, { message: 'Data de chegada deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de chegada é obrigatória' })
  dataChegada: string;

  @IsInt({ message: 'Assentos disponíveis deve ser um número inteiro' })
  @Min(0, { message: 'Assentos disponíveis não pode ser negativo' })
  assentosDisponiveis: number;

  @IsPositive({ message: 'Preço deve ser um valor positivo' })
  preco: number;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  status?: string;
}
