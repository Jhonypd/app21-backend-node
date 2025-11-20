/*
  Warnings:

  - You are about to drop the column `membro_permanente` on the `ParticipanteSala` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParticipanteSala" DROP COLUMN "membro_permanente",
ADD COLUMN     "tipo" INTEGER NOT NULL DEFAULT 0;
