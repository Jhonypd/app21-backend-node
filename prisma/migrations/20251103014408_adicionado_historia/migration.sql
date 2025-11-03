/*
  Warnings:

  - A unique constraint covering the columns `[sala_id,pessoa_id,historia_id]` on the table `Voto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `historia_id` to the `Voto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Voto_sala_id_pessoa_id_key";

-- AlterTable
ALTER TABLE "Sala" ALTER COLUMN "data_alteracao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Voto" ADD COLUMN     "historia_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HistoriaSala" (
    "id" TEXT NOT NULL,
    "sala_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "criado_por" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriaSala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Voto_sala_id_pessoa_id_historia_id_idx" ON "Voto"("sala_id", "pessoa_id", "historia_id");

-- CreateIndex
CREATE UNIQUE INDEX "Voto_sala_id_pessoa_id_historia_id_key" ON "Voto"("sala_id", "pessoa_id", "historia_id");

-- AddForeignKey
ALTER TABLE "HistoriaSala" ADD CONSTRAINT "HistoriaSala_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
