import jwtDecode, { JwtPayload } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IntegratiURL } from "../configs";
import useApi from "../context/ApiContext";
import useApp from "../context/AppContext";
import { User, UserIntegrati } from "../utils/types";

const Login = () => {
  const { jwt } = useParams();
  const navigate = useNavigate();
  const { setToken, loaded } = useApi();
  const { setUsuario } = useApp();

  useEffect(() => {
    if (jwt && loaded) {
      const converted = jwt.replaceAll("|", ".");
      setToken(converted);
      const decoded = jwtDecode<UserIntegrati>(converted);
      const { sub, exp, iat, expoKey, ...otheProps } = decoded;
      const currentTime = new Date().getTime() / 1000;
      if (decoded.exp && currentTime > decoded.exp) {
        navigate(IntegratiURL);
      } else {
        const role = decoded?.acessos.find((m) => m.modulo === "sistemati")?.role || "USUARIO";
        const user: User = { ...otheProps, role, accessToken: converted };
        setUsuario(user);
        navigate("/");
      }
    }
  }, [loaded]);
  //setToken(jwt)

  return <></>;
};

export default Login;
