/*
  Warnings:

  - Made the column `email` on table `Pessoa` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email_hash` on table `Pessoa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "codigo_confirmacao_hash" TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email_hash" SET NOT NULL;
