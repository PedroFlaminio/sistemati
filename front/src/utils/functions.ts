import jwtDecode from "jwt-decode";
import { JwtPayload } from "jsonwebtoken";
import { ModuleItem } from "../components/Module/context";

export const randomizeEmail = (original: String) => {
  let arrobaIndex = original.indexOf("@");
  let nome = original.substring(0, arrobaIndex);
  nome = nome.substring(0, 3) + "*".repeat(nome.length - 3);
  return nome + "@" + original.substring(arrobaIndex + 1);
};

export const isJwtExpired = (token: string) => {
  if (typeof token !== "string" || !token) return true;
  let isJwtExpired = false;
  const decoded = jwtDecode<JwtPayload>(token);
  const currentTime = new Date().getTime() / 1000;
  if (decoded.exp && currentTime > decoded.exp) isJwtExpired = true;
  return isJwtExpired;
};

export const GetItemProp = (item: { [key: string]: any } | undefined, fieldName: string) => {
  if (item === null || item === undefined) return "";
  var SplitedField = fieldName.split(".");

  var object = item;
  for (var i = 0; i < SplitedField.length; i++) {
    var currentField = SplitedField[i].slice(0, 1).toLowerCase() + SplitedField[i].slice(1, SplitedField[i].length);
    if (i === SplitedField.length - 1) {
      if (object !== null && object !== undefined) return object[currentField];
    } else {
      if (object !== null && object !== undefined) object = object[currentField];
    }
  }
};

export const SetItemProp = (item: { [key: string]: any } | undefined, fieldName: string, value: any) => {
  if (item === null || item === undefined) return "";
  var SplitedField = fieldName.split(".");
  var object = item;
  for (var i = 0; i < SplitedField.length; i++) {
    var currentField = SplitedField[i].slice(0, 1).toLowerCase() + SplitedField[i].slice(1, SplitedField[i].length);

    if (i === SplitedField.length - 1) {
      if (object !== null && object !== undefined) {
        object[currentField] = value;
        return object;
      }
    } else {
      if (object !== null && object !== undefined) object = object[currentField];
    }
  }
};

export const setEnterAsTab = () => {
  document.addEventListener("keydown", function (event: any) {
    if (event.keyCode === 13 && event.target.nodeName === "INPUT" && event.target.placeholder !== "Pesquisar...") {
      var form = event.target.form;
      var index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  });
};

export const dateToStr = (javaDate?: number[]) => {
  if (javaDate === undefined || javaDate === null) return "";
  let result = "";
  result += javaDate[2].toString().padStart(2, "0");
  result += "/";
  result += javaDate[1].toString().padStart(2, "0");
  result += "/";
  result += javaDate[0];
  return result;
};

export const jsDateToInput = (jsDate: Date) => {
  if (jsDate === undefined || jsDate === null) return "";
  let result: number[] = [];
  result.push(jsDate.getFullYear());
  result.push(jsDate.getMonth() + 1);
  result.push(jsDate.getDate());
  return result;
};

export const dateToInput = (javaDate: number[]) => {
  if (javaDate === undefined || javaDate === null) return "";
  let result = "";
  result += javaDate[0].toString();
  result += "-";
  result += javaDate[1].toString().padStart(2, "0");
  result += "-";
  result += javaDate[2].toString().padStart(2, "0");
  return result;
};
export const dateTimeToInput = (javaDate: number[]) => {
  if (javaDate === undefined || javaDate === null) return "";
  let result = "";
  result += javaDate[0].toString();
  result += "-";
  result += javaDate[1].toString().padStart(2, "0");
  result += "-";
  result += javaDate[2].toString().padStart(2, "0");
  return result;
};
export const dateTimeToStr = (javaDate: number[]) => {
  if (javaDate === undefined || javaDate === null || javaDate.length < 5) return "";
  let result = "";
  result += javaDate[0];
  result += "-";
  result += javaDate[1].toString().padStart(2, "0");
  result += "-";
  result += javaDate[2].toString().padStart(2, "0");
  result += " ";
  result += javaDate[3].toString().padStart(2, "0");
  result += ":";
  result += javaDate[4].toString().padStart(2, "0");
  return result;
};
export const timeToStr = (javaDate: number[]) => {
  if (javaDate === undefined || javaDate === null || javaDate.length < 5) return "";
  let result = "";
  result += javaDate[3].toString().padStart(2, "0");
  result += ":";
  result += javaDate[4].toString().padStart(2, "0");
  result += ":";
  result += javaDate[5].toString().padStart(2, "0");
  return result;
};

//ENTRADA: 2001-01-01
//SAIDA: 01/01/2001
export const dateEuaToBr = (stringDate: string) => {
  if (stringDate === undefined || stringDate === "") return "";
  let result = "";
  let strings = stringDate.split("-");
  result += strings[2].substring(0, 2);
  result += "/";
  result += strings[1];
  result += "/";
  result += strings[0];
  return result;
};
//ENTRADA: 01/01/2001
//SAIDA: 2001-01-01
export const dateBrToEua = (stringDate: string) => {
  if (stringDate === undefined || stringDate === "") return "";
  let result = "";
  let strings = stringDate.split("/");
  result += strings[2];
  result += "-";
  result += strings[1];
  result += "-";
  result += strings[0];
  return result;
};
//04/09/2022
//2022-09-04T00:00:00.000Z
export const strToDateTime = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let result: number[] = [];
  let stringsDate = stringDateTime.split("-");
  result.push(parseInt(stringsDate[0]));
  result.push(parseInt(stringsDate[1]));
  result.push(parseInt(stringsDate[2]));
  let stringsTime = stringDateTime.split("T")[1].split(":");
  result.push(parseInt(stringsTime[0]));
  result.push(parseInt(stringsTime[1]));
  result.push(0);
  return result;
};
//2022-09-04T00:00:00.000Z
//04/09/2022
export const dateTimeToDateStr = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let result: string[] = [];
  let stringsDate = stringDateTime.split("T")[0].split("-");
  result.push(stringsDate[2]);
  result.push(stringsDate[1]);
  result.push(stringsDate[0]);
  return `${result[0]}/${result[1]}/${result[2]}`;
};
//2022-09-04T00:00:00.000Z
//04/09/2022 00:00
export const dateTimeToDateTimeStr = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let result: string[] = [];
  let stringsDate = stringDateTime.split("T")[0].split("-");
  result.push(stringsDate[2]);
  result.push(stringsDate[1]);
  result.push(stringsDate[0]);
  let stringsTime = stringDateTime.split("T")[1].substring(0, 5);
  return `${result[0]}/${result[1]}/${result[2]} ${stringsTime}`;
};
//2022-09-04T00:00:00.000Z
//04/09/2022 00:00
export const dateStrToLocale = (dateTime: string) => {
  const data = new Date(dateTime);
  return data.toLocaleString();
};
//2022-09-04T00:00:00.000Z
//2022-09-04
export const dateTimeToDateStrUs = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  return stringDateTime.split("T")[0];
};

export const strToFakeDateTime = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let result: number[] = [];
  let stringsDate = stringDateTime.split("-");
  result.push(parseInt(stringsDate[0]));
  result.push(parseInt(stringsDate[1]));
  result.push(parseInt(stringsDate[2]));
  result.push(0);
  result.push(0);
  result.push(0);
  return result;
};
export const strToDate = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let result: number[] = [];
  let stringsDate = stringDateTime.split("-");
  result.push(parseInt(stringsDate[0]));
  result.push(parseInt(stringsDate[1]));
  result.push(parseInt(stringsDate[2]));
  return result;
};
export const newDateTimeJava = () => {
  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleDateString();
  let stringsDate = date.split("/");
  let stringsTime = time.split(":");
  let result: number[] = [];
  result.push(parseInt(stringsDate[2]));
  result.push(parseInt(stringsDate[1]));
  result.push(parseInt(stringsDate[0]));
  result.push(parseInt(stringsTime[0]));
  result.push(parseInt(stringsTime[1]));
  result.push(parseInt(stringsTime[2]));
  return result;
};
export const newDateJava = () => {
  const date = new Date().toLocaleDateString();
  let stringsDate = date.split("/");
  let result: number[] = [];
  result.push(parseInt(stringsDate[2]));
  result.push(parseInt(stringsDate[1]));
  result.push(parseInt(stringsDate[0]));
  return result;
};
export const newDateTimeUTC = () => {
  let date = "";
  let strings = new Date().toLocaleDateString().split("/");
  date += strings[2];
  date += "-";
  date += strings[1];
  date += "-";
  date += strings[0];
  return date + "T" + new Date().toLocaleTimeString();
};
export const limpaObservacao = (obsCompleta: string) => {
  if (obsCompleta === undefined) return "";
  let result = obsCompleta.substring(23, obsCompleta.length - 23);
  result = result.substring(0, result.indexOf(" - "));
  return result;
};
export const jsDateToDate = (jsDate: Date) => {
  let date = "";
  let strings = jsDate.toLocaleDateString().split("/");
  date += strings[2];
  date += "-";
  date += strings[1];
  date += "-";
  date += strings[0];
  return date;
};
export const sortResults = (data: ModuleItem[], prop: string, asc: boolean) => {
  return data.sort(function (a: any, b: any) {
    if (asc) {
      return GetItemProp(a, prop).toString().toUpperCase() > GetItemProp(b, prop).toString().toUpperCase() ||
        GetItemProp(a, prop) === undefined
        ? 1
        : GetItemProp(a, prop).toString().toUpperCase() < GetItemProp(b, prop).toString().toUpperCase() ||
          GetItemProp(b, prop) === undefined
        ? -1
        : 0;
    } else {
      return GetItemProp(b, prop).toString().toUpperCase() > GetItemProp(a, prop).toString().toUpperCase() ||
        GetItemProp(b, prop) === undefined
        ? 1
        : GetItemProp(b, prop).toString().toUpperCase() < GetItemProp(a, prop).toString().toUpperCase() ||
          GetItemProp(a, prop) === undefined
        ? -1
        : 0;
    }
  });
};
export const currentTimeToMilis = () => {
  const currentDate = new Date();
  let milis = currentDate.getHours();
  milis = milis * 60 + currentDate.getMinutes();
  milis = milis * 60 + currentDate.getSeconds();
  milis = milis * 1000 + currentDate.getMilliseconds();
  return milis;
};
export const javaTimeToMilis = (javaDate: number[]) => {
  let milis = javaDate[3];
  milis = milis * 60 + javaDate[4];
  milis = milis * 60 + javaDate[5];
  milis = milis * 1000;
  return milis;
};
export const javaTimeToMillis = (javaDate: number[]) => {
  if (javaDate === undefined || javaDate === null || javaDate.length < 5) return 0;
  let milis = javaDate[3];
  milis = milis * 60 + javaDate[4];
  milis = milis * 60 + javaDate[5];
  milis = milis * 1000;
  return milis;
};
export const timeStringToMillis = (timeString: string) => {
  const pausaSplited = timeString.split(":");
  let milis = parseInt(pausaSplited[0]);
  milis = milis * 60 + parseInt(pausaSplited[1]);
  milis = milis * 60 + parseInt(pausaSplited[2]);
  milis = milis * 1000;
  return milis;
};
export const timeMillisToString = (timeMillis?: number) => {
  if (!timeMillis || timeMillis === 0 || timeMillis === null) return "";
  let result = "";
  timeMillis /= 1000;
  result = parseInt((timeMillis % 60).toString())
    .toString()
    .padStart(2, "0");
  timeMillis /= 60;
  result =
    parseInt((timeMillis % 60).toString())
      .toString()
      .padStart(2, "0") +
    ":" +
    result;
  timeMillis /= 60;
  result =
    parseInt((timeMillis % 60).toString())
      .toString()
      .padStart(2, "0") +
    ":" +
    result;
  return result;
};
//ENTRADA: 12345678912
//SAIDA: 123.456.789-12
export const formatCPF = (raw: string) => {
  if (!raw || raw.length < 11) return "";
  let result = raw.replaceAll(".", "").replaceAll("-", "");
  result = result.substring(0, 3) + "." + result.substring(3, 6) + "." + result.substring(6, 9) + "-" + result.substring(9, 11);
  return result;
};
//ENTRADA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
//SAIDA: Janeiro
export const dateGetMonthPtBr = (date: Date) => {
  return ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][
    date.getMonth()
  ];
};
//ENTRADA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
//SAIDA: Date => Sun Dez 31 2000 00:00:00 GMT-0200 (Horário de Verão de Brasília)
export const firstDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
//ENTRADA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
//SAIDA: Date => Sat Jan 06 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
export const lastDay = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
//ENTRADA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
//SAIDA: 2001-01-01
export const dateToString = (date: Date) => {
  if (date === undefined || date === null) return "";
  let result = "";
  result += date.getFullYear();
  result += "-";
  result += (date.getMonth() + 1).toString().padStart(2, "0");
  result += "-";
  result += date.getDate().toString().padStart(2, "0");
  return result;
};
//ENTRADA: 2001-01-01
//SAIDA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
export const stringToDate = (dateStr: string) => {
  if (dateStr === undefined || dateStr === null || dateStr === "") return new Date();
  const splited = dateStr.split("-");
  const result = new Date(parseInt(splited[0]), parseInt(splited[1]) - 1, parseInt(splited[2]));
  return result;
};
//ENTRADA: 08:00
//SAIDA: 480
export const timeStringToMinutes = (timeStr: string) => {
  const splited = timeStr.split(":");
  return parseInt(splited["0"]) * 60 + parseInt(splited["1"]);
};
//ENTRADA: 480
//SAIDA: 08:00
export const minutesToTimeString = (minutes: number) => {
  return (
    Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    (minutes % 60).toString().padStart(2, "0")
  );
};
//ENTRADA: 0
//SAIDA: Dom.
export const dayWeekToStr = (day: number) => {
  switch (day) {
    case 0:
      return "Dom.";
    case 1:
      return "Seg.";
    case 2:
      return "Ter.";
    case 3:
      return "Qua.";
    case 4:
      return "Qui.";
    case 5:
      return "Sex.";
    default:
      return "Sab.";
  }
};
//ENTRADA: 01/01/2021
//SAIDA: Date => Mon Jan 01 2001 00:00:00 GMT-0200 (Horário de Verão de Brasília)
export const dateStringBrToDate = (dateStr: string) => {
  const splited = dateStr.split("/");
  return new Date(parseInt(splited[2])), parseInt(splited[1]) - 1, parseInt(splited[0]);
};

//ENTRADA: 01/01/2021
//SAIDA: 01 de Janeiro de 2021
export const formatDate = (stringDate: string) => {
  const dateSplited = stringDate.split("-");
  const data = new Date(parseInt(dateSplited[0]), parseInt(dateSplited[1]) - 1, parseInt(dateSplited[2]));
  var date = data.getDate();
  var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][
    data.getMonth()
  ];
  var year = data.getFullYear();
  return `${date} de ${month} de ${year}`;
};
//2022-09-28 11:56:23.913000000
//28/09/2022 11:56:23
export const formatDateTime = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  const splitDateAndTime = stringDateTime.split("T");
  const splitDate = splitDateAndTime[0].split("-");
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]} ${splitDateAndTime[1].substring(0, 8)}`;
};

//2022-09-28 11:56:23.913000000 (UTC)
//28/09/2022 14:56:23 (BR)
export const formatDateTimeCorrectTZ = (stringDateTime: string) => {
  if (stringDateTime === undefined || stringDateTime === null || stringDateTime === "") return "";
  let utcDate = new Date(stringDateTime);
  return utcDate.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

export const dateStrIsLessThenToday = (stringDate: string) => {
  if (stringDate === undefined || stringDate === null || stringDate === "") return false;
  const today = new Date();
  let stringDateConv = stringToDate(stringDate.split("T")[0]);
  return stringDateConv.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};

export const clearData = () => {
  localStorage.removeItem("token-sistemati");
  localStorage.removeItem("usuario-sistemati");
};
