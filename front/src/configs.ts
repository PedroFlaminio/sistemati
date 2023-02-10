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
//export const menu: Menu[] = [{ label: "Solicitações ", path: "/solicitacoesbyuser" }];

export const ApiURL = "http://192.168.12.18/sistemati-api/";
export const IntegratiURL = "https://hml.utc.urbamsjc.com.br/";
// export const ApiStageURL = "http://localhost:8080/sistemati-api";

//export const ApiURL = "http://localhost:5000/sistemati-api/";
export const ApiStageURL = "http://localhost:8080/sistemati-api/";
