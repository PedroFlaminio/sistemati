import { ModuleItem } from "./Module/context";

export type Operation = 
  "EQ"|//equal
  "NE"|//not equal
  "GT"|//greather than
  "GE"|//greather than or equal
  "LT"|//less then
  "LE"|//less then or equal
  "BW"|//begin with
  "BN"|//not begin with
  "EW"|//ends with
  "EN"|//not ends with
  "CN"|//contains
  "NC";//not contains

export type FilterRule = {
  field: string;
  data: string;
  operation: Operation
}

export type Options = {
  rules: FilterRule[];
  pageSize: number;
  currentPage: number;
  sortIndex: string;
  sortAsc: boolean;
}

export type QueryResponse = {
  options: Options;
  pages: number;
  totalRows: number;
  list: ModuleItem[]  
}