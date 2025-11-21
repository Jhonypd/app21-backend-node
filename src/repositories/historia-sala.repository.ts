import { prismaClient } from "../lib/prisma";

export interface CriarHistoriaSalaDTO {
  sala_id: string;
  titulo: string;
  descricao?: string;
  criado_por: string;
}

export interface AtualizarHistoriaSalaDTO {
  titulo?: string;
  descricao?: string;
}

class HistoriaSalaRepository {
  async criar(dados: CriarHistoriaSalaDTO) {
    return await prismaClient.historiaSala.create({
      data: dados,
    });
  }

  async obterPorId(id: string) {
    return await prismaClient.historiaSala.findUnique({
      where: { id },
      include: {
        sala: {
          select: {
            id: true,
            titulo: true,
            codigo: true,
          },
        },
      },
    });
  }

  async listarPorSala(sala_id: string) {
    return await prismaClient.historiaSala.findMany({
      where: { sala_id },
      orderBy: { data_criacao: "desc" },
    });
  }

  async atualizar(id: string, dados: AtualizarHistoriaSalaDTO) {
    return await prismaClient.historiaSala.update({
      where: { id },
      data: dados,
    });
  }

  async deletar(id: string) {
    return await prismaClient.historiaSala.delete({
      where: { id },
    });
  }

  async criarVarias(historias: CriarHistoriaSalaDTO[]) {
    return await prismaClient.historiaSala.createMany({
      data: historias,
    });
  }
}

export const historiaSalaRepository = new HistoriaSalaRepository();
