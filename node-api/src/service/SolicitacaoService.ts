import { File, Files } from "formidable";
import prismaClient from "../prisma";
import { Solicitacao, User } from "../types";
import fs from "fs";
import path from "path";
import { io } from "../app";
const STATUS = {
  aguardando: "Aguardando aprovação",
  nova: "Nova",
  analise: "Em Análise",
  andamento: "Em Andamento",
  espera: "Em Espera",
  cancelada: "Cancelada",
  resolvida: "Resolvida",
};
export const SolicitacaoService = {
  cancelar: async (id: number, user: User) => {
    try {
      let { nome, username, email, matricula = 0 } = user;
      let results = await prismaClient.solicitacao.update({
        where: { id },
        data: { status: STATUS.cancelada },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Cancelamento da solicitação",
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
  encaminha: async (id_dev: number, id: number, user: User) => {
    try {
      let { nome, username, matricula = 0 } = user;
      let results = await prismaClient.solicitacao.update({
        where: { id },
        data: { status: STATUS.analise, dev: { connect: { id: id_dev } } },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Encaminhamento da solicitação",
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
  aprova: async (id: number, user: User) => {
    try {
      let { nome, username, matricula = 0 } = user;
      let results = await prismaClient.solicitacao.update({
        where: { id },
        data: { status: STATUS.nova },
      });
      await prismaClient.historicoSolicitacao.create({
        data: {
          descricao: "Aprovação da solicitação",
          nome,
          username,
          matricula,
          solicitacao: { connect: { id } },
        },
      });
      io.of("/sistemati-api/io").emit("solicitacoes", "novaSolicitacao");
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
  listaSolicitacoesAguardando: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany({
        where: { status: STATUS.aguardando },
        include: { sistema: { include: { responsavel: true, reserva: true } }, dev: true },
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
        where: { status: STATUS.nova, OR: [{ dev: null }, { id_dev: 0 }] },
        include: { sistema: { include: { responsavel: true, reserva: true } }, dev: true },
        orderBy: { dataCriacao: "asc" },
      });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaSolicitacoesResolvidas: async () => {
    try {
      let results = await prismaClient.solicitacao.findMany({ where: { status: STATUS.resolvida }, include: { sistema: true, dev: true } });
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
      const { id, id_sistema, id_dev, dev, sistema, dataCriacao, historicos, arquivos, status, ...otheProps } = solicitacao;
      let { nome, username, email, matricula = 0 } = user;
      if (matricula === null) matricula = 0;
      const newSolicitacao = await prismaClient.solicitacao.create({
        data: {
          ...otheProps,
          sistema: otheProps.tipo === "Melhoria" ? { connect: { id: id_sistema } } : undefined,
          nome,
          username,
          email,
          matricula,
          status: ["Melhoria", "Novo Sistema"].indexOf(otheProps.tipo) >= 0 ? STATUS.aguardando : "Nova",
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
      if (["Melhoria", "Novo Sistema"].indexOf(otheProps.tipo) < 0) io.of("/sistemati-api/io").emit("solicitacoes", "novaSolicitacao");
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
