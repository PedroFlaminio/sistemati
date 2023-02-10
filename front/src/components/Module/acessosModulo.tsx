import { AcessosUser } from "../../utils/types";
import useModule from "./context";

type AcessosModuloProps = {
  modulo: { key: string; label: string; acessos: string[] };
};
const AcessosModulo = (props: AcessosModuloProps) => {
  const { modulo } = props;
  const { item } = useModule();

  const CheckBoxAcesso = (props: { modulo: string; acao: string }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (item.acessos?.find((a: AcessosUser) => a.modulo === props.modulo && a.role === props.acao)) {
        item.acessos = item.acessos.filter((a: AcessosUser) => a.modulo !== props.modulo || a.role !== props.acao);
      } else {
        if (!item.acessos) item.acessos = [];
        item.acessos.push({ modulo: props.modulo, acao: props.acao });
      }
    };
    return (
      <div className="form-check form-switch" key={props.modulo + "_" + props.acao}>
        <input className="form-check-input" name="Entrada" type="checkbox" onChange={handleChange} />
        <label className="form-check-label">
          <strong>{props.acao}</strong>
        </label>
      </div>
    );
  };
  return (
    <div className="row mx-1">
      <div className="card bg-light rounded-0 p-0 m-1 col-block">
        <div className="card-header bg-primary text-white rounded-0 text-center">
          <strong>{modulo.label}</strong>
        </div>
        <div className="card-body">
          {modulo.acessos.map((a, i) => (
            <CheckBoxAcesso acao={a} modulo={props.modulo.key} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcessosModulo;
