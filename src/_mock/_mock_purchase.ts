import { subDays } from 'date-fns';

import { _mock } from './_mock';

const TAB_HISTORY_DETAIL = [...Array(4)].map((__, index) => ({
  id: index + 1,
  fecha: subDays(new Date(), index),
  codigo_contable: '101010203',
  nombre_codigo_contable: _mock.companyName(index),
  doc_relacionado: _mock.jobTitle(index),
  descripción: _mock.sentence(index),
  id_documental: '1194-2023-119',
  valor: index % 2 === 0 ? '21.90' : '(-21.90)',
}));

const TAB_PAIMENTS_DETAIL = [...Array(4)].map((__, index) => ({
  id: index + 1,
  fecha: subDays(new Date(), index),
  doc_relacionado: _mock.jobTitle(index),
  descripción: _mock.sentence(index),
  id_documental: '1194-2023-119',
  valor: Math.floor(Math.random() * (99 - 1 + 1) + 1),
}));

const TAB_DOCRELATED_DETAIL = [...Array(3)].map((__, index) => ({
  id: index + 1,
  fecha: subDays(new Date(), index),
  doc_relacionado: index === 0 ? 'RETENCION EN COMPRA' : 'DEVOLUCION EN COMPRAS',
  contacto: 'DINNER CLUB',
  id_documental: '1194-2023-119',
  estado_contable: index === 2 ? 'No Procesado' : 'Procesado',
  estado_registro: index === 2 ? 'ANULADO' : 'VÁLIDO',
  valor: '11.90',
}));

const tabHistoryData = {
  id: 1,
  codigo_contable: '101010203',
  nombre_codigo_contable: 'CUENTAS POR PAGAR A PROVEEDORES',
  doc_relacionado: 'Compra de Bienes con pago Otros',
  valor_inicial: 41.8,
  saldo_compra: 0,
  items: TAB_HISTORY_DETAIL,
};

const getTotalPayments = TAB_PAIMENTS_DETAIL.reduce(
  (accumulator, curValue) => accumulator + curValue.valor,
  0
);

const tabPaymentsData = {
  total: getTotalPayments,
  items: TAB_PAIMENTS_DETAIL,
};

export const mockPurchaseData = {
  tabHistory: tabHistoryData,
  tabPayment: tabPaymentsData,
  tabDocRelated: TAB_DOCRELATED_DETAIL,
};
