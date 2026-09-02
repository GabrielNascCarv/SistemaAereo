import { IsIn, IsInt, IsPositive } from 'class-validator';

export class TrechoReservaDto {
  @IsInt({ message: 'vooId deve ser um número inteiro' })
  @IsPositive({ message: 'vooId é obrigatório' })
  vooId: number;

  @IsIn(['IDA', 'VOLTA'], { message: 'direcao deve ser IDA ou VOLTA' })
  direcao: 'IDA' | 'VOLTA';

  @IsInt({ message: 'ordem deve ser um número inteiro' })
  @IsPositive({ message: 'ordem deve ser maior que zero' })
  ordem: number;
}
