import prismaClient from "../prisma";
import { Dev } from "../types";

const DevService = {
  listaDevs: async () => {
    try {
      let results = await prismaClient.dev.findMany({ orderBy: { nome: "asc" } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  listaDevsAtivos: async () => {
    try {
      let results = await prismaClient.dev.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereDev: async (dev: Dev) => {
    try {
      const { id, ...otheProps } = dev;
      await prismaClient.dev.create({ data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaDev: async (dev: Dev) => {
    try {
      const { id, ...otheProps } = dev;
      await prismaClient.dev.update({ where: { id }, data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  deletaDev: async (id: number) => {
    try {
      await prismaClient.dev.delete({ where: { id } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { DevService };
