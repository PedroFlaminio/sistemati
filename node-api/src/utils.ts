import * as bcrypt from "bcrypt";
import { decode } from "jsonwebtoken";
import { User, UserIntegrati } from "./types";
import jwtDecode from "jwt-decode";

export const Encrypt = {
  cryptPassword: (password: string) =>
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => hash),

  comparePassword: (password: string, hashPassword: string) => bcrypt.compare(password, hashPassword).then((resp) => resp),
};

export const getUserId = (auth: string) => jwtDecode<UserIntegrati>(auth.replace("Bearer ", "")).id;
export const getUserName = (auth: string) => jwtDecode<UserIntegrati>(auth.replace("Bearer ", "")).username;
export const getRoleModulo = (auth: string, modulo: string) =>
  jwtDecode<UserIntegrati>(auth.replace("Bearer ", "")).acessos.find((a) => a.modulo === modulo).role || "";
export const getUser = (auth: string) => {
  const decoded = jwtDecode<UserIntegrati>(auth);
  const { sub, exp, iat, expoKey, ...otheProps } = decoded;
  const role = decoded.acessos.find((m) => m.modulo === "sistemati")?.role || "USUARIO";
  const user: User = { ...otheProps, role };
  return user;
  // (decode(auth.replace("Bearer ", "")) as { user_id: string; nome: string; iat: number; exp: number }).nome;
};
export const getTokenEmail = () => Math.random().toString(36).slice(2).substring(2, 6).toUpperCase();
export const dateBrToEua = (stringDate: string) => {
  if (stringDate === null || stringDate === undefined || stringDate === "") return "";
  let result = "";
  let strings = stringDate.split("/");
  result += strings[2];
  result += "-";
  result += strings[1];
  result += "-";
  result += strings[0];
  return result;
};

//ENTRADA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
//SAIDA: 2001-01-01
export const dateToString = (date: Date) => {
  if (date === undefined || date === null) return "";
  let result = "";
  result += date.getFullYear();
  result += "-";
  result += (date.getMonth() + 1).toString().padStart(2, "0");
  result += "-";
  result += date.getDate().toString().padStart(2, "0");
  return result;
};
//ENTRADA: 2001-01-01
//SAIDA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
export const stringToDate = (dateStr: string) => {
  if (dateStr === undefined || dateStr === null || dateStr === "") return undefined;
  const splited = dateStr.split("-");
  const result = new Date(parseInt(splited[0]), parseInt(splited[1]) - 1, parseInt(splited[2]));
  return result;
};
