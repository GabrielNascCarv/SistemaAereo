import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

export class AtualizarReservaDto {
  @IsOptional()
  @IsString({ message: 'Código da reserva deve ser uma string' })
  codigoReserva?: string;

  @IsOptional()
  @IsString({ message: 'Status deve ser uma string' })
  @IsIn(['CONFIRMADA', 'CANCELADA'], { message: 'Status deve ser CONFIRMADA ou CANCELADA' })
  status?: string;

  @IsOptional()
  @IsInt({ message: 'Número de passageiros deve ser um número inteiro' })
  @Min(1, { message: 'Número de passageiros deve ser pelo menos 1' })
  @Max(10, { message: 'Número de passageiros deve ser no máximo 10' })
  numeroPassageiros?: number;

  @IsOptional()
  @IsInt({ message: 'ID do voo deve ser um número inteiro' })
  vooId?: number;

  @IsOptional()
  @IsInt({ message: 'ID do passageiro deve ser um número inteiro' })
  passageiroId?: number;
}