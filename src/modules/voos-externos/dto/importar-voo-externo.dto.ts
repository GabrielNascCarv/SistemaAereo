import { IsNotEmpty, IsString } from 'class-validator';

export class ImportarVooExternoDto {
  @IsString({ message: 'ofertaId deve ser uma string' })
  @IsNotEmpty({ message: 'ofertaId é obrigatório' })
  ofertaId: string;
}
