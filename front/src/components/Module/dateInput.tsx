import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { dateTimeToStr, GetItemProp, SetItemProp } from "../../utils/functions";
import useModule from "./context";
import useApp from "../../context/AppContext";

export type DateInputProps = {
  field: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
  formatter?: (date: any) => string;
  setter?: (value: string) => any;
} & InputHTMLAttributes<HTMLInputElement>;

const DateInput = (props: DateInputProps) => {  
  const { size = 1, field, label, className, value, disabled, type, formatter, setter, ...InputHTMLAttributes } = props;
  const col = "form-group col-" + size;
  const { moduleErrors } = useModule();
  const { item, setItem, mode } = useForm();
  const [inputValue, setInputValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (setter) SetItemProp(item, field, setter(e.target.value));
    else SetItemProp(item, field, e.target.value);
    setItem(item);
    setInvalid(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    const aux = GetItemProp(item, field);
    if (formatter) setInputValue(formatter(aux));
    else setInputValue(aux);
  }, [item,setInputValue]);
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux);
  }, [moduleErrors]);
  return (
    <div className={col + " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label>
      <input
        {...InputHTMLAttributes}
        disabled={disabled || mode === "Delete" || mode === "View"}
        className={cx("form-control form-control-sm", className, { "is-invalid": !!invalid })}
        value={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
        type="date"
      />
    </div>
  );
};

export default DateInput;
