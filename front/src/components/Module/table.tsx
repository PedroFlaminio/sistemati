import { useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import useApp from "../../context/AppContext";
import { GetItemProp } from "../../utils/functions";
import { FilterRule as Filter, filterToOptions, SearchOptions } from "../../utils/searchTypes";
import Spinner from "../Spinner";
import useModule, { ModuleItem } from "./context";

export type FilterRule = Filter;

export type TableColumn = {
  label: string;
  field: string;
  formatter?: (obj: any) => string;
  component?: (props: { index: number; item: ModuleItem }) => JSX.Element;
  headerComponent?: () => JSX.Element;
  className?: string;
};
export type DateFilter = {
  field: string;
  inicial: string;
  final: string;
};
export type SearchRule = {
  fields: string[];
  data: string;
  op: string;
};
interface TableProps {
  id: string;
  local?: boolean;
  data?: ModuleItem[];
  options?: SearchOptions;
  columns: TableColumn[];
  order?: string;
  orderAsc?: boolean;
  pageSize?: number;
  pages?: boolean;

  filters?: (FilterRule | undefined)[];
  dateFilters?: (DateFilter | undefined)[];
  searchFilter?: SearchRule | undefined;

  handleSelect?: (id: number, index: number) => void;
  handleDoubleClick?: (item: ModuleItem) => void;
  handleRenderRowColor?: (item: ModuleItem) => string;

  footer?: () => JSX.Element;
  header?: () => JSX.Element;
  dataHandle?: "server" | "client";
  handleSearch?: (opt: SearchOptions, callback: (list: ModuleItem[], opt: SearchOptions) => void) => void;
}
const Table = (props: TableProps) => {
  const id = "tab_" + props.id;
  const { options, setOptions } = useModule();
  const { loaded } = useApp();
  const [currentPage, setCurrentPg] = useState(options[id]?.currentPage || 0);
  const [pageSize, setPageSz] = useState(options[id]?.pageSize || 20);
  const [sortIndex, setSortIndex] = useState(options[id]?.sortIndex || props?.order || "id");
  const [sortAsc, setSortAsc] = useState(options[id]?.sortAsc || props?.orderAsc || false);
  const [totalElements, setTotalElements] = useState(options[id]?.totalElements || 0);
  const { columns, handleSelect, handleDoubleClick, handleRenderRowColor, dataHandle = "client" } = props;
  const [selectedId, setSelectedId] = useState(-1);
  const [data, setDt] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);

  function sortResults(list: ModuleItem[], prop: string, asc: boolean) {
    return list.sort(function (a: any, b: any) {
      let result = 0;
      if (typeof GetItemProp(a, prop) === "number") result = GetItemProp(a, prop) - GetItemProp(b, prop);
      else {
        const txtA =
          GetItemProp(a, prop) === undefined || GetItemProp(a, prop) === null ? "" : GetItemProp(a, prop).toString().toUpperCase();
        const txtB =
          GetItemProp(b, prop) === undefined || GetItemProp(b, prop) === null ? "" : GetItemProp(b, prop).toString().toUpperCase();
        //result = txtA > txtB ? 1 : txtA < txtB ? -1 : 0;
        result = txtA.localeCompare(txtB);
      }
      return asc ? result : -1 * result;
    });
  }
  const filterAndOrder = async (
    list: ModuleItem[],
    filters?: (FilterRule | undefined)[],
    dateFilters?: (DateFilter | undefined)[],
    searchFilter?: SearchRule | undefined,
    newOptions?: SearchOptions
  ) => {
    let newData = list;
    let total = list.length;
    let opt = newOptions ? newOptions : { currentPage, pageSize, sortIndex, sortAsc };
    if (sortIndex !== "") {
      if (filters) {
        for (let index = 0; index < filters.length; index++) {
          const field = filters[index]?.field;
          if (field !== undefined && filters[index]?.data !== "") {
            const filterNormalized = filters[index]?.data === "empty" ? undefined : filters[index]?.data.toString().toUpperCase();
            newData = newData.filter((d) => GetItemProp(d, field)?.toString().toUpperCase() === filterNormalized);
          }
          setDt(newData);
          total = newData.length;
        }
      }
      if (dateFilters) {
        for (let index = 0; index < dateFilters.length; index++) {
          const filter = dateFilters[index];
          const field = dateFilters[index]?.field;
          if (field && filter && filter.final !== "" && filter.final !== undefined && filter.inicial !== "" && filter.inicial !== undefined)
            newData = newData.filter(
              (d) => d[field].toUpperCase() <= filter.final.toUpperCase() && d[field].toUpperCase() >= filter.inicial.toUpperCase()
            );
          setDt(newData);
          total = newData.length;
        }
      }
      if (searchFilter) {
        newData = newData.filter((d) => {
          for (let index = 0; index < searchFilter.fields.length; index++) {
            const value = GetItemProp(d, searchFilter.fields[index]);
            if (value && value.toString().toUpperCase().includes(searchFilter.data.toUpperCase())) return true;
          }
          return false;
        });
        total = newData.length;
      }
      if (newData) {
        if (total < opt.currentPage * opt.pageSize) {
          opt.currentPage = 0;
          setCurrentPg(0);
        }
        newData = sortResults(newData, opt.sortIndex, opt.sortAsc).slice(
          opt.currentPage * opt.pageSize,
          opt.currentPage * opt.pageSize + opt.pageSize
        );
        setDt(newData);
      }
    }
    setDt(newData);
    setTotalElements(total);
    setOptions(id, { ...options[id], ...opt });
  };
  const setPageSize = (size: number) => {
    const opt = { ...options[id], pageSize: size, currentPage: 0 };
    setPageSz(size);
    update(opt);
  };
  const setCurrentPage = (page: number) => {
    const opt = { ...options[id], currentPage: page };
    setCurrentPg(page);
    update(opt);
  };
  const setOrder = (order: string) => {
    const opt = { ...options[id], sortIndex: order };
    setSortIndex(order);
    update(opt);
  };
  const setOrderAsc = (orderAsc: boolean) => {
    const opt = { ...options[id], sortAsc: orderAsc };
    setSortAsc(orderAsc);
    update(opt);
  };
  const update = async (newOptions?: SearchOptions) => {
    if (dataHandle === "client" && props.data) {
      await filterAndOrder(props.data, props.filters, props.dateFilters, props.searchFilter, newOptions);
    } else if (props.handleSearch) {
      let opt = newOptions ? newOptions : options[id];
      if (!opt) {
        opt = {
          currentPage: 0,
          pageSize: props.pageSize || 20,
          sortAsc: props.orderAsc || false,
          sortIndex: props.order || "id",
          rules: [{ field: "id", data: "0", type: "I", operation: "GT" } as FilterRule],
        };
      }
      if (props.filters && data.length > 0) opt.rules = filterToOptions(props.filters);
      props.handleSearch(opt, (list, newOpt) => {
        setDt(list);
        setOptions(id, newOpt);
        setPageSz(newOpt.pageSize);
        setCurrentPg(newOpt.currentPage);
        setSortIndex(newOpt.sortIndex);
        setSortAsc(newOpt.sortAsc);
        setTotalElements(newOpt.totalElements || 0);
      });
    }
  };
  useEffect(() => {
    const updateAsync = async () => {
      await update();
      setLoading(false);
    };
    if (loaded) updateAsync();
  }, [loaded, props.data]);
  const PageButton = (props: { pagina: number }) => {
    return (
      <li className={`page-item ${currentPage + 1 === props.pagina ? "active" : ""}`}>
        <button type="button" className="page-link  rounded-0" onClick={() => setCurrentPage(props.pagina - 1)}>
          {props.pagina}
        </button>
      </li>
    );
  };
  const PointsButton = () => {
    return (
      <li className="page-item disabled">
        <button type="button" className="page-link rounded-0">
          ...
        </button>
      </li>
    );
  };
  const Paginator = () => {
    const paginas = Math.ceil(totalElements / pageSize);
    const paginaAtual = currentPage + 1;
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage + 1 < paginas;
    return (
      <>
        <li className={`page-item ${!canPreviousPage ? "disabled" : ""}`}>
          <button type="button" className="page-link py-1 rounded-left" onClick={() => setCurrentPage(currentPage - 1)}>
            Anterior
          </button>
        </li>
        <PageButton pagina={1} />
        {paginaAtual >= 5 && <PointsButton />}
        {paginaAtual <= 4 && (
          <>
            {paginas >= 2 && <PageButton pagina={2} />}
            {paginas >= 3 && <PageButton pagina={3} />}
            {paginas >= 4 && <PageButton pagina={4} />}
            {paginas >= 5 && <PageButton pagina={5} />}
          </>
        )}
        {paginaAtual >= 5 && (
          <>
            <PageButton pagina={paginaAtual - 1} />
            <PageButton pagina={paginaAtual} />
            {paginaAtual < paginas && <PageButton pagina={paginaAtual + 1} />}
          </>
        )}
        {paginas >= 6 && paginaAtual + 3 <= paginas && <PointsButton />}
        {paginas >= 6 && paginaAtual < paginas - 1 && <PageButton pagina={paginas} />}
        <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
          <button type="button" className="page-link py-1 rounded-end me-3" onClick={() => setCurrentPage(currentPage + 1)}>
            Próxima
          </button>
        </li>
      </>
    );
  };
  return (
    <>
      <div>
        {props.header ? <props.header /> : <></>}
        {!data || loading ? (
          <Spinner inner />
        ) : (
          <div className="overflow-auto hideXOverFlow h-60 d-flex tableFixHead d-flex flex-column">
            {data?.length === 0 || data?.length === undefined ? (
              <h4 className="p-3 text-primary">NENHUM REGISTRO ENCONTRADO </h4>
            ) : (
              <table className={"table table-striped table-bordered table-hover table-sm mb-0 visible"}>
                <thead className="table-primary bg-primary">
                  <tr className="text-center bg-primary">
                    {columns.map((col, i) => {
                      const onClickTh = () => {
                        if (col.headerComponent) return;
                        else if (col.field === sortIndex) {
                          setOrderAsc(!sortAsc);
                        } else {
                          setOrder(col.field);
                        }
                      };
                      const icon =
                        sortIndex === col.field ? sortAsc ? <FaSortUp className="mt-2 ms-1" /> : <FaSortDown className="mb-2 ms-1" /> : "";
                      return (
                        <th key={i} onClick={onClickTh}>
                          {col.headerComponent ? (
                            <col.headerComponent />
                          ) : (
                            <span className="d-flex justify-content-center">
                              {col.label}
                              {icon}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const handleClick = () => {
                      if (handleSelect) {
                        handleSelect(item.id, index);
                        setSelectedId(item.id);
                      }
                    };
                    const handleDbClick = () => {
                      if (handleDoubleClick) handleDoubleClick(item);
                    };
                    const renderClass = handleRenderRowColor ? handleRenderRowColor(item) : "";
                    return (
                      <tr
                        className={`px-0 ${selectedId === item.id ? "table-secondary" : renderClass}`}
                        key={item.id + "_" + index + "tr"}
                        onClick={handleClick}
                        onDoubleClick={handleDbClick}
                      >
                        {columns.map((col, i: number) => {
                          const itemField = GetItemProp(item, col.field);
                          const print = col.formatter ? col.formatter(itemField) : itemField;
                          return (
                            <td
                              key={"cell-" + i + col.field + "td"}
                              className={col.className}
                              style={{ paddingTop: "3px", paddingBottom: "3px" }}
                            >
                              {col.component ? <col.component index={index} item={item} /> : <span className="px-0 m-0">{print}</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
        {props.footer ? <props.footer /> : <></>}
        {props.pages === false ? (
          <></>
        ) : (
          <div className="d-flex flex-row">
            <div className="paginador col">
              <nav aria-label="Page navigation" className="mt-2">
                <ul className="pagination d-flex align-items-center">
                  <Paginator />
                  Itens por página:
                  <div className="form-group mx-2">
                    <select
                      value={pageSize}
                      className="form-select form-control form-control-sm bg-white py-1"
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                      }}
                    >
                      {[10, 15, 20, 25, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  |
                  <span className="span-pagination ms-2">
                    Exibindo {totalElements === 0 ? 0 : currentPage * pageSize + 1} até {currentPage * pageSize + data?.length} de{" "}
                    {totalElements} linhas
                  </span>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
