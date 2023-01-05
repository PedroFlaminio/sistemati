import prismaClient from "../prisma";
import { Dev, User } from "../types";

const UsuariosService = {
  listaUsuarios: async () => {
    try {
      let results = await prismaClient.user.findMany({ orderBy: { name: "asc" } });
      return results;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  insereUsuario: async (dev: User) => {
    try {
      const { id, ...otheProps } = dev;
      await prismaClient.user.create({ data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  atualizaUsuario: async (dev: User) => {
    try {
      const { id, ...otheProps } = dev;
      await prismaClient.user.update({ where: { id }, data: { ...otheProps } });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { UsuariosService };
