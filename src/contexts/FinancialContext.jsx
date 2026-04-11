import { createContext, useContext } from 'react';

export const FinancialContext = createContext(null);

export const useFinancial = () => useContext(FinancialContext);
