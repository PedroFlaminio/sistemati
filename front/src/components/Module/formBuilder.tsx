import { BsInputCursorText, BsListCheck, BsTextareaResize, BsUiRadios } from "react-icons/bs";
import SelectIcon from "../../assets/formbuilder/Select.svg";
import NumberIcon from "../../assets/formbuilder/Number.svg";
const FormBuilder = () => {
  const TiposBotoes = {
    "checkbox-group": {
      title: "Grupo de Seleção",
      icon: <BsListCheck size={18} className={"me-2 mb-1"} />,
      className: "rounded-top-right",
    },
    number: {
      title: "Número",
      icon: <img src={NumberIcon} alt="Select" className={"me-2 mb-1 fb-icon"} />,
      className: "",
    },
    "radio-group": {
      title: "Grupo de Opções",
      icon: <BsUiRadios size={18} className={"me-2 mb-1"} />,
      className: "",
    },
    select: {
      title: "Seleção",
      icon: <img src={SelectIcon} alt="Select" className={"me-2 mb-1 fb-icon"} />,
      className: "",
    },
    text: {
      title: "Campo de Texto",
      icon: <BsInputCursorText size={18} className={"me-2 mb-1"} />,
      className: "",
    },
    textarea: {
      title: "Área de Texto",
      icon: <BsTextareaResize size={18} className={"me-2 mb-1"} />,
      className: "rounded-bottom-right",
    },
  };
  const Option = (props: { tipo: "checkbox-group" | "select" | "number" | "radio-group" | "textarea" | "text" }) => {
    const { tipo } = props;
    const btn = TiposBotoes[tipo];
    return (
      <div className={`bg-white p-2 fb-option ${btn.className}`}>
        {btn.icon}
        {btn.title}
      </div>
    );
  };
  return (
    <div className="bg-light rounded p-4">
      <div className="d-flex flex-row">
        <div className="formbuilder-fields-empty">
          <span>Adicione campos arrastando ou utilize o duplo clique.</span>
        </div>
        <div className="fb-frame">
          <Option tipo="checkbox-group" />
          <Option tipo="number" />
          <Option tipo="radio-group" />
          <Option tipo="select" />
          <Option tipo="text" />
          <Option tipo="textarea" />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
