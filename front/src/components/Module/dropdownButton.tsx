import {useState} from "react";
import Button,{ButtonProps} from "./button"

const DropDownButton: React.FC<ButtonProps> = (props) => {
  //const {icon,label, ...btnProps} = props;
  const {icon,label, disabled, className} = props;
  const btnProps = { disabled,icon,label,className}  
  const [show,setShow] = useState(false);
  const menuClassName = "dropdown-menu rounded-0 py-1" + (show?" show":"");
  return (
    <>          
    <div className="border border-primary rounded-top-right border-bottom-0 border-top-0">
        <Button {...btnProps}  onClick={() => setShow(!show)} onBlur={() => setShow(false)}/>
        <div className={menuClassName} onBlur={() => setShow(false)} onMouseUp={() => setShow(false)}>
          {props.children}
        </div> 
    </div>
    </>
  );
};
export default DropDownButton;



