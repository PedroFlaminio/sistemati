import { Encrypt, getUserId } from "./../utils";
import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";

const AuthController = {
  signin: async (request: Request, response: Response) => {
    try {
      const { username, password } = request.body;
      const result = await AuthService.loginUsuario(username.toUpperCase(), password);
      if (result) {
        if (result.message) return response.status(203).json({ message: result.message });
        else return response.json(result);
      } else return response.status(400).json({ message: "Erro ao fazer login." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao fazer login." });
    }
  },
  alterarSenha: async (request: Request, response: Response) => {
    try {
      const { new_pass } = request.body;
      const id_user = parseInt(getUserId(request.headers.authorization));
      const result = await AuthService.alterarSenha(id_user, new_pass);
      if (result) return response.status(200).json({ message: "Sucesso ao alterar senha." });
      else return response.status(400).json({ message: "Erro ao alterar senha." });
    } catch (err) {
      return response.status(400).json({ message: "Erro ao alterar senha." });
    }
  },
  resetSenha: async (request: Request, response: Response) => {
    try {
      const id_user = getUserId(request.headers.authorization);
      const result = await AuthService.resetSenha(id_user);
      const ano = new Date().getFullYear().toString();
      if (result === true)
        return response.status(200).json(`Senha alterada com sucesso!\u00A0\u00A0\u00A0\u00A0
      Nova senha: urbam${ano}`);
      else if (typeof result !== "boolean") return response.status(400).json({ message: result.message });
      else return response.status(200).json({ message: "Erro ao confirmar token." });
    } catch (err) {
      return response.json({ error: err.message });
    }
  },
};

export { AuthController };
