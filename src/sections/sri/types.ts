export interface IConsulta {
  name: string;
  items: IItemConsulta[];
}

export interface IItemConsulta {
  id: number;
  selected: boolean;
  accessKey: string;
  razonSocial?: string;
  comprobante?: string;
  total?: number | string;
}
