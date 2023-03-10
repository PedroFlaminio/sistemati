import prismaClient from "../prisma";
import { Sistema } from "../types";

const SistemaService = {
  listaSistemas: async () => {
    try {
      let results = await prismaClient.sistema.findMany({ orderBy: { nome: "asc" }, include: { responsavel: true, reserva: true } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaAtivos: async () => {
    try {
      let results = await prismaClient.sistema.findMany({
        orderBy: { nome: "asc" },
        include: { responsavel: true, reserva: true },
        where: { ativo: true },
      });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereSistema: async (sistema: Sistema) => {
    try {
      const { id, reserva, responsavel, solicitacoes, id_reserva, id_responsavel, ...otheProps } = sistema;
      await prismaClient.sistema.create({
        data: {
          ...otheProps,
          reserva: { connect: reserva ? { id: reserva?.id } : { id: 0 } },
          responsavel: { connect: responsavel ? { id: responsavel?.id } : { id: 0 } },
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaSistema: async (sistema: Sistema) => {
    try {
      const { id, reserva, responsavel, solicitacoes, id_reserva, id_responsavel, ...otheProps } = sistema;
      await prismaClient.sistema.update({
        where: { id },
        data: { ...otheProps, reserva: { connect: { id: id_reserva } }, responsavel: { connect: { id: id_responsavel } } },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { SistemaService };
