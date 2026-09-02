import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { TrechoReservaDto } from './trecho-reserva.dto';

export class CriarReservaDto {
  @IsInt({ message: 'Passageiro deve ser um número inteiro' })
  @IsPositive({ message: 'Passageiro é obrigatório' })
  passageiroId: number;

  @IsInt({ message: 'Número de passageiros deve ser um número inteiro' })
  @IsPositive({ message: 'Número de passageiros deve ser maior que zero' })
  numeroPassageiros: number;

  @IsArray({ message: 'trechos deve ser uma lista' })
  @ArrayMinSize(1, { message: 'A reserva precisa de ao menos um trecho' })
  @ValidateNested({ each: true })
  @Type(() => TrechoReservaDto)
  trechos: TrechoReservaDto[];
}
