import { useEffect, useState } from "react";
import useForm from "./context";
import { GetItemProp, SetItemProp } from "../../utils/functions";
import { SwatchesPicker } from "react-color";
import { ColorResult } from "react-color"

export type SelectProps = {
  field: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  size?: number;
}

const ColorSelect = (props: SelectProps) => {
  const { size = 0, field, label } = props;
  const {item,setItem} = useForm();    
  const col = "form-group " + ((size!==0)?"col-"+size:"col");
  const [selectValue,setSelectValue]= useState("");
  const [showPicker, setShowPicker] = useState(false);
  useEffect(() => {
    const aux = GetItemProp(item, field);
    setSelectValue(aux)      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[item])
  const handleChange = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
    SetItemProp(item, field, color.hex.toLocaleUpperCase());
    setItem(item)
    setSelectValue(color.hex.toLocaleUpperCase())
    setShowPicker(false)
  }  
  const handleOpen =  () => {
    setShowPicker(!showPicker)
  }
  const dark = () => {  
    if (selectValue === "" || !selectValue) return true  
    let red = parseInt(selectValue.substring(1,3),16)
    let green = parseInt(selectValue.substring(3,5),16)
    let blue = parseInt(selectValue.substring(5,7),16)
    let total = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    return total < 128
  }

  return (
    <div className={col+ " px-2"}>
      <label className="mb-0">
        <strong>{label}</strong>
      </label>
      <div className="form-control form-control-sm rounded p-1" style={{border:  '1px solid #CBC8D0',backgroundColor:selectValue }} onClick={handleOpen}>
      <span className={"ps-1 "+(dark()?"text-white":"")}>{selectValue}</span>
      </div>
      {showPicker&&
      <SwatchesPicker
              //color={this.state.color}
              onChange={handleChange}
              onSwatchHover={(color, e) => {
                console.log("color", color);
              }}
              className="z3000"
            />}
    </div>
  );
};

export default ColorSelect;
