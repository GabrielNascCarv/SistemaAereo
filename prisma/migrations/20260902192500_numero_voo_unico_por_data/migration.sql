-- DropIndex
DROP INDEX "public"."voos_numeroVoo_key";

-- CreateIndex
CREATE UNIQUE INDEX "voos_numeroVoo_dataPartida_key" ON "voos"("numeroVoo", "dataPartida");
