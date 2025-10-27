/*
  Warnings:

  - You are about to drop the column `proprietario` on the `MembroEquipe` table. All the data in the column will be lost.
  - Added the required column `proprietario_id` to the `Equipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipe" ADD COLUMN     "proprietario_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MembroEquipe" DROP COLUMN "proprietario",
ADD COLUMN     "role" INTEGER NOT NULL DEFAULT 0;
