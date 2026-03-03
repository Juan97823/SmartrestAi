
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SUCURSALES, Sucursal } from '@/lib/mock-data';

interface BranchContextType {
  selectedBranch: Sucursal;
  setSelectedBranch: (branch: Sucursal) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState<Sucursal>(SUCURSALES[0]);

  // Sincronizar con localStorage para persistencia básica si se desea
  useEffect(() => {
    const saved = localStorage.getItem('activeBranchId');
    if (saved) {
      const branch = SUCURSALES.find(s => s.id === saved);
      if (branch) setSelectedBranch(branch);
    }
  }, []);

  const handleSetBranch = (branch: Sucursal) => {
    setSelectedBranch(branch);
    localStorage.setItem('activeBranchId', branch.id);
  };

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch: handleSetBranch }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch debe ser usado dentro de un BranchProvider');
  }
  return context;
}
