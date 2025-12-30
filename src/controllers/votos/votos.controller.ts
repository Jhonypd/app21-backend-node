import { Request, Response } from "express";
import { votosService } from "../../services/votos/votos.service";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const votosController = {
  async votar(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const { historia_id, valor } = req.body;
      const pessoa_id = req.user?.Usu_Id as string;

      if (!historia_id) {
        throw new Error("historia_id é obrigatório.");
      }

      // Buscar HistoriaSessao (deve existir - criada junto com a sessão)
      const historiaSessao =
        await historiaSessaoRepository.obterPorSessaoEHistoria(
          sessao_id,
          historia_id
        );

      if (!historiaSessao) {
        throw new Error("História não encontrada na sessão. As histórias devem ser adicionadas ao criar a sessão.");
      }

      // Registrar o voto
      const voto = await votosService.votar({
        historia_sessao_id: historiaSessao.id,
        pessoa_id,
        valor,
      });

      res.status(201).json(
        respostaSucesso({
          resultado: { voto },
          mensagem: "Voto registrado com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async obterVotos(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const { historia_id } = req.query;

      if (historia_id) {
        // Buscar votos de uma história específica
        const historiaSessao =
          await historiaSessaoRepository.obterPorSessaoEHistoria(
            sessao_id,
            historia_id as string
          );

        if (!historiaSessao) {
          return res.json(
            respostaSucesso({
              resultado: { votos: [] },
            })
          );
        }

        const votos = await votosService.obterVotosPorHistoriaSessao(
          historiaSessao.id
        );

        res.json(
          respostaSucesso({
            resultado: { votos },
          })
        );
      } else {
        // Buscar todos os votos da sessão
        const votos = await votosService.obterVotosPorSessao(sessao_id);

        res.json(
          respostaSucesso({
            resultado: { votos },
          })
        );
      }
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
