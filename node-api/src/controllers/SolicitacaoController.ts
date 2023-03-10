import { Solicitacao } from "./../types";
import { Request, Response } from "express";
import { SolicitacaoService } from "../service/SolicitacaoService";
import { getUser, getUserName } from "../utils";
import { Fields } from "formidable";
import axios from "axios";

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
  listaSolicitacoesAguardando: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.listaSolicitacoesAguardando();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  listaSolicitacoesPendentes: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.listaSolicitacoesPendentes();
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  lista: async (request: Request, response: Response) => {
    try {
      const result = await SolicitacaoService.lista();
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
  listaSolicitacoesByDev: async (request: Request, response: Response) => {
    try {
      const matricula = parseInt(request.params.matricula);
      const result = await SolicitacaoService.listaSolicitacoesByDev(matricula);
      if (result) return response.status(200).json(result);
      else return response.status(400).json({ message: "Erro ao listar solicitações." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao listar solicitações." });
    }
  },
  insere: async (request: Request, response: Response) => {
    try {
      let solicitacao = JSON.parse(request.fields.solicitacao as string); //👌👌👌
      const files = request.files;
      const user = getUser(request.headers.authorization);
      console.log(solicitacao);
      const result = await SolicitacaoService.insereSolicitacao(solicitacao, files, user);
      if (result) return response.status(200).json({ message: "Sucesso ao cadastrar solicitação." });
      else return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao cadastar solicitação." });
    }
  },
  atualiza: async (request: Request, response: Response) => {
    try {
      let solicitacao = JSON.parse(request.fields.solicitacao as string);
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

      if (result) {
        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        const filename = result.split("\\")[result.split("\\").length - 1].split("-")[1];
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);
        response.end();
      } else return response.status(400).json({ message: "Erro ao acessar arquivo." });
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: "Erro ao acessar arquivo." });
    }
  },
  getPrint: async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id);
      const result = await SolicitacaoService.getArquivo(id);
      if (typeof result === "string" && result.endsWith("svg")) response.setHeader("Content-Type", "image/svg+xml");
      else if (typeof result === "string" && result.endsWith("png")) response.setHeader("Content-Type", "image/png");
      else if (typeof result === "string" && result.endsWith("gif")) response.setHeader("Content-Type", "image/gif");
      else if (typeof result === "string" && (result.endsWith("jpeg") || result.endsWith("jpg")))
        response.setHeader("Content-Type", "image/jpeg");
      if (result) return response.status(200).sendFile(result);
      else return response.status(400).json({ message: "Erro ao acessar arquivo." });
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: "Erro ao acessar arquivo." });
    }
  },
  getFoto: async (request: Request, response: Response) => {
    try {
      const matricula = parseInt(request.params.matricula);
      console.log(matricula);

      let foto = "";
      const x = await axios
        .get(
          `https://urbamsjc.com.br/api/foto_colaborador/${matricula}/CFBDCB9C5B7936A8DE6B5EBEC22BC23BC911FB2286CFD320DAD371975CB2EEE0BA79758A3445E70468D16997DBB63D6DF51BFB3D9DD2A699B18285719ACC`
        )
        .then((resp) => {
          foto += resp.data.b64;
        })
        .catch((error) => console.log(error));
      let base64Image = foto.split(";base64,").pop();
      return response.status(200).json(foto);
    } catch (err) {
      console.log(err);
      return response.status(400).json({ message: "Erro ao acessar foto." });
    }
  },
  cancelar: async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id);
      const user = getUser(request.headers.authorization);
      const result = await SolicitacaoService.cancelar(id, user);
      if (result) return response.status(200).json({ message: "Sucesso ao cancelar solicitação." });
      else return response.status(400).json({ message: "Erro ao cancelar solicitação." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao cancelar solicitação." });
    }
  },
  encaminha: async (request: Request, response: Response) => {
    try {
      const { id_dev, id_solicitacao } = request.body;
      const user = getUser(request.headers.authorization);
      const result = await SolicitacaoService.encaminha(id_dev, id_solicitacao, user);
      if (result) return response.status(200).json({ message: "Sucesso ao atribuir solicitação." });
      else return response.status(400).json({ message: "Erro ao atribuir solicitação." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao atribuir solicitação." });
    }
  },
  aprova: async (request: Request, response: Response) => {
    try {
      const id = parseInt(request.params.id);
      const user = getUser(request.headers.authorization);
      const result = await SolicitacaoService.aprova(id, user);
      if (result) return response.status(200).json({ message: "Sucesso ao atribuir solicitação." });
      else return response.status(400).json({ message: "Erro ao atribuir solicitação." });
    } catch (err) {
      console.log(err.message);
      return response.status(400).json({ message: "Erro ao atribuir solicitação." });
    }
  },
};

export { SolicitacaoController };
