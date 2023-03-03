import { FaPlus, FaRegFileAlt, FaTrashAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import useModule from "./context";
type PrintListProps = {
  field: string;
  urlArquivos: string;
  accept: string;
  isPrint?: boolean;
};

type Arquivo = {
  id: number;
  id_solicitacao: number;
  nome_arquivo: string;
  deleted: boolean;
};
const FileList = (props: PrintListProps) => {
  const [prints, setPrints] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { field, urlArquivos, isPrint } = props;
  const { item, setItem, setFilesList, fileList, setPrintList, printList, mode } = useModule();

  const AddPrint = () => {
    const open = () => {
      ref.current?.click();
    };
    const selectPrint = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        if (e.currentTarget.files[0].size > 20 * 1024 * 1024) {
          window.alert("Tamanho máximo ultrapassado!(20MB)");
          e.currentTarget.value = "";
          return;
        }
        if (props.isPrint) {
          const list = [...printList, e.currentTarget.files[0]];
          setPrintList(list);
          prints.push(URL.createObjectURL(e.currentTarget.files[0]));
          setPrints([...prints]);
        } else {
          const list = [...fileList, e.currentTarget.files[0]];
          setFilesList(list);
          prints.push(e.currentTarget.files[0].name);
          setPrints([...prints]);
        }
      }
    };
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-white p-5 m-1 rounded"
        style={{
          border: "1px solid #cbc8d0",
          height: "7.5rem",
          minWidth: "12rem",
          cursor: "pointer",
        }}
        onClick={open}
      >
        <FaPlus size={20} color="#777" />
        <input type="file" accept={props.accept} className="d-none" ref={ref} onChange={selectPrint} />
      </div>
    );
  };
  const Print = (props: { src: string; gravado?: boolean; index: number }) => {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
      setShowModal(false);
    };
    const openModal = () => {
      setShowModal(true);
    };
    const handleRemove = () => {
      if (props.gravado) {
        item[field][props.index].deleted = true;
        setItem({ ...item });
      } else {
        prints.splice(props.index, 1);
        setPrints([...prints]);
      }
    };
    return (
      <>
        {showModal && (
          <div className="modal-image" onClick={closeModal}>
            <div className="close">
              <span className="p-4" onClick={closeModal}>
                &times;
              </span>
            </div>
            <img className="modal-image-content" alt="print" src={props.src} />
          </div>
        )}
        <div
          className="d-flex justify-content-center align-items-center p-5 m-1 rounded"
          style={{ height: "7.5rem", width: "12rem", cursor: "pointer", backgroundColor: "#DDD" }}
          onClick={openModal}
        >
          <img alt="Print" src={props.src} style={{ maxHeight: "7.5rem", maxWidth: "12rem" }} />
        </div>
        {(mode === "Edit" || mode === "Insert") && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRemove}
            style={{ height: 32, width: 32, padding: 0, borderRadius: 32, marginLeft: -17, marginTop: -5 }}
          >
            <FaTrashAlt style={{ marginTop: -3 }} />
          </button>
        )}
      </>
    );
  };
  const File = (props: { src: string; gravado?: boolean; index: number; name: string }) => {
    const downloadFile = () => {
      //let fileURL = URL.createObjectURL(props.src);
      window.open(props.src, "_blank");
    };
    const handleRemove = () => {
      if (props.gravado) {
        item[field][props.index].deleted = true;
        setItem({ ...item });
      } else {
        prints.splice(props.index, 1);
        setPrints([...prints]);
      }
    };
    return (
      <div className="d-flex flex-row">
        <span
          className="d-flex flex-column justify-content-center align-items-center m-1 rounded"
          style={{ height: "7.5rem", width: "12rem", cursor: "pointer", backgroundColor: "#FFF", border: "1px solid #cbc8d0" }}
          onClick={downloadFile}
        >
          <FaRegFileAlt size={48} color={"#1b3573"} />
          <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "150px" }}>{props.name}</span>
        </span>
        {(mode === "Edit" || mode === "Insert") && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRemove}
            style={{ height: 32, width: 32, padding: 0, borderRadius: 32, marginLeft: -17, marginTop: -5 }}
          >
            <FaTrashAlt style={{ marginTop: -3 }} />
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="d-flex flex-wrap col-12 px-1">
      {(item[field] as Arquivo[])?.map((p, i) => {
        return !p.deleted && props.isPrint ? (
          <Print src={urlArquivos + p.id} key={i} gravado index={i} />
        ) : (
          <File src={urlArquivos + p.id} key={i} gravado index={i} name={p.nome_arquivo} />
        );
      })}
      {prints?.map((p, i) => {
        return props.isPrint ? <Print src={p} key={i} index={i} /> : <File src={p} key={i} index={i} name={p} />;
      })}
      {(mode === "Edit" || mode === "Insert") && <AddPrint />}
    </div>
  );
};

export default FileList;
