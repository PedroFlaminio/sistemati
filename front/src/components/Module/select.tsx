import { SelectHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { GetItemProp, SetItemProp } from "../../utils/functions";

export type SelectProps = {
  field: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
  options: string[];
  values: any[];
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = (props: SelectProps) => {
  const { size = 0, options, field, label, className, value, disabled, ...SelectHTMLAttributes } = props;
  const { item, setItem, mode, moduleErrors } = useForm();
  const col = "form-group " + (size !== 0 ? "col-" + size : "col");
  const [selectValue, setSelectValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    const aux = GetItemProp(item, field);
    setSelectValue(aux);
    // setSelectValue(item[field])
    // if (item[field] === null || item[field] === undefined) {
    //   item[field] = "";
    //   setItem(item);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    SetItemProp(item, field, e.target.value);
    setItem({ ...item });
    setSelectValue(e.target.value);
    setInvalid(false);
    if (props.onChange) props.onChange(e);
  };
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleErrors]);
  return (
    <div className={col + " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label>
      <select
        {...SelectHTMLAttributes}
        disabled={disabled || mode === "Delete" || mode === "View"}
        className={cx("form-select form-select-sm  pe-0", className, { "is-invalid": !!invalid })}
        placeholder="Selecione"
        onChange={handleChange}
        value={selectValue}
      >
        {/* <option value=""></option> */}
        {options.map((option, index) => (
          <option value={props.values[index]} key={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
