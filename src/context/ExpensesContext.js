
import { createContext, useContext, useEffect, useState,} from 'react';

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../services/firebase';
import { SETTINGS_STORAGE_KEY } from '../data/storageKeys';

// Context que comparte los gastos y ajustes entre las pantallas.
const ExpensesContext = createContext(null);

// Valores iniciales de los ajustes.
const AJUSTES_INICIALES = {
  notificaciones: false,
  modoOscuro: false,
};

// Colección de Firestore donde guardaremos los gastos.
const gastosRef = collection(db, 'expenses');

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(AJUSTES_INICIALES);

  // Controlamos por separado la carga de gastos y ajustes.
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  const [errorCarga, setErrorCarga] = useState(null);
  const [intentoCarga, setIntentoCarga] = useState(0);

  // La hidratación consiste en recuperar los datos guardados
  // al iniciar la aplicación.
  //
  // isLoaded indica que los ajustes de AsyncStorage y los
  // gastos de Firestore terminaron de cargarse sin errores.
  // Mientras sea false, la aplicación debe esperar a que
  // los datos estén disponibles antes de mostrarlos.
  const isLoaded =
    settingsLoaded && firestoreLoaded && !errorCarga;

  // --------------------------------------------------
  // 1. HIDRATACIÓN DE AJUSTES CON ASYNCSTORAGE
  // --------------------------------------------------
  useEffect(() => {
    let activo = true;

    async function cargarAjustes() {
      try {
        const ajustesJSON = await AsyncStorage.getItem(
          SETTINGS_STORAGE_KEY
        );

        const ajustesGuardados = ajustesJSON
          ? JSON.parse(ajustesJSON)
          : AJUSTES_INICIALES;

        if (
          !ajustesGuardados ||
          typeof ajustesGuardados.notificaciones !== 'boolean' ||
          typeof ajustesGuardados.modoOscuro !== 'boolean'
        ) {
          throw new Error('Los ajustes guardados no son válidos.');
        }

        if (!activo) return;

        setSettings({
          notificaciones: ajustesGuardados.notificaciones,
          modoOscuro: ajustesGuardados.modoOscuro,
        });

        setSettingsLoaded(true);
      } catch (error) {
        console.error('Error al cargar ajustes:', error);

        if (activo) {
          setErrorCarga('No se pudieron recuperar los ajustes.');
        }
      }
    }

    cargarAjustes();

    return () => {
      activo = false;
    };
  }, [intentoCarga]);

  // --------------------------------------------------
  // 2. ESCUCHAR LOS GASTOS DESDE FIRESTORE
  // --------------------------------------------------
  useEffect(() => {
    let activo = true;

    // Ordenamos los gastos desde el más reciente.
    const consultaGastos = query(
      gastosRef,
      orderBy('createdAt', 'desc')
    );

    // onSnapshot escucha los cambios en tiempo real.
    const cancelarSuscripcion = onSnapshot(
      consultaGastos,

      (snapshot) => {
        if (!activo) return;

        const gastosActualizados = snapshot.docs.map(
          (documento) => {
            const datos = documento.data({
              serverTimestamps: 'estimate',
            });

            const fechaFirestore =
              datos.createdAt?.toDate?.();

            // Convertimos los datos de Firestore a los
            // nombres que ya utilizan nuestras pantallas.
            return {
              id: documento.id,
              descripcion: datos.title ?? '',
              monto: datos.amount ?? 0,
              categoria: datos.category ?? 'Otros',
              notas: datos.notes ?? '',
              fecha:
                fechaFirestore instanceof Date &&
                !Number.isNaN(fechaFirestore.getTime())
                  ? fechaFirestore.toISOString()
                  : '',
            };
          }
        );

        // Actualizamos la lista compartida.
        setExpenses(gastosActualizados);

        // El primer snapshot indica que los gastos están disponibles.
        setFirestoreLoaded(true);
      },

      (error) => {
        console.error('Error al leer Firestore:', error);

        if (activo) {
          setErrorCarga(
            'No se pudieron cargar los gastos desde Firestore.'
          );
        }
      }
    );

    // Dejamos de escuchar cuando el Provider se desmonta.
    return () => {
      activo = false;
      cancelarSuscripcion();
    };
  }, [intentoCarga]);

  // --------------------------------------------------
  // 3. GUARDAR LOS AJUSTES EN ASYNCSTORAGE
  // --------------------------------------------------
  useEffect(() => {
    // Esperamos a que termine la hidratación de los ajustes
    // para evitar sobrescribir los datos guardados en
    // AsyncStorage con los valores iniciales de la aplicación.
    if (!settingsLoaded) return;

    async function guardarAjustes() {
      try {
        await AsyncStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(settings)
        );
      } catch (error) {
        console.error('Error al guardar ajustes:', error);

        Alert.alert(
          'Error',
          'No se pudieron guardar los ajustes.'
        );
      }
    }

    guardarAjustes();
  }, [settings, settingsLoaded]);

  // --------------------------------------------------
  // 4. AGREGAR UN GASTO EN FIRESTORE
  // --------------------------------------------------
  const addExpense = (data) => {
    const nuevoGasto = {
      title: data.descripcion,
      amount: data.monto,
      category: data.categoria,
      notes: data.notas ?? '',
      createdAt: serverTimestamp(),
    };

    // Firestore genera el ID automáticamente.
    // No esperamos la respuesta del servidor para cerrar
    // el formulario, ya que puede no haber conexión.
    addDoc(gastosRef, nuevoGasto).catch((error) => {
      console.error('Error al agregar gasto:', error);

      Alert.alert(
        'Error',
        'No se pudo guardar el gasto en Firestore.'
      );
    });
  };

  // --------------------------------------------------
  // 5. ELIMINAR UN GASTO DE FIRESTORE
  // --------------------------------------------------
  const removeExpense = (id) => {
    const gastoRef = doc(db, 'expenses', id);

    deleteDoc(gastoRef).catch((error) => {
      console.error('Error al eliminar gasto:', error);

      Alert.alert(
        'Error',
        'No se pudo eliminar el gasto de Firestore.'
      );
    });
  };

  // --------------------------------------------------
  // 6. ACTUALIZAR LOS AJUSTES
  // --------------------------------------------------
  const updateSettings = (cambios) => {
    setSettings((actuales) => ({
      ...actuales,
      ...cambios,
    }));
  };

  // Permite reintentar si ocurre un error de carga.
  const reintentarCarga = () => {
    setErrorCarga(null);
    setSettingsLoaded(false);
    setFirestoreLoaded(false);
    setIntentoCarga((actual) => actual + 1);
  };

  // --------------------------------------------------
  // 7. COMPARTIR LOS DATOS CON LAS PANTALLAS
  // --------------------------------------------------
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        addExpense,
        removeExpense,
        settings,
        updateSettings,
        errorCarga,
        reintentarCarga,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

// Hook que permite acceder al Context.
export function useExpenses() {
  const contexto = useContext(ExpensesContext);

  if (!contexto) {
    throw new Error(
      'useExpenses debe usarse dentro de ExpensesProvider'
    );
  }

  return contexto;
}
