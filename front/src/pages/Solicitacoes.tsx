import { useEffect, useState } from "react";
import Module from "../components/Module";
import { Sistema, Solicitacao } from "../utils/types";
import List from "../components/Module/list";
import useModule from "../components/Module/context";
import Form from "../components/Module/form";
import Input from "../components/Module/input";
import Table, { SearchRule, TableColumn } from "../components/Module/table";
import FilterInput from "../components/Module/filterInput";
import useApi from "../context/ApiContext";
import yup from "../utils/schemas";
import useApp, { Item } from "../context/AppContext";
import Button from "../components/Module/button";
import Select from "../components/Module/select";
import Checkbox from "../components/Module/checkbox";
import TextArea from "../components/Module/textArea";
import DateInput from "../components/Module/dateInput";
import { dateTimeToDateStrUs, dateToStr, jsDateToDate } from "../utils/functions";
import PrintList from "../components/Module/printList";
import { Tab, TabView } from "../components/TabView";

const SolicitacoesSchema = yup.object().shape({
  nome: yup.string().required().label("Nome"),
  //endereco: yup.string().required().label("Endereço"),
});

const Solicitacoes = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  //const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [filterSearch, setFilterSearch] = useState<SearchRule>();

  const [devOptions, setDevOptions] = useState<string[]>([]);
  const [devValues, setDevValues] = useState<number[]>([]);

  const [sisOptions, setSisOptions] = useState<string[]>([]);
  const [sisValues, setSisValues] = useState<number[]>([]);

  const { getSolicitacoes, postSolicitacao, putSolicitacao, deleteSolicitacao, getDevs, getSistemas, loaded } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) updateList();
    getDevs((list) => {
      const sortedList = list.sort((a, b) => a.nome.localeCompare(b.nome));
      const labels = ["Não Definido"];
      const values = [0];
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
    getSistemas((list) => {
      const sortedList = list.sort((a, b) => a.nome.localeCompare(b.nome));
      const labels = ["Não Definido"];
      const values = [0];
      for (let index = 0; index < sortedList.length; index++) {
        const nomeSis = sortedList[index].nome;
        const idSis = sortedList[index].id;
        if (sortedList[index].id > 0) {
          labels.push(nomeSis);
          values.push(idSis);
        }
      }
      setSisOptions(labels);
      setSisValues(values);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const updateList = () => {
    getSolicitacoes((list: Solicitacao[]) => setSolicitacoes(list.filter((d) => d.id > 0)));
  };
  const columns: TableColumn[] = [
    { label: "Id", field: "id" },
    { label: "Nome", field: "nome" },
    { label: "Aberto Em", field: "dataCriacao" },
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
      setItem({ id: "Novo", dataCriacao: jsDateToDate(new Date()), usuario: usuario.username, tipo: "Erro no sistema", status: "Nova" });
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
        <Button className="rounded-0" label="Excluir" icon="delete" disabled={cantEdit} onClick={handleDelete} />
        <Button className="rounded-top-right" label="Visualizar" icon="view" disabled={cantView} onClick={handleView} />
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
      <div className="row row-cols-auto p-2 bg-light border-light border rounded-bottom mx-0 justify-content-end">
        <FilterInput placeholder="Pesquisar..." defaultValue={filterSearch?.data} handleBtnClick={handleSearchChange} />
      </div>
    );
  };
  const ModuleTable = () => {
    const { setList, setItem, setMode, item } = useModule();
    useEffect(() => {
      if (loaded) setList(solicitacoes);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);
    const handleSelect = (id: number) => {
      const find = solicitacoes.find((o) => o.id === id);
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
        id="solicitacoes"
        data={solicitacoes}
        columns={columns}
        handleSelect={handleSelect}
        handleDoubleClick={handleDbClick}
        footer={Filtros}
        searchFilter={filterSearch}
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
        postSolicitacao(item as Solicitacao, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Edit") {
        putSolicitacao(item as Solicitacao, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Delete") {
        deleteSolicitacao(item as Solicitacao, () => {
          setMode("List");
          updateList();
        });
      }
    };
    const columnsHistoricos = [
      { label: "Id", field: "id" },
      { label: "Data", field: "createdDate", formatter: dateToStr },
      { label: "Ação", field: "acao" },
      { label: "Usuário", field: "createdBy" },
    ];
    const HistoricosTable = () => <Table id="chamados_historicos" columns={columnsHistoricos} data={item.historicoList} />;
    const tiposDeErro = ["Dados incorretos", "Documentação", "Erro no sistema", "Sugestão", "Sistema Inacessível"];
    const criticidades = ["Médio", "Grave", "Urgente"];
    return (
      <Form className="p-4" onSubmit={handleSubmit} schema={SolicitacoesSchema}>
        <div className="input-group">
          <Input field="id" label="Id" readOnly />
          <Input field="usuario" label="Usuário" size={2} readOnly />
          <DateInput field="dataCriacao" label="Criado em" size={1} formatter={dateTimeToDateStrUs} readOnly />
          <Input field="status" label="Status" size={2} readOnly />
        </div>
        <div className="input-group">
          <Select options={sisOptions} values={sisValues} field="id_sistema" label="Sistema" size={2} />
          <Select options={tiposDeErro} values={tiposDeErro} field="tipo" label="Tipo" size={2} />
          <Select options={criticidades} values={criticidades} field="criticidade" label="Criticidade" size={2} />
        </div>
        <div className="input-group">
          <Input field="resumo" label="Resumo do problema" size={6} />
          <Checkbox field="reproduzivel" label="Reproduzível" />
        </div>
        <div className="input-group">
          <TextArea label="Problema e como reproduzir" divClassName="px-2 col-12 col-xl-10" />
        </div>
        <div className="input-group mb-3">
          <TextArea label="Resolução sugerida(opcional)" divClassName="px-2 col-12 col-xl-10" />
        </div>
        <TabView tabClassName="tab-max" initial="Materiais">
          <Tab title="Captura de Tela">
            <PrintList />
          </Tab>
          <Tab title="Histórico">
            <HistoricosTable />
          </Tab>
          <Tab title="Desenvolvimento">
            <></>
          </Tab>
        </TabView>
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
    <Module name="Solicitações" id="solicitacoes" buttons={Buttons}>
      <List>
        <ModuleTable />
      </List>
      <ModuleForm />
    </Module>
  );
};

export default Solicitacoes;
