import { ReactNode } from "react";
type PageProps = {
  children: ReactNode;
  buttons: any;
  title: string;
  container?: boolean | false;
};
const Frame = (props: PageProps) => {
  const { children, container, title, buttons } = props;
  const TitleBar = () => {
    return (
      <nav className={`no-print navbar d-flex align-items-stretch justify-content-start p-0 mt-2 ${container ? "container" : ""}`}>
        <div className="align-middle border border-bottom-0 border-primary bg-white rounded-top px-4 col-4">
          <h3 className="mt-2 pb-0 text-primary">
            <strong>{title}</strong>
          </h3>
        </div>
        <div className="d-flex align-items-end me-3">
          <div className="btn-group">{buttons()}</div>
        </div>
      </nav>
    );
  };
  return (
    <>
      <TitleBar />
      <div className={`px-4 pt-3 bg-white border border-primary rounded-frame ${container ? "container" : ""}`}>{children}</div>
    </>
  );
};

export default Frame;
