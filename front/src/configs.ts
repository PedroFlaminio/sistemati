export const versao = "Versão: 1.1.0";
type Menu = {
  label: string;
  path?: string;
  submenu?: [{ label: string; path: string }];
  roles?: string[];
};
export const menus: Menu[] = [
  { label: "Minhas Solicitações ", path: "/minhasSolicitacoes" },
  { label: "Solicitações Pendentes", path: "/solicitacoes" },
  { label: "Solicitações Resolvidas", path: "/solicitacoesResolvidas" },
  { label: "Sistemas", path: "/sistemas" },
  { label: "Devs", path: "/devs" },
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
