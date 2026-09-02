import { PrismaClient } from '@prisma/client';

export const prismaTeste = new PrismaClient();

export async function limparBanco(): Promise<void> {
  await prismaTeste.reserva.deleteMany();
  await prismaTeste.voo.deleteMany();
  await prismaTeste.passageiro.deleteMany();
}
