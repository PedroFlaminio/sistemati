import { InputHTMLAttributes, useEffect, useState } from "react";
import cx from "classnames";
import useForm from "./context";
import { FaEraser, FaSearch } from "react-icons/fa";
import Table, { SearchRule } from "../Module/table";
import { GetItemProp, SetItemProp } from "../../utils/functions";
import { TableColumn } from "./table";
import Spinner from "../Spinner";
type Item = { [key: string]: any };
export type SearchInputProps = {
  field: string;
  fieldLabel: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  canClear?: boolean;
  size?: number;
  columns: TableColumn[];
  getValues: () => Promise<void>;
  footer?: () => JSX.Element;
  header?: () => JSX.Element;
  searchFilter?: SearchRule | undefined;
} & InputHTMLAttributes<HTMLInputElement>;

const SearchInput = (props: SearchInputProps) => {
  const { size = 1, field, fieldLabel, label, className, disabled, getValues, searchFilter, footer, header, canClear = false, ...InputHTMLAttributes } = props;
  const col = "form-group col-" + size;
  const { item, searchIndex, setSearchIndex, searchList, setSearchList, setList, setItem, mode, moduleErrors } = useForm();
  
  const [value, setValue] = useState(GetItemProp(item, field + "." + fieldLabel));
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [inputValue, setValue] = useState("");

  useEffect(() => {
    setValue(GetItemProp(item, field + "." + fieldLabel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, field]);
  useEffect(() => {}, [loading]);
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
  };
  const handleClear = () => {
    delete item[field];
    setSearchIndex("");
    setSearchList([]);
    setItem(item);
    setValue("");
  };
  const handleOpenDialog = async () => {
    setLoading(true);
    setList([]);
    setSearchIndex(field);
    await getValues().then(() => {
      setLoading(false);
    });
  };
  const SearchDialog = () => {
    return (
      <div className={searchIndex !== field ? "d-none" : ""}>
        <div className="fade modal-backdrop show" style={{ zIndex: 150 }} onClick={() => setSearchIndex("")}></div>
        <div className={"rounded-0 modal-big   modal-dialog-centered"}>
          <div className="modal-content p-4">
            <div className="modal-header">
              <h5 className="modal-title">{props.label}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSearchIndex("")}>
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              {searchList.length ? (
              <Table
                id={"search_"+field}
                pageSize={10}
                columns={props.columns}
                data={searchList}
                handleDoubleClick={handleSelect}
                handleSelect={() => {}}
                footer={footer}
                header={header}
                searchFilter={searchFilter}
                local
              />):(<Spinner inner />)}
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
      <button type="button" disabled={disabled || mode === "Delete" || mode === "View"} className="px-2 btn btn btn-sm btn-light" onClick={handleClear}>
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
            onChange={() => {}}
            disabled={disabled || mode === "Delete" || mode === "View"}
            className={cx("form-control form-control-sm", { "is-invalid": !!invalid }, { "bg-white": !(disabled || mode === "Delete" || mode === "View") })}
            value={value}
            readOnly
          />
          {canClear && <ClearButton />}
          <SearchButton />
        </div>
      </div>
    </>
  );
};

export default SearchInput;
