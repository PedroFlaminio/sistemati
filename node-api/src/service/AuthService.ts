import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
import { dateToString, Encrypt } from "../utils";
import { selectUserByUserName } from "../database/SSODataBase";
import bcrypt from "bcrypt";

const AuthService = {
  loginUsuario: async (username: string, password: string) => {
    try {
      let user;
      const matricula = parseInt(username);
      if (isNaN(matricula)) user = await prismaClient.user.findFirst({ where: { username, active: true } });
      else {
        user = (await selectUserByUserName(username))[0];
        user.interno = true;
      }

      if (!user) return { message: "Usuário não encontrado!" };
      let senhaCorreta = false;
      senhaCorreta = await bcrypt.compare(password, user.password);
      if (!senhaCorreta) return { message: "Senha incorreta!" };
      const token = sign({ nome: user.name, isDev: user.isDev, interno: user.interno }, process.env.JWT_SECRET, {
        //subject: user.toString(),
        expiresIn: "1d",
      });
      delete user.password;
      return { user, token };
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  resetSenha: async (id_user: string) => {
    try {
      let user = await prismaClient.user.findFirst({ where: { id: parseInt(id_user) } });
      if (!user) return { message: "Usuário não cadastrado!" };
      else {
        const ano = new Date().getFullYear().toString();
        const newPassword = Encrypt.cryptPassword("urbam" + ano);
        prismaClient.user.update({ where: { id: user.id }, data: { password: newPassword, alterarSenha: true } });
        return true;
      }
    } catch {
      return false;
    }
  },
  alterarSenha: async (id_user: number, new_pass: string) => {
    try {
      let user = await prismaClient.user.findFirst({ where: { id: id_user } });
      if (!user) return { message: "Usuário não cadastrado!" };
      else {
        const password = await Encrypt.cryptPassword(new_pass);
        const res = await prismaClient.user.update({ where: { id: user.id }, data: { password, alterarSenha: false } });
        if (res) return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  },
};

export { AuthService };
