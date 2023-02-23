import { useEffect, useState } from "react";
import Module from "../components/Module";
import { Solicitacao } from "../utils/types";
import List from "../components/Module/list";
import useModule from "../components/Module/context";
import Form from "../components/Module/form";
import Input from "../components/Module/input";
import Table, { SearchRule, TableColumn } from "../components/Module/table";
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
import PrintList from "../components/Module/printList";
import { Tab, TabView } from "../components/TabView";
import { useParams } from "react-router-dom";
import { ApiURL } from "../configs";

const SolicitacoesSchema = yup.object().shape({
  id_sistema: yup.number().required().moreThan(0, "Sistema: Campo obrigatório.").label("Sistema"),
  resumo: yup.string().required().label("Resumo do problema"),
  descricao: yup.string().required().label("Problema e como reproduzir"),
});

const Solicitacoes = (props: { tipo: "Minhas" | "Pendentes" | "Resolvidas" }) => {
  const { id } = useParams();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filterSearch, setFilterSearch] = useState<SearchRule>();

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
    getDevs,
    getSistemas,
    loaded,
  } = useApi();
  const { usuario } = useApp();
  useEffect(() => {
    if (loaded) {
      updateList();

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, props.tipo]);

  const updateList = () => {
    if (id !== undefined) return;
    else if (props.tipo === "Minhas") getSolicitacoesByUser((list: Solicitacao[]) => setSolicitacoes(list));
    else if (props.tipo === "Pendentes") getSolicitacoes((list: Solicitacao[]) => setSolicitacoes(list.filter((d) => d.id > 0)));
    else if (props.tipo === "Resolvidas") getSolicitacoesResolvidas((list: Solicitacao[]) => setSolicitacoes(list.filter((d) => d.id > 0)));
  };
  const columns: TableColumn[] = [
    { label: "Id", field: "id" },
    { label: "Resumo", field: "resumo" },
    { label: "Tipo", field: "tipo" },
    { label: "Status", field: "status" },
    { label: "Criticidade", field: "criticidade" },
    { label: "Sistema", field: "sistema.nome" },
    { label: "Usuário", field: "nome" },
    // { label: "Ordem", field: "ordem" },
    { label: "Aberto Em", field: "dataCriacao", formatter: dateStrToLocale },
    { label: "Atualizado Em", field: "updatedAt", formatter: dateStrToLocale },
  ];
  const Buttons = () => {
    const { setMode, setItem, mode, item } = useModule();
    const handleNew = () => {
      console.log(usuario);
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
      setMode("Insert");
    };
    const handleEdit = () => {
      getSolicitacaoById(item.id, (solicitacao) => {
        console.log(solicitacao);
        setItem({ ...solicitacao });
        setMode("Edit");
      });
    };
    const handleDelete = () => {
      getSolicitacaoById(item.id, (solicitacao) => {
        setItem({ ...solicitacao });
        setMode("Delete");
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
          fields: ["id", "resumo", "tipo", "criticidade", "username", "dataCriacao", "updatedAt"],
          data: value,
          op: "CT",
        };
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
    const { setItem, setMode, item, mode } = useModule();
    useEffect(() => {
      if (id && mode !== "View") setMode("View");
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
        columns={columns}
        handleSelect={handleSelect}
        handleDoubleClick={handleDbClick}
        footer={Filtros}
        searchFilter={filterSearch}
      />
    );
  };
  const ModuleForm = () => {
    const { setMode, setItem, mode, item, files, fileList, setFiles } = useModule();

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
      var form_data = files;
      var key: string;
      if (mode === "Insert") {
        delete item.id;
        for (key in item) {
          form_data.append(key, item[key]);
        }
        for (let index = 0; index < fileList.length; index++) {
          const element = fileList[index];
          form_data.append(`arquivos[${index}]`, element);
        }
        postSolicitacao(form_data, () => {
          setMode("List");
          updateList();
        });
      } else if (mode === "Edit") {
        const excluir = ["resolucao", "resolvido_por", "resolvido_em", "testado_por", "testado_em", "deferido", "historicos", "arquivos"];
        const arquivosDeleted = [];
        for (let index = 0; index < item.arquivos.length; index++) {
          const arq = item.arquivos[index];
          if (arq.deleted) arquivosDeleted.push(arq.id);
        }
        if (arquivosDeleted.length > 0) form_data.append(`arquivosDeleted`, JSON.stringify(arquivosDeleted));
        for (key in item) {
          if (excluir.indexOf(key) < 0) form_data.append(key, item[key]);
        }
        for (let index = 0; index < fileList.length; index++) {
          const element = fileList[index];
          form_data.append(`arquivos[${index}]`, element);
        }
        // for (const value of form_data) console.log(value);
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
      setItem({});
      setFiles(new FormData());
    };
    const columnsHistoricos = [
      { label: "Id", field: "id" },
      { label: "Data", field: "data", formatter: dateStrToLocale },
      { label: "Descrição", field: "descricao" },
      { label: "Usuário", field: "nome" },
    ];
    const HistoricosTable = () => <Table id="chamados_historicos" columns={columnsHistoricos} data={item.historicos} />;
    const tiposDeErro = ["Erro no sistema", "Melhoria", "Sistema Inacessível"];
    const status = ["Nova", "Em Análise", "Em Andamento", "Em Espera", "Resolvido"];
    const criticidades = ["Média", "Grave", "Urgente"];
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
          <Select options={tiposDeErro} values={tiposDeErro} field="tipo" label="Tipo" size={2} />
          <Select options={criticidades} values={criticidades} field="criticidade" label="Criticidade" size={2} />
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
        <TabView tabClassName="tab-max" initial="Materiais">
          <Tab title="Capturas de Tela">
            <PrintList field="arquivos" urlArquivos={ApiURL + "arquivos/"} />
          </Tab>
          <Tab title="Desenvolvimento">
            <div className="input-group">
              <DateInput field="dataCriacao" label="Criado em" size={2} formatter={dateTimeToDateStrUs} readOnly />
              <Select options={devOptions} values={devValues} field="id_dev" label="Dev" size={2} />
              <Select options={status} values={status} field="status" label="Status" size={2} />
              <Select options={criticidades} values={criticidades} field="criticidade" label="Criticidade" size={2} />
              <Checkbox
                field="solicitado_diretor"
                label="Solicitado por um diretor"
                tooltip="Marque se o problema é facilmente reproduzido, se possível descreva como chegou a esse erro"
              />
              <div className="input-group mb-3">
                <TextArea field="sugestao" label="Resolução" divClassName="px-2 col-12 col-xl-10" />
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
