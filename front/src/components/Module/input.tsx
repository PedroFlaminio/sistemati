import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import { GetItemProp, SetItemProp } from "../../utils/functions";
import useModule from "./context";

export type InputProps = {
  field?: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  const { size = 1, field, label, className, value, disabled, onBlur, ...InputHTMLAttributes } = props;
  const col = "form-group col-" + size;
  const { item, setItem, mode, moduleErrors } = useModule();
  const [inputValue, setInputValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (field) {
      SetItemProp(item, field, e.target.value);
      //item[field] = e.target.value;
      setItem(item);
    }
    if (onBlur) onBlur(e)
    setInvalid(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className={col + " px-2"}>
      {label !== "" && (
        <label className="mb-0">
          <strong>{label}</strong>
        </label>
      )}
      <input
        {...InputHTMLAttributes}
        disabled={disabled || mode === "Delete" || mode === "View"}
        className={cx("form-control form-control-sm", className, { "is-invalid": !!invalid })}
        value={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
