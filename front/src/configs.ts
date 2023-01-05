export const versao = "Versão: 1.1.0";
type Menu = {
  label: string;
  path?: string;
  submenu?: [{ label: string; path: string }];
  roles?: string[];
};
export const menus: Menu[] = [
  { label: "Solicitações", path: "/solicitacoes" },
  { label: "Sistemas", path: "/sistemas" },
  { label: "Devs", path: "/devs" },
  { label: "Usuarios", path: "/usuarios" },
];

export const ApiURL = "http://192.168.12.18/sistemati-api/";
export const ApiStageURL = "http://localhost:8080/sistemati-api";
