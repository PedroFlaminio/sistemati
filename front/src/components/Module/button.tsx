import { ButtonHTMLAttributes } from "react";
import Icons, { IconType } from "./icons";
import cx from "classnames";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconType;
  label?: string;
  className?: string;
};

const Button = (props: ButtonProps) => {
  const { icon, label = "", className, ...buttonHTMLAttributes } = props;
  return (
    <button type="button" {...buttonHTMLAttributes} className={cx("px-2 btn btn-primary", className)}>
      <div className="px-0 d-flex align-center">
        {props.icon ? <div className="pe-2 py-0">{Icons[props.icon]}</div> : <></>}
        <div className="flex-grow-1 align-center">{label}</div>
      </div>
    </button>
  );
};
export default Button;
