import { ReactNode, createContext, useState, useContext } from "react";

type TabViewContexType = {
  activeTab: string;
  setActive: (item: string) => void;
};
const TabViewContext = createContext({} as TabViewContexType);

const TabViewContextProvider = (props: { children: ReactNode; initial: string }) => {
  const { children, initial } = props;
  const [activeTab, setActiveTab] = useState(initial);
  const setActive = (item: string) => {
    setActiveTab(item);
  };
  return <TabViewContext.Provider value={{ activeTab, setActive }}>{children}</TabViewContext.Provider>;
};
export const useTabView = () => {
  const value = useContext(TabViewContext);
  return value;
};

type TabViewProps = {
  children: ReactNode[];
  tabClassName?: string;
  initial: string;
};

const TabView = (props: TabViewProps) => {
  const { tabClassName } = props;
  const [selected, setSelected] = useState<number>(0);
  const handleChange = (index: number) => {
    setSelected(index);
  };
  return (
    <TabViewContextProvider initial={props.initial}>
      <ul className="nav nav-tabs">
        {props.children.map((elem: any, index) => {
          let style = "nav-item";
          let styleElem = "nav-link " + (index === selected ? "active text-primary bg-lighter font-weight-bold" : "text-dark");
          if (elem.props.hide) return <></>;
          return (
            <li style={{ cursor: "pointer", userSelect: "none" }} key={"li" + index} className={style} onClick={() => handleChange(index)}>
              <div className={styleElem}>{elem.props.title}</div>
            </li>
          );
        })}
      </ul>
      <div className={"tab border border-top-0 bg-lighter p-3 " + tabClassName}>
        {props.children.map((elem, index) => (
          <div key={"div" + index} className={index !== selected ? "d-none h-0" : ""}>
            {props.children[index]}
          </div>
        ))}
      </div>
    </TabViewContextProvider>
  );
};

type TabProps = {
  title: string;
  children: ReactNode;
  className?: string;
  hide?: boolean;
};

const Tab = (props: TabProps) => {
  const { children } = props;
  return <div className={props.className}>{children}</div>;
};

export { TabView, Tab };
