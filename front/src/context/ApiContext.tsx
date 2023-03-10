import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User, Dev, Sistema, Solicitacao, Email } from "../utils/types";
import useApp, { Modulo } from "./AppContext";
import { useAlert } from "react-alert";
import { ModuleItem } from "../components/Module/context";
import axios from "axios";
import { ApiURL, IntegratiURL } from "../configs";
import { clearData } from "../utils/functions";
import { useNavigate } from "react-router-dom";

type ApiType = {
  setToken: (token: string) => void;
  //AUTH
  login: (username: string, password: string, callback: (user: User) => any) => void;
  logout: (callback: () => any) => void;
  alterarSenha: (id: number, password: string, callback: () => any) => void;
  resetarSenha: (id: number) => void;
  //DEVS
  getDevs: (callback: (list: Dev[]) => any) => Promise<void>;
  getDevsAtivos: (callback: (list: Dev[]) => any) => Promise<void>;
  postDev: (dev: Dev, callback: () => any) => Promise<void>;
  putDev: (dev: Dev, callback: () => any) => Promise<void>;
  deleteDev: (dev: Dev, callback: () => any) => Promise<void>;
  //SISTEMAS
  getSistemas: (callback: (list: Sistema[]) => any) => Promise<void>;
  getSistemasAtivos: (callback: (list: Sistema[]) => any) => Promise<void>;
  postSistema: (dev: Sistema, callback: () => any) => Promise<void>;
  putSistema: (dev: Sistema, callback: () => any) => Promise<void>;
  deleteSistema: (dev: Sistema, callback: () => any) => Promise<void>;
  //SOLICITACOES
  getSolicitacaoById: (id: number, callback: (solicitacao: Solicitacao) => any) => Promise<void>;
  getSolicitacoes: (callback: (list: Solicitacao[]) => any) => Promise<void>;
  getSolicitacoesAguardando: (callback: (list: Solicitacao[]) => any) => Promise<void>;
  getSolicitacoesPendentes: (callback: (list: Solicitacao[]) => any) => Promise<void>;
  getSolicitacoesResolvidas: (callback: (list: Solicitacao[]) => any) => Promise<void>;
  getSolicitacoesByUser: (callback: (list: Solicitacao[]) => any) => Promise<void>;
  getSolicitacoesByDev: (matricula: number, callback: (list: Solicitacao[]) => any) => Promise<void>;
  postSolicitacao: (dev: FormData, callback: () => any) => Promise<void>;
  putSolicitacao: (dev: FormData, callback: () => any) => Promise<void>;
  deleteSolicitacao: (dev: Solicitacao, callback: () => any) => Promise<void>;
  cancelarSolicitacao: (id: number, callback: () => any) => Promise<void>;
  aprovarSolicitacao: (id: number, callback: () => any) => Promise<void>;
  encaminharSolicitacao: (id: number, id_dev: number, callback: () => any) => Promise<void>;
  //USUARIO
  getUsuarios: (callback: (item: User[]) => any) => void;
  getUsuarioById: (id: number, callback: (userProps: { username: string; name: string }) => void) => void;
  inativaUsuarioById: (id: number, callback: () => void) => void;
  ativaUsuarioById: (id: number, callback: () => void) => void;
  getUsuarioByMatricula: (matricula: string, callback: (userProps: { username: string; name: string }) => void) => void;
  postUsuario: (user: User, callback: () => any) => void;
  putUsuario: (user: User, callback: () => any) => void;
  deleteUsuario: (user: User, callback: () => any) => void;
  listaLideres: (callback: (item: ModuleItem[]) => any) => void;
  alterarSenhaUsuario: (id_user: number) => void;

  //E-MAIL
  postEmail: (email: Email, callback: () => any) => void;

  loaded: boolean;
};
export const ApiContext = createContext({} as ApiType);

type ApiContextProviderProps = {
  children: ReactNode;
};

export const ApiContextProvider = (props: ApiContextProviderProps) => {
  const { setLoading, setUsuario } = useApp();
  const alert = useAlert();
  const [accessToken, setAccessToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let JSONObject = localStorage.getItem("token-sistemati");
    if (JSONObject !== null) {
      setAccessToken(JSON.parse(JSONObject).token);
    }
    setLoaded(true);
  }, []);
  const setToken = (token: string) => {
    setAccessToken(token);
    localStorage.setItem("token-sistemati", JSON.stringify({ token }));
  };
  const api = axios.create({
    baseURL: ApiURL,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      var status = error.response.status;
      var resBaseURL = error.response.config.baseURL;
      if (resBaseURL === ApiURL && (status === 401 || status === 403)) {
        clearData();
        window.location.href = IntegratiURL + "logoff";
      }
      return Promise.reject(error);
    }
  );
  //AUTH
  const login = (username: string, password: string, callback: (user: User) => any) => {
    setLoading(true);
    api
      .post("signin", { username, password })
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          const { user, token } = resp.data;
          setToken(token);
          user.accessToken = token;
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
          setUsuario(user);
          callback(user);
        } else {
          if (resp.data.message) alert.error(resp.data.message);
          else alert.error("Erro o acessar servidor");
        }
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
        setLoading(false);
      });
  };
  const logout = (callback: () => any) => {
    setLoading(true);
    api
      .get("auth/signout")
      .then((resp) => {
        if (resp.status === 200) callback();
        else alert.error(resp.data);
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data);
        else alert.error("Erro o acessar servidor");
        setLoading(false);
      });
  };
  const alterarSenha = (id: number, password: string, callback: () => any) => {
    setLoading(true);
    api
      .put("alterarSenha", { new_pass: password })
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data.message) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  //DEVS
  const getDevs = async (callback: (list: Dev[]) => {}) => {
    setLoading(true);
    api
      .get("devs")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getDevsAtivos = async (callback: (list: Dev[]) => {}) => {
    setLoading(true);
    api
      .get("devsAtivos")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const postDev = async (dev: Dev, callback: () => any) => {
    setLoading(true);
    api
      .post("devs", dev)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const putDev = async (dev: Dev, callback: () => any) => {
    setLoading(true);
    api
      .put("devs/", dev)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const deleteDev = async (dev: Dev, callback: () => any) => {
    setLoading(true);
    api
      .delete("devs/" + dev.id)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  //SISTEMAS
  const getSistemas = async (callback: (list: Sistema[]) => {}) => {
    setLoading(true);
    api
      .get("sistemas")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSistemasAtivos = async (callback: (list: Sistema[]) => {}) => {
    setLoading(true);
    api
      .get("sistemasAtivos")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const postSistema = async (local: Sistema, callback: () => any) => {
    setLoading(true);
    api
      .post("sistemas", local)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const putSistema = async (local: Sistema, callback: () => any) => {
    setLoading(true);
    api
      .put("sistemas/", local)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const deleteSistema = async (local: Sistema, callback: () => any) => {
    setLoading(true);
    api
      .delete("sistemas/" + local.id)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  //SOLICITA????ES
  const getSolicitacaoById = async (id: number, callback: (solicitacao: Solicitacao) => any) => {
    setLoading(true);
    api
      .get("solicitacoes/" + id.toString())
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoes = async (callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoes")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoesAguardando = async (callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoesAguardando")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoesPendentes = async (callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoesPendentes")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoesResolvidas = async (callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoesResolvidas")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoesByUser = async (callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoesByUser")
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getSolicitacoesByDev = async (matricula: number, callback: (list: Solicitacao[]) => {}) => {
    setLoading(true);
    api
      .get("solicitacoesByDev/" + matricula.toString())
      .then((resp) => {
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const postSolicitacao = async (solicitacao: FormData, callback: () => any) => {
    setLoading(true);
    api
      .post("solicitacoes", solicitacao)
      .then((resp) => {
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const putSolicitacao = async (solicitacao: FormData, callback: () => any) => {
    setLoading(true);
    api
      .put("solicitacoes", solicitacao)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const deleteSolicitacao = async (solicitacao: Solicitacao, callback: () => any) => {
    setLoading(true);
    api
      .put("solicitacoes/", solicitacao)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const cancelarSolicitacao = async (id: number, callback: () => any) => {
    setLoading(true);
    api
      .get("solicitacoes/cancelar/" + id.toString())
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const aprovarSolicitacao = async (id: number, callback: () => any) => {
    setLoading(true);
    api
      .put("solicitacoes/aprovar/" + id.toString())
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const encaminharSolicitacao = async (id_dev: number, id_solicitacao: number, callback: () => any) => {
    setLoading(true);
    api
      .put("solicitacoes/encaminhar", { id_dev, id_solicitacao })
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  //USUARIO
  const getUsuarios = (callback: (itens: User[]) => {}) => {
    setLoading(true);
    callback([]);
    api
      .get("usuarios")
      .then((resp) => {
        setLoading(false);
        callback(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getUsuarioById = (id: number, callback: (userProps: { username: string; name: string }) => void) => {
    setLoading(true);
    api
      .get("usuarios/id/" + id)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          callback(resp.data);
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const getUsuarioByMatricula = (matricula: string, callback: (userProps: { username: string; name: string }) => void) => {
    setLoading(true);
    api
      .get("usuarios/matricula/" + matricula)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          callback(resp.data);
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const postUsuario = (user: User, callback: () => any) => {
    setLoading(true);
    api
      .post("usuarios", user)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const putUsuario = (user: User, callback: () => any) => {
    setLoading(true);
    api
      .put("usuarios", user)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const deleteUsuario = (user: User, callback: () => any) => {
    setLoading(true);
    api
      .delete("api/usuario/deletar/" + user.id)
      .then((resp) => {
        setLoading(false);
        alert.success(resp.data);
        callback();
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const listaLideres = (callback: (itens: ModuleItem[]) => {}) => {
    setLoading(true);
    callback([]);
    api
      .get("api/usuario/listar-lideres")
      .then((resp) => {
        setLoading(false);
        let newUsuarios: User[] = [];
        for (let index = 0; index < resp.data.length; index++) {
          newUsuarios.push({ ...resp.data[index] });
        }
        callback(newUsuarios);

        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const resetarSenha = (id: number) => {
    setLoading(true);
    api
      .get("resetSenha")
      .then((resp) => {
        setLoading(false);
        alert.success(resp.data);
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const inativaUsuarioById = (id: number, callback: () => void) => {
    setLoading(true);
    api
      .get("usuarios/inativar/" + id)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const ativaUsuarioById = (id: number, callback: () => void) => {
    setLoading(true);
    api
      .get("usuarios/ativar/" + id)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback();
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 400 && error.response.data) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const alterarSenhaUsuario = (id_user: number) => {
    setLoading(true);
    api
      .get("usuarios/resetSenha/" + id_user)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data.message) alert.error(error.response.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  const postEmail = (email: any, callback: (list: Email) => {}) => {
    setLoading(true);
    api
      .post("email", email)
      .then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          alert.success(resp.data.message);
          callback(resp.data);
        }
        if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") console.log(resp.data);
      })
      .catch((error) => {
        setLoading(false);
        if (error.resp.data.status === 400 && error.resp.data) alert.error(error.resp.data.message);
        else alert.error("Erro o acessar servidor");
      });
  };
  return (
    <ApiContext.Provider
      value={{
        setToken,
        //AUTH
        loaded,
        login,
        logout,
        alterarSenha,
        //DEVS
        getDevs,
        getDevsAtivos,
        postDev,
        putDev,
        deleteDev,
        //SISTEMAS
        getSistemas,
        getSistemasAtivos,
        postSistema,
        putSistema,
        deleteSistema,
        //SOLICITACOES
        getSolicitacaoById,
        getSolicitacoes,
        getSolicitacoesAguardando,
        getSolicitacoesPendentes,
        getSolicitacoesResolvidas,
        getSolicitacoesByUser,
        getSolicitacoesByDev,
        postSolicitacao,
        putSolicitacao,
        deleteSolicitacao,
        cancelarSolicitacao,
        aprovarSolicitacao,
        encaminharSolicitacao,
        //USUARIO
        getUsuarios,
        postUsuario,
        putUsuario,
        deleteUsuario,
        resetarSenha,
        getUsuarioById,
        getUsuarioByMatricula,
        listaLideres,
        ativaUsuarioById,
        inativaUsuarioById,
        alterarSenhaUsuario,
        //E-MAIL
        postEmail,
      }}
    >
      {props.children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const value = useContext(ApiContext);
  return value;
};

export default useApi;
