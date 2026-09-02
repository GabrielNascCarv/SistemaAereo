import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class BuscarVoosExternosDto {
  @IsString({ message: 'Origem deve ser uma string' })
  @IsNotEmpty({ message: 'Origem é obrigatória' })
  @Length(3, 3, { message: 'Origem deve ser um código IATA de 3 letras' })
  origem: string;

  @IsString({ message: 'Destino deve ser uma string' })
  @IsNotEmpty({ message: 'Destino é obrigatório' })
  @Length(3, 3, { message: 'Destino deve ser um código IATA de 3 letras' })
  destino: string;

  @IsDateString({}, { message: 'Data de ida deve estar no formato AAAA-MM-DD' })
  @IsNotEmpty({ message: 'Data de ida é obrigatória' })
  dataIda: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Data de volta deve estar no formato AAAA-MM-DD' },
  )
  dataVolta?: string;
}
