import Page from "../components/Page";
import logoUrbam from "../assets/logo_urbam.png";
import keyboard from "../assets/keyboard.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiURL } from "../configs";
import useApi from "../context/ApiContext";
import useApp from "../context/AppContext";

const Home = () => {
  const { usuario, loaded } = useApp();
  const [foto, setFoto] = useState();
  useEffect(() => {
    if (loaded)
      axios
        .get(`${ApiURL}foto/${usuario.matricula}`)
        .then((resp) => {
          console.log(resp.data);
          //console.log(resp);
          setFoto(resp.data);
        })
        .catch((error) => console.log(error));
  }, [loaded]);
  return (
    <Page>
      <div className="d-flex justify-content-end bg-white rounded border border-primary h-75 mt-5 container p-0">
        <div className="col-6 p-0 pt-5">
          <h1 className="text-primary home-title text-center mt-5">Sistema TI</h1>
          <h4 className="text-center my-3 pb-5">Sistema de gestão de chamados de Desenvolvimento.</h4>
          <div className="text-center mt-5"></div>
          <img
            src={`data:image/jpeg;base64,${foto}`}
            alt="Foto"
            style={{ width: 300, height: 300, borderRadius: 300, objectFit: "cover" }}
          />
        </div>
        <div className="col-6 bg-secondary p-0" style={{ backgroundImage: `url(${keyboard})`, backgroundSize: "cover" }}></div>
        {/* <img src={`data:image/jpeg;base64,${foto}`} alt="logotipo" /> */}
      </div>
    </Page>
  );
};
export default Home;
