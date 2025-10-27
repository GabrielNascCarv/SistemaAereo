-- CreateTable
CREATE TABLE "voos" (
    "id" SERIAL NOT NULL,
    "numeroVoo" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "dataPartida" TIMESTAMP(3) NOT NULL,
    "dataChegada" TIMESTAMP(3) NOT NULL,
    "assentosDisponiveis" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passageiros" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passageiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "codigoReserva" TEXT NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMADA',
    "numeroPassageiros" INTEGER NOT NULL,
    "vooId" INTEGER NOT NULL,
    "passageiroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voos_numeroVoo_key" ON "voos"("numeroVoo");

-- CreateIndex
CREATE UNIQUE INDEX "passageiros_email_key" ON "passageiros"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passageiros_cpf_key" ON "passageiros"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_codigoReserva_key" ON "reservas"("codigoReserva");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_vooId_fkey" FOREIGN KEY ("vooId") REFERENCES "voos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_passageiroId_fkey" FOREIGN KEY ("passageiroId") REFERENCES "passageiros"("id") ON DELETE CASCADE ON UPDATE CASCADE;
