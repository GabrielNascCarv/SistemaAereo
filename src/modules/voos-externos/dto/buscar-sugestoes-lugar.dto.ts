import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BuscarSugestoesLugarDto {
  @IsString({ message: 'query deve ser uma string' })
  @IsNotEmpty({ message: 'query é obrigatória' })
  @MinLength(2, { message: 'query deve ter pelo menos 2 caracteres' })
  query: string;
}
