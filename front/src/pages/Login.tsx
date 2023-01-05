import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoRodape from "../assets/logomarca_rodape.svg";
import useApi from "../context/ApiContext";
import useApp, { Modulo } from "../context/AppContext";
import logoLogin from "../assets/NovoLogo.png";
import popupWarning from "../assets/PopupWarning.png";
import { IoWarningOutline } from "react-icons/io5";

const Login = () => {
  const { login } = useApi();
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value);
  const handleMatricula = (e: React.ChangeEvent<HTMLInputElement>) => setMatricula(e.currentTarget.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(matricula, password, (user) => {
      if (user.alterarSenha) navigate("/alterarSenha");
      else navigate("/home");
    });
  };
  return (
    <>
      <div className="bg-login h-100 d-flex flex-column  justify-content-between align-items-center">
        <div></div>
        <div className="d-flex flex-column justify-content-between align-items-center">
          <img src={logoLogin} alt="logo" className="shadow" style={{ marginBottom: -65, zIndex: 10, height: 150, width: 150, borderRadius: 150 }} />
          <div className="">
            <form className="card border-light rounded px-4 shadow-lg" style={{ minWidth: 450, minHeight: 400, paddingTop: 100 }} onSubmit={handleSubmit}>
              <h2 className="text-center text-primary" style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 35 }}>
                Acesso ao Sistema
              </h2>
              <div className="form-group px-5">
                <label className="form-label text-primary fw-bold mt-4 mb-0">Usuário</label>
                <input type="text" className="form-control" placeholder="Entre com a usuário" onChange={handleMatricula} />
              </div>
              <div className="form-group px-5">
                <label className="form-label text-primary fw-bold mt-2 mb-0">Senha</label>
                <input type="password" className="form-control" placeholder="Entre com a senha" onChange={handlePassword} />
              </div>
              <button className="btn btn-bg btn-primary mt-4 mx-5 py-2 mb-5">ENTRAR</button>
            </form>
          </div>
        </div>
        <div className="d-flex flex-row my-3">
          <div className="border-right-white pe-4">
            <img src={logoRodape} alt="logo" style={{ height: 110, width: "auto", marginBottom: 10 }} />
          </div>
          <p className="d-flex flex-column text-white justify-content-center ps-4 mt-4 ">
            <span>Rua Ricardo Edwards, 100</span>
            <span>Vila Industrial - São José dos Campos - SP</span>
            <span>CEP: 12220-290</span>
            <span>Tel: +55 12 3908-6000</span>
          </p>
        </div>
      </div>
    </>
  );
};
export default Login;
