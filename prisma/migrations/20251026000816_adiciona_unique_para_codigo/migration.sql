/*
  Warnings:

  - A unique constraint covering the columns `[codigo_confirmacao]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo_confirmacao_hash]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_codigo_confirmacao_key" ON "Pessoa"("codigo_confirmacao");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_codigo_confirmacao_hash_key" ON "Pessoa"("codigo_confirmacao_hash");
