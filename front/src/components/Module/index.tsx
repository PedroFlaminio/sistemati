import { ReactNode } from "react";
import Frame from "../Frame";
import Page from "../Page";
import { ModuleContextProvider } from "./context";

type ModuleProps = {
  children: ReactNode;
  buttons?: () => void;
  name: string;
  id: string;
  container?: boolean | false;
  frame?: boolean;
  pageSize?: number;
  order?: string;
  orderAsc?: boolean;
};
type ModuleHOProps = {
  children: ReactNode;
  id: string;
  pageSize?: number;
  order?: string;
  orderAsc?: boolean;
};


const ModuleHO = (props: ModuleHOProps) => {
  const { children, ...providerProps } = props;
  return <ModuleContextProvider {...providerProps}>{children}</ModuleContextProvider>;
};

const Module = (props: ModuleProps) => {
  const { children, name, buttons, container, frame = true, ...providerProps } = props;
  return (
    <ModuleHO {...providerProps}>
      <Page>
        {frame ? (
          <Frame title={name} buttons={buttons} container={container}>
            {children}
          </Frame>
        ) : (
          <>{children}</>
        )}
      </Page>
    </ModuleHO>
  );
};

export default Module;