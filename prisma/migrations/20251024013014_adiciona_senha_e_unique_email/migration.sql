/*
  Warnings:

  - You are about to drop the column `auth_id` on the `Pessoa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Pessoa_auth_id_key";

-- AlterTable
ALTER TABLE "Pessoa" DROP COLUMN "auth_id",
ADD COLUMN     "senha" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_email_key" ON "Pessoa"("email");
