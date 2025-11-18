/*
  Warnings:

  - You are about to drop the column `historia_id` on the `Voto` table. All the data in the column will be lost.
  - You are about to drop the column `sala_id` on the `Voto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[historia_sessao_id,pessoa_id]` on the table `Voto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `historia_sessao_id` to the `Voto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_sala_id_fkey";

-- DropIndex
DROP INDEX "Voto_sala_id_idx";

-- DropIndex
DROP INDEX "Voto_sala_id_pessoa_id_historia_id_idx";

-- DropIndex
DROP INDEX "Voto_sala_id_pessoa_id_historia_id_key";

-- AlterTable
ALTER TABLE "Voto" DROP COLUMN "historia_id",
DROP COLUMN "sala_id",
ADD COLUMN     "historia_sessao_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HistoriaSessao" (
    "id" TEXT NOT NULL,
    "sessao_id" TEXT NOT NULL,
    "historia_id" TEXT NOT NULL,

    CONSTRAINT "HistoriaSessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoriaSessao_sessao_id_idx" ON "HistoriaSessao"("sessao_id");

-- CreateIndex
CREATE INDEX "HistoriaSessao_historia_id_idx" ON "HistoriaSessao"("historia_id");

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaSessao_sessao_id_historia_id_key" ON "HistoriaSessao"("sessao_id", "historia_id");

-- CreateIndex
CREATE INDEX "ParticipanteSessao_sessao_id_idx" ON "ParticipanteSessao"("sessao_id");

-- CreateIndex
CREATE INDEX "ParticipanteSessao_pessoa_id_idx" ON "ParticipanteSessao"("pessoa_id");

-- CreateIndex
CREATE INDEX "SessaoSala_sala_id_idx" ON "SessaoSala"("sala_id");

-- CreateIndex
CREATE INDEX "Voto_historia_sessao_id_idx" ON "Voto"("historia_sessao_id");

-- CreateIndex
CREATE UNIQUE INDEX "Voto_historia_sessao_id_pessoa_id_key" ON "Voto"("historia_sessao_id", "pessoa_id");

-- AddForeignKey
ALTER TABLE "HistoriaSessao" ADD CONSTRAINT "HistoriaSessao_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "SessaoSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaSessao" ADD CONSTRAINT "HistoriaSessao_historia_id_fkey" FOREIGN KEY ("historia_id") REFERENCES "HistoriaSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_historia_sessao_id_fkey" FOREIGN KEY ("historia_sessao_id") REFERENCES "HistoriaSessao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
