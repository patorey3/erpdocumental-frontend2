export type ITaxDetail = {
  id: number;
  taxId: number;
  taxCode: string;
  taxDescription: string;
  percentId: number;
  percentCode: string;
  percentDescription: string;
  percentValue: number;
  taxAmount: number;
};

export type IDetailPurchase = {
  id: number | string;
  detailTypeId: string;
  invoiceId: number;
  itemId: number;
  itemName: string;
  itemBarCode: string | null;
  productCode: string | null;
  description: string;
  quantity: number;
  priceAmount: number;
  discountDecimalPercent: number;
  subtotal: number;
  vatTaxCode: string;
  vatTaxDecimalPercent: number;
  documentId: number | null;
  decreaseDocumentId: number | null;
  purchaseRequisitionDocumentId: number | null;
  invoiceDetailsDocument: any[];
  taxDetails: ITaxDetail[];
  barCode?: string;
  totalImpuesto?: number;
  total?: number;
  montoDescuento?: number;
};

export type IPartner = {
  isPerson: boolean;
  sectorId: string;
  academicDegree: string | null;
  c_tratamiento: string | null;
  c_profesion: string | null;
  c_sexo: string | null;
  dateOfBirth: string | null;
  urL_CarpetaProyectos: string | null;
  parentContactId: number | null;
  c_oficina: string | null;
  c_cargo: string | null;
  phoneExtension: string | null;
  c_telefono_directo: string | null;
  c_email_empresarial: string | null;
  c_c_cod_encargado: string | null;
  updatedBy: string | null;
  createdBy: string | null;
  documentType: string | null;
  city: string | null;
  sector: string | null;
  id: number;
  name: string;
  cityId: string;
  identityDocumentTypeId: string;
  cC_RUC_DNI: string;
  cC_Number: string | null;
  address: string | null;
  addressReference: string | null;
  phone: string | null;
  phone2: string | null;
  phone3: string | null;
  movilPhone: string | null;
  email: string | null;
  zipCode: string | null;
  c_web: string | null;
  c_activo: boolean;
  c_calificado: boolean;
  c_actualizado: boolean;
  c_RFM: number;
  c_cliente: boolean;
  c_distribuidor: boolean;
  c_proveedor_servicios: boolean;
  c_proveedor_mercaderia: boolean;
  esFabricante: boolean;
  c_credito: boolean;
  c_monto_credito: number;
  c_dias_credito: number;
  c_dias_garantia: number;
  c_dias_entrega: number;
  c_informacion_adicional: string | null;
  c_imagen: string | null;
  c_correo: string | null;
};

export type IPurchase = {
  documentId: number;
  invoiceId: number;
  documentModelId: number;
  partnerId: number;
  transactionDate: string | null;
  created: string | null;
  description: string | null;
  sriSerieNumber: string | null;
  referenceNumber: string | null;
  sriAuthorization: string | null;
  sriIssueDateLimit: string | null;
  hasCredit: false;
  daysForCredit: number;
  creditDateLimit: string | null;
  nodeCityId: string | null;
  subTotal: number;
  taxAmount: number;
  total: number;
  balanceAmount: number;
  partner: IPartner;
  details: IDetailPurchase[];
  allowEdit: boolean;
  accountableStatus: string;
};

export interface IItemToCreate {
  partnerId: number;
  cC_RUC_DNI: string;
  name: string;
  itemId: number;
  itemName: string;
  itemBarCode: string;
  productCode: string;
  description: string;
}

export type IPurchaseRegister = {
  id: number;
  partnerId: number;
  documentModelId: number;
  sriSerieNumber: string | null;
  referenceNumber: string | null;
  sriAuthorization: string | null;
  sriIssueDateLimit: string | null;
  sriPaymentType: string | null;
  transactionDate: string | null;
  created: string | null;
  description: string | null;
  hasCredit: false;
  daysForCredit: number;
  creditDateLimit: string | null;
  nodeCityId: string | null;
  subTotal: number;
  taxAmount: number;
  total: number;
  balanceAmount: number;
  allowEdit: boolean;
  details: IDetailPurchase[];
};

export interface ITaxes {
  id: number;
  percentCode: string;
  percentValue: number;
  tax: string;
  taxCode: string;
  description: string;
}

export interface IItemResult {
  id: number;
  barCode: string;
  name: string;
  collectionPath: string;
  taxes: ITaxes[];
}
