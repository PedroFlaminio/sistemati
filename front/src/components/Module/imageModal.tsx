import { ReactNode, useState } from "react";
import { JsxElement } from "typescript";

type ImageModalProperties = {
  images: {
    id: number;
    url: string;
    alt: string;
  }[];
  handleClose: () => void;
  ButtonPanel: (props: { id: number }) => JSX.Element;
  index: number;
};

const ImageModal = (props: ImageModalProperties) => {
  const { images, handleClose,ButtonPanel } = props;
  const [index, setIndex] = useState(props.index);
  return (
    <div className="modal-image">
      <div className="close">
        <span className="p-4" onClick={() => handleClose()}>
          &times;
        </span>
      </div>
      <div className="carousel slide">
        <div className="carousel-inner">
          {images?.map((img, i) => {
            return (
              <div className={`carousel-item flex-column ${index === i && "d-flex justify-content-center"}`}>
                <img className="modal-image-content" src={img.url} alt={img.alt} />
                <div className="caption">
                  {img.alt}
                  <ButtonPanel id={img.id} />
                </div>
              </div>
            );
          })}
        </div>
        {index !== 0 &&
        <button type="button" className="carousel-control-prev" onClick={() => setIndex(index - 1)}>
          <span className="carousel-control-prev-icon"></span>
          <span className="sr-only">Previous</span>
        </button>}
        {index < (images.length - 1) &&
        <button type="button" className="carousel-control-next" onClick={() => setIndex(index + 1)}>
          <span className="carousel-control-next-icon"></span>
          <span className="sr-only">Next</span>
        </button>}
      </div>
    </div>
  );
};

export default ImageModal;
