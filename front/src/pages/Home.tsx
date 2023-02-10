import Page from "../components/Page";
import logoUrbam from "../assets/logo_urbam.png";
import keyboard from "../assets/keyboard.jpg";

const Home = () => {
  return (
    <Page>
      <div className="d-flex justify-content-end bg-white rounded border border-primary h-75 mt-5 container p-0">
        <div className="col-6 p-0 pt-5">
          <h1 className="text-primary home-title text-center mt-5">Sistema TI</h1>
          <h4 className="text-center my-3 pb-5">Sistema de gestão de chamados de Desenvolvimento.</h4>
          <div className="text-center mt-5">
            <img src={logoUrbam} alt="logotipo" />
          </div>
        </div>
        <div className="col-6 bg-secondary p-0" style={{ backgroundImage: `url(${keyboard})`, backgroundSize: "cover" }}></div>
      </div>
    </Page>
  );
};
export default Home;
