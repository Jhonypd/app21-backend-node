/*
  Warnings:

  - You are about to drop the column `ultima_senha` on the `Pessoa` table. All the data in the column will be lost.
  - You are about to drop the column `historia_id` on the `Voto` table. All the data in the column will be lost.
  - You are about to drop the `Equipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Historia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MembroEquipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Projeto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `Sala` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sala_id,pessoa_id]` on the table `Voto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Historia" DROP CONSTRAINT "Historia_criado_por_fkey";

-- DropForeignKey
ALTER TABLE "public"."Historia" DROP CONSTRAINT "Historia_sala_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MembroEquipe" DROP CONSTRAINT "MembroEquipe_equipe_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MembroEquipe" DROP CONSTRAINT "MembroEquipe_pessoa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Projeto" DROP CONSTRAINT "Projeto_equipe_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voto" DROP CONSTRAINT "Voto_historia_id_fkey";

-- DropIndex
DROP INDEX "public"."Voto_historia_id_idx";

-- DropIndex
DROP INDEX "public"."Voto_sala_id_historia_id_pessoa_id_key";

-- AlterTable
ALTER TABLE "Pessoa" DROP COLUMN "ultima_senha";

-- AlterTable
ALTER TABLE "Voto" DROP COLUMN "historia_id";

-- DropTable
DROP TABLE "public"."Equipe";

-- DropTable
DROP TABLE "public"."Historia";

-- DropTable
DROP TABLE "public"."MembroEquipe";

-- DropTable
DROP TABLE "public"."Projeto";

-- CreateIndex
CREATE INDEX "Pessoa_email_idx" ON "Pessoa"("email");

-- CreateIndex
CREATE INDEX "Pessoa_codigo_expiracao_idx" ON "Pessoa"("codigo_expiracao");

-- CreateIndex
CREATE UNIQUE INDEX "Sala_codigo_key" ON "Sala"("codigo");

-- CreateIndex
CREATE INDEX "Sala_criado_por_idx" ON "Sala"("criado_por");

-- CreateIndex
CREATE INDEX "Sala_codigo_idx" ON "Sala"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Voto_sala_id_pessoa_id_key" ON "Voto"("sala_id", "pessoa_id");
