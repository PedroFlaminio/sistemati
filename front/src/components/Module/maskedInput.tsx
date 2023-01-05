import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { GetItemProp } from "../../utils/functions";
import InputMask from "react-input-mask";

type InputProps = {
  field?: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
  mask: "cnpj" | "cpf" | "cep" | "tel" | "cel";
} & InputHTMLAttributes<HTMLInputElement>;

const MaskedInput = (props: InputProps) => {
  const { size = 1, field, label, className, value, disabled, ...InputHTMLAttributes } = props;
  const col = "form-group col-" + size;
  const { item, setItem, mode, moduleErrors } = useForm();
  const [inputValue, setInputValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const maskStr = () => {
    switch (props.mask) {
      case "cel":
        return "(99)99999-9999";
      case "cep":
        return "99999-999";
      case "cnpj":
        return "99.999.999/9999-99";
      case "cpf":
        return "999.999.999-99";
      default:
        return "(99)9999-9999";
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (field) {
      item[field] = e.target.value;
      setItem(item);
    }
    setInvalid(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (typeof value === "string") setInputValue(value);
    else if (field){
      const aux = GetItemProp(item, field);
      if (aux === null || aux === undefined) {
        setInputValue("");
        item[field] = "";
        setItem(item);
      }
      else
        setInputValue(aux);
    }

  }, []);  
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux)
  }, [moduleErrors]);

  return (
    <div className={col + " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label> 
      <InputMask 
        mask={maskStr()} 
        className={cx("form-control form-control-sm", { "is-invalid": !!invalid }, className)}      
        disabled={disabled || mode === "Delete" || mode === "View"}
        value={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
      /> 
    </div>
  );
};

export default MaskedInput;
