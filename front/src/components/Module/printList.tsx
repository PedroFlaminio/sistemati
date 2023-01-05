import { FaPlus } from "react-icons/fa";
import { useRef, useState } from "react";
import Modal from "react-modal";

const PrintList = () => {
  const [prints, setPrints] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const AddPrint = () => {
    const open = () => {
      ref.current?.click();
    };
    const selectPrint = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setPrints([...prints, URL.createObjectURL(e.target.files[0])]);
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
  const Print = (props: { src: string }) => {
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
      setShowModal(false);
    };
    const openModal = () => {
      setShowModal(true);
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
          style={{
            height: "7.5rem",
            width: "12rem",
            cursor: "pointer",
            backgroundColor: "#DDD",
          }}
          onClick={openModal}
        >
          <img
            alt="Print"
            src={props.src}
            style={{
              maxHeight: "7.5rem",
              maxWidth: "12rem",
            }}
          />
        </div>
      </>
    );
  };
  return (
    <div className="d-flex flex-wrap col-12 px-1">
      {prints.map((p) => {
        return <Print src={p} />;
      })}
      <AddPrint />
    </div>
  );
};

export default PrintList;
