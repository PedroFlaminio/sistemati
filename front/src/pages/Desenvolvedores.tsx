import { useEffect, useState } from "react";
import Module from "../components/Module";
import { Dev } from "../utils/types";
import List from "../components/Module/list";
import useModule from "../components/Module/context";
import Form from "../components/Module/form";
import Input from "../components/Module/input";
import Table, { FilterRule, SearchRule, TableColumn } from "../components/Module/table";
import FilterInput from "../components/Module/filterInput";
import useApi from "../context/ApiContext";
import yup from "../utils/schemas";
import useApp from "../context/AppContext";
import Button from "../components/Module/button";
import Checkbox from "../components/Module/checkbox";
import FilterSelect from "../components/Module/filterSelect";

const DevsSchema = yup.object().shape({
  nome: yup.string().required().label("Nome"),
  matricula: yup.string().required().label("Matrícula"),
});

const Devs = () => {
  const [devs, setDevs] = useState<Dev[]>([]);
  const [filterSearch, setFilterSearch] = useState<SearchRule>();
  const [filterStatus, setFilterStatus] = useState<FilterRule | undefined>({ field: "ativo", data: "true", operation: "CN", type: "S" });
  const { getDevs, postDev, putDev, deleteDev, loaded } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) updateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const updateList = () => {
    getDevs((list: Dev[]) => setDevs(list.filter((d) => d.id > 0)));
  };

  const columns: TableColumn[] = [
    { label: "Id", field: "id" },
    { label: "Nome", field: "nome" },
    { label: "Matrícula", field: "matricula" },
    { label: "Ativo", field: "ativo", formatter: (ativo) => (ativo ? "Sim" : "Não") },
  ];
  const Buttons = () => {
    const { setMode, setItem, mode, item } = useModule();
    const handleNew = () => {
      setItem({} as Dev);
      setItem({ id: "Novo", ativo: true });
      setMode("Insert");
    };
    const handleEdit = () => {
      setItem({ ...item });
      setMode("Edit");
    };
    const handleView = () => {
      setItem({ ...item });
      setMode("View");
    };
    const cantInsert = mode === "Edit" || mode === "Insert" || !usuario.isDev;
    const cantEdit = mode === "Edit" || mode === "Insert" || item.id === undefined || !usuario.isDev;
    const cantView = mode === "Edit" || mode === "Insert" || item.id === undefined;
    return (
      <>
        <Button className="rounded-0" label="Novo" icon="new" disabled={cantInsert} onClick={handleNew} />
        <Button className="rounded-0" label="Editar" icon="edit" disabled={cantEdit} onClick={handleEdit} />
        <Button className="rounded-top-right" label="Visualizar" icon="view" disabled={cantView} onClick={handleView} />
      </>
    );
  };
  const Filtros = () => {
    const handleSearchChange = (value: string) => {
      if (value !== "") {
        const searchFilter: SearchRule = { fields: ["id", "nome", "matricula"], data: value, op: "CT" };
        setFilterSearch(searchFilter);
      } else setFilterSearch(undefined);
    };
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value !== "") {
        const newFilter: FilterRule = { field: "ativo", data: e.currentTarget.value, operation: "CN", type: "S" };
        setFilterStatus(newFilter);
      } else setFilterStatus(undefined);
    };
    return (
      <div className="row row-cols-auto p-2 bg-light border-light border rounded-bottom mx-0 justify-content-end">
        <FilterSelect
          size={2}
          label="Status"
          onChange={handleStatusChange}
          options={["Todos", "Ativos", "Inativos"]}
          values={["", "true", "false"]}
          value={filterStatus?.data}
        />
        <FilterInput placeholder="Pesquisar..." defaultValue={filterSearch?.data} handleBtnClick={handleSearchChange} />
      </div>
    );
  };
  const ModuleTable = () => {
    const { setList, setItem, setMode, item } = useModule();
    useEffect(() => {
      if (loaded) setList(devs);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);
    const handleSelect = (id: number) => {
      const find = devs.find((o) => o.id === id);
      if (find) {
        setItem(find);
      }
    };
    const handleDbClick = () => {
      setItem({ ...item });
      setMode("View");
    };
    return (
      <Table
        id="devs"
        data={devs}
        columns={columns}
        handleSelect={handleSelect}
        handleDoubleClick={handleDbClick}
        footer={Filtros}
        searchFilter={filterSearch}
        filters={[filterStatus]}
        order="nome"
        orderAsc={true}
      />
    );
  };
  const ModuleForm = () => {
    const { setMode, setItem, mode, item } = useModule();

    const handleCancelar = () => {
      setMode("List");
      setItem({});
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mode === "Insert") {
        delete item.id;
        postDev(item as Dev, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Edit") {
        putDev(item as Dev, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Delete") {
        deleteDev(item as Dev, () => {
          setMode("List");
          updateList();
        });
      }
    };
    return (
      <Form className="p-4" onSubmit={handleSubmit} schema={DevsSchema}>
        <div className="input-group">
          <Input field="id" label="Id" readOnly />
          <Input field="nome" label="Nome" size={4} />
          <Input field="matricula" label="Matrícula" type="number" size={1} />
          <Checkbox field="ativo" label="Ativo" size={1} />
        </div>
        <div className="d-flex justify-content-end pe-3">
          <div className="btn-group my-3">
            {mode === "View" ? (
              <button className="btn btn-light btn-block" onClick={handleCancelar}>
                Voltar
              </button>
            ) : (
              <>
                <button className="btn btn-light btn-block" onClick={handleCancelar}>
                  Cancelar
                </button>
                <button className="btn btn-primary btn-block" type="submit">
                  Confirmar
                </button>
              </>
            )}
          </div>
        </div>
      </Form>
    );
  };
  return (
    <Module name="Devs" id="devs" buttons={Buttons}>
      <List>
        <ModuleTable />
      </List>
      <ModuleForm />
    </Module>
  );
};

export default Devs;
