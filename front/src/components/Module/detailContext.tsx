import { createContext, ReactNode, useContext, useState } from "react";
import { TypeOfShape } from "yup/lib/object";
import useModule, { ModuleItem, ModuleError } from "./context";
import * as yup from "yup";

type DetailContextType = {
  showModal: boolean;
  prevItem?: ModuleItem;
  currentIndex: number;
  view: string;
  detailErrors: ModuleError[];
  setDetailErrors: (errors: ModuleError[]) => void;
  setCurrentDetailIndex: (index: number) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  handleNew: () => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
};
export const DetailContext = createContext({} as DetailContextType);
type DetailContextProviderProps = {
  children: ReactNode;
  detailField: string;
  defaultValues: ModuleItem;
  schema?: yup.ObjectSchema<TypeOfShape<ModuleItem>>;
  handleConfirm?: (item: ModuleItem, currentIndex: number) => void;
  handleValidate?: (item: ModuleItem, currentIndex: number) => Promise<boolean>;
};
export const DetailContextProvider = (props: DetailContextProviderProps) => {
  const { children, detailField, defaultValues, schema } = props;
  const { item, setItem, setModuleErrors } = useModule();
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [detailErrors, setDetailErrors] = useState<ModuleError[]>([]);
  const [prevItem, setPrevItem] = useState<ModuleItem>();
  const [view, setView] = useState("list");
  const setCurrentDetailIndex = (index: number) => {
    setCurrentIndex(index);
  };
  const handleNew = () => {
    setView("new");
    const newItem = { ...defaultValues };
    if (!item[detailField]) item[detailField] = [newItem];
    else item[detailField].push(newItem);
    setCurrentIndex(item[detailField].length - 1);
    setItem({ ...item });
    setShowModal(true);
  };
  const handleEdit = (index: number) => {
    setCurrentIndex(index);
    setView("edit");
    const newItem = { ...item[detailField][index] };
    setPrevItem({ ...newItem });
    setShowModal(true);
    setItem({ ...item });
  };
  const handleDelete = (index: number) => {
    setCurrentIndex(index);
    setItem({ ...item });
    setView("delete");
    setShowModal(true);
  };
  const handleCancel = () => {
    if (view === "new") {
      item[detailField].pop();
      setItem({ ...item });
      setCurrentIndex(-1);
    } else if (view === "edit") {
      item[detailField][currentIndex] = prevItem;
      setItem({ ...item });
    }
    setDetailErrors([]);
    setShowModal(false);
  };
  const handleConfirm = async () => {
    let erros: ModuleError[] = [];
    let valid = true;
    if (props.handleValidate) {
      valid = await props.handleValidate(item, currentIndex)
    }
    if (valid)
    schema
      ?.validate(item[detailField][currentIndex], { abortEarly: false })
      .then(function (value) {
        setDetailErrors(erros);
        if (view === "delete") item[detailField].pop();
        if (["new", "edit", "delete"].includes(view)) {
          if (props.handleConfirm) props.handleConfirm(item, currentIndex);
          else {
            setItem({ ...item });
          }
        }
        setShowModal(false);
      })
      .catch(function (err) {
        err.inner.forEach((e: any) => {
          return erros.push({ field: e.params.label, error: e.message });
        });
        setDetailErrors(erros);
        setModuleErrors(erros);
      });
  };
  return (
    <DetailContext.Provider
      value={{
        showModal,
        currentIndex,
        setCurrentDetailIndex,
        prevItem,
        view,
        handleNew,
        handleEdit,
        handleDelete,
        handleCancel,
        handleConfirm,
        detailErrors,
        setDetailErrors,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};
const useDetail = () => {
  const value = useContext(DetailContext);
  return value;
};

export default useDetail;
