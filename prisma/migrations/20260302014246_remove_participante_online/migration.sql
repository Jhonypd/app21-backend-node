/*
  Warnings:

  - You are about to drop the column `online` on the `ParticipanteSala` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParticipanteSala" DROP COLUMN "online",
ADD COLUMN     "adicionado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
