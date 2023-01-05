/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable no-template-curly-in-string */

const { toString } = Object.prototype;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== 'undefined' ? Symbol.prototype.toString : () => '';

const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;

function printNumber(val: any): string {
  if (val != +val) return 'NaN';
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? '-0' : `${val}`;
}

function printSimpleValue(val: any, quoteStrings: boolean = false): string | null {
  if (val == null || val === true || val === false) return `${val}`;

  const typeOf = typeof val;
  if (typeOf === 'number') return printNumber(val);
  if (typeOf === 'string') return quoteStrings ? `"${val}"` : val;
  if (typeOf === 'function') { return `[Function ${val.name || 'anonymous'}]`; }
  if (typeOf === 'symbol') { return symbolToString.call(val).replace(SYMBOL_REGEXP, 'Symbol($1)'); }

  const tag = toString.call(val).slice(8, -1);
  if (tag === 'Date') { return isNaN(val.getTime()) ? `${val}` : val.toISOString(val); }
  if (tag === 'Error' || val instanceof Error) { return `[${errorToString.call(val)}]`; }
  if (tag === 'RegExp') return regExpToString.call(val);

  return null;
}

function printValue(value: any, quoteStrings: boolean): string {
  const result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;

  return JSON.stringify(
    value,
    function (key: string, value: any) {
      const result = printSimpleValue(this[key], quoteStrings);
      if (result !== null) return result;
      return value;
    },
    2,
  );
}

export const mixed = {
  default: '${path}: Campo inválido.',
  required: '${path}: Campo obrigatório.',
  oneOf: 'Deve ter um dos seguintes valores: ${values}.',
  notOneOf: 'Não deve ter nenhum dos seguintes valores: ${values}.',
  notType: ({
    type, value, originalValue,
  }: any) => {
    const isCast = originalValue != null && originalValue !== value;
    let msg = `${`Deve ser do tipo \`${type}\`, `
      + `mas o valor final é: \`${printValue(value, true)}\``}${
      isCast
        ? ` (cast do valor \`${printValue(originalValue, true)}\`).`
        : '.'}`;

    if (value === null) {
      msg += '\nSe a intenção era usar "null" como um valor em branco marque o esquema como `.nullable()`.';
    }

    return msg;
  },
  defined: 'Não deve ser indefinido.',
};

export const string = {
  length: ({ length }: any) => `Deve ter exatamente ${length} ${length === 1 ? 'caractere' : 'caracteres'}.`,
  min: ({ min }: any) => `Deve ter pelo menos ${min} ${min === 1 ? 'caractere' : 'caracteres'}.`,
  max: ({ max }: any) => `Deve ter no máximo ${max} ${max === 1 ? 'caractere' : 'caracteres'}.`,
  matches: 'Deve corresponder ao padrão: "${regex}".',
  email: 'Deve ser um e-mail válido.',
  url: 'Deve ser uma URL válida.',
  trim: 'Não deve conter espaços adicionais no início nem no fim.',
  lowercase: 'Deve estar em letras minúsculas.',
  uppercase: 'Deve estar em letras maiúsculas.',
};

export const number = {
  min: 'Deve ser maior ou igual a ${min}.',
  max: 'Deve menor ou igual a ${max}.',
  lessThan: 'Deve ser menor que ${less}.',
  moreThan: 'Deve ser maior que ${more}.',
  notEqual: 'Não deve ser igual a ${notEqual}.',
  positive: 'Deve ser um número positivo.',
  negative: 'Deve ser um número negativo.',
  integer: 'Deve ser um número inteiro.',
};

export const date = {
  min: 'Deve ser posterior a ${min}.',
  max: 'Deve ser anterior a ${max}.',
};

export const boolean = {};

export const object = {
  noUnknown: 'Existem chaves desconhecidas: ${unknown}.',
};

export const array = {
  min: ({ min } : any) => `Deve ter pelo menos ${min} ${min === 1 ? 'item': 'itens'}.`,
  max: ({ max } : any) => `Deve ter no máximo ${max} ${max === 1 ? 'item': 'itens'}.`,
};

const ptBr = {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
};

export default ptBr;