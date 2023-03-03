export type User = {
  id: number;
  nome: string;
  username: string;
  email: string;
  matricula: number;
  alterarSenha?: boolean;
  interno: boolean;
  active: boolean;
  role: string;
  isDev?: boolean;
  isAdm?: boolean;
  accessToken?: string;
};

export type UserIntegrati = {
  id: number;
  nome: string;
  username: string;
  email: string;
  matricula: number;
  expoKey?: string;
  alterarSenha?: boolean;
  interno: boolean;
  active: boolean;
  acessos: AcessosUser[];

  sub?: string;
  exp?: number;
  iat?: number;
};
export type AcessosUser = {
  modulo: string;
  role: string;
};

export type UserResponse = {
  username: string;
  password: string;
  name: string;
  email: string;
  blocked: number;
};

export type Dev = {
  id: number;
  nome: string;
  matricula: number;
  ativo: boolean;
};

export type Sistema = {
  id: number;
  id_responsavel?: number;
  id_reserva?: number;
  nome: string;
  versao: string;
  banco: string;
  ip: string;
  ip_homolog: string;
  servidor: string;
  tecnologia: string;
  responsavel?: Dev;
  reserva?: Dev;
  ativo: boolean;
  solicitacoes: Solicitacao[];
};

export type Solicitacao = {
  id: number;
  id_sistema: number;
  id_dev: number;

  matricula?: number;
  username?: string;
  nome?: string;
  email?: string;

  celular: string;
  ramal: string;
  dataCriacao: Date;
  tipo: string;
  criticidade: string;
  titulo: string;
  reproduzivel: boolean;
  descricao: string;
  sugestao: string;
  area: string;
  encaminhado: string;
  comentarios: string;
  status: string;
  prioridade: string;
  complexidade: string;
  resolucao: string;
  resolvido_por: string;
  resolvido_em: Date;
  testado_por: string;
  testado_em: Date;
  deferido: boolean;
  sistema: Sistema;
  dev: Dev;
  arquivosDeleted?: number[];
  historicos: [];
  arquivos: [];
  prints?: [];
};
export type Email = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};
