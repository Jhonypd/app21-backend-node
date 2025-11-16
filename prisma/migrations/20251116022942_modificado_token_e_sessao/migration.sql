/*
  Warnings:

  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `SessaoUsuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token_hash]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessao_id]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessao_id` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_hash` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessaoUsuario" DROP CONSTRAINT "SessaoUsuario_usuario_id_fkey";

-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- DropIndex
DROP INDEX "RefreshToken_userId_idx";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "token",
DROP COLUMN "userId",
ADD COLUMN     "sessao_id" TEXT NOT NULL,
ADD COLUMN     "token_hash" TEXT NOT NULL;

-- DropTable
DROP TABLE "SessaoUsuario";

-- CreateTable
CREATE TABLE "SessaoPessoa" (
    "id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiracao" TIMESTAMP(3) NOT NULL,
    "ultimo_acesso_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revogado_em" TIMESTAMP(3),
    "ip" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "SessaoPessoa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessaoPessoa_pessoa_id_idx" ON "SessaoPessoa"("pessoa_id");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_hash_key" ON "RefreshToken"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_sessao_id_key" ON "RefreshToken"("sessao_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "SessaoPessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessaoPessoa" ADD CONSTRAINT "SessaoPessoa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
