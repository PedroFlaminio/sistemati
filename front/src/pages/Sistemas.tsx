import { useEffect, useState } from "react";
import Module from "../components/Module";
import { Sistema } from "../utils/types";
import List from "../components/Module/list";
import useModule from "../components/Module/context";
import Form from "../components/Module/form";
import Input from "../components/Module/input";
import Table, { FilterRule, SearchRule, TableColumn } from "../components/Module/table";
import FilterInput from "../components/Module/filterInput";
import useApi from "../context/ApiContext";
import yup from "../utils/schemas";
import useApp, { Item } from "../context/AppContext";
import Button from "../components/Module/button";
import Select from "../components/Module/select";
import TextArea from "../components/Module/textArea";
import Checkbox from "../components/Module/checkbox";
import FilterSelect from "../components/Module/filterSelect";

const SistemasSchema = yup.object().shape({
  nome: yup.string().required().label("Nome"),
  tecnologia: yup.string().required().label("Tecnologia"),
  banco: yup.string().required().label("Banco"),
  ip: yup.string().required().label("IP"),
  servidor: yup.string().required().label("Servidor"),
  id_responsavel: yup.number().moreThan(0, "Responsável: Campo obrigatório.").required().label("Responsável"),
});

const Sistemas = () => {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [filterSearch, setFilterSearch] = useState<SearchRule>();
  const [filterStatus, setFilterStatus] = useState<FilterRule | undefined>({ field: "ativo", data: "true", operation: "CN", type: "S" });
  const [devOptions, setDevOptions] = useState<string[]>([]);
  const [devValues, setDevValues] = useState<number[]>([]);
  const { getSistemas, postSistema, putSistema, deleteSistema, getDevsAtivos, loaded } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) updateList();
    getDevsAtivos((list) => {
      const sortedList = list.sort((a, b) => a.nome.localeCompare(b.nome));
      const newTecnicos: Item[] = [];
      const labels = ["Não Definido"];
      const values = [0];
      newTecnicos.push({ label: "Não Definido", value: "0" });
      for (let index = 0; index < sortedList.length; index++) {
        const nomeDev = sortedList[index].nome;
        const idDev = sortedList[index].id;
        if (sortedList[index].id > 0) {
          labels.push(nomeDev);
          values.push(idDev);
        }
      }
      setDevOptions(labels);
      setDevValues(values);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const updateList = () => {
    getSistemas((list: Sistema[]) => setSistemas(list.filter((d) => d.id > 0)));
  };
  const columns: TableColumn[] = [
    { label: "Id", field: "id" },
    { label: "Nome", field: "nome" },
    { label: "Tecnologia", field: "tecnologia" },
    { label: "Banco", field: "banco" },
    { label: "IP", field: "ip" },
    { label: "Servidor", field: "servidor" },
    { label: "Responsável", field: "responsavel.nome" },
    { label: "Reserva", field: "reserva.nome" },
    { label: "Ativo", field: "ativo", formatter: (ativo) => (ativo ? "Sim" : "Não") },
  ];
  const Buttons = () => {
    const { setMode, setItem, mode, item } = useModule();
    const handleNew = () => {
      setItem({} as Sistema);
      setItem({ id: "Novo" });
      setMode("Insert");
    };
    const handleEdit = () => {
      setItem({ ...item });
      setMode("Edit");
    };
    const handleDelete = () => {
      setItem({ ...item });
      setMode("Delete");
    };
    const handleView = () => {
      setItem({ ...item });
      setMode("View");
    };
    const cantInsert = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || usuario.role === "ROLE_VISITANTE";
    const cantEdit =
      mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined || usuario.role === "ROLE_VISITANTE";
    const cantView = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined;
    return (
      <>
        <Button className="rounded-0" label="Novo" icon="new" disabled={cantInsert} onClick={handleNew} />
        <Button className="rounded-0" label="Editar" icon="edit" disabled={cantEdit} onClick={handleEdit} />
        {/* <Button className="rounded-0" label="Excluir" icon="delete" disabled={cantEdit} onClick={handleDelete} /> */}
        <Button className="rounded-top-right" label="Visualizar" icon="view" disabled={cantView} onClick={handleView} />
      </>
    );
  };
  const Filtros = () => {
    const handleSearchChange = (value: string) => {
      if (value !== "") {
        const searchFilter: SearchRule = {
          fields: ["id", "nome", "tecnologia", "banco", "ip", "servidor", "responsavel.nome", "reserva.nome"],
          data: value,
          op: "CT",
        };
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
      if (loaded) setList(sistemas);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);
    const handleSelect = (id: number) => {
      const find = sistemas.find((o) => o.id === id);
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
        id="sistemas"
        data={sistemas}
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
      item.id_responsavel = parseInt(item.id_responsavel);
      item.id_reserva = parseInt(item.id_reserva);
      if (mode === "Insert") {
        delete item.id;
        postSistema(item as Sistema, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Edit") {
        putSistema(item as Sistema, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Delete") {
        deleteSistema(item as Sistema, () => {
          setMode("List");
          updateList();
        });
      }
    };
    return (
      <Form className="p-4" onSubmit={handleSubmit} schema={SistemasSchema}>
        <div className="input-group">
          <Input field="id" label="Id" readOnly />
          <Input field="nome" label="Nome" size={4} />
          <Input field="tecnologia" label="Tecnologia" size={2} />
          <Input field="banco" label="Banco" size={2} />
          <Input field="ip" label="IP" size={2} />
        </div>
        <div className="input-group">
          <Input field="servidor" label="Servidor" size={2} />

          <Select options={devOptions} values={devValues} field="id_responsavel" label="Responsável" size={3} />
          <Select options={devOptions} values={devValues} field="id_reserva" label="Reserva" size={3} />
          <Checkbox field="ativo" label="Ativo" size={1} />
        </div>
        <TextArea label="Descrição" field="descricao" size={12} />
        <TextArea label="Observações" field="observacoes" size={12} />
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
    <Module name="Sistemas" id="sistemas" buttons={Buttons}>
      <List>
        <ModuleTable />
      </List>
      <ModuleForm />
    </Module>
  );
};

export default Sistemas;
