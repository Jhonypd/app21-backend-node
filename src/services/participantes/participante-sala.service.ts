import { criptografia } from "../../lib/criptografia";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import { salaRepository } from "../../repositories/sala.repository";

export const participanteSalaService = {
  async adicionarParticipanteASala(
    sala_id: string,
    pessoa_id: string,
    tipo: number = 2,
  ) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id,
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
        pessoaExiste.id,
      );

    if (participanteExistente) {
      throw new Error("Participante já está na sala");
    }

    const participante = await participanteSalaRepository.inserir({
      sala_id,
      pessoa_id,
      tipo,
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
      pessoa_id,
    );

    if (!salaExiste) {
      throw new Error("Sala não encontrada");
    }

    if (!pessoaExiste) {
      throw new Error("Pessoa não encontrada");
    }

    const removeParticipante = await participanteSalaRepository.remover(
      salaExiste.id,
      pessoaExiste.id,
    );

    if (!removeParticipante) {
      throw new Error("Erro ao remover participante da sala");
    }

    return removeParticipante.id;
  },

  async listarParticipantesDaSala(sala_id: string, sessao_id?: string | null) {
    const participantesSala =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);

    // Montar lista de participantes permanentes
    const participantes: Array<{
      id: string;
      nome: string;
      inativo: boolean;
      role: number;
      online: boolean;
    }> = participantesSala.map((p) => ({
      id: p.pessoa.id,
      nome: criptografia.descriptografar(p.pessoa.nome),
      inativo: p.pessoa.inativo,
      role: p.role,
      online: p.online,
    }));

    // Se sessao_id fornecido, incluir visitantes (ParticipanteSessao que não são permanentes)
    if (sessao_id) {
      const participantesSessao =
        await participanteSessaoRepository.obterParticipantesPorSessao(
          sessao_id,
        );

      const idsPermanentes = new Set(participantesSala.map((p) => p.pessoa.id));

      participantesSessao.forEach((ps) => {
        if (!idsPermanentes.has(ps.pessoa.id)) {
          participantes.push({
            id: ps.pessoa.id,
            nome: criptografia.descriptografar(ps.pessoa.nome),
            inativo: ps.pessoa.inativo,
            role: 3, // Visitante sempre role 3
            online: true, // Visitante sempre online (está na sessão ativa)
          });
        }
      });
    }

    return { participantes };
  },

  async alterarParticipanteSalaOnline(
    sala_id: string,
    pessoa_id: string,
    online: boolean,
  ) {
    const pessoaExiste = await pessoaRepository.obterPorId(pessoa_id, false);

    const salaExiste = await salaRepository.obterPorId(
      sala_id,
      false,
      pessoa_id,
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
        online,
      );

    return participante.id;
  },

  /**
   * Adiciona um participante permanente à sala
   * Permissões: Dono (0) pode adicionar role 1 ou 2, Admin (1) pode adicionar apenas role 2
   * Se sessao_id for fornecido, também cria ParticipanteSessao (autorizado=true)
   */
  async adicionarParticipante(
    sala_id: string,
    pessoa_id_solicitante: string,
    pessoa_id_adicionar: string,
    role: 1 | 2,
    sessao_id?: string,
  ) {
    // Buscar sala
    const sala = await salaRepository.obterPorId(sala_id, false, undefined);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Verificar permissão do solicitante
    const isDono = sala.criado_por === pessoa_id_solicitante;
    const participanteSolicitante =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id_solicitante,
      );
    const isAdmin = participanteSolicitante?.role === 1;

    if (!isDono && !isAdmin) {
      throw new Error(
        "Apenas o dono ou administradores podem adicionar participantes",
      );
    }

    // Admin só pode adicionar membros (role 2)
    if (isAdmin && !isDono && role === 1) {
      throw new Error("Apenas o dono pode adicionar administradores");
    }

    // Verificar se pessoa existe
    const pessoaAdicionar = await pessoaRepository.obterPorId(
      pessoa_id_adicionar,
      false,
    );
    if (!pessoaAdicionar) {
      throw new Error("Pessoa não encontrada");
    }

    // Verificar se já é participante
    const participanteExistente =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id_adicionar,
      );
    if (participanteExistente) {
      throw new Error("Esta pessoa já é participante da sala");
    }

    // Adicionar participante permanente à sala
    const participante = await participanteSalaRepository.inserir({
      sala_id,
      pessoa_id: pessoa_id_adicionar,
      tipo: role,
    });

    // Se sessao_id fornecido, também adicionar como ParticipanteSessao (autorizado)
    if (sessao_id) {
      const jaExisteNaSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessao_id,
          pessoa_id_adicionar,
        );
      if (!jaExisteNaSessao) {
        await participanteSessaoRepository.inserir({
          sessao_id,
          pessoa_id: pessoa_id_adicionar,
          autorizado: true,
        });
      }
    }

    return {
      id: participante.id,
      pessoa: {
        id: pessoaAdicionar.id,
        nome: criptografia.descriptografar(pessoaAdicionar.nome),
        inativo: pessoaAdicionar.inativo,
      },
      role,
    };
  },

  /**
   * Remove um participante permanente da sala
   * Permissões: Dono (0) e Admin (1) podem remover, mas não podem remover o dono ou outros admins
   */
  async removerParticipante(
    sala_id: string,
    pessoa_id_solicitante: string,
    pessoa_id_remover: string,
  ) {
    // Buscar sala
    const sala = await salaRepository.obterPorId(sala_id, false, undefined);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Não pode remover o dono
    if (sala.criado_por === pessoa_id_remover) {
      throw new Error("Não é possível remover o dono da sala");
    }

    // Verificar permissão do solicitante
    const isDono = sala.criado_por === pessoa_id_solicitante;
    const participanteSolicitante =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id_solicitante,
      );
    const isAdmin = participanteSolicitante?.role === 1;

    if (!isDono && !isAdmin) {
      throw new Error(
        "Apenas o dono ou administradores podem remover participantes",
      );
    }

    // Buscar participante a ser removido
    const participanteRemover =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id_remover,
      );
    if (!participanteRemover) {
      throw new Error("Participante não encontrado na sala");
    }

    // Admin não pode remover outro admin
    if (isAdmin && !isDono && participanteRemover.role === 1) {
      throw new Error(
        "Administradores não podem remover outros administradores",
      );
    }

    // Remover participante
    await participanteSalaRepository.remover(sala_id, pessoa_id_remover);

    return { sucesso: true };
  },

  /**
   * Altera o role de um participante (promover ou rebaixar)
   * Permissões: Apenas o dono (0) pode alterar roles
   */
  async alterarRoleParticipante(
    sala_id: string,
    pessoa_id_solicitante: string,
    pessoa_id_alterar: string,
    novo_role: 1 | 2,
  ) {
    // Buscar sala
    const sala = await salaRepository.obterPorId(sala_id, false, undefined);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Apenas o dono pode alterar roles
    if (sala.criado_por !== pessoa_id_solicitante) {
      throw new Error("Apenas o dono pode promover ou rebaixar participantes");
    }

    // Não pode alterar role do próprio dono
    if (sala.criado_por === pessoa_id_alterar) {
      throw new Error("Não é possível alterar o role do dono");
    }

    // Buscar participante
    const participante = await participanteSalaRepository.obterPorSalaEPessoa(
      sala_id,
      pessoa_id_alterar,
    );
    if (!participante) {
      throw new Error("Participante não encontrado na sala");
    }

    // Alterar role
    const participanteAtualizado = await participanteSalaRepository.alterarRole(
      sala_id,
      pessoa_id_alterar,
      novo_role,
    );

    return {
      id: participanteAtualizado.id,
      role: novo_role,
    };
  },
};
