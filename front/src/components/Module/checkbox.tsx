import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";

type InputProps = {
  field: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
} & InputHTMLAttributes<HTMLInputElement>;

const Checkbox = (props: InputProps) => {
  const { size, field, label, className, value, disabled, type, ...InputHTMLAttributes } = props;
  const col = "form-group " + (size !== undefined ? "col-" + size : "col");
  const { item, setItem, mode } = useForm();
  const [inputValue, setInputValue] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    item[field] = e.target.checked;
    setItem(item);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.checked);
    item[field] = e.target.checked;
    setItem({ ...item });
  };
  useEffect(() => {
    setInputValue(item[field]);
  }, []);
  return (
    <div className={col + " mt-4 ms-1 form-check"}>
      <label className="mb-0 form-check-label">
        <strong>{label}</strong>
      </label>
      <input
        {...InputHTMLAttributes}
        type="checkbox"
        disabled={disabled || mode === "Delete"}
        className={cx("form-check-input")}
        checked={inputValue}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
};

export default Checkbox;
