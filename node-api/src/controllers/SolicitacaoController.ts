import { Request, Response } from "express";
import { SolicitacaoService } from "../service/SolicitacaoService";

const SolicitacaoController = {
  lista: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.listaSolicitacoes();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },

  insere: async (request: Request, response: Response) => {
    try {
      const sistema = request.body;
      const result = await SolicitacaoService.insereSolicitacao(sistema);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar solicitação." });
      else return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      const sistema = request.body;
      const result = await SolicitacaoService.atualizaSolicitacao(sistema);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar solicitação." });
      else return response.status(400).json({ message: "Erro ao alterar solicitação." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao alterar solicitação." });
    }
  },
};

export { SolicitacaoController };
