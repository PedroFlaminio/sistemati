import prismaClient from "../prisma";
import { Sistema } from "../types";

const SistemaService = {
  listaSistemas: async () => {
    try {
      let results = await prismaClient.sistema.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
        include: { responsavel: true, reserva: true },
      });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereSistema: async (sistema: Sistema) => {
    try {
      const { id, reserva, responsavel, solicitacoes, ...otheProps } = sistema;
      await prismaClient.sistema.create({ data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaSistema: async (sistema: Sistema) => {
    try {
      const { id, solicitacoes, reserva, responsavel, ...otheProps } = sistema;
      await prismaClient.sistema.update({ where: { id }, data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { SistemaService };
