import { IsString, IsInt, IsPositive, IsDateString, IsOptional, MaxLength, Min } from 'class-validator';

export class AtualizarVooDto {
  @IsOptional()
  @IsString({ message: 'Número do voo deve ser uma string' })
  @MaxLength(10, { message: 'Número do voo deve ter no máximo 10 caracteres' })
  numeroVoo?: string;

  @IsOptional()
  @IsString({ message: 'Origem deve ser uma string' })
  @MaxLength(100, { message: 'Origem deve ter no máximo 100 caracteres' })
  origem?: string;

  @IsOptional()
  @IsString({ message: 'Destino deve ser uma string' })
  @MaxLength(100, { message: 'Destino deve ter no máximo 100 caracteres' })
  destino?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de partida deve ser uma data válida' })
  dataPartida?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de chegada deve ser uma data válida' })
  dataChegada?: string;

  @IsOptional()
  @IsInt({ message: 'Assentos disponíveis deve ser um número inteiro' })
  @Min(0, { message: 'Assentos disponíveis não pode ser negativo' })
  assentosDisponiveis?: number;

  @IsOptional()
  @IsPositive({ message: 'Preço deve ser um valor positivo' })
  preco?: number;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  status?: string;
}
