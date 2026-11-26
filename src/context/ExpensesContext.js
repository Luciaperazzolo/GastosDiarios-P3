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
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { SETTINGS_STORAGE_KEY } from '../data/storageKeys';

// Context que comparte los gastos y ajustes entre las pantallas.
const ExpensesContext = createContext(null);

// Valores iniciales de los ajustes.
const AJUSTES_INICIALES = {
  notificaciones: false,
  modoOscuro: false,
};

// Cada persona usuaria (anónima) guarda sus gastos en users/{uid}/expenses.
const getGastosRef = (uid) => collection(db, 'users', uid, 'expenses');

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(AJUSTES_INICIALES);

  // Controlamos por separado la carga de gastos y ajustes.
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  const [errorCarga, setErrorCarga] = useState(null);
  const [intentoCarga, setIntentoCarga] = useState(0);

  // Identificador del usuario anónimo de Firebase Authentication.
  const [uid, setUid] = useState(null);

  // La aplicación estará lista cuando ambas cargas terminen.
  const isLoaded =
    settingsLoaded && firestoreLoaded && !errorCarga;

  // --------------------------------------------------
  // 0. AUTENTICACIÓN ANÓNIMA
  // --------------------------------------------------
  useEffect(() => {
    let activo = true;

    // Si hay una sesión guardada, se recupera; si no, se crea una anónima.
    const cancelarSuscripcion = onAuthStateChanged(auth, (usuario) => {
      if (!activo) return;

      if (usuario) {
        setUid(usuario.uid);
        return;
      }

      signInAnonymously(auth).catch((error) => {
        console.error('Error al iniciar sesión anónima:', error);

        if (activo) {
          setErrorCarga('No se pudo iniciar la sesión.');
        }
      });
    });

    return () => {
      activo = false;
      cancelarSuscripcion();
    };
  }, [intentoCarga]);

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
    // Sin sesión todavía no sabemos qué colección leer.
    if (!uid) return;

    let activo = true;

    // Ordenamos los gastos desde el más reciente.
    const consultaGastos = query(
      getGastosRef(uid),
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
  }, [uid, intentoCarga]);

  // --------------------------------------------------
  // 3. GUARDAR LOS AJUSTES EN ASYNCSTORAGE
  // --------------------------------------------------
  useEffect(() => {
    // No guardamos hasta terminar la hidratación.
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
    if (!uid) return;

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
    addDoc(getGastosRef(uid), nuevoGasto).catch((error) => {
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
    if (!uid) return;

    const gastoRef = doc(db, 'users', uid, 'expenses', id);

    deleteDoc(gastoRef).catch((error) => {
      console.error('Error al eliminar gasto:', error);

      Alert.alert(
        'Error',
        'No se pudo eliminar el gasto de Firestore.'
      );
    });
  };

  // --------------------------------------------------
  // 5.1 EDITAR UN GASTO EN FIRESTORE
  // --------------------------------------------------
  const updateExpense = (id, data) => {
    if (!uid) return;

    const gastoRef = doc(db, 'users', uid, 'expenses', id);

    // Solo se modifican estos campos: createdAt no cambia.
    // Igual que al agregar, no esperamos al servidor para
    // poder editar también sin conexión.
    updateDoc(gastoRef, {
      title: data.descripcion,
      amount: data.monto,
      category: data.categoria,
      notes: data.notas ?? '',
    }).catch((error) => {
      console.error('Error al editar gasto:', error);

      Alert.alert(
        'Error',
        'No se pudo editar el gasto en Firestore.'
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
    setUid(null);
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
        updateExpense,
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