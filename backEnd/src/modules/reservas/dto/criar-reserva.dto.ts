// src/modules/reservas/dto/criar-reserva.dto.ts
import { IsInt, IsNotEmpty, IsPositive, IsString, IsOptional } from "class-validator";

export class CriarReservaDto {
    @IsOptional()
    @IsString()
    codigoReserva?: string;

    @IsInt()
    @IsPositive()
    numeroPassageiros: number;

    @IsInt()
    @IsPositive()
    vooId: number;

    @IsInt()
    @IsPositive()
    passageiroId: number;
}