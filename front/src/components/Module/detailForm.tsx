import { CSSProperties, ReactNode, useEffect} from "react";
import useModule, { ModuleItem, ModuleError } from "./context";
import * as yup from "yup";
import { TypeOfShape } from "yup/lib/object";
import Input, { InputProps } from "./input";
import Select, { SelectProps } from "./select";
import SearchInput, { SearchInputProps } from "./searchInput";
import React from "react";
import DateInput, { DateInputProps } from "./dateInput";
import useDetail, { DetailContextProvider } from "./detailContext";
import SearchInputList, { SearchInputListProps } from "./searchInputList";

const modalStyle: CSSProperties = {
  display: "block",
};
type DetailFormProps = {
  title: string;
  detailField: string;
  defaultValues: ModuleItem;
  schema?: yup.ObjectSchema<TypeOfShape<ModuleItem>>;
  Table: () => JSX.Element;
  Header: () => JSX.Element;children: ReactNode;
  handleConfirm?: (item: ModuleItem,currentIndex: number) => void;
  handleValidate?: (item: ModuleItem, currentIndex: number) => Promise<boolean>;
};

const DetailFormHO = (props: DetailFormProps) => {
  const { children, detailField, defaultValues, schema } = props;
  return <DetailContextProvider detailField={detailField} defaultValues={defaultValues} schema={schema} handleConfirm={props.handleConfirm} handleValidate={props.handleValidate}>{children}</DetailContextProvider>;
};

const DetailForm: React.FC<DetailFormProps> = (props) => {  
  const { title, detailField, Table, Header } = props;
  const ConvertedChild = () => {
    const {view, handleCancel, handleConfirm, currentIndex, detailErrors, setDetailErrors} = useDetail();
    const DetailEdit = (props: InputProps) => {
      const {field,...otherProps} = props;
      const {currentIndex} = useDetail();
      useEffect(()=> {},[currentIndex])
      return <Input {...otherProps} field={`${detailField}.${currentIndex}.${field}`} readOnly={view === "delete" || view === "view"} />;
    };
    const DetailDateInput = (props: DateInputProps) => {
      const {field,...otherProps} = props;
      return <DateInput {...otherProps} field={`${detailField}.${currentIndex}.${field}`} readOnly={view === "delete" || view === "view"} />;
    };
    const SelectEdit = (props: SelectProps) => {
      const {field,...otherProps} = props;
      return <Select {...otherProps} field={`${detailField}.${currentIndex}.${field}`} readOnly={view === "delete" || view === "view"} />;
    };
    const DetailSearchEdit = (props: SearchInputProps) => {
      const {field,...otherProps} = props;
      return (
        <SearchInput {...otherProps} type="DetailSearchEdit" field={`${detailField}.${currentIndex}.${field}`} disabled={props.disabled||view === "delete" || view === "view"} />
      );
    };
    const DetailSearchEditList = (props: SearchInputListProps) => {
      const {field,...otherProps} = props;
      return (
        <SearchInputList {...otherProps} type="DetailSearchEditList" field={`${detailField}.${currentIndex}.${field}`} disabled={props.disabled||view === "delete" || view === "view"} />
      );
    };
    function recursiveMap(children: any): any {
      return React.Children.map(children, (child: any | typeof Input) => {
        const type = child.type||"";
        if (child.props?.children) {
          child = React.cloneElement(child, {
            children: recursiveMap(child.props.children),
          });
        }
        if (type === Input) {
          return DetailEdit({ ...child.props });
        } else if (type === Select) {
          return SelectEdit({ ...child.props });
        } else if (type === SearchInput) {
          return DetailSearchEdit(child.props);
        } else if (type === SearchInputList) {
          return DetailSearchEditList(child.props);
        } else if (type === DateInput) {
          return DetailDateInput(child.props);        
        } else return child;
      });
    }
    let Title = title;
    switch (view) {
      case "new":
        Title = "Novo " + Title;
        break;
      case "edit":
        Title = "Alterar " + Title;
        break;
      case "delete":
        Title = "Excluir " + Title;
        break;
      case "view":
        Title = "Visualizar " + Title;
        break;
      default:
        break;
    }
    const ErrorsPanel = () => {
      return detailErrors.length > 0 ? (
        <>
          <div className="alert alert-dismissible alert-danger py-2">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              onClick={() => {
                setDetailErrors([]);
              }}
            />
            <strong>Erro!</strong>
            <br />
            {detailErrors.map((e: ModuleError) => (
              <div key={e.field}>{e.error}</div>
            ))}
          </div>
        </>
      ) : (
        <></>
      );
    };
    //const handleConfirm = props.handleConfirm?props.handleConfirm:handleDetailConfirm;
    const children = recursiveMap(props.children);
    return (
      <>
        <div className="modal-header">
          <h5 className="modal-title">{Title}</h5>
        </div>
        <div className="modal-body">
          <ErrorsPanel />
          {children}
        </div>
        <div className="modal-footer">
          <div className="">
            {view !== "view" ? (
              <>
                <button className="btn btn-dark btn-sm me-2" onMouseUp={handleCancel} type="button">Cancelar</button>
                <button className="btn btn-primary btn-sm" id="confirmarDetail" onMouseUp={handleConfirm} type="button">Confirmar</button>
              </>
            ) : (
              <button className="btn btn-primary rounded" onClick={handleCancel} type="button" >Voltar</button>
            )}
          </div>
        </div>
      </>
    );
  };
  const DetailModal = () => {
    const {showModal,currentIndex} = useDetail();
    useEffect(()=> {},[currentIndex])
    return (
      <div className={!showModal?"d-none":""} id="modalDetail">
        <div className="fade modal-backdrop show"></div>
        <div className="fade modal show overflow-auto" style={modalStyle}>
          <div className="modal-dialog  modal-dialog-centered modal-xl">
            <div className="modal-content">
              <ConvertedChild />
            </div>
          </div>
        </div>
      </div>
    )
  };
  return (
    <DetailFormHO {...props}>
      <Header />
      <Table />
      <DetailModal />
    </DetailFormHO>
  );
};

export default DetailForm;
