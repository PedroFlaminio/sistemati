import { SelectHTMLAttributes } from "react";
import cx from "classnames";

type FilterSelectProps = {
  label: string;
  options: string[];
  values: string[];
  divClassNameAdd?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const FilterSelect = (props: FilterSelectProps) => {
  const { options, values, label, className, divClassNameAdd = "", ...SelectHTMLAttributes } = props;
  return (
    <div className={cx("row",divClassNameAdd)}>
      <label className={"col-auto col-form-label dropdown-header text-primary p-1"} ><strong>{label}</strong></label>
      <div className="col-auto">
        <select {...SelectHTMLAttributes} className={cx("form-select form-select-sm",className)} placeholder="Selecione" size={1}>
          {options.map((option, index) => (
            <option value={values[index]} key={index}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSelect;
