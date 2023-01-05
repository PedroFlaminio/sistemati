import { TextareaHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { GetItemProp } from "../../utils/functions";

type InputProps = {
  field?: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
  divClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = (props: InputProps) => {
  const { size = 1, field, label, className, value, disabled, ...InputHTMLAttributes } = props;
  const col = "form-group " + size ? "col-" + size : "col-auto";
  const { item, setItem, mode, moduleErrors } = useForm();
  const [inputValue, setInputValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    if (field) {
      item[field] = e.target.value;
      setItem(item);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (typeof value === "string") setInputValue(value);
    else if (field) {
      const aux = GetItemProp(item, field);
      if ((aux === null || aux === undefined) && !field.includes(".")) {
        setInputValue("");
        item[field] = "";
        setItem(item);
      } else setInputValue(aux);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleErrors]);
  return (
    <div className={props.divClassName ? props.divClassName : col + " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label>
      <textarea
        {...InputHTMLAttributes}
        disabled={disabled || mode === "Delete" || mode === "View"}
        className={cx("form-control form-control-sm", className, { "is-invalid": !!invalid })}
        defaultValue={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
        rows={5}
      />
    </div>
  );
};

export default TextArea;
