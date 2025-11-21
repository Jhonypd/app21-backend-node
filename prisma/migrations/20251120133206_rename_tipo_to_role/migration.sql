-- RenameColumn: Renomear 'tipo' para 'role' em ParticipanteSala
ALTER TABLE "ParticipanteSala" RENAME COLUMN "tipo" TO "role";

-- CreateIndex: Adicionar índice em 'role' para melhor performance
CREATE INDEX "ParticipanteSala_role_idx" ON "ParticipanteSala"("role");
