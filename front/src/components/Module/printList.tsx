import { FaPlus, FaTrash, FaTrashAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "react-modal";
import { SetItemProp } from "../../utils/functions";
import useModule from "./context";
type PrintListProps = {
  field: string;
  urlArquivos: string;
};

type Arquivo = {
  id: number;
  id_solicitacao: number;
  nome_arquivo: string;
  deleted: boolean;
};
const PrintList = (props: PrintListProps) => {
  const [prints, setPrints] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const { field, urlArquivos } = props;
  const { item, setItem, setFilesList, fileList, mode } = useModule();
  const AddPrint = () => {
    const open = () => {
      ref.current?.click();
    };
    const selectPrint = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.files && e.currentTarget.files[0]) {
        prints.push(URL.createObjectURL(e.currentTarget.files[0]));
        var list = fileList;
        list.push(e.currentTarget.files[0]);
        setFilesList(list);
        setPrints([...prints]);
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
        <input type="file" accept="image/*" className="d-none" ref={ref} onChange={selectPrint} />
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
        //item[field].splice(props.index, 1);
        setItem({ ...item });
      } else {
        console.log(prints);
        prints.splice(props.index, 1);
        console.log(prints);
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
  return (
    <div className="d-flex flex-wrap col-12 px-1">
      {(item[field] as Arquivo[])?.map((p, i) => {
        return !p.deleted && <Print src={urlArquivos + p.id} key={i} gravado index={i} />;
      })}
      {prints?.map((p, i) => {
        return <Print src={p} key={i} index={i} />;
      })}
      {(mode === "Edit" || mode === "Insert") && <AddPrint />}
    </div>
  );
};

export default PrintList;
