// src/modules/reservas/dto/criar-reserva.dto.ts
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CriarReservaDto {
    @IsString()
    @IsNotEmpty()
    codigoReserva: string;

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