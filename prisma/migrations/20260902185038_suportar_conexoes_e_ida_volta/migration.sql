/*
  Warnings:

  - You are about to drop the column `vooId` on the `reservas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."reservas" DROP CONSTRAINT "reservas_vooId_fkey";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "vooId",
ALTER COLUMN "status" SET DEFAULT 'PENDENTE_PAGAMENTO';

-- CreateTable
CREATE TABLE "reserva_trechos" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "vooId" INTEGER NOT NULL,
    "direcao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserva_trechos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reserva_trechos_reservaId_direcao_ordem_key" ON "reserva_trechos"("reservaId", "direcao", "ordem");

-- AddForeignKey
ALTER TABLE "reserva_trechos" ADD CONSTRAINT "reserva_trechos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_trechos" ADD CONSTRAINT "reserva_trechos_vooId_fkey" FOREIGN KEY ("vooId") REFERENCES "voos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
