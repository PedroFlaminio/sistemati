import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { GetItemProp, SetItemProp } from "../../utils/functions";
import useModule from "./context";

export type TimeInputProps = {
  field: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
  formatter?: (date: any) => string;
  setter?: (value: string) => any;
} & InputHTMLAttributes<HTMLInputElement>;

const TimeInput = (props: TimeInputProps) => {
  const { size = 0, field, label, className, value, disabled, type, formatter, setter,...InputHTMLAttributes } = props;
  const col = "form-group " + ((size!==0)?"col-"+size:"col");
  const {moduleErrors} = useModule();
  const {item, setItem, mode} = useForm();
  const [inputValue,setInputValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {   
    if (setter){
    SetItemProp(item, field, setter(e.target.value));}
    else
    SetItemProp(item, field, e.target.value);
    setItem(item);    
    setInvalid(false);
    if (props.onBlur) props.onBlur(e)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  useEffect(()=> {
    const aux = GetItemProp(item,field)   
    if (formatter) setInputValue(formatter(aux))  
    else setInputValue(aux)    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[item]) 
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleErrors]);
  return (
    <div className={col+ " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label>
      <input 
        {...InputHTMLAttributes} 
        disabled={disabled|| mode==="Delete"|| mode==="View"} 
        className={cx("form-control form-control-sm", className, { "is-invalid": !!invalid })}
        defaultValue={inputValue} 
        onBlur={handleBlur} 
        onChange={handleChange} 
        type="time" />
    </div>
  );
};

export default TimeInput;