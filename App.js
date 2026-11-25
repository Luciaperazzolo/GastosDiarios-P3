import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavegadorPrincipal from './src/navigation/NavegadorPrincipal';
import { ExpensesProvider, useExpenses } from './src/context/ExpensesContext';

// Muestra una ruedita de carga hasta que se leen los gastos guardados.
function Contenido() {
  const { isLoaded } = useExpenses();

  if (!isLoaded) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <NavegadorPrincipal />
    </NavigationContainer>
  );
}

// App solo arma los proveedores globales; la navegación vive en src/navigation.
export default function App() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
        <Contenido />
      </ExpensesProvider> 
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
});