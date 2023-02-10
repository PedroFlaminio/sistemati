import { Request, Response } from "express";
import { DevService } from "../service/DevService";

const DevController = {
  lista: async (request: Request, response: Response) => {
    try {
      const result = await DevService.listaDevs();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    }
  },
  listaAtivos: async (request: Request, response: Response) => {
    try {
      const result = await DevService.listaDevsAtivos();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    }
  },

  insere: async (request: Request, response: Response) => {
    try {
      const dev = request.body;
      const result = await DevService.insereDev(dev);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar desenvolvedor." });
      else return response.status(400).json({ message: "Erro ao cadastar desenvolvedor." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar desenvolvedor." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      const dev = request.body;
      const result = await DevService.atualizaDev(dev);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar desenvolvedor." });
      else return response.status(400).json({ message: "Erro ao alterar desenvolvedor." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao alterar desenvolvedor." });
    }
  },
  deleta: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const result = await DevService.deletaDev(parseInt(id));
      if (result) return response.status(200).json({ message: "Sucesso ao e desenvolvedor." });
      else return response.status(400).json({ message: "Erro ao excluir desenvolvedor." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao excluir desenvolvedor." });
    }
  },
};

export { DevController };
