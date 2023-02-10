import "./styles.css"

type SpinnerProps = {
  inner?: boolean;
  hide?: boolean
}
const Spinner = (props: SpinnerProps) => {
  const {inner = false} = props;
  const className = inner?"div-spinner-inner":"div-spinner"
  return (
    <div className={className}>
      <div className="spinner-border spinner-custom" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
