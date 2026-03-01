-- This is an empty migration.

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- cria os índices trigram (GIN)
CREATE INDEX IF NOT EXISTS pessoa_nome_busca_trgm
  ON "Pessoa" USING GIN ("nome_busca" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS pessoa_email_busca_trgm
  ON "Pessoa" USING GIN ("email_busca" gin_trgm_ops);

-- opcional: remover os índices btree antigos (se ainda existirem)
DROP INDEX IF EXISTS "Pessoa_nome_busca_idx";
DROP INDEX IF EXISTS "Pessoa_email_busca_idx";