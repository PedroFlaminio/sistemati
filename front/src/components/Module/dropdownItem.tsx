import { ButtonHTMLAttributes } from "react";
import Icons, { IconType } from "./icons";

type DropDownItemProps = {
  label: string;
  icon?: IconType;
} &  ButtonHTMLAttributes<HTMLButtonElement>;

const DropDownItem = (props: DropDownItemProps) => {
  const {label,icon,onClick, ...buttonProps} = props
  const iconSpan = (
    <span>
      {props.icon ? Icons[props.icon]:<></>}{label}
    </span>
  );
  return (
    <button className="dropdown-item pl-3" {...buttonProps} onMouseDown={onClick}>
      {iconSpan}
    </button>
  );
};
export default DropDownItem;
