-- AlterTable: Adicionar campo iniciada_por à SessaoSala
-- Estratégia: Primeiro adiciona como nullable, preenche com criado_por da sala, depois torna NOT NULL

-- Passo 1: Adicionar coluna como nullable
ALTER TABLE "SessaoSala" ADD COLUMN "iniciada_por" TEXT;

-- Passo 2: Preencher valores existentes com o criado_por da sala correspondente
UPDATE "SessaoSala" 
SET "iniciada_por" = "Sala"."criado_por"
FROM "Sala"
WHERE "SessaoSala"."sala_id" = "Sala"."id";

-- Passo 3: Tornar a coluna NOT NULL
ALTER TABLE "SessaoSala" ALTER COLUMN "iniciada_por" SET NOT NULL;

-- Passo 4: Adicionar foreign key
ALTER TABLE "SessaoSala" ADD CONSTRAINT "SessaoSala_iniciada_por_fkey" FOREIGN KEY ("iniciada_por") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Passo 5: Criar índice para melhor performance
CREATE INDEX "SessaoSala_iniciada_por_idx" ON "SessaoSala"("iniciada_por");
