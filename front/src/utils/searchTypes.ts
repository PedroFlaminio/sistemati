import { ModuleItem } from "../components/Module/context";

export type Operation =
  | "EQ" //equal
  | "NE" //not equal
  | "GT" //greather than
  | "GE" //greather than or equal
  | "LT" //less then
  | "LE" //less then or equal
  | "BW" //begin with
  | "BN" //not begin with
  | "EW" //ends with
  | "EN" //not ends with
  | "CN" //contains
  | "NC"; //not contains

export type FieldType =
  | "D" //date
  | "E" //enum
  | "I" //int
  | "N" //numeric
  | "S" //string
  | "B"; //boolean

export type FilterRule = {
  field: string;
  data: string;
  type: FieldType;
  operation: Operation;
};

export type SearchOptions = {
  rules: FilterRule[];
  pageSize: number;
  currentPage: number;
  sortIndex: string;
  sortAsc: boolean;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  totalElements?: number;
};

export type Sort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type Pageable = {
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type QueryResponse = {
  content: ModuleItem[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  number: number;
  size: number;
  empty: false;
};

export const filterToOptions = (filterRules: Array<FilterRule|undefined>) => {    
  let rules: FilterRule[] = [];
  for (let index = 0; index < filterRules.length; index++) {
    const element = filterRules[index];
    if (element) rules.push(element)          
  }
  return rules
}