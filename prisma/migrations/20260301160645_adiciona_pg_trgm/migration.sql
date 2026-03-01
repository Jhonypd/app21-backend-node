-- DropIndex
DROP INDEX "pessoa_email_busca_trgm";

-- DropIndex
DROP INDEX "pessoa_nome_busca_trgm";

-- CreateIndex
CREATE INDEX "Pessoa_nome_busca_idx" ON "Pessoa"("nome_busca");

-- CreateIndex
CREATE INDEX "Pessoa_email_busca_idx" ON "Pessoa"("email_busca");
