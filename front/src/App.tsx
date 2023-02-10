import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./theme/app.scss";
import { setEnterAsTab } from "./utils/functions";
import useApp, { AppContextProvider } from "./context/AppContext";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import Login from "./pages/Login";
import { ApiContextProvider } from "./context/ApiContext";
import AlertTemplate from "./components/AlertTemplate";
import AlterarSenha from "./pages/AlterarSenha";
import Devs from "./pages/Desenvolvedores";
import Sistemas from "./pages/Sistemas";
import Solicitacoes from "./pages/Solicitacoes";
const options = {
  position: positions.TOP_CENTER,
  timeout: 5000, //5sec
  offset: "30px",
  transition: transitions.SCALE,
};

function App() {
  setEnterAsTab();
  return (
    <AppContextProvider>
      <div className="App">
        <Rotas />
      </div>
    </AppContextProvider>
  );
}

const Rotas = () => {
  const { loading } = useApp();
  const basename = "sistemati";
  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter basename={basename}>
        <AlertProvider template={AlertTemplate} {...options}>
          <ApiContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login/:jwt" element={<Login />} />
              <Route path="/alterarSenha" element={<AlterarSenha />} />
              <Route path="/devs" element={<Devs />} />
              <Route path="/sistemas" element={<Sistemas />} />
              <Route path="/solicitacoes/:id" element={<Solicitacoes tipo="Pendentes" />} />
              <Route path="/minhasSolicitacoes" element={<Solicitacoes tipo="Minhas" />} />
              <Route path="/solicitacoes" element={<Solicitacoes tipo="Pendentes" />} />
              <Route path="/solicitacoesResolvidas" element={<Solicitacoes tipo="Resolvidas" />} />
            </Routes>
          </ApiContextProvider>
        </AlertProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
