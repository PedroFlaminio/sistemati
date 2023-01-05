import { InputHTMLAttributes } from "react";
import cx from "classnames";

type FilterInputProps = {
  label?: string;
  filterRef?: React.LegacyRef<HTMLInputElement> | undefined;
} & InputHTMLAttributes<HTMLInputElement>;

export const FilterDate = (props: FilterInputProps) => {
  const { label="Filtro",className,filterRef,...InputHTMLAttributes } = props; 
  return (
    <div className={"row "+ className}>
      <label className={"col-auto col-form-label dropdown-header text-primary p-1 "} ><strong>{label}</strong></label>
      <div className="col-auto">
      <div className="input-group">
        <input  ref={filterRef} {...InputHTMLAttributes} className={cx("form-control form-control-sm")} type="date" />
        </div>
      </div>
    </div>
  );
};

export default FilterDate;
