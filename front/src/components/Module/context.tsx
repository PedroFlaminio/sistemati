import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SearchOptions } from "../../utils/searchTypes";
//type ModuleMode = "Insert" | "Edit" | "View" | "List" | "Delete";export

export type ModuleError = {
  field: string;
  error: string;
};
export type ModuleItem = { [prop: string]: any };
type FormType = {
  mode: string;
  item: ModuleItem;
  list: ModuleItem[];
  searchList: ModuleItem[];
  searchIndex: string;
  index: number;
  update: boolean;
  files: FormData;
  fileList: File[];
  printList: File[];
  setItem: (item: ModuleItem, callback?: () => void) => void;
  setMode: (mode: string) => void;
  setList: (list: ModuleItem[]) => void;
  setSearchList: (list: ModuleItem[]) => void;
  setSearchIndex: (index: string) => void;
  setIndex: (index: number) => void;
  setUpdate: (update: boolean) => void;
  moduleErrors: ModuleError[];
  setModuleErrors: (errors: ModuleError[]) => void;
  currentPage: number;
  pageSize: number;
  order: string;
  orderAsc: boolean;
  setCurrentPage: (currentPage: number) => void;
  setPageSize: (pageSize: number) => void;
  setOrder: (order: string) => void;
  setOrderAsc: (orderAsc: boolean) => void;
  setFiles: (files: FormData) => void;
  setFilesList: (files: File[]) => void;
  setPrintList: (files: File[]) => void;

  options: { [prop: string]: SearchOptions };
  setOptions: (index: string, opt: SearchOptions) => void;
};
type ModuleContextProviderProps = {
  children: ReactNode;
  id: string;
  pageSize?: number;
  order?: string;
  orderAsc?: boolean;
};
export const ModuleContext = createContext({} as FormType);

export const ModuleContextProvider = (props: ModuleContextProviderProps) => {
  const { children, id } = props;
  const [mode, setMod] = useState<string>("List");
  const [searchIndex, setSearchIndex] = useState("");
  const [searchList, setSearchList] = useState<ModuleItem[]>([]);
  const [item, setIt] = useState<ModuleItem>({});
  const [files, setFls] = useState<FormData>(new FormData());
  const [list, setListModule] = useState<ModuleItem[]>([]);
  const [index, setIndex] = useState(-1);
  const [moduleErrors, setErrors] = useState<ModuleError[]>([]);
  const [currentPage, setCurrentPg] = useState(0);
  const [pageSize, setPageSz] = useState(props.pageSize || 20);
  const [order, setOrd] = useState(props.order || "id");
  const [orderAsc, setOrdAsc] = useState(props.orderAsc || false);
  const [update, setUpdate] = useState(true);

  const [printList, setPrtList] = useState<File[]>([]);
  const [fileList, setFlsList] = useState<File[]>([]);
  const storedProps = { currentPage, pageSize, order, orderAsc, list, item };
  useEffect(() => {
    let JSONObject = localStorage.getItem(id);
    if (JSONObject) {
      const object = JSON.parse(JSONObject);
      setListModule(object.list);
      setIt(object.item);
      setCurrentPg(object.currentPage);
      setPageSz(object.pageSize);
      setOrd(object.order);
      setOrdAsc(object.orderAsc);
      //setMod(object.mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setItem = (item: ModuleItem, callback?: () => void) => {
    setIt(item);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, item }));
    if (callback) callback();
  };

  const setFiles = (files: FormData) => {
    setFls(files);
  };

  const setPrintList = (files: File[]) => {
    setPrtList(files);
  };

  const setFilesList = (files: File[]) => {
    setFlsList(files);
  };

  const setList = (list: ModuleItem[]) => {
    setIt(item);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, list }));
  };
  const setMode = (mode: string) => {
    setMod(mode);
    //localStorage.setItem(id, JSON.stringify({ item, list, mode }));
  };
  const setCurrentPage = (currentPage: number) => {
    setCurrentPg(currentPage);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, currentPage }));
  };
  const setPageSize = (pageSize: number) => {
    setPageSz(pageSize);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, pageSize }));
  };
  const setOrder = (order: string) => {
    setOrd(order);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, order }));
  };
  const setOrderAsc = (orderAsc: boolean) => {
    setOrdAsc(orderAsc);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, orderAsc }));
  };
  const setModuleErrors = (errors: ModuleError[]) => {
    setErrors(errors);
  };
  const [options, setOpt] = useState<{ [prop: string]: SearchOptions }>({});
  const setOptions = (index: string, opt: SearchOptions) => {
    const newOptions = options;
    newOptions[index] = opt;
    setOpt(newOptions);
    localStorage.setItem(id, JSON.stringify({ ...storedProps, options: newOptions }));
  };
  return (
    <ModuleContext.Provider
      value={{
        update,
        setUpdate,
        mode,
        item,
        setItem,
        setMode,
        list,
        setList,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        order,
        setOrder,
        orderAsc,
        setOrderAsc,
        searchIndex,
        setSearchIndex,
        searchList,
        setSearchList,
        index,
        setIndex,
        moduleErrors,
        setModuleErrors,
        options,
        setOptions,
        files,
        setFiles,
        fileList,
        setFilesList,
        printList,
        setPrintList,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};
const useModule = () => {
  const value = useContext(ModuleContext);
  return value;
};

export default useModule;
