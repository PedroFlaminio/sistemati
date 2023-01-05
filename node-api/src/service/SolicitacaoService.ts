import prismaClient from "../prisma";
import { Solicitacao } from "../types";

const SolicitacaoService = {
  listaSolicitacoes: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany();
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereSolicitacao: async (solicitacao: Solicitacao) => {
    try {
      const { id, sistema, dataCriacao, ...otheProps } = solicitacao;
      await prismaClient.solicitacao.create({ data: { ...otheProps, dataCriacao: new Date() } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaSolicitacao: async (solicitacao: Solicitacao) => {
    try {
      const { id, sistema, ...otheProps } = solicitacao;
      await prismaClient.solicitacao.update({ where: { id }, data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { SolicitacaoService };
