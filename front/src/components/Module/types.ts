export type TableColumns = {
  Header: string;
  isVisible: boolean;
  hideHeader: boolean;
  columns: {
      Header: string;
      accessor: string;
  }[];
}