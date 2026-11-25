import { createContext, useContext, useState } from 'react';

// Context que centraliza los gastos: las pantallas solo usan useExpenses().
const ExpensesContext = createContext(null);

// Genera un id único para cada gasto nuevo.
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function ExpensesProvider({ children }) {
  // US #1: estado volátil. La persistencia llega en las US #3 y #5.
  const [expenses, setExpenses] = useState([]);
  const isLoaded = true;

  // Recibe descripcion, monto y categoria; el id y la fecha los genera el Provider.
  const addExpense = (data) => {
    const nuevoGasto = {
      id: generarId(),
      descripcion: data.descripcion,
      monto: data.monto,
      categoria: data.categoria,
      notas: data.notas ?? '',
      fecha: new Date().toISOString(),
    };
    setExpenses((actuales) => [nuevoGasto, ...actuales]);
  };

  const removeExpense = (id) => {
    setExpenses((actuales) => actuales.filter((gasto) => gasto.id !== id));
  };

  return (
    <ExpensesContext.Provider
      value={{ expenses, isLoaded, addExpense, removeExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

// Custom hook: devuelve el valor del Context.
export function useExpenses() {
  const contexto = useContext(ExpensesContext);
  if (!contexto) {
    throw new Error('useExpenses debe usarse dentro de ExpensesProvider');
  }
  return contexto;
}