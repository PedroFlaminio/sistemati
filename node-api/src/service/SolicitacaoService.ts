import { File, Files } from "formidable";
import prismaClient from "../prisma";
import { Solicitacao, User } from "../types";
import fs from "fs";
import path from "path";

export const SolicitacaoService = {
  cancelar: async (id: number, user: User) => {
    try {
      let { nome, username, email, matricula = 0 } = user;
      let results = await prismaClient.solicitacao.update({
        where: { id },
        data: { status: "Cancelado" },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Cancelamento do solicitação",
          nome,
          username,
          matricula,
          solicitacao: { connect: { id } },
        },
      });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getById: async (id: number) => {
    try {
      let results = await prismaClient.solicitacao.findUnique({
        where: { id },
        include: { sistema: true, arquivos: true, historicos: true, dev: true },
      });
      const { arquivos, ...otherProps } = results;
      return { ...otherProps, arquivos: arquivos.filter((a) => a.tipo === "arquivo"), prints: arquivos.filter((a) => a.tipo === "print") };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  lista: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany({
        include: { sistema: true, dev: true },
        orderBy: { dataCriacao: "asc" },
      });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaSolicitacoesPendentes: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany({
        where: { NOT: { OR: [{ status: "Resolvido" }, { status: "Cancelado" }] } },
        include: { sistema: true, dev: true },
        orderBy: { dataCriacao: "asc" },
      });
      const ordenados = [];
      for (let index = 0; index < results.length; index++) {
        const element = results[index];
        let ordem = 0;
        if (element.criticidade === "Média") ordem += 1;
        else if (element.criticidade === "Grave") ordem += 3;
        else if (element.criticidade === "Urgente") ordem += 5;
        if (element.solicitado_diretor) ordem += 1;
        ordenados.push({ ...element, ordem });
      }
      ordenados.sort((a, b) => a.ordem);
      //console.log(ordenados);
      return ordenados;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaSolicitacoesResolvidas: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany({ where: { status: "Resolvido" }, include: { sistema: true, dev: true } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaSolicitacoesByUser: async (username: string) => {
    try {
      console.log(username);
      let results = await prismaClient.solicitacao.findMany({ where: { username }, include: { sistema: true, dev: true } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaSolicitacoesByDev: async (matricula: number) => {
    try {
      let results = await prismaClient.solicitacao.findMany({ where: { dev: { matricula } }, include: { sistema: true, dev: true } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereSolicitacao: async (solicitacao: Solicitacao, files: any, user: User) => {
    try {
      const { id, id_sistema, id_dev, dev, sistema, dataCriacao, historicos, arquivos, ...otheProps } = solicitacao;
      let { nome, username, email, matricula = 0 } = user;
      if (matricula === null) matricula = 0;
      const newSolicitacao = await prismaClient.solicitacao.create({
        data: {
          ...otheProps,
          sistema: { connect: { id: id_sistema } },
          nome,
          username,
          email,
          matricula,
        },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Criação do solicitação",
          nome,
          username,
          matricula,
          solicitacao: { connect: { id: newSolicitacao.id } },
        },
      });
      const keys = Object.keys(files);
      if (keys.length > 0) {
        for (let index = 0; index < keys.length; index++) {
          const tipo = keys[index].split("[")[0];
          const element = files[keys[index]];
          const newArquivo = await prismaClient.arquivoSolicitacao.create({
            data: {
              tipo,
              nome_arquivo: element.name,
              solicitacao: { connect: { id: newSolicitacao.id } },
            },
          });
          const nomeArquivo = newArquivo.id.toString().padStart(6, "0") + "-" + element.name;
          fs.copyFileSync(element.path, path.join(process.env.FOLDER, nomeArquivo));
        }
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaSolicitacao: async (solicitacao: Solicitacao, files: any, user: User) => {
    try {
      let {
        id,
        id_sistema,
        id_dev,
        sistema,
        dev,
        dataCriacao,
        nome,
        username,
        email,
        matricula,
        arquivosDeleted,
        historicos,
        arquivos,
        prints,
        ...otheProps
      } = solicitacao;
      if (id_dev === null) id_dev = 0;
      if (matricula === null) matricula = 0;
      await prismaClient.solicitacao.update({
        where: { id },
        data: {
          ...otheProps,
          sistema: { connect: { id: id_sistema } },
          dev: { connect: { id: id_dev } },
        },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Alteração da solicitação",
          nome: user.nome,
          username: user.username,
          matricula: user.matricula || 0,
          solicitacao: { connect: { id } },
        },
      });
      const keys = Object.keys(files);
      if (keys.length > 0) {
        for (let index = 0; index < keys.length; index++) {
          const tipo = keys[index].split("[")[0];
          const element = files[keys[index]];
          const newArquivo = await prismaClient.arquivoSolicitacao.create({
            data: {
              tipo,
              nome_arquivo: element.name,
              solicitacao: { connect: { id } },
            },
          });
          const nomeArquivo = newArquivo.id.toString().padStart(6, "0") + "-" + element.name;
          fs.copyFileSync(element.path, path.join(process.env.FOLDER, nomeArquivo));
        }
      }
      if (arquivosDeleted?.length > 0)
        for (let index = 0; index < arquivosDeleted.length; index++) {
          const oldArquivo = await prismaClient.arquivoSolicitacao.delete({ where: { id: arquivosDeleted[index] } });
        }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  deletaSolicitacao: async (id: number) => {
    try {
      await prismaClient.solicitacao.delete({ where: { id } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getArquivo: async (id: number) => {
    try {
      let result = await prismaClient.arquivoSolicitacao.findUnique({ where: { id } });
      const fotoPath = path.join(process.env.FOLDER, result.id.toString().padStart(6, "0") + "-" + result.nome_arquivo);
      return fotoPath;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};
