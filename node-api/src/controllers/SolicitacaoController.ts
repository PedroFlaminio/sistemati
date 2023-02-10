import { Solicitacao } from "./../types";
import { Request, Response } from "express";
import { SolicitacaoService } from "../service/SolicitacaoService";
import { getUser, getUserName } from "../utils";
import { Fields } from "formidable";

const SolicitacaoController = {
  getById: async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id);
      const result = await SolicitacaoService.getById(id);
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  lista: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.listaSolicitacoes();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  listaSolicitacoesResolvidas: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.listaSolicitacoesResolvidas();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  listaSolicitacoesByUser: async (request: Request, response: Response) => {
    try {
      const usuario = getUserName(request.headers.authorization);
      const result = await SolicitacaoService.listaSolicitacoesByUser(usuario);
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  insere: async (request: Request, response: Response) => {
    try {
      const fields = request.fields;
      let solicitacao: Solicitacao = {} as Solicitacao;
      Object.keys(fields).forEach((key) => {
        if (key.startsWith("id")) solicitacao[key] = parseInt(fields[key][0]);
        else if (fields[key] === "true") solicitacao[key] = true;
        else if (fields[key] === "false") solicitacao[key] = false;
        else solicitacao[key] = fields[key];
      });
      const files = request.files;
      const user = getUser(request.headers.authorization);
      const result = await SolicitacaoService.insereSolicitacao(solicitacao, files, user);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar solicitação." });
      else return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      const fields = request.fields;
      let solicitacao: Solicitacao = {} as Solicitacao;
      Object.keys(fields).forEach((key) => {
        if (key.startsWith("id")) solicitacao[key] = parseInt(fields[key] as string);
        else if (key === "arquivosDeleted") solicitacao[key] = JSON.parse(fields[key] as string);
        else if (fields[key] === "true") solicitacao[key] = true;
        else if (fields[key] === "false") solicitacao[key] = false;
        else solicitacao[key] = fields[key];
      });
      const files = request.files;
      const user = getUser(request.headers.authorization);
      const result = await SolicitacaoService.atualizaSolicitacao(solicitacao, files, user);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar solicitação." });
      else return response.status(400).json({ message: "Erro ao alterar solicitação." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao alterar solicitação." });
    }
  },
  deleta: async (request: Request, response: Response) => {
    try {
      const sistema = request.body;
      const result = await SolicitacaoService.deletaSolicitacao(sistema);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar solicitação." });
      else return response.status(400).json({ message: "Erro ao alterar solicitação." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao alterar solicitação." });
    }
  },
  getArquivo: async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id);
      const result = await SolicitacaoService.getArquivo(id);
      if (result) return response.status(200).sendFile(result);
      else return response.status(400).json({ message: "Erro ao acessar foto." });
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: "Erro ao acessar foto." });
    }
  },
};

export { SolicitacaoController };
