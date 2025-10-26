/*
  Warnings:

  - A unique constraint covering the columns `[email_hash]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ultima_senha` to the `Pessoa` table without a default value. This is not possible if the table is not empty.
  - Made the column `senha` on table `Pessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "email_confirmado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_hash" TEXT,
ADD COLUMN     "ultima_senha" TEXT NOT NULL,
ALTER COLUMN "senha" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_hash_key" ON "Pessoa"("email_hash");
