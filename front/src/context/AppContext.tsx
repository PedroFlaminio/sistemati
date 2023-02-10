import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../utils/types";
import { clearData, isJwtExpired } from "../utils/functions";
export type Modulo = "chamados" | "emprestimos";

export type Item = {
  label: string;
  value: string;
};
type AppType = {
  loaded: boolean;
  showModal: boolean;
  loading: boolean;
  setLoading: (active: boolean) => void;

  openModal: () => void;
  closeModal: () => void;

  usuario: User;
  setUsuario: (usuario: User) => void;
  signOff: () => void;
  verificaUser: () => boolean;
};
export const AppContext = createContext({} as AppType);

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = (props: AppContextProviderProps) => {
  const [loading, setLoad] = useState(false);
  const [showModal, setShowMod] = useState(false);
  const [usuario, setUser] = useState<User>({ matricula: 0 } as User);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let JSONObject = localStorage.getItem("usuario-sistemati");
    if (JSONObject !== null) {
      setUser(JSON.parse(JSONObject));
    }
    setLoaded(true);
  }, []);
  const setUsuario = (usuario: User) => {
    setUser(usuario);
    localStorage.setItem("usuario-sistemati", JSON.stringify(usuario));
  };
  const setLoading = (active: boolean) => {
    setLoad(active);
  };
  const verificaUser = () => {
    console.log(usuario);
    if (!isJwtExpired(usuario.accessToken || "")) return true;
    else {
      clearData();
      return false;
    }
  };
  const openModal = () => {
    setShowMod(true);
    setLoad(false);
  };
  const signOff = () => {
    setUser({} as User);
    clearData();
  };
  const closeModal = () => setShowMod(false);
  useEffect(() => {}, []);
  return (
    <AppContext.Provider
      value={{
        showModal,
        openModal,
        closeModal,
        usuario,
        setUsuario,
        signOff,
        loading,
        setLoading,
        verificaUser,
        loaded,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const value = useContext(AppContext);
  return value;
};

export default useApp;
