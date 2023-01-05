import { Request, Response } from "express";
import { SistemaService } from "../service/SistemaService";

const SistemaController = {
  lista: async (request: Request, response: Response) => {
    try {
      const result = await SistemaService.listaSistemas();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar sistemas." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao listar sistemas." });
    }
  },

  insere: async (request: Request, response: Response) => {
    try {
      const sistema = request.body;
      const result = await SistemaService.insereSistema(sistema);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar sistema." });
      else return response.status(400).json({ message: "Erro ao cadastar sistema." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar sistema." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      const sistema = request.body;
      const result = await SistemaService.atualizaSistema(sistema);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar sistema." });
      else return response.status(400).json({ message: "Erro ao alterar sistema." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao alterar sistema." });
    }
  },
};

export { SistemaController };
