import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm, { ModuleItem } from "./context";
import { FaEraser, FaSearch } from "react-icons/fa";
import Table, { SearchRule } from "./table";
import { GetItemProp, SetItemProp } from "../../utils/functions";
import { TableColumn } from "./table";
import Spinner from "../Spinner";
type Item = { [key: string]: any };
export type SearchInputListProps = {
  field: string;
  fieldLabel: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  canClear?: boolean;
  size?: number;
  columns: TableColumn[];
  values: ModuleItem[];
  getValues: () => Promise<void>;
  handleSelect?: (newItem: Item) => void;
  footer?: () => JSX.Element;
  header?: () => JSX.Element;
  searchFilter?: SearchRule | undefined;
} & InputHTMLAttributes<HTMLInputElement>;

const SearchInputList = (props: SearchInputListProps) => {
  const { size = 1, field, fieldLabel, label, className, disabled, values, getValues, canClear = false, ...InputHTMLAttributes } = props;
  const col = "form-group col-" + size;
  const { item, searchIndex, setSearchIndex, searchList, setSearchList, setList, setItem, mode, moduleErrors } = useForm();
  const [value, setValue] = useState(GetItemProp(item, field + "." + fieldLabel));
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [inputValue, setValue] = useState("");
  const handleOpenDialog = async () => {
    setList([]);
    setSearchList([]);
    setSearchIndex(field);
    //setLoading(true);
    await getValues().then(() => setLoading(false));
  };
  useEffect(() => {
    setValue(GetItemProp(item, field + "." + fieldLabel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, field]);
  useEffect(() => {
    const aux = moduleErrors.filter((e) => e.field === label).length > 0;
    setInvalid(aux);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleErrors]);
  const handleSelect = (newItem: Item) => {
    SetItemProp(item, field, newItem);
    //item[field] = newItem;
    setSearchIndex("");
    setSearchList([]);
    setItem({ ...item });
    setValue(newItem[fieldLabel]);
    if (props.handleSelect) props.handleSelect(newItem);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { value } = e.currentTarget;
    const newItem = values.find((it) => it[props.fieldLabel].toUpperCase() === value.toUpperCase());
    if (newItem) {
      SetItemProp(item, field, newItem);
      setItem({ ...item });
      if (props.handleSelect) props.handleSelect(newItem);
    } else {
      SetItemProp(item, field, {});
      setItem({ ...item });
      setValue("");
      if (props.handleSelect) props.handleSelect({});
    }
  };
  const handleClear = () => {
    delete item[field];
    setSearchIndex("");
    setSearchList([]);
    setItem(item);
    setValue("");
  };
  const handleClose = () => {
    setSearchIndex("");
    setSearchList([]);
  };
  const SearchDialog = () => {
    return (
      <div className={searchIndex !== field ? "d-none" : ""}>
        <div className="fade modal-backdrop show" style={{ zIndex: 150 }} onClick={handleClose}></div>
        <div className={"rounded-0 modal-big   modal-dialog-centered"}>
          <div className="modal-content p-4">
            <div className="modal-header">
              <h5 className="modal-title">{props.label}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              {searchList.length ? (
                <Table
                  id={"search_" + field}
                  pageSize={10}
                  columns={props.columns}
                  data={searchList}
                  handleDoubleClick={handleSelect}
                  handleSelect={() => {}}
                  footer={props.footer}
                  header={props.header}
                  searchFilter={props.searchFilter}
                  local
                />
              ) : (
                <Spinner inner />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const SearchButton = () => {
    return (
      <button
        type="button"
        disabled={disabled || mode === "Delete" || mode === "View"}
        className={cx("px-2 btn btn btn-sm btn-primary")}
        onClick={handleOpenDialog}
      >
        <div className="px-0 d-flex align-center">
          <div className="">
            <FaSearch />
          </div>
        </div>
      </button>
    );
  };
  const ClearButton = () => {
    return (
      <button
        type="button"
        disabled={disabled || mode === "Delete" || mode === "View"}
        className="px-2 btn btn btn-sm btn-light"
        onClick={handleClear}
      >
        <div className="px-0 d-flex align-center">
          <div className="">
            <FaEraser />
          </div>
        </div>
      </button>
    );
  };
  return (
    <>
      <SearchDialog />
      <div className={col + " px-2"}>
        <label className="mb-0">
          <strong>{label}</strong>
        </label>
        <div className="input-group">
          <input
            {...InputHTMLAttributes}
            onDoubleClick={handleOpenDialog}
            disabled={disabled || mode === "Delete" || mode === "View"}
            className={cx("form-control form-control-sm", { "is-invalid": !!invalid }, className)}
            defaultValue={value}
            list={"input-" + field}
            onBlur={(e) => handleBlur(e)}
          />
          <datalist id={"input-" + field}>
            {values.map((v, i) => {
              return <option key={i} value={v.label.toUpperCase()}></option>;
            })}
          </datalist>
          {canClear && <ClearButton />}
          <SearchButton />
        </div>
      </div>
    </>
  );
};

export default SearchInputList;
