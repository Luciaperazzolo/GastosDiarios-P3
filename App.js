import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavegadorPrincipal from './src/navigation/NavegadorPrincipal';
import { ExpensesProvider } from './src/context/ExpensesContext';

// App solo arma los proveedores globales; la navegación vive en src/navigation.
export default function App() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
         <NavigationContainer>
          <StatusBar style="dark" />
          <NavegadorPrincipal />
        </NavigationContainer>
      </ExpensesProvider> 
    </SafeAreaProvider>
  );
}