import { Request, Response } from "express";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const participanteSalaController = {
  async adicionarParticipante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const { pessoa_id, tipo } = req.body; // tipo: 1=admin, 2=participante
      const dono_id = req.user?.Usu_Id as string;

      // Validar que apenas dono ou admin pode adicionar participantes
      const userRole = req.user?.Role;
      if (userRole !== 0 && userRole !== 1) {
        return res.status(403).json(
          respostaErro({
            mensagem:
              "Apenas o dono ou administrador pode adicionar participantes.",
          })
        );
      }

      // Validar tipo
      if (tipo === 0) {
        return res.status(400).json(
          respostaErro({
            mensagem: "Não é possível adicionar outro dono.",
          })
        );
      }

      if (![1, 2].includes(tipo)) {
        return res.status(400).json(
          respostaErro({
            mensagem:
              "Tipo inválido. Use 1 para administrador ou 2 para participante.",
          })
        );
      }

      const participante =
        await participanteSalaService.adicionarParticipanteASala(
          sala_id,
          pessoa_id,
          tipo
        );

      res.json(
        respostaSucesso({
          resultado: { id: participante },
          mensagem: "Participante adicionado com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async removerParticipante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.params.pessoaId;
      const dono_id = req.user?.Usu_Id as string;

      // Validar que apenas dono ou admin pode remover participantes
      const userRole = req.user?.Role;
      if (userRole !== 0 && userRole !== 1) {
        return res.status(403).json(
          respostaErro({
            mensagem:
              "Apenas o dono ou administrador pode remover participantes.",
          })
        );
      }

      // Não permitir remover o dono
      // TODO: Verificar se pessoa_id não é o dono da sala

      const participante =
        await participanteSalaService.removerParticipanteDaSala(
          sala_id,
          pessoa_id
        );

      res.json(
        respostaSucesso({
          resultado: { id: participante },
          mensagem: "Participante removido com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async listarParticipantes(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;

      const participantes =
        await participanteSalaService.listarParticipantesDaSala(sala_id);

      res.json(
        respostaSucesso({
          resultado: { participantes },
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
