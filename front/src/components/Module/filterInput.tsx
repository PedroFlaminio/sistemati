import { InputHTMLAttributes, useState } from "react";
import cx from "classnames";
import { FaSearch } from "react-icons/fa";

type FilterInputProps = {
  label?: string;
  divClassNameAdd?: string;
  handleBtnClick?: (value: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const FilterInput = (props: FilterInputProps) => {
  const { label="Filtro",className,handleBtnClick, divClassNameAdd = "", ...InputHTMLAttributes } = props; 
  const [inputValue,setInputValue] = useState("");  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleClick = () => {
    if (handleBtnClick) handleBtnClick(inputValue)
  }
  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key=== "Enter"){
      if (handleBtnClick) handleBtnClick(inputValue)
    }
  }
  const SearchButton = () => {
    return (
      <button type="button" disabled={InputHTMLAttributes.disabled} className={"px-2 btn btn btn-sm btn-primary"} onClick={handleClick}>
        <div className="px-0 d-flex align-center">
          <div className="">
            <FaSearch  />
          </div>
        </div>
      </button>
    );
  };
  return (
    <div className={cx("row",divClassNameAdd)}>
      <label className="col-auto col-form-label dropdown-header text-primary p-1" ><strong>{label}</strong></label>
      <div className="col-auto">
      <div className="input-group">
        <input {...InputHTMLAttributes} className={cx("form-control form-control-sm")} onChange={handleChange} onKeyDown={handlePressEnter}/>
          <SearchButton />
        </div>
      </div>
    </div>
  );
};

export default FilterInput;
