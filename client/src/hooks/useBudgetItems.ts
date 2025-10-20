import { useState, useEffect } from 'react';

export interface BudgetItem {
  id: string;
  category: string;
  amount: string;
  notes: string;
}

export function useBudgetItems(projectId: string) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  // Charger les données du localStorage au montage du composant
  useEffect(() => {
    const storedItems = localStorage.getItem(`project-${projectId}-budget`);
    if (storedItems) {
      setBudgetItems(JSON.parse(storedItems));
    }
  }, [projectId]);

  // Sauvegarder dans le localStorage à chaque modification
  const saveBudgetItems = (items: BudgetItem[]) => {
    localStorage.setItem(`project-${projectId}-budget`, JSON.stringify(items));
    setBudgetItems(items);
  };

  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    saveBudgetItems([...budgetItems, newItem]);
  };

  const updateBudgetItem = (id: string, updatedItem: Omit<BudgetItem, 'id'>) => {
    const newItems = budgetItems.map(item => 
      item.id === id ? { ...updatedItem, id } : item
    );
    saveBudgetItems(newItems);
  };

  const deleteBudgetItem = (id: string) => {
    const newItems = budgetItems.filter(item => item.id !== id);
    saveBudgetItems(newItems);
  };

  return {
    budgetItems,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem
  };
}