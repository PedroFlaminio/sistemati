export type User = {
  id: number;
  name: string;
  username: string;
  matricula: number;
  password?: string;
  alterarSenha: boolean;
  interno: boolean;
  active: boolean;
  role: string;
  accessToken?: string;
};

export type AcessosUser = {
  id: number;
  id_user: number;
  modulo: string;
  acao: string;
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
  id_responsavel: number;
  id_reserva: number;
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
  usuario: string;
  dataCriacao: Date;
  tipo: string;
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
};
