import { Request, Response } from "express";
import { DevService } from "../service/DevService";

const UsuariosController = {
  lista: async (request: Request, response: Response) => {
    try {
      const result = await DevService.listaDevs();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao listar desenvolvedores." });
    }
  },

  insere: async (request: Request, response: Response) => {
    try {
      const local = request.body;
      const result = await DevService.insereDev(local);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar desenvolvedor." });
      else return response.status(400).json({ message: "Erro ao cadastar desenvolvedor." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar desenvolvedor." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      const local = request.body;
      const result = await DevService.atualizaDev(local);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar desenvolvedor." });
      else return response.status(400).json({ message: "Erro ao alterar desenvolvedor." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao alterar desenvolvedor." });
    }
  },
};

export { UsuariosController };
