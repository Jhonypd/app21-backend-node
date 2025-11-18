-- AlterTable
ALTER TABLE "ParticipanteSala" ADD COLUMN     "membro_permanente" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sala" ADD COLUMN     "historia_atual_id" TEXT,
ADD COLUMN     "votos_revelados" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SessaoSala" (
    "id" TEXT NOT NULL,
    "sala_id" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SessaoSala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipanteSessao" (
    "id" TEXT NOT NULL,
    "sessao_id" TEXT NOT NULL,
    "pessoa_id" TEXT NOT NULL,
    "autorizado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ParticipanteSessao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipanteSessao_sessao_id_pessoa_id_key" ON "ParticipanteSessao"("sessao_id", "pessoa_id");

-- CreateIndex
CREATE INDEX "HistoriaSala_sala_id_idx" ON "HistoriaSala"("sala_id");

-- CreateIndex
CREATE INDEX "Sala_historia_atual_id_idx" ON "Sala"("historia_atual_id");

-- AddForeignKey
ALTER TABLE "SessaoSala" ADD CONSTRAINT "SessaoSala_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteSessao" ADD CONSTRAINT "ParticipanteSessao_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "SessaoSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipanteSessao" ADD CONSTRAINT "ParticipanteSessao_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
