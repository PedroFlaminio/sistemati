import { HTMLProps, ReactNode } from "react";
import useModule from "./context";

type FormProps = {
  children: ReactNode;
} & HTMLProps<HTMLDivElement>;

const List = (props: FormProps) => {
  const {mode} = useModule();
  const { ...divAttributes } = props;
  return (    
    (mode === "List")?<div {...divAttributes}>{props.children}</div>:<></>
  );
};

export default List;
