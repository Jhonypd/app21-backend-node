-- AlterTable
ALTER TABLE "Pessoa" ADD COLUMN     "email_busca" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nome_busca" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Pessoa_nome_busca_idx" ON "Pessoa"("nome_busca");

-- CreateIndex
CREATE INDEX "Pessoa_email_busca_idx" ON "Pessoa"("email_busca");
