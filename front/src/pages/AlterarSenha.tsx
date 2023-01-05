import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoRodape from '../assets/logomarca_rodape.svg';
import useApi from "../context/ApiContext";
import useApp from "../context/AppContext";
import logoLogin from "../assets/NovoLogo.png";

const AlterarSenha = () => {
  const {alterarSenha} = useApi();
  const {usuario} = useApp();
  const navigate = useNavigate();
  const [confirmacao, setConfirmacao] = useState("");
  const [password, setPassword] = useState("");
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };
  const handleConfirmacao = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmacao(e.currentTarget.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (password ==="")
      alert("Insira uma nova senha!")  
    else if (password !== confirmacao) {
      alert("Senha divergente da confirmação!") 
      setPassword("");
      setConfirmacao("");
    }
    else alterarSenha(usuario.id,password,()=> {
      navigate("/home")
    })
  };
  return (
    <>
      <div className="bg-login h-100 d-flex flex-column  justify-content-between align-items-center">
        <div></div>
        <div className="d-flex flex-column  justify-content-between align-items-center">
          <img src={logoLogin} alt="logo" className="shadow" style={{ marginBottom: -65, zIndex: 10, height: 150, width: 150, borderRadius: 150 }} />
          <div className="">
            <form className="card border-light rounded px-4 shadow-lg" style={{ minWidth: 450, minHeight: 400, paddingTop: 100 }} onSubmit={handleSubmit}>
              <h2 className="text-center text-primary" style={{ fontFamily: "Oswald", fontWeight: 700, fontSize: 35 }}>
                Alterar Senha
              </h2>
              <div className="form-group px-5">
                <label className="form-label text-primary fw-bold mt-4">Nova Senha</label>
                <input type="password" className="form-control" placeholder="Entre com a senha" value={password} onChange={handlePassword} />
              </div>
              <div className="form-group px-5">
                <label className="form-label text-primary fw-bold mt-2">Confirmação Nova Senha</label>
                <input type="password" className="form-control" placeholder="Entre com a senha novamente" value={confirmacao} onChange={handleConfirmacao} />
              </div>
              <button className="btn btn-bg btn-primary mt-4 mx-5 py-2">ENTRAR</button>
            </form>
          </div>
        </div>
        <div className="d-flex flex-row my-3">
          <div className="border-right-white pe-4">
            <img src={logoRodape} alt="logo"  style={{ height: 110, width: "auto", marginBottom: 10 }} />
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
export default AlterarSenha;
