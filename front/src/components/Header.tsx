import { useNavigate, useLocation } from "react-router-dom";
import { menus, versao } from "../configs";
import useApp from "../context/AppContext";
import DropDownButton from "./Module/dropdownButton";
import DropDownItem from "./Module/dropdownItem";
import logo from "../assets/NovoLogo.png";
import logoSistemati from "../assets/sistemati-logo.png";
import useModule from "./Module/context";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOff, usuario } = useApp();
  const { setMode } = useModule();
  const handleSair = () => {
    signOff();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary header no-print">
      <img src={logo} width="40" alt="logo" className="m-1" />
      <div className="d-flex flex-column">
        <button className="header-title bg-primary border-0" onClick={() => navigate("/")}>
          <img src={logoSistemati} height={32} alt="logo aproximati" className="m-1" />
        </button>
        <span className="pill" style={{ marginTop: -8 }}>
          {versao}
        </span>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {menus.map((menu, i) => {
            if (menu.path && (!menu.roles || menu.roles.indexOf(usuario.role) > -1))
              return (
                <li
                  className="nav-item"
                  onClick={() => {
                    navigate(menu.path || "");
                    if (setMode) setMode("List");
                  }}
                  key={i}
                >
                  <button className={`btn btn-link nav-link ${location.pathname === menu.path ? "active" : ""}`}>{menu.label}</button>
                </li>
              );
            else if (menu.submenu)
              return (
                <li className="nav-item" key={i}>
                  <DropDownButton label={menu.label} className={`btn btn-link nav-link ${location.pathname === menu.path ? "active" : ""}`}>
                    <DropDownItem label="Enviar Aprovação" />
                  </DropDownButton>
                </li>
              );
          })}
        </ul>

        <ul className="navbar-nav">
          <li className="nav-item pe-5 me-5">
            <DropDownButton label={usuario.nome} className="btn btn-link nav-link">
              <DropDownItem label="Sair" onClick={handleSair} />
            </DropDownButton>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
