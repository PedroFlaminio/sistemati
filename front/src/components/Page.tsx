import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useApp from "../context/AppContext";

type PageProps = {
  children: ReactNode;
};
const Page = (props: PageProps) => {
  const { verificaUser, loaded } = useApp();
  const navigate = useNavigate();
  const { children } = props;
  useEffect(() => {
    if (loaded) {
      if (verificaUser()) return;
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
  return (
    <div className="d-flex flex-column bg-light" style={{ height: "100vh" }}>
      <Header />
      <div className={`p-5 pt-3 bg-light h-100  rounded`}>{children}</div>
    </div>
  );
};

export default Page;
