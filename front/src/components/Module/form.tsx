import { FormHTMLAttributes, ReactNode, useEffect } from "react";
import useModule, { ModuleItem, ModuleError } from "./context";
import ptBr from "../../utils/pt-br.locales";
import * as yup from "yup";
import { TypeOfShape } from "yup/lib/object";
yup.setLocale(ptBr);

type FormProps = {
  children: ReactNode;
  aditionalModes?: string[]
  schema?: yup.ObjectSchema<TypeOfShape<ModuleItem>>;
  ref?: React.RefObject<HTMLFormElement>
  onSubmitInvalid?: () => void;
} & FormHTMLAttributes<HTMLFormElement>;

const Form = (props: FormProps) => {
  const { mode, item, setModuleErrors, moduleErrors } = useModule();
  const { onSubmit, ...FormHTMLAttributes } = props;
  useEffect(() => {
    setModuleErrors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.schema)
      props.schema
        ?.validate(item, { abortEarly: false })
        .then(function (value) {
          if (onSubmit) onSubmit(e);
        })
        .catch(function (err) {
          let erros: ModuleError[] = [];
          err.inner.forEach((e: any) => {
            if (e.params.label) erros.push({ field: e.params.label, error: e.message });
          });
          if (props.onSubmitInvalid) props.onSubmitInvalid()
          setModuleErrors(erros);
          window.scrollTo(0,0)
        });
    else if (onSubmit) onSubmit(e);
  };

  const ErrorsPanel = () =>
    moduleErrors.length > 0 ? (
      <>
        <div className="alert alert-dismissible alert-danger py-2">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            onClick={() => {
              setModuleErrors([]);
            }}
          />
          <strong>Erro!</strong>
          <br />
          {moduleErrors.map((e) => (
            <div key={e.field}>{e.error}</div>
          ))}
        </div>
      </>
    ) : (
      <></>
    );
  return ["Delete", "Edit", "Insert", "View"].indexOf(mode) !== -1 ||(props.aditionalModes &&  props.aditionalModes.indexOf(mode) !== -1) ? (
    <form onSubmit={submit} {...FormHTMLAttributes} ref={props.ref} >
      <ErrorsPanel  />
      {props.children}
    </form>
  ) : (
    <></>
  );
};

export default Form;
