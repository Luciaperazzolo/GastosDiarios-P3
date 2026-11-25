import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../data/storageKeys';

// Context que centraliza los gastos: las pantallas solo usan useExpenses().
const ExpensesContext = createContext(null);

// Genera un id único para cada gasto nuevo.
function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function ExpensesProvider({ children }) {
  // Estado de los gastos y bandera que indica si ya se leyó el almacenamiento.
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hidratación: al montar, lee los gastos guardados y recién ahí marca isLoaded.
  useEffect(() => {
    const cargarGastos = async () => {
      try {
        const guardado = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (guardado) {
          const datos = JSON.parse(guardado);
          if (Array.isArray(datos)) setExpenses(datos);
        }
      } catch (error) {
        console.error('No se pudieron leer los gastos guardados:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    cargarGastos();
  }, []);

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