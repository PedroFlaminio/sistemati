import { useEffect, useState } from "react";
import Module from "../components/Module";
import { Solicitacao } from "../utils/types";
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
import Select from "../components/Module/select";
import Checkbox from "../components/Module/checkbox";
import TextArea from "../components/Module/textArea";
import DateInput from "../components/Module/dateInput";
import { dateStrToLocale, dateTimeToDateStrUs, jsDateToDate } from "../utils/functions";
import FileList from "../components/Module/fileList";
import { Tab, TabView } from "../components/TabView";
import { useParams } from "react-router-dom";
import { ApiURL } from "../configs";
import FilterSelect from "../components/Module/filterSelect";

const SolicitacoesSchema = yup.object().shape({
  id_sistema: yup.number().required().moreThan(0, "Sistema: Campo obrigatório.").label("Sistema"),
  resumo: yup.string().required().label("Resumo do problema"),
  descricao: yup.string().required().label("Problema e como reproduzir"),
});
const TIPOS_ERROS = ["Erro no sistema", "Melhoria", "Sistema Inacessível"];
const STATUS = ["Nova", "Em Análise", "Em Andamento", "Em Espera", "Resolvido"];
const CRITICIDADE = ["Média", "Grave", "Urgente"];

const Solicitacoes = (props: { tipo: "Minhas" | "Pendentes" | "Resolvidas" }) => {
  const { id } = useParams();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const [filterSearch, setFilterSearch] = useState<SearchRule>();
  const [filterStatus, setFilterStatus] = useState<FilterRule>();
  const [filterDev, setFilterDev] = useState<FilterRule>();
  const [filterSistema, setFilterSistema] = useState<FilterRule>();

  const [devOptions, setDevOptions] = useState<string[]>([]);
  const [devValues, setDevValues] = useState<number[]>([]);

  const [sisOptions, setSisOptions] = useState<string[]>([]);
  const [sisValues, setSisValues] = useState<number[]>([]);

  const {
    getSolicitacaoById,
    getSolicitacoes,
    getSolicitacoesByUser,
    getSolicitacoesResolvidas,
    postSolicitacao,
    putSolicitacao,
    deleteSolicitacao,
    cancelarSolicitacao,
    getDevsAtivos,
    getSistemasAtivos,
    loaded,
  } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) {
      updateList();
      getDevsAtivos((list) => {
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
        const currentDev = list.find((d) => d.matricula === usuario.matricula);
        if (currentDev && props.tipo === "Pendentes") {
          const newFilter: FilterRule = { field: "dev.id", data: currentDev.id.toString(), operation: "CN", type: "S" };
          setFilterDev(newFilter);
        } else setFilterDev(undefined);
      });
      getSistemasAtivos((list) => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, props.tipo]);

  const updateList = () => {
    if (id !== undefined) return;
    else if (props.tipo === "Minhas") getSolicitacoesByUser((list: Solicitacao[]) => setSolicitacoes(list));
    else if (props.tipo === "Pendentes") getSolicitacoes((list: Solicitacao[]) => setSolicitacoes(list.filter((d) => d.id > 0)));
    else if (props.tipo === "Resolvidas") getSolicitacoesResolvidas((list: Solicitacao[]) => setSolicitacoes(list.filter((d) => d.id > 0)));
  };
  const columnsMinhas: TableColumn[] = [
    { label: "Id", field: "id" },
    { label: "Resumo", field: "resumo" },
    { label: "Tipo", field: "tipo" },
    { label: "Status", field: "status" },
    { label: "Criticidade", field: "criticidade" },
    { label: "Sistema", field: "sistema.nome" },
    { label: "Usuário", field: "nome" },
    { label: "Desenvolvedor", field: "dev.nome" },
    { label: "Ordem", field: "ordem" },
    { label: "Aberto Em", field: "dataCriacao", formatter: dateStrToLocale },
    { label: "Atualizado Em", field: "updatedAt", formatter: dateStrToLocale },
  ];
  const Buttons = () => {
    const { setMode, setItem, mode, item, setPrintList, setFilesList } = useModule();
    const handleNew = () => {
      setItem({});
      setItem({
        id: "Novo",
        status: "Nova",
        dataCriacao: jsDateToDate(new Date()),
        nome: usuario.nome,
        email: usuario.email,
        tipo: "Erro no sistema",
        criticidade: "Média",
      });
      setPrintList([]);
      setFilesList([]);
      setMode("Insert");
    };
    const handleEdit = () => {
      getSolicitacaoById(item.id, (solicitacao) => {
        setItem({ ...solicitacao });
        setMode("Edit");
      });
    };
    const handleView = () => {
      getSolicitacaoById(item.id, (solicitacao) => {
        setItem({ ...solicitacao });
        setMode("View");
      });
    };
    const handleCancelar = () => {
      cancelarSolicitacao(item.id, () => {
        setMode("List");
        updateList();
      });
    };
    const cantInsert = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || usuario.role === "ROLE_VISITANTE";
    const cantEdit =
      mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined || usuario.role === "ROLE_VISITANTE";
    const cantView = mode === "Edit" || mode === "Insert" || mode === "Agendamentos" || item.id === undefined;
    return (
      <>
        <Button className="rounded-0" label="Novo" icon="new" disabled={cantInsert} onClick={handleNew} />
        <Button className="rounded-0" label="Editar" icon="edit" disabled={cantEdit} onClick={handleEdit} />
        <Button className="rounded-0" label="Cancelar" icon="cancelar" disabled={cantEdit} onClick={handleCancelar} />
        <Button className="rounded-top-right" label="Visualizar" icon="view" disabled={cantView} onClick={handleView} />
      </>
    );
  };
  const Filtros = () => {
    const handleSearchChange = (value: string) => {
      if (value !== "") {
        const searchFilter: SearchRule = {
          fields: [
            "id",
            "resumo",
            "tipo",
            "status",
            "criticidade",
            "criticidade",
            "sistema.nome",
            "nome",
            "dev.nome",
            "dataCriacao",
            "updatedAt",
          ],
          data: value,
          op: "CT",
        };
        setFilterSearch(searchFilter);
      } else setFilterSearch(undefined);
    };
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value !== "") {
        const newFilter: FilterRule = { field: "status", data: e.currentTarget.value, operation: "CN", type: "S" };
        setFilterStatus(newFilter);
      } else setFilterStatus(undefined);
    };
    const handleDevChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value !== "") {
        const newFilter: FilterRule = { field: "dev.id", data: e.currentTarget.value, operation: "CN", type: "S" };
        setFilterDev(newFilter);
      } else setFilterDev(undefined);
    };
    const handleSistemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.currentTarget.value !== "") {
        const newFilter: FilterRule = { field: "sistema.id", data: e.currentTarget.value, operation: "CN", type: "S" };
        setFilterSistema(newFilter);
      } else setFilterSistema(undefined);
    };
    return (
      <div className="row row-cols-auto p-2 bg-light border-light border rounded-bottom mx-0 justify-content-end">
        <FilterSelect
          size={2}
          label="Status"
          onChange={handleStatusChange}
          options={["Todos", ...STATUS]}
          values={["", ...STATUS]}
          value={filterStatus?.data}
        />
        <FilterSelect
          size={2}
          label="Sistema"
          onChange={handleSistemaChange}
          options={["Todos", ...sisOptions]}
          values={["", ...sisValues]}
          value={filterSistema?.data}
        />
        <FilterSelect
          size={2}
          label="Dev"
          onChange={handleDevChange}
          options={["Todos", ...devOptions]}
          values={["", ...devValues]}
          value={filterDev?.data}
        />
        <FilterInput placeholder="Pesquisar..." defaultValue={filterSearch?.data} handleBtnClick={handleSearchChange} />
      </div>
    );
  };
  const ModuleTable = () => {
    const { setItem, setMode, item, mode } = useModule();
    useEffect(() => {
      if (id && mode !== "View") setMode("View");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);
    const handleSelect = (id: number) => {
      const find = solicitacoes.find((o) => o.id === id);
      if (find) {
        setItem(find);
      }
    };
    const handleDbClick = () => {
      getSolicitacaoById(item.id, (solicitacao) => {
        setItem({ ...solicitacao });
        setMode("View");
      });
    };
    return (
      <Table
        id="solicitacoes"
        order={props.tipo === "Pendentes" ? "ordem" : "updatedAt"}
        data={solicitacoes}
        columns={columnsMinhas}
        handleSelect={handleSelect}
        handleDoubleClick={handleDbClick}
        footer={Filtros}
        searchFilter={filterSearch}
        filters={[filterStatus, filterDev, filterSistema]}
      />
    );
  };
  const ModuleForm = () => {
    const { setMode, setItem, mode, item, files, fileList, setFiles, printList } = useModule();

    useEffect(() => {
      if (loaded) {
        if (id && item?.id?.toString() !== id) {
          getSolicitacaoById(parseInt(id), (sol) => setItem(sol));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancelar = () => {
      setMode("List");
      setItem({});
      setFiles(new FormData());
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      item.id_sistema = parseInt(item.id_sistema);
      item.id_dev = parseInt(item.id_dev);
      var form_data = files;
      if (mode === "Insert") {
        form_data.append("solicitacao", JSON.stringify(item));
        for (let index = 0; index < printList.length; index++) {
          const element = printList[index];
          form_data.append(`print[${index}]`, element);
        }
        for (let index = 0; index < fileList.length; index++) {
          const element = fileList[index];
          form_data.append(`arquivo[${index}]`, element);
        }
        postSolicitacao(form_data, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Edit") {
        const arquivosDeleted = [];
        for (let index = 0; index < item.arquivos.length; index++) {
          const arq = item.arquivos[index];
          if (arq.deleted) arquivosDeleted.push(arq.id);
        }
        if (arquivosDeleted.length > 0) form_data.append(`arquivosDeleted`, JSON.stringify(arquivosDeleted));
        form_data.append("solicitacao", JSON.stringify(item));
        for (let index = 0; index < printList.length; index++) {
          const element = printList[index];
          form_data.append(`print[${index}]`, element);
        }
        for (let index = 0; index < fileList.length; index++) {
          const element = fileList[index];
          form_data.append(`arquivo[${index}]`, element);
        }
        putSolicitacao(form_data, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Delete") {
        deleteSolicitacao(item as Solicitacao, () => {
          setMode("List");
          updateList();
        });
      }
      //setItem({});
      //setFiles(new FormData());
    };
    const columnsHistoricos = [
      { label: "Id", field: "id" },
      { label: "Data", field: "data", formatter: dateStrToLocale },
      { label: "Descrição", field: "descricao" },
      { label: "Usuário", field: "nome" },
    ];
    const HistoricosTable = () => <Table id="chamados_historicos" columns={columnsHistoricos} data={item.historicos} />;

    return (
      <Form className="p-4" onSubmit={handleSubmit} schema={SolicitacoesSchema}>
        <div className="input-group">
          <Input field="id" label="Id" readOnly />
          <DateInput field="dataCriacao" label="Criado em" size={3} formatter={dateTimeToDateStrUs} readOnly />
          <Input field="status" label="Status" size={3} readOnly />
        </div>
        <div className="input-group">
          <Input field="nome" label="Usuário" size={4} readOnly />
          <Input field="email" label="E-mail" size={4} readOnly />
        </div>
        <div className="input-group">
          <Select options={sisOptions} values={sisValues} field="id_sistema" label="Sistema" size={4} />
          <Select options={TIPOS_ERROS} values={TIPOS_ERROS} field="tipo" label="Tipo" size={2} />
          <Select options={CRITICIDADE} values={CRITICIDADE} field="criticidade" label="Criticidade" size={2} />
        </div>
        <div className="input-group">
          <Input field="resumo" label="Resumo do problema" size={6} />
          <Checkbox
            field="reproduzivel"
            label="Reproduzível"
            tooltip="Marque se o problema é facilmente reproduzido, se possível descreva como chegou a esse erro"
          />
        </div>
        <div className="input-group">
          <TextArea label="Problema e como reproduzir" field="descricao" divClassName="px-2 col-12 col-xl-10" />
        </div>
        <div className="input-group mb-3">
          <TextArea label="Resolução sugerida(opcional)" field="sugestao" divClassName="px-2 col-12 col-xl-10" />
        </div>
        <TabView tabClassName="tab-max" initial="Capturas de Tela">
          <Tab title="Capturas de Tela">
            <FileList field="prints" urlArquivos={ApiURL + "arquivos/"} accept="image/*" isPrint />
          </Tab>
          <Tab title="Arquivos Anexos">
            <FileList field="arquivos" urlArquivos={ApiURL + "arquivos/"} accept="*" />
          </Tab>
          <Tab title="Desenvolvimento" hide={!usuario.isDev}>
            <div className="input-group">
              <DateInput field="dataCriacao" label="Criado em" size={2} formatter={dateTimeToDateStrUs} readOnly />
              <Select options={devOptions} values={devValues} field="id_dev" label="Dev" size={2} />
              <Select options={STATUS} values={STATUS} field="status" label="Status" size={2} />
              <Checkbox
                field="solicitado_diretor"
                label="Solicitado por um diretor"
                tooltip="Marque se o problema é facilmente reproduzido, se possível descreva como chegou a esse erro"
              />
              <div className="input-group mb-3">
                <TextArea field="resolucao" label="Resolução" divClassName="px-2 col-12 col-xl-10" />
              </div>
            </div>
          </Tab>
          <Tab title="Histórico">
            <HistoricosTable />
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
