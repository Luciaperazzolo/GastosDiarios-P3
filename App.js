import { ActivityIndicator, Pressable, StyleSheet, Text,} from 'react-native';
import { NavigationContainer,} from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView,} from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

import { ExpensesProvider, useExpenses,} from './src/context/ExpensesContext';
import NavegadorPrincipal from './src/navigation/NavegadorPrincipal';

// Este componente está dentro del Provider,
// por eso puede consultar el estado de la carga.
function ContenidoApp() {
  const {
    isLoaded,
    errorCarga,
    reintentarCarga,
  } = useExpenses();

  // Revisamos primero si hubo un error de lectura.
  if (errorCarga) {
    return (
      <SafeAreaView style={styles.estado}>
        <StatusBar style="dark" />

        <Text style={styles.titulo}>
          No pudimos cargar tus datos
        </Text>

        <Text style={styles.mensaje}>
          Tocá Reintentar para volver a intentarlo.
        </Text>

        <Pressable
          style={styles.boton}
          onPress={reintentarCarga}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>
            Reintentar
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Mientras se recuperan los datos, mostramos la carga.
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.estado}>
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.mensaje}>
          Cargando datos...
        </Text>
      </SafeAreaView>
    );
  }

  // Cuando terminó la carga, mostramos la navegación habitual.
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <NavegadorPrincipal />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
        <ContenidoApp />
      </ExpensesProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  estado: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },

  mensaje: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },

  boton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});