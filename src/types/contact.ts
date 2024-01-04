export interface IContact {
  id: string;
  ruc: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  empleados: any[];
  sector: string;
  isPerson: boolean;
  ubication: string;
  isActive: boolean;
}

export interface IContactPerson {
  id: number;
  identityDocumentTypeId: string;
  name: string;
  cC_RUC_DNI: string;
  cityId: string;
  address: string;
  movilPhone: string;
  phone: string;
  emailBilling: string;
  dateOfBirth: string;
  isPerson: boolean;
  isActive: boolean;
  clientGroupId: string;
  created: string | null;
  parentContactId: number;
  c_oficina: string;
  c_cargo: string;
  emailCompany: string;
  esFabricante: boolean;
  c_proveedor_servicios: boolean;
  c_proveedor_mercaderia: boolean;
  c_distribuidor: boolean;
  phone2: string;
  phone3: string;
  canHasCredit: boolean;
  creditAmount: number;
  daysOfCredit: number;
  additionalInformation: string;
}

export interface IContactEnterprise {
  id: number;
  identityDocumentTypeId: string;
  name: string;
  cC_RUC_DNI: string;
  cityId: string;
  address: string;
  phone: string;
  emailBilling: string;
  isPerson: boolean;
  isActive: boolean;
  clientGroupId: string;
  created: string | null;
  emailCompany: string;
  c_web: string;
  esFabricante: boolean;
  c_proveedor_servicios: boolean;
  c_proveedor_mercaderia: boolean;
  c_distribuidor: boolean;
  phone2: string;
  phone3: string;
  canHasCredit: boolean;
  creditAmount: number;
  daysOfCredit: number;
  additionalInformation: string;
  sectorId: string;
}

export interface IContactPersonResponse {
  isPerson: boolean;
  sectorId: string;
  academicDegree: string;
  c_tratamiento: string;
  c_profesion: string;
  c_sexo: string;
  dateOfBirth: string;
  urL_CarpetaProyectos: string;
  parentContactId: number | null;
  c_oficina: string;
  c_cargo: string;
  phoneExtension: string;
  c_telefono_directo: string;
  c_c_cod_encargado: string;
  updatedBy: string;
  createdBy: string;
  documentType: IDocumentType;
  city: ICity;
  sector: string;
  employees: any[];
  branchs: any[];
  items: any[];
  id: number;
  name: string;
  cityId: string;
  identityDocumentTypeId: string;
  cC_RUC_DNI: string;
  cC_Number: any;
  address: string;
  addressReference: string;
  phone: string;
  phone2: string;
  phone3: string;
  movilPhone: string;
  emailBilling: string;
  emailCompany: string;
  zipCode: string;
  c_web: string;
  c_activo: boolean;
  c_calificado: boolean;
  c_actualizado: boolean;
  c_RFM: number;
  c_cliente: boolean;
  c_distribuidor: boolean;
  c_proveedor_servicios: boolean;
  c_proveedor_mercaderia: boolean;
  esFabricante: boolean;
  canHasCredit: boolean;
  creditAmount: number;
  daysOfCredit: number;
  c_dias_garantia: number;
  c_dias_entrega: number;
  additionalInformation: string;
  c_imagen: string;
  c_correo: string;
}

export interface IDocumentType {
  id: string;
  description: string;
}

export interface ICity {
  parentId: string;
  level: number;
  sortOrder: number;
  isVisible: boolean;
  isGroup: boolean;
  isCity: boolean;
  isSector: boolean;
  id: string;
  name: string;
}
