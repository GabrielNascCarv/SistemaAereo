import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

export class AtualizarReservaDto {
  @IsOptional()
  @IsIn(['PENDENTE_PAGAMENTO', 'CONFIRMADA', 'CANCELADA'], {
    message: 'Status deve ser PENDENTE_PAGAMENTO, CONFIRMADA ou CANCELADA',
  })
  status?: string;

  @IsOptional()
  @IsInt({ message: 'Número de passageiros deve ser um número inteiro' })
  @IsPositive({ message: 'Número de passageiros deve ser maior que zero' })
  numeroPassageiros?: number;
}
