import { Menu } from "./utils/types";

export const versao = "Versão: 1.1.0";

export const menus: Menu[] = [
  { label: "Minhas Solicitações ", path: "/minhasSolicitacoes" },
  { label: "Minhas Pendências", path: "/minhasPendencias", dev: true },
  { label: "Solicitações Pendentes", path: "/solicitacoesPendentes", roles: ["APROVADOR"] },
  { label: "Lista Completa", path: "/solicitacoes", roles: ["APROVADOR"] },
  { label: "Sistemas", path: "/sistemas", roles: ["APROVADOR"] },
  { label: "Devs", path: "/devs", roles: ["APROVADOR"] },
];

//DEV
// export const ApiBuildURL = "http://192.168.12.19/sistemati-api/";
// export const IntegratiBuildURL = "http://192.168.12.19/";

//HML
export const ApiBuildURL = "https://hml.utc.urbamsjc.com.br/sistemati-api/";
export const IntegratiBuildURL = "https://hml.utc.urbamsjc.com.br/";

//PRD
// export const ApiBuildURL = "https://utc.urbamsjc.com.br/sistemati-api/";
// export const IntegratiBuildURL = "https://utc.urbamsjc.com.br/";

const ApiStageURL = "http://localhost:8080/sistemati-api/";
//const ApiStageURL = "https://hml.utc.urbamsjc.com.br/sistemati-api/";
//const ApiStageURL = "http://192.168.12.19/sistemati-api/";
//export const IntegratiStageURL = "http://127.0.0.1:5173/";
export const IntegratiStageURL = "http://192.168.12.19/";

export const ApiURL = !process.env.NODE_ENV || process.env.NODE_ENV === "development" ? ApiStageURL : ApiBuildURL;
export const IntegratiURL = !process.env.NODE_ENV || process.env.NODE_ENV === "development" ? IntegratiStageURL : IntegratiBuildURL;
