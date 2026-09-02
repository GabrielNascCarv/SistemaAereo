import { IsInt, IsPositive } from 'class-validator';

export class CriarReservaDto {
  @IsInt({ message: 'Voo deve ser um número inteiro' })
  @IsPositive({ message: 'Voo é obrigatório' })
  vooId: number;

  @IsInt({ message: 'Passageiro deve ser um número inteiro' })
  @IsPositive({ message: 'Passageiro é obrigatório' })
  passageiroId: number;

  @IsInt({ message: 'Número de passageiros deve ser um número inteiro' })
  @IsPositive({ message: 'Número de passageiros deve ser maior que zero' })
  numeroPassageiros: number;
}
