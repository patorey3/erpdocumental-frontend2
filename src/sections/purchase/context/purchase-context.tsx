import { useContext, createContext } from 'react';

interface ListParameters {
    emittedDocument:boolean | string;
}

export const ListParameterContext = createContext<ListParameters | undefined>(undefined);

export function useListParameterContext() {
  const listParameters = useContext(ListParameterContext);

  if (listParameters === undefined) {
    throw new Error('useListParameterContext must be used with a ListParametersContext');
  }

  return listParameters;
}

