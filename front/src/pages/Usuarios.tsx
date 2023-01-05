import { useEffect, useState } from "react";
import Module from "../components/Module";
import { User } from "../utils/types";
import List from "../components/Module/list";
import useModule, { ModuleItem } from "../components/Module/context";
import Form from "../components/Module/form";
import Input from "../components/Module/input";
import Table, { SearchRule } from "../components/Module/table";
import FilterInput from "../components/Module/filterInput";
import useApi from "../context/ApiContext";
import yup from "../utils/schemas";
import useApp from "../context/AppContext";
import Select from "../components/Module/select";
import Button from "../components/Module/button";
import DropDownButton from "../components/Module/dropdownButton";
import DropDownItem from "../components/Module/dropdownItem";

const MODULE_NAME = "usuarios";
const MODULE_LABEL = "Usuarios";

const UsuariosSchema = yup.object().shape({
  role: yup.string().required().label("Papel"),
});

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filterSearch, setFilterSearch] = useState<SearchRule>();
  const {
    getUsuarios,
    getUsuarioByMatricula,
    postUsuario,
    putUsuario,
    deleteUsuario,
    alterarSenhaUsuario,
    ativaUsuarioById,
    inativaUsuarioById,
    loaded,
  } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) update();
  }, [loaded]);
  const update = () => {
    getUsuarios((usuarios: User[]) => {
      setUsuarios(usuarios);
    });
  };
  const getRoleFormated = (role: string) => {
    switch (role) {
      case "ROLE_ATENDENTE":
        return "Atendente";
      case "ROLE_AGENTE":
        return "Agente";
      case "ROLE_ADMIN":
        return "Administrador";
      default:
        return "";
    }
  };
  const getAtivoFormated = (ativo: boolean) => (ativo ? "Sim" : "Não");
  const columns = [
    { label: "Id", field: "id" },
    { label: "Matrícula", field: "matricula" },
    { label: "Username", field: "username" },
    { label: "Nome", field: "nome" },
    { label: "Papel", field: "role", formatter: getRoleFormated },
    { label: "Interno", field: "interno", formatter: (interno: boolean) => (interno ? "Sim" : "Não") },
    { label: "Ativo", field: "active", formatter: getAtivoFormated },
  ];
  const Buttons = () => {
    const { setMode, setItem, mode, item } = useModule();
    const handleNew = (interno: boolean) => {
      setItem({} as User);
      setItem({ id: "Novo", interno });
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
    const handleResetarSenha = () => {
      alterarSenhaUsuario(item.id);
    };
    const handleAtivarUser = () => {
      ativaUsuarioById(item.id, update);
    };
    const handleInativarUser = () => {
      inativaUsuarioById(item.id, update);
    };
    const handleView = () => {
      setItem({ ...item });
      setMode("View");
    };
    const cantInsert = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || usuario.role === "ROLE_VISITANTE";
    const cantEdit =
      mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined || usuario.role === "ROLE_VISITANTE";
    const cantView = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined;
    const cantResetPass = cantEdit || item.interno;
    return (
      <>
        <DropDownButton className="rounded-0" label="Novo" icon="new" disabled={cantInsert}>
          <DropDownItem label="Interno" onClick={() => handleNew(true)} />
          <DropDownItem label="Externo" onClick={() => handleNew(false)} />
        </DropDownButton>
        <Button className="rounded-0" label="Editar" icon="edit" disabled={cantEdit} onClick={handleEdit} />
        {/* <Button className="rounded-0" label="Excluir" icon="delete" disabled={cantEdit} onClick={handleDelete} /> */}
        <Button className="rounded-0" label="Visualizar" icon="view" disabled={cantView} onClick={handleView} />
        <Button className="rounded-0" label="Ativar" icon="ativo" disabled={cantEdit} onClick={handleAtivarUser} />
        <Button className="rounded-0" label="Inativar" icon="inativo" disabled={cantEdit} onClick={handleInativarUser} />
        <Button className="rounded-top-right" label="Resetar Senha" icon="key" disabled={cantResetPass} onClick={handleResetarSenha} />
      </>
    );
  };
  const Filtros = () => {
    const handleSearchChange = (value: string) => {
      if (value !== "") {
        const searchFilter: SearchRule = { fields: ["id", "nome", "username"], data: value, op: "CT" };
        setFilterSearch(searchFilter);
      } else setFilterSearch(undefined);
    };
    return (
      <div className="row row-cols-auto p-2 bg-light border-light border rounded-bottom mx-0  justify-content-between">
        <div className="d-flex flex-row">
          <div className="mt-1 px-3 alert-dark rounded border border-dark"></div>
          <span className="px-2 mt-1 font-weight-bold align-content-center">inativo</span>
        </div>
        <div className="">
          <FilterInput placeholder="Pesquisar..." defaultValue={filterSearch?.data} handleBtnClick={handleSearchChange} />
        </div>
      </div>
    );
  };
  const ModuleTable = () => {
    const { setList, setItem, setMode, item } = useModule();
    useEffect(() => {
      if (loaded) setList(usuarios);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);
    const handleSelect = (id: number) => {
      const find = usuarios.find((o) => o.id === id);
      if (find) {
        setItem(find);
      }
    };
    const handleDbClick = () => {
      setItem({ ...item });
      setMode("View");
    };
    const handleRenderRowColor = (item: ModuleItem) => {
      if (!item.active) return "table-gray";
      else return "";
    };
    return (
      <Table
        id="usuarios"
        data={usuarios}
        columns={columns}
        handleSelect={handleSelect}
        handleDoubleClick={handleDbClick}
        handleRenderRowColor={handleRenderRowColor}
        footer={Filtros}
        searchFilter={filterSearch}
      />
    );
  };
  const ModuleForm = () => {
    const { setMode, setItem, mode, setModuleErrors, moduleErrors, item } = useModule();
    const handleCancelar = () => {
      setMode("List");
      setItem({});
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const erros = [];
      if (item.interno) {
        if (!item.matricula || item.matricula === "") erros.push({ error: "Matrícula: Campo obrigatório", field: "Matrícula" });
      } else {
        if (!item.nome || item.nome === "") erros.push({ error: "Nome: Campo obrigatório", field: "Nome" });
        if (!item.username || item.username === "") erros.push({ error: "Usuário: Campo obrigatório", field: "Usuário" });
      }
      if (erros.length > 0) setModuleErrors(erros);
      else {
        if (mode === "Insert") {
          delete item.id;
          postUsuario(item as User, () => {
            setMode("List");
            getUsuarios((list: User[]) => setUsuarios(list));
          });
        } else if (mode === "Edit") {
          putUsuario(item as User, () => {
            setMode("List");
            getUsuarios((list: User[]) => setUsuarios(list));
          });
        } else if (mode === "Delete") {
          deleteUsuario(item as User, () => {
            setMode("List");
            getUsuarios((list: User[]) => setUsuarios(list));
          });
        }
      }
    };
    const searchUser = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      getUsuarioByMatricula(e.target.value, (resp) => {
        setItem({ ...item, nome: resp.name, username: resp.username });
      });
    };
    return (
      <Form className="p-4" onSubmit={handleSubmit} schema={UsuariosSchema}>
        <div className="input-group">
          <Input field="id" label="Id" readOnly />
          {item.interno && (
            <Input field="matricula" label="Matrícula" size={1} disabled={!item.interno} type="number" onBlur={searchUser} />
          )}
          <Input field="nome" label="Nome" size={3} disabled={item.interno} />
          <Input field="username" label="Usuário" disabled={item.interno} size={3} />
          {usuario.role === "ROLE_ADMIN" && (
            <Select
              field="role"
              label="Papel"
              options={["Selecione", "Atendente", "Agente", "Administrador"]}
              values={["", "ROLE_ATENDENTE", "ROLE_AGENTE", "ROLE_ADMIN"]}
              size={2}
            />
          )}
          {usuario.role !== "ROLE_ADMIN" &&
            (item.role !== "ROLE_ADMIN" ? (
              <Select
                field="role"
                label="Papel"
                options={["Selecione", "Atendente", "Monitor"]}
                values={["", "ROLE_ATENDENTE", "ROLE_MONITOR"]}
                size={2}
              />
            ) : (
              <Input field="role" label="Papel" readOnly value="Administrador" size={2} />
            ))}
        </div>
        {/* <div className="d-flex flex-row my-3">
          {ModulosAcessos.map((m,i)=> <AcessosModulo modulo={m} key={i}/> )}
        </div> */}
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
    <Module name={MODULE_LABEL} id={MODULE_NAME} buttons={Buttons}>
      <List>
        <ModuleTable />
      </List>
      <ModuleForm />
    </Module>
  );
};

export default Usuarios;
