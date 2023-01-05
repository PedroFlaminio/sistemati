import * as yup from "yup";
import * as validators from "cpf-cnpj-validator";

const cpf = (label: string) => yup.string().label(label).default("").test({  
  test: (value: any) => (validators.cpf.isValid(value) || value === "" || value === "___.___.___-__") ,
  message: label + ': CPF inválido.'
});

const cnpj = (label: string) => yup.string().label(label).default("").test({
  test: (value: any) => (validators.cnpj.isValid(value) || value === ""|| value === "___.___.___-__"),
  message: label + ': CNPJ inválido.'
});
const Schemas = {...yup,cpf,cnpj}

export default Schemas;