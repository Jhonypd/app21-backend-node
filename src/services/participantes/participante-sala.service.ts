import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import { salaRepository } from "../../repositories/sala.repository";

export const participanteSalaService = {
  async adicionarParticipanteASala(
    sala_id: string,
    pessoa_id: string,
    membro_permanente = false
  ) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id
    );

    if (!salaExiste) {
      throw new Error("Sala não encontrada");
    }

    if (!pessoaExiste) {
      throw new Error("Pessoa não encontrada");
    }

    const participanteExistente =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoaExiste.id
      );

    if (participanteExistente) {
      throw new Error("Participante já está na sala");
    }

    const participante = await participanteSalaRepository.inserir({
      sala_id,
      pessoa_id,
      membro_permanente,
    });

    if (!participante) {
      throw new Error("Erro ao adicionar participante à sala");
    }

    return participante.id;
  },

  async removerParticipanteDaSala(sala_id: string, pessoa_id: string) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id
    );

    if (!salaExiste) {
      throw new Error("Sala não encontrada");
    }

    if (!pessoaExiste) {
      throw new Error("Pessoa não encontrada");
    }

    const removeParticipante = await participanteSalaRepository.remover(
      salaExiste.id,
      pessoaExiste.id
    );

    if (!removeParticipante) {
      throw new Error("Erro ao remover participante da sala");
    }

    return removeParticipante.id;
  },

  async listarParticipantesDaSala(sala_id: string) {
    return participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);
  },

  async alterarParticipanteSalaMembroPermanente(
    sala_id: string,
    pessoa_id: string,
    membro_permanente: boolean
  ) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id
    );

    if (!salaExiste) {
      throw new Error("Sala não encontrada");
    }

    if (!pessoaExiste) {
      throw new Error("Pessoa não encontrada");
    }

    const participante =
      await participanteSalaRepository.alterarParticipanteSalaMembroPermanente(
        salaExiste.id,
        pessoaExiste.id,
        membro_permanente
      );

    return participante.id;
  },

  async alterarParticipanteSalaOnline(
    sala_id: string,
    pessoa_id: string,
    online: boolean
  ) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id
    );

    if (!salaExiste) {
      throw new Error("Sala não encontrada");
    }

    if (!pessoaExiste) {
      throw new Error("Pessoa não encontrada");
    }

    const participante =
      await participanteSalaRepository.alterarParticipanteSalaOnline(
        salaExiste.id,
        pessoaExiste.id,
        online
      );

    return participante.id;
  },
};
